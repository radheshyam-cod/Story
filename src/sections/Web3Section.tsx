import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Key, FileCode, Globe, Server, Zap } from 'lucide-react';
import { PacketSimulation } from '../features/PacketSimulation';
import { ConceptTooltip } from '../components/ConceptTooltip';


export function Web3Section() {
  const sectionRef = useRef<HTMLElement>(null);
  const [comparison, setComparison] = useState<'web2' | 'web3'>('web2');
  const [packetMode, setPacketMode] = useState<'web2' | 'web3'>('web2');

  const comparisonData = [
    {
      aspect: 'Data Ownership',
      web2: { icon: Server, text: 'Platform-owned, centralized servers', detail: 'Your data lives on corporate servers — Facebook, Google, Amazon. They own it, monetize it, and can delete or block your access at any time.' },
      web3: { icon: Database, text: 'User-owned via cryptographic keys', detail: 'Your private key = your data. No intermediary can revoke access. Smart contracts enforce ownership rules automatically.' },
    },
    {
      aspect: 'Identity',
      web2: { icon: Key, text: 'Email/password, controlled by platforms', detail: 'Platform-controlled identity means a ban or hack can lock you out of everything. Your digital identity is rented, not owned.' },
      web3: { icon: Key, text: 'Wallet-based, self-sovereign identity', detail: 'Your wallet address is your identity. No signup, no password, no permission needed. You control your keys, you control your identity.' },
    },
    {
      aspect: 'Trust Model',
      web2: { icon: Globe, text: 'Trust in corporations and institutions', detail: 'Web2 requires trust in intermediaries — that they won\'t lie, won\'t censor, won\'t be hacked. History shows this trust is frequently violated.' },
      web3: { icon: FileCode, text: 'Trustless smart contracts and consensus', detail: 'Smart contracts execute automatically when conditions are met. No humans in the loop, no counterparty risk. "Don\'t trust, verify."' },
    },
  ];

  const [expandedComparison, setExpandedComparison] = useState<number | null>(null);

  // Network visualization nodes
  const centralizedNodes = [0, 60, 120, 180, 240, 300].map((angle) => ({
    x: 100 + 65 * Math.cos((angle * Math.PI) / 180),
    y: 100 + 65 * Math.sin((angle * Math.PI) / 180),
  }));

  const decentralizedNodes = [
    [50, 50], [150, 50], [100, 100], [50, 150], [150, 150],
    [25, 100], [175, 100],
  ];

  return (
    <section
      id="web3"
      ref={sectionRef}
      className="relative min-h-screen py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #000000 0%, #00080e 50%, #000000 100%)' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00f0ff] rounded-full blur-[150px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-[#ec4899] rounded-full blur-[150px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
              style={{ background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)' }}>
              <Zap className="w-3 h-3 text-[#00f0ff]" />
              <span className="text-[#00f0ff] font-mono text-xs tracking-widest">2015 – PRESENT</span>
            </div>
            <h2
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ec4899]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700' }}
            >
              Web3: Decentralization
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Web3 distributes control across{' '}
              <ConceptTooltip
                term="blockchain networks"
                short="Immutable distributed ledger"
                detail="A blockchain is a chain of blocks, each containing transaction data, linked by cryptographic hashes. Once recorded, data cannot be altered without redoing all subsequent blocks — providing immutability. The consensus mechanism (PoW, PoS) ensures agreement without a central authority."
                color="#00f0ff"
              />
              , fundamentally changing the power dynamics of the internet.
            </p>
          </div>

          {/* Key Concepts */}
          <div className="mb-16 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Blockchain',
                desc: 'Distributed ledger with cryptographic integrity',
                color: '#00f0ff',
                icon: '⛓️',
                detail: 'Every transaction is recorded on a chain of blocks. Each block references the previous one via hash, making tampering computationally infeasible.',
              },
              {
                title: 'IPFS',
                desc: 'Content-addressed peer-to-peer storage',
                color: '#7a5cff',
                icon: '🌐',
                detail: 'InterPlanetary File System addresses content by what it IS (hash) rather than where it is (URL). Files are distributed across the network — no central server can take them down.',
              },
              {
                title: 'Smart Contracts',
                desc: 'Self-executing code on the blockchain',
                color: '#ec4899',
                icon: '📜',
                detail: 'Smart contracts are programs stored on a blockchain that run automatically when predefined conditions are met. They eliminate intermediaries in financial, legal, and governance processes.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="web3-card p-6 rounded-xl cursor-pointer"
                style={{
                  border: `1px solid ${item.color}30`,
                  background: `linear-gradient(135deg, ${item.color}08, transparent)`,
                  backdropFilter: 'blur(10px)',
                }}
                data-cursor="node"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: item.color, fontSize: '1.2rem' }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{item.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* ⚖️ Web2 vs Web3 Toggle */}
          <div className="mb-16">
            <h3
              className="text-center font-bold mb-8"
              style={{ color: '#00f0ff', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
            >
              The Paradigm Shift
            </h3>

            {/* Toggle */}
            <div className="flex justify-center mb-8">
              <div
                className="relative flex rounded-xl overflow-hidden p-1 gap-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {(['web2', 'web3'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setComparison(mode)}
                    className="relative px-8 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300"
                    style={{
                      background: comparison === mode
                        ? mode === 'web2'
                          ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                          : 'linear-gradient(135deg, #00f0ff, #7a5cff)'
                        : 'transparent',
                      color: comparison === mode ? (mode === 'web2' ? '#000' : '#000') : '#666',
                      boxShadow: comparison === mode
                        ? `0 0 20px ${mode === 'web2' ? '#f59e0b50' : '#00f0ff50'}`
                        : 'none',
                    }}
                  >
                    {mode === 'web2' ? 'Centralized (Web2)' : 'Decentralized (Web3)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison cards */}
            <div className="space-y-4">
              {comparisonData.map((item, index) => {
                const data = comparison === 'web2' ? item.web2 : item.web3;
                const Icon = data.icon;
                const isExpanded = expandedComparison === index;
                const color = comparison === 'web2' ? '#f59e0b' : '#00f0ff';

                return (
                  <motion.div
                    key={item.aspect}
                    layout
                    initial={{ opacity: 0, x: comparison === 'web2' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      background: `${color}08`,
                      border: `1px solid ${color}${isExpanded ? '50' : '20'}`,
                      transition: 'border-color 0.3s',
                    }}
                    onClick={() => setExpandedComparison(isExpanded ? null : index)}
                    data-cursor="node"
                  >
                    <div className="p-5 flex items-center gap-4">
                      <div
                        className="p-3 rounded-xl shrink-0"
                        style={{ background: `${color}18` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest">{item.aspect}</p>
                        <p className="font-semibold" style={{ color }}>
                          {data.text}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-600 text-lg shrink-0"
                      >
                        ▾
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                            style={{ borderTop: `1px solid ${color}15` }}
                          >
                            <p className="pt-4">{data.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 🧠 Packet Simulation */}
          <div className="mb-16">
            <h3
              className="font-bold mb-3"
              style={{ color: '#7a5cff', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
            >
              Simulate the Web
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Watch how data travels differently in centralized vs. decentralized networks.
            </p>

            <div className="flex justify-center mb-6">
              <div
                className="relative flex rounded-xl overflow-hidden p-1 gap-1"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {(['web2', 'web3'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPacketMode(mode)}
                    className="px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                      background: packetMode === mode
                        ? mode === 'web2' ? '#f59e0b' : '#00f0ff'
                        : 'transparent',
                      color: packetMode === mode ? '#000' : '#666',
                    }}
                  >
                    {mode === 'web2' ? '🏛 Centralized' : '🕸 Distributed'}
                  </button>
                ))}
              </div>
            </div>

            <PacketSimulation mode={packetMode} />
          </div>

          {/* Network Architecture Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(122,92,255,0.2)' }}
          >
            <h3
              className="font-bold mb-6 text-center"
              style={{ color: '#7a5cff', fontSize: '1.3rem' }}
            >
              Network Topology Comparison
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Centralized */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <h4 className="text-center text-sm font-semibold text-[#ef4444] mb-4">
                  Centralized (Web2)
                </h4>
                <svg viewBox="0 0 200 200" className="w-full" style={{ maxHeight: '200px' }}>
                  {centralizedNodes.map((node, i) => (
                    <g key={i}>
                      <line x1="100" y1="100" x2={node.x} y2={node.y} stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
                      <circle cx={node.x} cy={node.y} r="7" fill="#ef444440" stroke="#ef4444" strokeWidth="1" />
                    </g>
                  ))}
                  {/* Central server */}
                  <circle cx="100" cy="100" r="18" fill="#ef444425" stroke="#ef4444" strokeWidth="2" />
                  <text x="100" y="97" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">SERVER</text>
                  <text x="100" y="107" textAnchor="middle" fill="#ef444490" fontSize="6">Central</text>
                </svg>
                <p className="text-center text-gray-600 text-xs mt-2">Single point of failure</p>
              </div>

              {/* Decentralized */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)' }}
              >
                <h4 className="text-center text-sm font-semibold text-[#00f0ff] mb-4">
                  Decentralized (Web3)
                </h4>
                <svg viewBox="0 0 200 200" className="w-full" style={{ maxHeight: '200px' }}>
                  {decentralizedNodes.map((pos, i) => (
                    <g key={i}>
                      {decentralizedNodes.map((target, j) => {
                        if (j <= i) return null;
                        const dist = Math.sqrt(
                          (pos[0] - target[0]) ** 2 + (pos[1] - target[1]) ** 2
                        );
                        if (dist > 90) return null;
                        return (
                          <line
                            key={j}
                            x1={pos[0]}
                            y1={pos[1]}
                            x2={target[0]}
                            y2={target[1]}
                            stroke="#00f0ff"
                            strokeWidth="1"
                            opacity="0.25"
                          />
                        );
                      })}
                      <circle cx={pos[0]} cy={pos[1]} r="10" fill="#00f0ff20" stroke="#00f0ff" strokeWidth="1.5" />
                      <text x={pos[0]} y={pos[1] + 4} textAnchor="middle" fill="#00f0ff" fontSize="7" fontWeight="bold">
                        N{i + 1}
                      </text>
                    </g>
                  ))}
                </svg>
                <p className="text-center text-gray-600 text-xs mt-2">No single point of failure</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
