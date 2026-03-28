import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Network formation animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      alpha: number;
    }

    const nodes: Node[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: 0,
    }));

    let t = 0;
    const animate = () => {
      t += 0.01;
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.alpha = Math.min(node.alpha + 0.008, 0.8);
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha * 0.8})`;
        ctx.fill();

        // Draw connections
        nodes.forEach((other, j) => {
          if (j <= i) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 160) * node.alpha * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Progress counter
  useEffect(() => {
    let current = 0;
    const target = 100;
    const interval = setInterval(() => {
      current += Math.random() * 4 + 1;
      if (current >= target) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setPhase('ready');
        setTimeout(() => onComplete(), 600);
      } else {
        setProgress(Math.round(current));
      }
    }, 35);
    return () => clearInterval(interval);
  }, [onComplete]);

  const loadingMessages = [
    'Initializing ARPANET protocols…',
    'Establishing packet routing…',
    'Calibrating TCP/IP stack…',
    'Loading HTTP/3 transport…',
    'Deploying smart contracts…',
    'Activating AI agents…',
    'Network initialized.',
  ];

  const msgIndex = Math.min(Math.floor(progress / 15), loadingMessages.length - 1);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Radial vignette */}
      <div className="loading-vignette absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        {/* Glowing icon */}
        <motion.div
          className="loading-icon mb-8 mx-auto relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Title */}
        <motion.h1
          className="mb-2 loading-title bg-gradient-to-r from-[#00f0ff] to-[#7a5cff] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The Architecture of Connectivity
        </motion.h1>

        <motion.p
          className="text-gray-600 font-mono text-xs mb-10 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Interactive Web History
        </motion.p>

        {/* Progress bar */}
        <div className="loading-progress w-full h-px rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15, ease: 'linear' }}
          />
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between">
          <motion.p
            key={msgIndex}
            className="text-gray-600 font-mono text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loadingMessages[msgIndex]}
          </motion.p>
          <span className="text-[#00f0ff] font-mono text-xs font-bold">
            {progress}%
          </span>
        </div>

        {/* Ready state */}
        {phase === 'ready' && (
          <motion.p
            className="mt-6 text-[#00f0ff] font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ textShadow: '0 0 15px #00f0ff' }}
          >
            ▶ Entering the network…
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
