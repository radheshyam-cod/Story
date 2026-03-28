import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Dynamic style helpers for NetworkCanvas
const getCanvasBgStyle = () => ({
  background: 'radial-gradient(ellipse at center, #050510 0%, #000000 100%)',
});

const getPulseRingStyle = (color: string, isHovered: boolean) => ({
  backgroundColor: `${color}20`,
  width: isHovered ? '48px' : '36px',
  height: isHovered ? '48px' : '36px',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%',
  animationDuration: '2s',
});

const getNodeStyle = (color: string, isHovered: boolean, isSelected: boolean) => ({
  width: isHovered || isSelected ? '38px' : '28px',
  height: isHovered || isSelected ? '38px' : '28px',
  backgroundColor: isHovered || isSelected ? `${color}35` : `${color}15`,
  border: `${isSelected ? 2 : 1.5}px solid ${color}${isHovered ? 'cc' : '70'}`,
  boxShadow: isHovered || isSelected
    ? `0 0 20px ${color}, 0 0 40px ${color}40`
    : `0 0 8px ${color}40`,
  backdropFilter: 'blur(4px)',
});

const getInnerDotStyle = (color: string) => ({
  width: '6px',
  height: '6px',
  backgroundColor: color,
  boxShadow: `0 0 8px ${color}`,
});

const getLabelStyle = (color: string, isHovered: boolean, isSelected: boolean) => ({
  fontSize: '9px',
  color: color,
  fontWeight: 700,
  textShadow: isHovered ? `0 0 10px ${color}` : 'none',
});

const getPanelStyle = (color: string) => ({
  background: `linear-gradient(135deg, ${color}12, rgba(0,0,0,0.9))`,
  border: `1px solid ${color}50`,
  boxShadow: `0 0 40px ${color}20`,
});

const getYearStyle = (color: string) => ({
  color: `${color}90`,
});

const getTitleStyle = (color: string) => ({
  color,
  fontSize: '18px',
  textShadow: `0 0 15px ${color}60`,
});

const getButtonStyle = () => ({
  background: 'rgba(255,255,255,0.05)',
});

const getDividerStyle = (color: string) => ({
  background: `linear-gradient(to right, ${color}40, transparent)`,
});

interface BackgroundNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface EraNode {
  id: string;
  label: string;
  year: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color: string;
  info: string;
  detail: string;
}

const ERA_NODES: EraNode[] = [
  {
    id: 'arpanet',
    label: 'ARPANET',
    year: '1969',
    x: 12,
    y: 25,
    color: '#3b82f6',
    info: 'The first packet-switched network',
    detail:
      'ARPANET (Advanced Research Projects Agency Network) was the first wide-area packet-switching network. On October 29, 1969, the first message "LO" was sent from UCLA to SRI — it crashed after two letters, but the internet was born.',
  },
  {
    id: 'email',
    label: 'Email',
    year: '1972',
    x: 24,
    y: 65,
    color: '#00f0ff',
    info: 'First killer app of the network',
    detail:
      'Ray Tomlinson sent the first email in 1971, choosing the @ symbol to separate user from host. Email became the internet\'s first "killer app" and remains one of the most used protocols today.',
  },
  {
    id: 'tcpip',
    label: 'TCP/IP',
    year: '1983',
    x: 37,
    y: 38,
    color: '#10b981',
    info: 'The universal language of the internet',
    detail:
      'TCP/IP (Transmission Control Protocol / Internet Protocol) became the standard networking protocol on January 1, 1983 — "Flag Day". It enabled a network of networks — the true birth of the Internet as we know it.',
  },
  {
    id: 'www',
    label: 'WWW',
    year: '1991',
    x: 52,
    y: 22,
    color: '#10b981',
    info: 'Tim Berners-Lee\'s gift to humanity',
    detail:
      'Tim Berners-Lee invented the World Wide Web at CERN in 1989, releasing it publicly in 1991. He chose not to patent it, giving the technology to the world. HTML, HTTP, and URLs formed the foundation.',
  },
  {
    id: 'google',
    label: 'Google',
    year: '1998',
    x: 64,
    y: 60,
    color: '#f59e0b',
    info: 'Organizing the world\'s information',
    detail:
      "Google's PageRank algorithm revolutionized search by ranking pages based on their link graph. From a Stanford dorm room project, it grew into the world's most visited website and AI company.",
  },
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    year: '2009',
    x: 77,
    y: 35,
    color: '#ec4899',
    info: 'The first decentralized currency',
    detail:
      'Satoshi Nakamoto\'s Bitcoin whitepaper (2008) introduced blockchain — a distributed ledger that enables trustless transactions without central authority. It sparked the Web3 movement and a new model of digital ownership.',
  },
  {
    id: 'ai-web',
    label: 'AI Web',
    year: '2023',
    x: 88,
    y: 68,
    color: '#7a5cff',
    info: 'The intelligent internet era',
    detail:
      'Large Language Models (LLMs) like GPT-4 brought human-level language understanding to the web. Web agents can now browse, code, and act autonomously — the beginning of Web 4.0 and the agentic internet.',
  },
];

