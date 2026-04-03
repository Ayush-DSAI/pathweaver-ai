'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, X, Terminal } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'sonner';

// ─── Skeleton fragment component ───────────────────────────────────────────────

interface SkeletonFragmentProps {
  /** Tailwind width / height classes */
  className: string;
  /** Delay offset for staggered pulse (seconds) */
  delay?: number;
  /** Optional border-radius override */
  rounded?: string;
}

function SkeletonFragment({ className, delay = 0, rounded = 'rounded-lg' }: SkeletonFragmentProps) {
  return (
    <motion.div
      className={[
        className,
        rounded,
        // Base dark glass with neon-tinted gradient
        'bg-gradient-to-r from-slate-800/50 via-cyan-900/20 to-slate-800/50',
        'border border-cyan-500/10',
      ].join(' ')}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ─── Glitch / flicker keyframes (injected once via <style>) ────────────────────

const glitchKeyframes = `
@keyframes glitch-flicker {
  0%, 100% { opacity: 0.9; }
  10%      { opacity: 0.4; }
  12%      { opacity: 0.9; }
  20%      { opacity: 0.75; }
  22%      { opacity: 0.9; }
  50%      { opacity: 0.85; }
  52%      { opacity: 0.3; }
  54%      { opacity: 0.9; }
  70%      { opacity: 0.7; }
  72%      { opacity: 0.9; }
  90%      { opacity: 0.5; }
  92%      { opacity: 0.9; }
}
`;

// ─── Cyberpunk Skeleton Loader ─────────────────────────────────────────────────

function CyberpunkSkeleton() {
  return (
    <motion.div
      className="flex flex-col gap-6 flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Block 1: Title skeleton ─────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <SkeletonFragment className="h-7 w-3/5" delay={0} />
        <SkeletonFragment className="h-4 w-4/5" delay={0.15} />
      </div>

      {/* ── Block 2: Main content / Challenge area ──────────────── */}
      <SkeletonFragment className="h-44 w-full" delay={0.3} rounded="rounded-2xl" />

      {/* ── Block 3: Metadata / Tag pills ───────────────────────── */}
      <div className="flex gap-3">
        <SkeletonFragment className="h-7 w-24" delay={0.45} rounded="rounded-full" />
        <SkeletonFragment className="h-7 w-20" delay={0.55} rounded="rounded-full" />
      </div>

      {/* ── "SYSTEM DECODING..." overlay ────────────────────────── */}
      <div className="mt-auto pt-6 flex items-center justify-center gap-2">
        {/* Inject the glitch keyframes */}
        <style>{glitchKeyframes}</style>

        <span
          className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-cyan-400/80"
          style={{ animation: 'glitch-flicker 2.2s steps(1) infinite' }}
        >
          [ SYSTEM DECODING... ]
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function BossDrawer() {
  const { isDrawerOpen, setDrawerOpen, currentChallenge, updateStat } = usePlayerStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate a data-fetch loading state whenever the drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, currentChallenge]);

  const handleChallenge = async () => {
    setIsGenerating(true);

    // Simulate AI delay (2 seconds)
    setTimeout(() => {
      setIsGenerating(false);
      updateStat('int', 10);

      toast.success('CHALLENGE CLEARED!', {
        description: 'Mistral AI logic defeated. +10 INT Gained.',
      });
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.aside
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="fixed right-0 top-24 bottom-0 w-96 glass border-l border-white/10 z-40 p-8 flex flex-col gap-10 bg-zinc-950 shadow-2xl overflow-y-auto"
        >
          {/* ── Header bar (always visible) ───────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40">
                <Skull className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                Boss Encounter
              </span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Content: skeleton OR real ──────────────────────────── */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <CyberpunkSkeleton key="skeleton" />
            ) : (
              <motion.div
                key="content"
                className="flex flex-col gap-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* ── Title & description ─────────────────────────── */}
                <div className="flex flex-col gap-6">
                  <h2 className="text-4xl font-black text-white leading-tight">
                    {currentChallenge || 'Linear Regression'}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Master the fundamentals of predictive modeling with{' '}
                    {currentChallenge?.toLowerCase() || 'linear regression'}.
                  </p>
                  <div className="flex gap-2">
                    {['regression', 'supervised', 'boss'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold text-[#8b5cf6] bg-[#8b5cf6]/20 px-3 py-1 rounded-full uppercase tracking-widest border border-[#8b5cf6]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Challenge card ──────────────────────────────── */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-5 accent-glow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Skull className="w-16 h-16 text-red-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-red-500/20 border border-red-500/40">
                      <Skull className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                      Challenge
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                    Implement a {currentChallenge?.toLowerCase() || 'linear regression'} model from
                    scratch using only NumPy, then compare its performance against
                    scikit-learn&apos;s implementation.
                  </p>

                  <button
                    onClick={handleChallenge}
                    disabled={isGenerating}
                    className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 flex items-center justify-center gap-2 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)] disabled:opacity-50 relative z-10"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        INTERROGATING AI...
                      </>
                    ) : (
                      <>
                        <Terminal size={16} /> START CHALLENGE
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}