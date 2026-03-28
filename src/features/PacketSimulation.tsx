import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw } from 'lucide-react';

interface PacketSimulationProps {
  mode: 'web2' | 'web3';
}

type PacketState = 'idle' | 'animating' | 'done';

interface Packet {
  id: number;
  pathIndex: number;
  progress: number;
}

// SVG viewport: 500 x 200
const WEB2_PATH_POINTS = [
  { x: 60, y: 100 },
  { x: 250, y: 100 },
  { x: 440, y: 100 },
];

const WEB3_PATHS = [
  [{ x: 60, y: 100 }, { x: 200, y: 48 }, { x: 440, y: 48 }],
  [{ x: 60, y: 100 }, { x: 200, y: 100 }, { x: 440, y: 100 }],
  [{ x: 60, y: 100 }, { x: 200, y: 152 }, { x: 440, y: 152 }],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getPointOnPath(points: { x: number; y: number }[], t: number) {
  const segments = points.length - 1;
  const segT = t * segments;
  const segIndex = Math.min(Math.floor(segT), segments - 1);
  const localT = segT - segIndex;
  const p0 = points[segIndex];
  const p1 = points[segIndex + 1];
  return { x: lerp(p0.x, p1.x, localT), y: lerp(p0.y, p1.y, localT) };
}

export function PacketSimulation({ mode }: PacketSimulationProps) {
  const [state, setState] = useState<PacketState>('idle');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const DURATION = mode === 'web2' ? 2200 : 2800;

  const startSimulation = () => {
    if (state === 'animating') return;
    setState('animating');
    setProgress(0);
    setMessage('');

    const initialPackets: Packet[] =
      mode === 'web2'
        ? [{ id: 0, pathIndex: 0, progress: 0 }]
        : [
            { id: 0, pathIndex: 0, progress: 0 },
            { id: 1, pathIndex: 1, progress: 0 },
            { id: 2, pathIndex: 2, progress: 0 },
          ];

    setPackets(initialPackets);

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);

      setProgress(t);
      setPackets((prev) => prev.map((p) => ({ ...p, progress: t })));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setState('done');
        setMessage(
          mode === 'web2'
            ? '✓ Packet delivered through central server'
            : '✓ Data distributed across 3 nodes — no single point of failure'
        );
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    setState('idle');
    setPackets([]);
    setProgress(0);
    setMessage('');
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    reset();
  }, [mode]);

  const accentColor = mode === 'web2' ? '#f59e0b' : '#00f0ff';
  const paths = mode === 'web2' ? [WEB2_PATH_POINTS] : WEB3_PATHS;

  return (
    <div className="packet-simulation rounded-xl overflow-hidden" data-mode={mode}>
      {/* Header */}
      <div className="packet-sim-header px-5 py-3 flex items-center justify-between">
        <div>
          <span className="packet-sim-title text-xs uppercase tracking-widest">
            Packet Simulation
          </span>
          <p className="packet-sim-subtitle text-xs text-gray-500 mt-0.5">
            {mode === 'web2' ? 'Centralized routing' : 'Distributed routing'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="packet-sim-btn p-2 rounded-lg text-gray-500 hover:text-white transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={startSimulation}
            disabled={state === 'animating'}
            className="packet-sim-send flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            {state === 'animating' ? 'Sending…' : 'Send Packet'}
          </button>
        </div>
      </div>

      {/* SVG Animation */}
      <div className="bg-black/60 px-4 py-2">
        <svg viewBox="0 0 500 200" className="w-full" style={{ height: '160px' }}>
          {/* Background grid lines */}
          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[100, 200, 300, 400].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Paths */}
          {paths.map((pathPoints, i) => {
            const d = pathPoints
              .map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');
            return (
              <g key={i}>
                {/* Base path */}
                <path d={d} stroke={`${accentColor}20`} strokeWidth="2" fill="none" />
                {/* Animated progress path */}
                {state !== 'idle' && (
                  <motion.path
                    d={d}
                    stroke={accentColor}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="500"
                    strokeDashoffset={500 - 500 * progress}
                    style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }}
                  />
                )}
              </g>
            );
          })}

          {/* Source Node */}
          <g>
            <circle
              cx="60"
              cy="100"
              r="16"
              fill={`${accentColor}20`}
              stroke={accentColor}
              strokeWidth="1.5"
            />
            {state === 'animating' && (
              <circle
                cx="60"
                cy="100"
                r="20"
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                opacity="0.4"
              >
                <animate attributeName="r" values="16;26;16" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="60" y="104" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
              YOU
            </text>
          </g>

          {/* Middle Nodes */}
          {mode === 'web2' ? (
            <g>
              {/* Central server */}
              <rect
                x="218"
                y="82"
                width="64"
                height="36"
                rx="4"
                fill={progress > 0.3 && progress < 0.8 ? `${accentColor}30` : '#1a1a1a'}
                stroke={progress > 0.3 && progress < 0.8 ? accentColor : '#333'}
                strokeWidth="1.5"
                style={{ transition: 'fill 0.3s, stroke 0.3s', filter: progress > 0.3 && progress < 0.8 ? `drop-shadow(0 0 8px ${accentColor})` : 'none' }}
              />
              <text x="250" y="97" textAnchor="middle" fill={progress > 0.3 && progress < 0.8 ? accentColor : '#666'} fontSize="7" fontWeight="bold">
                CENTRAL
              </text>
              <text x="250" y="108" textAnchor="middle" fill={progress > 0.3 && progress < 0.8 ? accentColor : '#555'} fontSize="7">
                SERVER
              </text>
            </g>
          ) : (
            <>
              {WEB3_PATHS.map((path, i) => {
                const midPt = path[1];
                const isActive = progress > 0.15 && progress < 0.85;
                return (
                  <g key={i}>
                    <circle
                      cx={midPt.x}
                      cy={midPt.y}
                      r="12"
                      fill={isActive ? `${accentColor}25` : '#111'}
                      stroke={isActive ? accentColor : '#333'}
                      strokeWidth="1.5"
                      style={{
                        transition: 'fill 0.4s, stroke 0.4s',
                        filter: isActive ? `drop-shadow(0 0 6px ${accentColor})` : 'none',
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    />
                    <text
                      x={midPt.x}
                      y={midPt.y + 3.5}
                      textAnchor="middle"
                      fill={isActive ? accentColor : '#555'}
                      fontSize="7"
                      fontWeight="bold"
                    >
                      N{i + 1}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Destination Node */}
          <g>
            <circle
              cx="440"
              cy="100"
              r="16"
              fill={state === 'done' ? `${accentColor}30` : `${accentColor}10`}
              stroke={state === 'done' ? accentColor : `${accentColor}50`}
              strokeWidth="1.5"
              style={{ transition: 'fill 0.3s, stroke 0.3s', filter: state === 'done' ? `drop-shadow(0 0 12px ${accentColor})` : 'none' }}
            />
            <text x="440" y="104" textAnchor="middle" fill={state === 'done' ? accentColor : '#666'} fontSize="8" fontWeight="bold">
              {mode === 'web2' ? 'DEST' : 'DEST'}
            </text>
          </g>

          {/* Moving Packets */}
          <AnimatePresence>
            {packets.map((pkt) => {
              const pathPoints = paths[pkt.pathIndex] || paths[0];
              const pos = getPointOnPath(pathPoints, pkt.progress);
              return (
                <g key={pkt.id}>
                  {/* Glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="10"
                    fill={`${accentColor}20`}
                    style={{ filter: `blur(4px)` }}
                  />
                  {/* Packet dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="5"
                    fill={accentColor}
                    style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
                  />
                </g>
              );
            })}
          </AnimatePresence>

          {/* Labels */}
          <text x="60" y="128" textAnchor="middle" fill="#555" fontSize="7">Source</text>
          <text x="440" y="128" textAnchor="middle" fill="#555" fontSize="7">Destination</text>
        </svg>
      </div>

      {/* Progress bar */}
      {state !== 'idle' && (
        <div className="px-4 pb-2">
          <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress * 100}%`,
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      )}

      {/* Status message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-4"
          >
            <p className="text-xs text-center" style={{ color: accentColor }}>
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
