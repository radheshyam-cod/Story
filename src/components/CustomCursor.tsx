import { useEffect, useRef } from 'react';
import { useMotionPref } from '../hooks/useMotionPref';

type CursorMode = 'default' | 'hover' | 'node' | 'drag';

interface CursorConfig {
  dotSize: number;
  dotColor: string;
  ringSize: number;
  dotRadius: string;
  glowSize: number;
}

const CURSOR_CONFIGS: Record<CursorMode, CursorConfig> = {
  default: { dotSize: 8,  dotColor: '#ffffff', ringSize: 32, dotRadius: '50%', glowSize: 8  },
  hover:   { dotSize: 12, dotColor: '#7a5cff', ringSize: 44, dotRadius: '50%', glowSize: 18 },
  node:    { dotSize: 20, dotColor: '#00f0ff', ringSize: 56, dotRadius: '50%', glowSize: 30 },
  drag:    { dotSize: 12, dotColor: '#f59e0b', ringSize: 40, dotRadius: '4px', glowSize: 14 },
};

export function CustomCursor() {
  const { prefersReduced, isFinePointer } = useMotionPref();
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<CursorMode>('default');
  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos  = useRef({ x: -200, y: -200 });
  const rafRef   = useRef<number>(0);
  const prevMode = useRef<CursorMode>('default');

  useEffect(() => {
    if (prefersReduced || !isFinePointer) return;
    // Only activate on fine-pointer (mouse) devices
    document.documentElement.style.cursor = 'none';

    const applyConfig = (mode: CursorMode) => {
      const cfg = CURSOR_CONFIGS[mode];
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot) {
        dot.style.width = `${cfg.dotSize}px`;
        dot.style.height = `${cfg.dotSize}px`;
        dot.style.marginLeft = `-${cfg.dotSize / 2}px`;
        dot.style.marginTop = `-${cfg.dotSize / 2}px`;
        dot.style.backgroundColor = cfg.dotColor;
        dot.style.borderRadius = cfg.dotRadius;
        dot.style.boxShadow = `0 0 ${cfg.glowSize}px ${cfg.dotColor}, 0 0 ${cfg.glowSize * 2}px ${cfg.dotColor}40`;
      }
      if (ring) {
        ring.style.width = `${cfg.ringSize}px`;
        ring.style.height = `${cfg.ringSize}px`;
        ring.style.marginLeft = `-${cfg.ringSize / 2}px`;
        ring.style.marginTop = `-${cfg.ringSize / 2}px`;
        ring.style.borderColor = `${cfg.dotColor}50`;
        ring.style.background = `radial-gradient(circle, ${cfg.dotColor}12 0%, transparent 70%)`;
      }
    };

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.11;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.11;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      if (modeRef.current !== prevMode.current) {
        applyConfig(modeRef.current);
        prevMode.current = modeRef.current;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current)  dotRef.current.style.opacity  = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';

      const el = e.target as Element;
      if (el.closest('[data-cursor="node"]'))         modeRef.current = 'node';
      else if (el.closest('[data-cursor="drag"]'))    modeRef.current = 'drag';
      else if (el.closest('button, a, [role="button"], input[type="range"]')) modeRef.current = 'hover';
      else                                             modeRef.current = 'default';
    };

    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };
    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    prefersReduced || !isFinePointer ? null : (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 rounded-full"
      />
      {/* Ring / glow trail */}
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 pointer-events-none z-[9998] opacity-0 rounded-full"
      />
    </>
    )
  );
}
