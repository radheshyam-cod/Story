import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Database } from 'lucide-react';
import { dataFlowItems } from '../../utils/data/web2';
import { fadeIn } from '../../utils/animation';

type Mode = 'user' | 'platform';

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export const SurveillancePanel = memo(function SurveillancePanel({ mode, onChange }: Props) {
  const buttons: { key: Mode; label: string; icon: JSX.Element; color: string }[] = [
    { key: 'user', label: 'User View', icon: <User className="w-4 h-4" />, color: 'bg-cyan-400 text-black border-cyan-400' },
    { key: 'platform', label: 'Platform View', icon: <Database className="w-4 h-4" />, color: 'bg-red-400 text-black border-red-400' },
  ];

  return (
    <section className="mb-12 rounded-xl border border-red-300/30 bg-gradient-to-br from-red-500/10 to-pink-500/10 p-8 sticky top-16">
      <div className="flex gap-2 mb-6">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => onChange(btn.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border transition-colors ${
              mode === btn.key ? btn.color : 'bg-white/5 text-gray-400 border-white/10'
            }`}
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="rounded-xl border border-white/10 bg-white/5 p-6"
        >
          {mode === 'user' ? (
            <>
              <h5 className="text-cyan-300 font-semibold mb-4">What Users Experience</h5>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-200">
                {['Free social platforms', 'Personalized feeds', 'Seamless search', 'Cloud storage', 'Maps & navigation', 'Instant communication'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-cyan-300">✓</span>
                      {item}
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <h5 className="text-red-300 font-semibold mb-2">What Platforms Extract</h5>
              {dataFlowItems.map((item) => (
                <div key={item.action} className="p-3 rounded-lg border border-red-300/20 bg-red-500/5">
                  <p className="text-gray-300 text-xs font-mono mb-1">USER ACTION: {item.action}</p>
                  <p className="text-red-200 text-xs">EXTRACTED: {item.extraction}</p>
                </div>
              ))}
              <p className="text-red-300 italic mt-4 text-center text-sm border-t border-red-300/20 pt-3">
                “If you’re not paying for the product, you are the product.”
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
});
