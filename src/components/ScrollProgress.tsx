import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEraState } from '../hooks/useEraState';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [percentage, setPercentage] = useState(0);
  const { currentColor, currentLabel, currentYear } = useEraState();

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 origin-left z-50"
        style={{
          scaleX,
          background: `linear-gradient(to right, #3b82f6, ${currentColor})`,
          boxShadow: `0 0 8px ${currentColor}80`,
        }}
      />

      {/* Era status indicator */}
      <motion.div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full"
        style={{
          background: `${currentColor}10`,
          border: `1px solid ${currentColor}30`,
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          animate={{ backgroundColor: currentColor }}
          transition={{ duration: 0.4 }}
          style={{ boxShadow: `0 0 6px ${currentColor}` }}
        />
        <motion.span
          className="font-mono text-xs font-bold"
          animate={{ color: currentColor }}
          transition={{ duration: 0.4 }}
        >
          {currentYear} · {currentLabel}
        </motion.span>
      </motion.div>

      {/* Percentage badge (top right) */}
      <motion.div
        className="fixed top-4 right-16 z-50 px-3 py-1.5 rounded-full hidden lg:block"
        style={{
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <span className="font-mono text-xs" style={{ color: currentColor }}>
          {percentage}%
        </span>
      </motion.div>
    </>
  );
}
