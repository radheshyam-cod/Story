import { useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ConceptTooltip } from '../../components/ConceptTooltip';
import { PlatformGrid } from './PlatformGrid';
import { SurveillancePanel } from './SurveillancePanel';
import { MobileRevolution } from './MobileRevolution';
import '../../styles/retro-web2.css';
import { fadeIn, fadeSlide } from '../../utils/animation';
import { useRef } from 'react';

type ViewMode = 'user' | 'platform';

export const Web2Section = memo(function Web2Section() {
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="web2" className="relative min-h-screen py-24 px-6 overflow-hidden web2-gradient" ref={sectionRef}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full web2-badge">
              <Zap className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400 font-mono text-xs tracking-widest">2001 – 2015</span>
            </div>
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-pink-500 text-4xl md:text-5xl font-bold">
              Web 2.0
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              The shift from read-only to read-write, enabled by{' '}
              <ConceptTooltip
                term="AJAX"
                short="Asynchronous data loading without page refresh"
                detail="Asynchronous JavaScript and XML (AJAX) allowed web pages to fetch data from servers without reloading. Jesse James Garrett named it in 2005. Google Maps was the first blockbuster AJAX application — suddenly the web felt like software, not documents."
                color="#f59e0b"
              />
              , broadband, and social participation.
            </p>
          </header>

          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-6 mb-8 text-gray-200">
              {['Read', 'Write', 'Monetize'].map((stage, idx) => (
                <div key={stage} className="text-center">
                  <div className="text-4xl mb-1">{['📖', '✍️', '💰'][idx]}</div>
                  <p className={`font-semibold text-sm ${idx === 0 ? 'text-gray-400' : idx === 1 ? 'text-amber-400' : 'text-pink-400'}`}>
                    {stage}
                  </p>
                  <p className="text-gray-700 text-xs">{['Web 1.0', 'Web 2.0', 'Platform era'][idx]}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div variants={fadeSlide()} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <PlatformGrid />
          </motion.div>
          <motion.div variants={fadeSlide()} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <SurveillancePanel mode={viewMode} onChange={setViewMode} />
          </motion.div>
          <MobileRevolution expandedPostId={expandedPostId} onTogglePost={setExpandedPostId} />
        </motion.div>
      </div>
    </section>
  );
});