export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<EraNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Background particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodeCount = 60;
    const nodes: BackgroundNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    // Named node positions (as canvas pixels, updated each frame)
    const getNamedPos = (n: EraNode) => ({
      x: (n.x / 100) * canvas.width,
      y: (n.y / 100) * canvas.height,
    });

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update background nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.fill();
      });

      // Draw background-to-background connections
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = (1 - dist / 120) * 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw connections from background nodes to named nodes
      ERA_NODES.forEach((n) => {
        const nPos = getNamedPos(n);
        nodes.forEach((bg) => {
          const dx = bg.x - nPos.x;
          const dy = bg.y - nPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(bg.x, bg.y);
            ctx.lineTo(nPos.x, nPos.y);
            ctx.strokeStyle = n.color;
            ctx.globalAlpha = (1 - dist / 130) * 0.12;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={getCanvasBgStyle()}
      />

      {/* Interactive Era Nodes overlay */}
      <div className="absolute inset-0">
        {ERA_NODES.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              data-cursor="node"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(isSelected ? null : node)}
            >
              {/* Outer pulse ring */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={getPulseRingStyle(node.color, isHovered)}
              />

              {/* Node circle */}
              <div
                className="relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
                style={getNodeStyle(node.color, isHovered, isSelected)}
              >
                <div
                  className="rounded-full"
                  style={getInnerDotStyle(node.color)}
                />
              </div>

              {/* Label */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 text-center pointer-events-none whitespace-nowrap transition-all duration-300"
                style={{ opacity: isHovered || isSelected ? 1 : 0.6 }}
              >
                <div
                  className="font-mono"
                  style={getLabelStyle(node.color, isHovered, isSelected)}
                >
                  {node.label}
                </div>
                <div style={{ fontSize: '8px', color: '#555' }}>{node.year}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info panel for selected node */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-sm w-full mx-4 z-30"
            style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.8))' }}
          >
            <div
              className="p-5 rounded-xl backdrop-blur-xl"
              style={getPanelStyle(selectedNode.color)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div
                    className="font-mono text-xs mb-1 tracking-widest"
                    style={getYearStyle(selectedNode.color)}
                  >
                    {selectedNode.year}
                  </div>
                  <h3
                    className="font-bold"
                    style={getTitleStyle(selectedNode.color)}
                  >
                    {selectedNode.label}
                  </h3>
                </div>
                <button
                  aria-label="Close"
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-white transition-colors"
                  style={getButtonStyle()}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-2">{selectedNode.info}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{selectedNode.detail}</p>

              <div
                className="mt-3 h-px"
                style={getDividerStyle(selectedNode.color)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover hint */}
      {!selectedNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="text-gray-600 text-xs font-mono tracking-widest">
            CLICK NODES TO EXPLORE HISTORY
          </p>
        </div>
      )}
    </div>
  );
}
