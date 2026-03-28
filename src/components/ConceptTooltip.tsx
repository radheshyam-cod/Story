import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

interface ConceptTooltipProps {
  term: string;
  short: string;
  detail: string;
  color?: string;
  children?: ReactNode;
}

// Dynamic style helpers
const getTermStyle = (color: string, hovered: boolean) => ({
  color,
  borderBottom: `2px dashed ${color}80`,
  paddingBottom: '1px',
  fontWeight: 600,
  textShadow: hovered ? `0 0 12px ${color}80` : 'none',
  transition: 'text-shadow 0.2s ease',
});

const getTooltipCardStyle = (color: string) => ({
  background: `linear-gradient(135deg, ${color}18, #0a0a0a)`,
  border: `1px solid ${color}40`,
  boxShadow: `0 0 20px ${color}20`,
});

const getArrowStyle = (color: string) => ({
  borderLeft: '6px solid transparent',
  borderRight: '6px solid transparent',
  borderTop: `6px solid ${color}40`,
});

const getModalOverlayStyle = () => ({
  background: 'rgba(0,0,0,0.85)',
  backdropFilter: 'blur(8px)',
});

const getModalCardStyle = (color: string) => ({
  background: `linear-gradient(135deg, #0a0a1a, #000000)`,
  border: `1px solid ${color}50`,
  boxShadow: `0 0 60px ${color}20, inset 0 0 60px ${color}05`,
});

const getIconBoxStyle = (color: string) => ({
  background: `${color}20`,
  border: `1px solid ${color}40`,
});

const getModalTitleStyle = (color: string) => ({
  color,
  fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
  fontWeight: 700,
  textShadow: `0 0 20px ${color}60`,
});

const getDividerStyle = (color: string) => ({
  background: `linear-gradient(to right, ${color}40, transparent)`,
});

export function ConceptTooltip({
  term,
  short,
  detail,
  color = '#00f0ff',
  children,
}: ConceptTooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <span
        className="relative inline-block"
        data-cursor="node"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setExpanded(true)}
      >
        <span
          className="cursor-pointer relative"
          style={getTermStyle(color, hovered)}
        >
          {children || term}
        </span>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hovered && !expanded && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
              style={{ minWidth: '180px' }}
            >
              <div
                className="px-3 py-2 rounded-lg backdrop-blur-xl text-center"
                style={getTooltipCardStyle(color)}
              >
                <p className="text-xs font-bold" style={{ color }}>
                  {term}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{short}</p>
                <div className="flex items-center justify-center gap-1 mt-1.5">
                  <Zap className="w-2.5 h-2.5 text-gray-500" />
                  <p className="text-[10px] text-gray-500">Click to explore</p>
                </div>
              </div>
              {/* Arrow */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                style={getArrowStyle(color)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </span>

      {/* Expanded modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={getModalOverlayStyle()}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-md w-full p-8 rounded-2xl"
              style={getModalCardStyle(color)}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-white transition-colors"
                onClick={() => setExpanded(false)}
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={getIconBoxStyle(color)}
              >
                <Zap className="w-5 h-5" style={{ color }} />
              </div>

              <h3
                className="mb-2"
                style={getModalTitleStyle(color)}
              >
                {term}
              </h3>

              <p className="text-white mb-3" style={{ fontWeight: 500 }}>
                {short}
              </p>

              <p className="text-gray-400 leading-relaxed text-sm">{detail}</p>

              <div
                className="mt-6 h-px"
                style={getDividerStyle(color)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}