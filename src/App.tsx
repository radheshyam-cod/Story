import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EraProvider } from './hooks/useEraState';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollProgress } from './components/ScrollProgress';
import { MiniMap } from './components/MiniMap';
import { CustomCursor } from './components/CustomCursor';
import { TimelineSlider } from './components/TimelineSlider';
import { Hero } from './sections/Hero';
import { Genesis } from './sections/Genesis';
import { WebBirth } from './sections/WebBirth';
import { Web2Section } from './sections/Web2/Web2Section';
import { Web3Section } from './sections/Web3Section';
import { Future } from './sections/Future';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <>
      {/* Custom cursor — renders outside EraProvider since it doesn't need era state */}
      <CustomCursor />

      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <EraProvider>
          <div className="bg-black text-white overflow-x-hidden pb-16">
            {/* Fixed UI chrome */}
            <ScrollProgress />
            <MiniMap />

            {/* Main content */}
            <Hero />
            <Genesis />
            <WebBirth />
            <Web2Section />
            <Web3Section />
            <Future />

            {/* Fixed timeline slider at bottom */}
            <TimelineSlider />
          </div>
        </EraProvider>
      )}
    </>
  );
}
