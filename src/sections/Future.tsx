import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Globe2, Cpu, Network, Lock, Eye, RotateCcw } from 'lucide-react';
import { ConceptTooltip } from '../components/ConceptTooltip';


export function Future() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [agentStep, setAgentStep] = useState(0);
  const [agentRunning, setAgentRunning] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const agentSteps = [
    { icon: Brain, label: 'Perceive',  description: 'Analyze user intent, context, and environment',   color: '#7a5cff', detail: 'AI agents continuously parse natural language, sensor data, and API signals to understand what the user needs — often before they even ask.' },
    { icon: Zap,   label: 'Plan',     description: 'Decompose tasks into executable sub-goals',        color: '#ec4899', detail: 'The agent breaks complex goals into discrete steps, reasons about dependencies, and creates an execution plan using chain-of-thought reasoning.' },
    { icon: Globe2, label: 'Execute',  description: 'Browse, code, and act autonomously across services', color: '#f59e0b', detail: 'The agent calls APIs, writes and runs code, navigates websites, fills forms, and coordinates with other agents — all without human supervision.' },
    { icon: Cpu,    label: 'Learn',    description: 'Update memory and improve from outcomes',           color: '#00f0ff', detail: 'Actions and outcomes are stored in vector databases. The agent learns from experience, personalizing its behavior to each user over time.' },
  ];

  // Auto-advance agent steps
  useEffect(() => {
    if (!agentRunning) return;
    const interval = setInterval(() => {
      setAgentStep((prev) => (prev + 1) % agentSteps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [agentRunning, agentSteps.length]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      alpha: number; size: number;
      hue: number;
    }

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
      size: Math.random() * 2 + 0.5,
      hue: Math.random() > 0.5 ? 280 : 200,
    }));

    let raf: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 60%, ${(1 - dist / 100) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const existentialQuestions = [
    {
      q: 'Who controls autonomous systems?',
      a: 'When AI agents act on our behalf — booking flights, making trades, managing health data — accountability becomes diffuse. Who is responsible when an agent causes harm? The user? The developer? The model provider?',
      icon: Network,
      color: '#7a5cff',
    },
    {
      q: 'Who owns digital identity?',
      a: 'Web4 may converge self-sovereign identity (blockchain wallets) with biometric AI verification. But if your identity lives on a network you don\'t control, it can be revoked. The architecture of identity IS the architecture of power.',
      icon: Lock,
      color: '#ec4899',
    },
    {
      q: 'What happens to human agency?',
      a: 'As AI optimizes decisions, humans may delegate more and more cognitive work. Convenience breeds dependence. The risk: a generation that can\'t reason without AI assistance — outsourcing the very faculty that makes us human.',
      icon: Eye,
      color: '#f59e0b',
    },
  ];

  return (
    <section
      id="future"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      style={{ background: '#000000' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
            style={{ background: 'rgba(122,92,255,0.1)', border: '1px solid rgba(122,92,255,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full bg-[#7a5cff] animate-pulse" style={{ boxShadow: '0 0 8px #7a5cff' }} />
            <span className="text-[#7a5cff] font-mono text-xs tracking-widest uppercase">2025 → Beyond</span>
          </div>

          <h2
            className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#7a5cff] via-[#ec4899] to-[#f59e0b]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700' }}
          >
            The Future: Web 4.0
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-3xl mx-auto">
            Web 4.0 introduces{' '}
            <ConceptTooltip
              term="autonomous agents"
              short="AI systems that perceive, plan, and act"
              detail="Autonomous agents are AI systems that can perceive their environment, make decisions, and take actions to achieve goals — without continuous human supervision. They can browse the web, write code, manage files, call APIs, and coordinate with other agents. The shift is from AI as a tool to AI as a collaborator."
              color="#7a5cff"
            />{' '}
            — AI systems that can plan, execute, and act on behalf of users across the entire web.
          </p>

          <p className="text-gray-500">
            The web shifts from <span className="text-white font-semibold">search</span> → {' '}
            <span className="text-[#7a5cff] font-semibold">instruction</span> →{' '}
            <span className="text-[#00f0ff] font-semibold">autonomous action</span>.
          </p>
        </motion.div>

        {/* Agentic Workflow */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold" style={{ color: '#ec4899', fontSize: '1.3rem' }}>
              Agentic Workflow
            </h3>
            <button
              onClick={() => setAgentRunning(!agentRunning)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                background: agentRunning ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${agentRunning ? 'rgba(236,72,153,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: agentRunning ? '#ec4899' : '#666',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {agentRunning ? 'Pause' : 'Resume'}
            </button>
          </div>

          {/* Step progress dots */}
          <div className="flex items-center gap-2 mb-6">
            {agentSteps.map((step, i) => (
              <button
                key={i}
                onClick={() => { setAgentStep(i); setAgentRunning(false); }}
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: i <= agentStep ? step.color : '#1a1a1a',
                  boxShadow: i === agentStep ? `0 0 8px ${step.color}` : 'none',
                }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {agentSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === agentStep;
              const isPast = index < agentStep;

              return (
                <motion.div
                  key={step.label}
                  layout
                  className="relative rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: isActive ? `${step.color}12` : '#050505',
                    border: `1px solid ${isActive ? step.color : isPast ? `${step.color}30` : '#1a1a1a'}`,
                    boxShadow: isActive ? `0 0 30px ${step.color}20` : 'none',
                    transition: 'all 0.4s ease',
                  }}
                  onClick={() => { setAgentStep(index); setAgentRunning(false); }}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div
                      className="p-3 rounded-xl transition-all duration-400 shrink-0"
                      style={{
                        background: isActive || isPast ? `${step.color}20` : '#111',
                      }}
                    >
                      <Icon
                        className="w-7 h-7 transition-all duration-400"
                        style={{ color: isActive || isPast ? step.color : '#333' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h5
                        className="font-bold mb-0.5 transition-colors duration-400"
                        style={{
                          color: isActive ? step.color : isPast ? `${step.color}80` : '#333',
                          fontSize: '1.1rem',
                        }}
                      >
                        {index + 1}. {step.label}
                      </h5>
                      <p className={`text-sm transition-colors duration-400 ${isActive ? 'text-gray-300' : isPast ? 'text-gray-600' : 'text-gray-700'}`}>
                        {step.description}
                      </p>
                    </div>

                    {isActive && (
                      <motion.div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: step.color, boxShadow: `0 0 10px ${step.color}` }}
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}

                    {isPast && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                        style={{ background: `${step.color}20`, color: step.color }}
                      >
                        ✓
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-5 pb-5 text-xs text-gray-500 leading-relaxed"
                          style={{ borderTop: `1px solid ${step.color}15` }}
                        >
                          <span className="pt-3 block">{step.detail}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Future Capabilities */}
        <div className="mb-20 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Cpu,
              title: 'Edge Intelligence',
              color: '#7a5cff',
              body: 'AI inference moves to edge devices — phones, chips, wearables. Privacy by design: your data never leaves your device. Real-time responses without cloud latency.',
            },
            {
              icon: Globe2,
              title: 'Ambient Computing',
              color: '#ec4899',
              body: 'Physical and digital worlds merge. Spatial computing, haptic interfaces, and neural I/O blur the boundary. The web becomes environmental, not just a screen.',
            },
          ].map((cap) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${cap.color}08, transparent)`,
                  border: `1px solid ${cap.color}25`,
                }}
              >
                <Icon className="w-10 h-10 mb-4" style={{ color: cap.color }} />
                <h4 className="font-bold mb-3" style={{ color: cap.color, fontSize: '1.2rem' }}>
                  {cap.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">{cap.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Existential Questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="h-px mb-12" style={{ background: 'linear-gradient(to right, transparent, #7a5cff, transparent)' }} />

          <h3
            className="text-center font-bold mb-3"
            style={{ color: '#f59e0b', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
          >
            Who Owns the Web?
          </h3>
          <p className="text-center text-gray-600 text-sm mb-8">Click each question to explore</p>

          <div className="space-y-3 mb-16">
            {existentialQuestions.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeQuestion === index;
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: isActive ? `${item.color}10` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? item.color + '50' : 'rgba(255,255,255,0.06)'}`,
                  }}
                  onClick={() => setActiveQuestion(isActive ? null : index)}
                  data-cursor="node"
                >
                  <div className="p-5 flex items-center gap-4">
                    <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                    <p className="flex-1 font-medium" style={{ color: isActive ? item.color : '#00f0ff' }}>
                      {item.q}
                    </p>
                    <motion.span
                      animate={{ rotate: isActive ? 180 : 0 }}
                      className="text-gray-600 shrink-0"
                    >
                      ▾
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-5 pb-5 text-gray-400 text-sm leading-relaxed"
                          style={{ borderTop: `1px solid ${item.color}15` }}
                        >
                          <span className="block pt-4">{item.a}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="text-center space-y-6"
          >
            <div
              className="inline-block px-8 py-8 rounded-2xl max-w-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(122,92,255,0.08), rgba(0,240,255,0.04))',
                border: '1px solid rgba(122,92,255,0.2)',
              }}
            >
              <p
                className="italic text-gray-300 text-lg leading-relaxed mb-4"
              >
                "The web is no longer just infrastructure.<br />
                It is the foundation of global civilization."
              </p>
              <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(122,92,255,0.5), transparent)' }} />
            </div>

            <div className="pt-4">
              <p className="text-gray-600 text-sm">
                From 4 nodes in 1969 to an intelligent, decentralized, agentic web.
              </p>
              <p className="text-gray-700 font-mono text-xs mt-2">
                What we build today defines the civilization of tomorrow.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
