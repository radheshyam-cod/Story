import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEraState } from '../hooks/useEraState';

const MIN_YEAR = 1960;
const MAX_YEAR = 2035;

const MILESTONES = [
  { year: 1969, label: 'ARPANET', section: 'genesis' },
  { year: 1983, label: 'TCP/IP',  section: 'genesis' },
  { year: 1991, label: 'WWW',     section: 'web-birth' },
  { year: 2000, label: 'Crash',   section: 'web-birth' },
  { year: 2004, label: 'Web 2.0', section: 'web2' },
  { year: 2009, label: 'Bitcoin', section: 'web3' },
  { year: 2023, label: 'AI Era',  section: 'future' },
];

function yearToProgress(year: number) {
  return (year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR);
}

function scrollProgressToYear(sp: number) {
  return Math.round(MIN_YEAR + sp * (MAX_YEAR - MIN_YEAR));
}

export function TimelineSlider() {
  const [year, setYear] = useState(MIN_YEAR);
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isDraggingRef = useRef(false);
  const { currentColor, currentLabel } = useEraState();

  // Sync year from scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingRef.current) return;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const sp = window.scrollY / scrollable;
      setYear(scrollProgressToYear(sp));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToYear = useCallback((newYear: number) => {
    const scrollable = document.body.scrollHeight - window.innerHeight;
    const sp = yearToProgress(newYear);
    window.scrollTo({ top: sp * scrollable, behavior: 'auto' });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = Number(e.target.value);
    setYear(newYear);
    scrollToYear(newYear);
  };

  const handleMilestoneClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const yearProgress = yearToProgress(year);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40"
      initial={{ y: 80 }}
      animate={{ y: isExpanded ? 0 : 56 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Toggle tab */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-7 left-1/2 -translate-x-1/2 px-4 py-1 rounded-t-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
        style={{
          background: 'rgba(0,0,0,0.8)',
          border: `1px solid ${currentColor}30`,
          borderBottom: 'none',
          color: currentColor,
        }}
      >
        <span className="text-[10px] tracking-widest uppercase">Timeline</span>
        <span style={{ fontSize: '8px' }}>{isExpanded ? '▼' : '▲'}</span>
      </button>

      <div
        className="w-full"
        style={{
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${currentColor}25`,
          boxShadow: `0 -8px 40px rgba(0,0,0,0.8), 0 0 20px ${currentColor}10`,
        }}
      >
        {/* Milestones row */}
        <div className="relative h-7 mx-6 mt-2">
          {MILESTONES.map((m) => {
            const pos = yearToProgress(m.year) * 100;
            const isPast = m.year <= year;
            return (
              <button
                key={m.year}
                className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5 group"
                style={{ left: `${pos}%`, top: 0 }}
                onMouseEnter={() => setHoveredMilestone(m.label)}
                onMouseLeave={() => setHoveredMilestone(null)}
                onClick={() => handleMilestoneClick(m.section)}
              >
                <div
                  className="w-0.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isPast ? currentColor : '#333',
                    boxShadow: isPast ? `0 0 4px ${currentColor}` : 'none',
                  }}
                />
                <AnimatePresence>
                  {hoveredMilestone === m.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      className="absolute top-full mt-1 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap z-10"
                      style={{
                        background: '#0a0a0a',
                        border: `1px solid ${currentColor}40`,
                        color: currentColor,
                      }}
                    >
                      {m.year} · {m.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Main slider row */}
        <div className="flex items-center gap-3 px-6 pb-3">
          {/* Year labels */}
          <span className="text-gray-600 font-mono text-[11px] w-10 shrink-0">{MIN_YEAR}</span>

          {/* Slider */}
          <div className="relative flex-1">
            {/* Track fill */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full pointer-events-none"
              style={{
                width: `${yearProgress * 100}%`,
                background: `linear-gradient(to right, #3b82f6, ${currentColor})`,
                boxShadow: `0 0 8px ${currentColor}80`,
                transition: 'width 0.05s linear, box-shadow 0.3s',
              }}
            />
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              value={year}
              onChange={handleChange}
              onMouseDown={() => { setIsDragging(true); isDraggingRef.current = true; }}
              onMouseUp={() => { setIsDragging(false); isDraggingRef.current = false; }}
              onTouchStart={() => { isDraggingRef.current = true; }}
              onTouchEnd={() => { isDraggingRef.current = false; }}
              data-cursor="drag"
              className="w-full h-1 rounded-full appearance-none relative z-10"
              style={{
                background: 'transparent',
                outline: 'none',
              }}
            />
          </div>

          <span className="text-gray-600 font-mono text-[11px] w-10 shrink-0 text-right">{MAX_YEAR}</span>

          {/* Current year badge */}
          <div
            className="shrink-0 px-3 py-1 rounded-lg min-w-[90px] text-center"
            style={{
              background: `${currentColor}15`,
              border: `1px solid ${currentColor}40`,
              boxShadow: `0 0 12px ${currentColor}20`,
            }}
          >
            <div className="font-mono font-bold" style={{ color: currentColor, fontSize: '15px' }}>
              {year}
            </div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest">{currentLabel}</div>
          </div>
        </div>

        {/* Drag hint */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] text-gray-500 font-mono"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            Drag to travel through time
          </motion.div>
        )}
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${currentColor};
          cursor: grab;
          box-shadow: 0 0 10px ${currentColor};
          transition: transform 0.1s, box-shadow 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.3);
          box-shadow: 0 0 18px ${currentColor};
        }
        input[type=range]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${currentColor};
          cursor: grab;
          box-shadow: 0 0 10px ${currentColor};
          border: none;
        }
      `}</style>
    </motion.div>
  );
}
