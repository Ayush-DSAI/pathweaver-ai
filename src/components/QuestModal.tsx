'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useSkillStore } from '../store/useSkillStore';
import { toast } from 'sonner';

// ─── Glitch flicker keyframes ──────────────────────────────────────────────────

const glitchKeyframes = `
@keyframes quest-glitch {
  0%, 100% { opacity: 0.85; }
  8%       { opacity: 0.3;  transform: translateX(2px); }
  10%      { opacity: 0.9;  transform: translateX(0); }
  30%      { opacity: 0.7;  }
  32%      { opacity: 0.9;  }
  55%      { opacity: 0.85; }
  57%      { opacity: 0.2;  transform: translateX(-1px); }
  59%      { opacity: 0.9;  transform: translateX(0); }
  80%      { opacity: 0.6;  }
  82%      { opacity: 0.9;  }
}
`;

// ─── Cycling status messages ───────────────────────────────────────────────────

const GENERATING_MESSAGES = ['ENCRYPTING...', 'MAPPING ARCHIVE...', 'SYNCING NODES...'] as const;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function QuestModal() {
  const { isQuestModalOpen, toggleQuestModal } = usePlayerStore();
  const [goal, setGoal] = useState('');
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cycle through generating messages every 800ms
  useEffect(() => {
    if (phase === 'generating') {
      setMsgIndex(0);
      msgIntervalRef.current = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % GENERATING_MESSAGES.length);
      }, 800);
    } else {
      if (msgIntervalRef.current) {
        clearInterval(msgIntervalRef.current);
        msgIntervalRef.current = null;
      }
    }
    return () => {
      if (msgIntervalRef.current) clearInterval(msgIntervalRef.current);
    };
  }, [phase]);

  const resetAndClose = useCallback(() => {
    setGoal('');
    setPhase('idle');
    setProgress(0);
    toggleQuestModal();
  }, [toggleQuestModal]);

  const handleSubmit = useCallback(async () => {
    if (!goal.trim() || phase !== 'idle') return;

    setPhase('generating');
    setProgress(0);

    // Simulate progress ticks while the API call runs
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 12;
      });
    }, 200);

    try {
<<<<<<< HEAD
      const response = await fetch('/api/generate-tree', {
=======
      const response = await fetch('https://exwkezfimdfvmaqmdruo.supabase.co/functions/v1/generate-tree', {
        // ... rest of the code stays the same
>>>>>>> 4c6b6307533389663c7ca5245caa044dcd86527c
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      if (!response.ok) throw new Error('Backend failed');

      const treeData = await response.json();

      // 🚨 NODE FIX: Force Strings, Positions, customSkill type, and default UI props!
      const safeNodes = (treeData.nodes || []).map((node: any, index: number) => {
        const fallbackText = node.data?.label || node.label || node.title || node.name || `Skill ${index + 1}`;

        return {
          ...node,
          id: String(node.id || `fallback-node-${index}`), // 👈 String forced
          type: 'customSkill', // 👈 Antigravity's custom UI fix
          position: node.position || { x: 300, y: index * 180 }, // 👈 Vertical RPG Layout
          data: {
            ...node.data,
            label: fallbackText,
            borderColor: '#a855f7', // 👈 Fallback property to prevent CustomSkillNode crash
          }
        };
      });

      // 🚨 EDGE FIX: Force Source/Target to be strings and add glowing styles!
      const safeEdges = (treeData.edges || []).map((edge: any, index: number) => ({
        ...edge,
        id: edge.id || `e${edge.source || edge.from}-${edge.target || edge.to}-${index}`,
        source: String(edge.source || edge.from), // 👈 Forces to string, handles either API format
        target: String(edge.target || edge.to),   // 👈 Forces to string, handles either API format
        animated: true,
        style: { stroke: '#a855f7', strokeWidth: 3 }, // Glowing purple laser edge
      }));

      // Pass the fully sanitized nodes AND edges to the store
      useSkillStore.getState().setTree(safeNodes, safeEdges);

      clearInterval(progressInterval);
      setProgress(100);
      setPhase('done');

      toast.success('PATHWAY GENERATED', {
        description: `Skill tree for "${goal.trim()}" is ready.`,
      });

      // Close after 500ms
      setTimeout(() => {
        resetAndClose();
      }, 500);
    } catch (error) {
      console.error('API failed:', error);
      clearInterval(progressInterval);

      toast.error('GENERATION FAILED', {
        description: 'Could not reach the backend. Try again.',
      });

      setPhase('idle');
      setProgress(0);
    }
  }, [goal, phase, resetAndClose]);

  return (
    <>
      <style>{glitchKeyframes}</style>

      <AnimatePresence>
        {isQuestModalOpen && (
          <>
            {/* ── Backdrop ───────────────────────────────────────── */}
            <motion.div
              key="quest-backdrop"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={phase === 'idle' ? resetAndClose : undefined}
            />

            {/* ── Modal ──────────────────────────────────────────── */}
            <motion.div
              key="quest-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-lg pointer-events-auto rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.15)] overflow-hidden"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

                {/* ── Close button ────────────────────────────────── */}
                <button
                  onClick={resetAndClose}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-8 flex flex-col gap-6">
                  {/* ── Header ───────────────────────────────────── */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-wide uppercase">
                        New Quest
                      </h2>
                      <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                        Define your learning pathway
                      </p>
                    </div>
                  </div>

                  {/* ── Content: input or generating state ────────── */}
                  <AnimatePresence mode="wait">
                    {phase === 'idle' ? (
                      <motion.div
                        key="input-phase"
                        className="flex flex-col gap-5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Input */}
                        <div className="relative group">
                          <input
                            id="quest-goal-input"
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            placeholder="WHAT DO YOU WANT TO MASTER? (e.g. Quantum Computing, Python for Finance)"
                            className="w-full rounded-xl border border-slate-600/60 bg-slate-800/60 px-5 py-4 text-sm font-medium text-white placeholder:text-gray-500 placeholder:text-xs focus:outline-none focus:border-cyan-500/60 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all"
                          />
                          {/* Bottom glow on focus */}
                          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-focus-within:via-cyan-500/50 transition-all duration-500" />
                        </div>

                        {/* Submit button */}
                        <button
                          id="quest-generate-btn"
                          onClick={handleSubmit}
                          disabled={!goal.trim()}
                          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 py-3.5 text-sm font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                          Generate Pathway
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="generating-phase"
                        className="flex flex-col items-center gap-5 py-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Spinner */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        >
                          <Loader2 className="w-8 h-8 text-cyan-400" />
                        </motion.div>

                        {/* Cycling status text */}
                        <span
                          className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-cyan-400/80"
                          style={{ animation: 'quest-glitch 2s steps(1) infinite' }}
                        >
                          [ {GENERATING_MESSAGES[msgIndex]} ]
                        </span>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        </div>

                        {/* Goal echo */}
                        <p className="text-[10px] font-bold text-gray-600 tracking-wider uppercase text-center max-w-xs truncate">
                          Target: {goal}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}