'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, X, Users, Trophy, Target, CheckCircle2, Circle, Terminal } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'sonner';

export default function BossDrawer() {
  const { isDrawerOpen, setDrawerOpen, currentChallenge, updateStat } = usePlayerStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // 🔥 YAHI HAI WO MAGIC FUNCTION JO GAYAB THA 🔥
  const handleChallenge = async () => {
    setIsGenerating(true);
    
    // Simulate AI Delay (2 seconds)
    setTimeout(() => {
      setIsGenerating(false);
      updateStat('int', 10); // Sidebar ka bar badhayega
      
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40">
                <Skull className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Boss Encounter</span>
            </div>
            <button 
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-black text-white leading-tight">
              {currentChallenge || 'Linear Regression'}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Master the fundamentals of predictive modeling with {currentChallenge?.toLowerCase() || 'linear regression'}.
            </p>
            <div className="flex gap-2">
              {['regression', 'supervised', 'boss'].map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-[#8b5cf6] bg-[#8b5cf6]/20 px-3 py-1 rounded-full uppercase tracking-widest border border-[#8b5cf6]/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-5 accent-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Skull className="w-16 h-16 text-red-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-red-500/20 border border-red-500/40">
                <Skull className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Challenge</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed relative z-10">
              Implement a {currentChallenge?.toLowerCase() || 'linear regression'} model from scratch using only NumPy, then compare its performance against scikit-learn&apos;s implementation.
            </p>

            {/* 🔥 YAHAN CLICK HOGA TOH CHALEGA MAGIC 🔥 */}
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

        </motion.aside>
      )}
    </AnimatePresence>
  );
}