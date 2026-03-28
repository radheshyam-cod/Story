import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Era = 'hero' | 'genesis' | 'web-birth' | 'web2' | 'web3' | 'future';

const ERA_YEARS: Record<Era, number> = {
  hero: 1960,
  genesis: 1969,
  'web-birth': 1991,
  web2: 2004,
  web3: 2017,
  future: 2030,
};

const ERA_COLORS: Record<Era, string> = {
  hero: '#00f0ff',
  genesis: '#3b82f6',
  'web-birth': '#10b981',
  web2: '#f59e0b',
  web3: '#ec4899',
  future: '#7a5cff',
};

const ERA_LABELS: Record<Era, string> = {
  hero: 'Initialization',
  genesis: 'Genesis',
  'web-birth': 'Web Birth',
  web2: 'Web 2.0',
  web3: 'Web3',
  future: 'Web 4.0',
};

interface EraContextType {
  currentEra: Era;
  setCurrentEra: (era: Era) => void;
  currentYear: number;
  currentColor: string;
  currentLabel: string;
}

const EraContext = createContext<EraContextType>({
  currentEra: 'hero',
  setCurrentEra: () => {},
  currentYear: 1960,
  currentColor: '#00f0ff',
  currentLabel: 'Initialization',
});

export function EraProvider({ children }: { children: ReactNode }) {
  const [currentEra, setCurrentEra] = useState<Era>('hero');

  useEffect(() => {
    const sectionEras: Array<{ id: string; era: Era }> = [
      { id: 'hero', era: 'hero' },
      { id: 'genesis', era: 'genesis' },
      { id: 'web-birth', era: 'web-birth' },
      { id: 'web2', era: 'web2' },
      { id: 'web3', era: 'web3' },
      { id: 'future', era: 'future' },
    ];

    const handleScroll = () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      for (let i = sectionEras.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionEras[i].id);
        if (el && mid >= el.offsetTop) {
          setCurrentEra(sectionEras[i].era);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <EraContext.Provider
      value={{
        currentEra,
        setCurrentEra,
        currentYear: ERA_YEARS[currentEra],
        currentColor: ERA_COLORS[currentEra],
        currentLabel: ERA_LABELS[currentEra],
      }}
    >
      {children}
    </EraContext.Provider>
  );
}

export function useEraState() {
  return useContext(EraContext);
}
