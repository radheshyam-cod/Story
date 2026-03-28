import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { platforms } from '../../utils/data/web2';
import { slideUp, staggerChildren } from '../../utils/animation';

const colorMap: Record<string, { text: string; border: string; gradient: string }> = {
  '#00f0ff': { text: 'text-cyan-300', border: 'border-cyan-300/40', gradient: 'from-cyan-300' },
  '#3b82f6': { text: 'text-blue-400', border: 'border-blue-400/40', gradient: 'from-blue-400' },
  '#ef4444': { text: 'text-red-400', border: 'border-red-400/40', gradient: 'from-red-400' },
  '#10b981': { text: 'text-emerald-300', border: 'border-emerald-300/40', gradient: 'from-emerald-300' },
  '#7a5cff': { text: 'text-indigo-300', border: 'border-indigo-300/40', gradient: 'from-indigo-300' },
  '#ec4899': { text: 'text-pink-300', border: 'border-pink-300/40', gradient: 'from-pink-300' },
};

export const PlatformGrid = memo(function PlatformGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="mb-16" ref={ref}>
      <h3 className="font-bold mb-6 text-amber-400 text-lg">The Rise of Platforms</h3>
      <motion.div
        variants={staggerChildren(0.08)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid md:grid-cols-3 gap-4"
      >
        {platforms.map((platform) => {
          const palette = colorMap[platform.color];
          return (
            <motion.div
              key={platform.name}
              variants={slideUp}
              className={`web2-platform-card p-5 rounded-xl cursor-pointer bg-black/40 border ${palette.border} transition-transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-gray-600 font-mono text-xs">{platform.year}</span>
              </div>
              <h4 className="font-bold text-white mb-1">{platform.name}</h4>
              <p className={`text-xs mb-2 ${palette.text}`}>{platform.users}</p>
              <div className={`h-0.5 w-full rounded-full mb-3 bg-gradient-to-r ${palette.gradient} to-transparent`} />
              <p className="text-gray-500 text-xs">{platform.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
});
