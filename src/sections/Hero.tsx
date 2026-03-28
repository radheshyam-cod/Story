import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { NetworkCanvas } from '../features/NetworkCanvas';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Different parallax layers
  const orb1X = useTransform(smoothX, [-1, 1], [-30, 30]);
  const orb1Y = useTransform(smoothY, [-1, 1], [-20, 20]);
  const orb2X = useTransform(smoothX, [-1, 1], [25, -25]);
  const orb2Y = useTransform(smoothY, [-1, 1], [15, -15]);
  const orb3X = useTransform(smoothX, [-1, 1], [-15, 15]);
  const orb3Y = useTransform(smoothY, [-1, 1], [-25, 25]);
  const textX  = useTransform(smoothX, [-1, 1], [-8, 8]);
  const textY  = useTransform(smoothY, [-1, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Layer 1: Interactive network canvas (background) */}
      <NetworkCanvas />

      {/* Layer 2: Parallax glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            top: '10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%)',
            x: orb1X,
            y: orb1Y,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            bottom: '5%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(122,92,255,0.07) 0%, transparent 70%)',
            x: orb2X,
            y: orb2Y,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            top: '40%',
            left: '60%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
            x: orb3X,
            y: orb3Y,
          }}
        />
      </div>

      {/* Layer 3: Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pointer-events-none"
        style={{ x: textX, y: textY }}
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(0,240,255,0.08)',
            border: '1px solid rgba(0,240,255,0.25)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"
            style={{ boxShadow: '0 0 8px #00f0ff' }}
          />
          <span className="text-[#00f0ff] font-mono text-xs tracking-widest uppercase">
            Interactive Journey
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6 bg-gradient-to-r from-[#00f0ff] via-[#7a5cff] to-[#ec4899] bg-clip-text text-transparent"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
            lineHeight: '1.05',
            fontWeight: '800',
            letterSpacing: '-0.02em',
          }}
        >
          The Architecture<br />of Connectivity
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="mb-4 text-gray-300"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
        >
          A Technical & Socio-Economic History of the Web
        </motion.p>

        <p className="mb-10 text-gray-600 font-mono text-sm">
          ARPANET → WWW → Web 2.0 → Web3 → Web 4.0
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
          className="pointer-events-auto flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => document.getElementById('genesis')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #7a5cff)',
              boxShadow: '0 0 30px rgba(0,240,255,0.3)',
            }}
          >
            Begin the Journey
          </button>
          <button
            onClick={() => document.getElementById('genesis')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full font-semibold border border-white/20 text-white hover:border-white/40 transition-all duration-300 hover:scale-105"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            Explore Nodes ↗
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-[#00f0ff]" style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }} />
        </motion.div>
      </div>

      {/* Scanline vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </section>
  );
}
