import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConceptTooltip } from '../components/ConceptTooltip';


const ARPANET_NODES = [
  {
    id: 'ucla',
    name: 'UCLA',
    x: 18,
    y: 28,
    info: 'University of California, Los Angeles',
    detail: 'First ARPANET node. On October 29, 1969, Charley Kline sent "LO" — the first two letters of "LOGIN" before the system crashed.',
    color: '#00f0ff',
  },
  {
    id: 'sri',
    name: 'SRI',
    x: 28,
    y: 65,
    info: 'Stanford Research Institute',
    detail: 'Second node. Received the first ARPANET message. Its IMP (Interface Message Processor) established the protocol for packet-switched routing.',
    color: '#7a5cff',
  },
  {
    id: 'ucsb',
    name: 'UCSB',
    x: 68,
    y: 32,
    info: 'UC Santa Barbara',
    detail: 'Third ARPANET node. UCSB contributed early network analysis and helped develop the first applications for the network.',
    color: '#10b981',
  },
  {
    id: 'utah',
    name: 'Utah',
    x: 78,
    y: 68,
    info: 'University of Utah',
    detail: 'Fourth ARPANET node. The Utah node was central to early computer graphics research, led by Ivan Sutherland and David Evans.',
    color: '#ec4899',
  },
];

const CONNECTIONS = [
  ['ucla', 'sri'],
  ['sri', 'ucsb'],
  ['ucsb', 'utah'],
  ['ucla', 'ucsb'],
  ['sri', 'utah'],
];

type NodeId = 'ucla' | 'sri' | 'ucsb' | 'utah';

function getNodePos(id: NodeId) {
  return ARPANET_NODES.find((n) => n.id === id) || ARPANET_NODES[0];
}

