import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEraState } from '../hooks/useEraState';

interface Section {
  id: string;
  label: string;
  color: string;
  year: string;
}

const sections: Section[] = [
  { id: 'hero',      label: 'Intro',     color: '#00f0ff', year: '1960' },
  { id: 'genesis',   label: 'Genesis',   color: '#3b82f6', year: '1969' },
  { id: 'web-birth', label: 'Web Birth', color: '#10b981', year: '1991' },
  { id: 'web2',      label: 'Web 2.0',   color: '#f59e0b', year: '2004' },
  { id: 'web3',      label: 'Web3',      color: '#ec4899', year: '2017' },
  { id: 'future',    label: 'Future',    color: '#7a5cff', year: '2030' },
];

export function MiniMap() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hovered, setHovered] = useState<string | null>(null);
  const { currentColor } = useEraState();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      className="minimap-container fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 2 }}
    >
      {/* Vertical line */}
      <div className="minimap-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" />

      <div className="flex flex-col items-center gap-5 relative">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isHovered = hovered === section.id;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center justify-center group"
              aria-label={`Navigate to ${section.label}`}
            >
              {/* Dot */}
              <motion.div
                animate={{
                  width: isActive ? '12px' : isHovered ? '10px' : '8px',
                  height: isActive ? '12px' : isHovered ? '10px' : '8px',
                }}
                transition={{ duration: 0.2 }}
                className="rounded-full transition-all"
                style={{
                  backgroundColor: isActive ? section.color : 'transparent',
                  border: `2px solid ${isActive ? section.color : isHovered ? section.color : '#333'}`,
                  boxShadow: isActive
                    ? `0 0 10px ${section.color}, 0 0 20px ${section.color}40`
                    : isHovered
                    ? `0 0 6px ${section.color}60`
                    : 'none',
                }}
              />

              {/* Label tooltip */}
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="minimap-tooltip absolute right-full mr-4 pointer-events-none"
                  >
                    <div
                      className="px-3 py-1.5 rounded-lg backdrop-blur-xl minimap-tooltip-card"
                      data-color={section.color}
                    >
                      <p className="text-xs font-semibold minimap-tooltip-title" style={{ color: section.color }}>
                        {section.label}
                      </p>
                      <p className="text-gray-600 font-mono minimap-tooltip-year">
                        {section.year}
                      </p>
                    </div>
                    {/* Arrow */}
                    <div
                      className="minimap-arrow absolute top-1/2 -translate-y-1/2 right-0 translate-x-full w-0 h-0"
                      data-color={section.color}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {/* Era indicator line at bottom */}
      <motion.div
        className="minimap-era-indicator mt-4 h-0.5 w-6 rounded-full mx-auto"
        animate={{ backgroundColor: currentColor }}
        transition={{ duration: 0.5 }}
        style={{ boxShadow: `0 0 6px ${currentColor}` }}
      />
    </motion.div>
  );
}