export function Genesis() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [packetPos, setPacketPos] = useState({ x: 18, y: 28 });
  const packetRef = useRef<number>(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    setGlitchActive(true);
    const id = setTimeout(() => setGlitchActive(false), 800);
    return () => clearTimeout(id);
  }, []);

  // Animated packet around network
  useEffect(() => {
    const route = [
      { x: 18, y: 28 },
      { x: 28, y: 65 },
      { x: 68, y: 32 },
      { x: 78, y: 68 },
      { x: 18, y: 28 },
    ];
    let step = 0;
    let t = 0;
    const SPEED = 0.004;

    const animate = () => {
      t += SPEED;
      if (t >= 1) {
        t = 0;
        step = (step + 1) % (route.length - 1);
      }
      const from = route[step];
      const to = route[step + 1];
      setPacketPos({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
      });
      packetRef.current = requestAnimationFrame(animate);
    };

    packetRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(packetRef.current);
  }, []);

  return (
    <section
      id="genesis"
      className="relative min-h-screen py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #000000 0%, #000818 50%, #000000 100%)' }}
    >
      {/* Parallax background */}
      <div className="genesis-parallax absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-[#00f0ff] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#3b82f6] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto genesis-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00f0ff]/40" />
            <div>
              <h2
                className={`text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#3b82f6] ${glitchActive ? 'genesis-glitch' : ''}`}
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700' }}
              >
                Genesis
              </h2>
              <p className="text-center text-gray-600 font-mono text-sm mt-1">1960s – 1980s</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00f0ff]/40" />
          </div>

          {/* Story narrative */}
          <div className="mb-16 space-y-6 max-w-3xl mx-auto">
            <p className="text-gray-300 text-lg leading-relaxed">
              In the early 1960s, communication relied on{' '}
              <ConceptTooltip
                term="circuit-switched networks"
                short="Single dedicated path for each call"
                detail="Circuit switching reserves a complete physical path between two endpoints for the duration of the call. Efficient for voice, but catastrophically fragile — if one node is destroyed (e.g., in a nuclear attack), communication fails entirely. This vulnerability drove ARPA to fund a new paradigm."
                color="#ef4444"
              />{' '}
              that were catastrophically vulnerable. A single failure could bring down an entire communication network.
            </p>

            <div
              className="p-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(59,130,246,0.05))',
                border: '1px solid rgba(0,240,255,0.25)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-[#00f0ff] mb-3 font-semibold text-lg">
                J.C.R. Licklider envisioned a "Galactic Network" — computers interconnected globally.
              </p>
              <p className="text-gray-300">
                This vision required a radical new architecture:{' '}
                <ConceptTooltip
                  term="packet switching"
                  short="Break data into packets, route independently"
                  detail="Packet switching breaks messages into small packets that can travel independently across a network, potentially taking different routes. This is fundamentally more resilient than circuit switching — if one node fails, packets reroute around the failure. Developed simultaneously by Paul Baran (USA), Donald Davies (UK), and Leonard Kleinrock."
                  color="#00f0ff"
                />
                {' '}— a way to make networks survive any attack.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Leonard Kleinrock', role: 'Queuing theory for packet networks', color: '#00f0ff' },
                { name: 'Donald Davies', role: 'Coined "packet switching"', color: '#7a5cff' },
                { name: 'Paul Baran', role: 'Distributed network topology', color: '#10b981' },
              ].map((person, i) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-4 rounded-lg"
                  style={{
                    background: `${person.color}08`,
                    border: `1px solid ${person.color}30`,
                  }}
                >
                  <p className="font-semibold" style={{ color: person.color }}>{person.name}</p>
                  <p className="text-gray-500 text-sm mt-1">{person.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive ARPANET Map */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="font-bold"
                style={{ color: '#00f0ff', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}
              >
                ARPANET — The First 4 Nodes
              </h3>
              <span className="text-gray-600 font-mono text-xs">October 29, 1969</span>
            </div>

            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                height: '360px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(0,240,255,0.15)',
              }}
            >
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {/* Draw connection lines */}
                {CONNECTIONS.map(([a, b]) => {
                  const nodeA = getNodePos(a as NodeId);
                  const nodeB = getNodePos(b as NodeId);
                  const isActive =
                    hoveredNode === a || hoveredNode === b || selectedNode === a || selectedNode === b;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={`${nodeA.x}%`}
                      y1={`${nodeA.y}%`}
                      x2={`${nodeB.x}%`}
                      y2={`${nodeB.y}%`}
                      stroke={isActive ? '#00f0ff' : 'rgba(0,240,255,0.2)'}
                      strokeWidth={isActive ? '2' : '1'}
                      style={{
                        filter: isActive ? 'drop-shadow(0 0 4px #00f0ff)' : 'none',
                        transition: 'all 0.3s',
                      }}
                    />
                  );
                })}

                {/* Animated packet */}
                <>
                  <circle
                    cx={`${packetPos.x}%`}
                    cy={`${packetPos.y}%`}
                    r="10"
                    fill="rgba(0,240,255,0.15)"
                    style={{ filter: 'blur(3px)' }}
                  />
                  <circle
                    cx={`${packetPos.x}%`}
                    cy={`${packetPos.y}%`}
                    r="4"
                    fill="#00f0ff"
                    style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }}
                  />
                </>

                {/* Draw nodes */}
                {ARPANET_NODES.map((node) => {
                  const isHovered = hoveredNode === node.id;
                  const isSelected = selectedNode === node.id;
                  const r = isHovered || isSelected ? 18 : 14;

                  return (
                    <g
                      key={node.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      data-cursor="node"
                    >
                      {/* Pulse ring */}
                      {(isHovered || isSelected) && (
                        <circle
                          cx={`${node.x}%`}
                          cy={`${node.y}%`}
                          r={r + 8}
                          fill="none"
                          stroke={node.color}
                          strokeWidth="1"
                          opacity="0.4"
                          style={{ animation: 'pulse 1.5s ease-out infinite' }}
                        />
                      )}
                      <circle
                        cx={`${node.x}%`}
                        cy={`${node.y}%`}
                        r={r}
                        fill={isSelected ? `${node.color}30` : isHovered ? `${node.color}20` : '#0a1a2a'}
                        stroke={node.color}
                        strokeWidth={isSelected ? '2.5' : '2'}
                        style={{
                          filter: isHovered || isSelected ? `drop-shadow(0 0 10px ${node.color})` : 'none',
                          transition: 'all 0.3s',
                        }}
                      />
                      <text
                        x={`${node.x}%`}
                        y={`${node.y + 1}%`}
                        textAnchor="middle"
                        fill={isHovered || isSelected ? node.color : '#888'}
                        fontSize="11"
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                        style={{ transition: 'fill 0.3s' }}
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Node info panel */}
              <AnimatePresence>
                {selectedNode && (() => {
                  const node = ARPANET_NODES.find((n) => n.id === selectedNode);
                  if (!node) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-4 right-4 p-4 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${node.color}15, rgba(0,0,0,0.9))`,
                        border: `1px solid ${node.color}40`,
                        backdropFilter: 'blur(12px)',
                        zIndex: 10,
                      }}
                    >
                      <p className="font-bold mb-1" style={{ color: node.color }}>
                        {node.name} — {node.info}
                      </p>
                      <p className="text-gray-400 text-sm">{node.detail}</p>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              <div className="absolute top-4 left-4 text-gray-600 text-xs font-mono z-10">
                Hover or click nodes to explore
              </div>

              {/* Data packet label */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff]" style={{ boxShadow: '0 0 6px #00f0ff' }} />
                <span className="text-[#00f0ff] text-xs font-mono">DATA PACKET</span>
              </div>
            </div>
          </div>

          {/* First message callout */}
          <div
            className="mb-8 text-center py-6 rounded-xl"
            style={{
              background: 'rgba(0,240,255,0.04)',
              border: '1px solid rgba(0,240,255,0.15)',
            }}
          >
            <p className="text-gray-500 font-mono text-sm mb-2">FIRST MESSAGE ON ARPANET</p>
            <p className="text-[#00f0ff] font-mono" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 800 }}>
              "LO"
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Intended to send "LOGIN" — crashed after two letters
            </p>
            <p className="text-gray-700 font-mono text-xs mt-1">October 29, 1969 — 22:30 PST</p>
          </div>

          {/* TCP/IP evolution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(122,92,255,0.1), rgba(236,72,153,0.05))',
              border: '1px solid rgba(122,92,255,0.25)',
            }}
          >
            <h4 className="mb-3" style={{ color: '#7a5cff', fontSize: '1.2rem', fontWeight: 700 }}>
              Protocol Evolution
            </h4>
            <p className="text-gray-300 leading-relaxed">
              Network Control Protocol (NCP) enabled early communication. By 1983, it was replaced by{' '}
              <ConceptTooltip
                term="TCP/IP"
                short="The universal language of the internet"
                detail="TCP (Transmission Control Protocol) ensures reliable, ordered delivery of data. IP (Internet Protocol) handles addressing and routing. Together they form the foundation of all internet communication. On January 1, 1983 — 'Flag Day' — all ARPANET computers switched to TCP/IP simultaneously."
                color="#7a5cff"
              />
              , enabling a "network of networks" — the internet as we know it.
              {' '}
              <ConceptTooltip
                term="DNS"
                short="The phone book of the internet"
                detail="The Domain Name System (DNS), introduced in 1983 by Paul Mockapetris, translates human-readable domain names (like google.com) into IP addresses. Without DNS, you'd have to memorize numeric IP addresses for every website you visit."
                color="#10b981"
              />{' '}
              followed in 1983, making the web human-navigable.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes genesis-glitch {
          0% { transform: translate(0); filter: none; }
          20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(3px, -2px); filter: hue-rotate(-90deg); }
          60% { transform: translate(-2px, 3px); filter: brightness(1.5); }
          80% { transform: translate(2px, -3px); filter: hue-rotate(45deg); }
          100% { transform: translate(0); filter: none; }
        }
        .genesis-glitch {
          animation: genesis-glitch 0.5s ease forwards;
        }
      `}</style>
    </section>
  );
}
