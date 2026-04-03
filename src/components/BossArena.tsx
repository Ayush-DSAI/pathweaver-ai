'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { Heart, Coins, Shield, Zap, X, Trophy, Skull } from 'lucide-react';

interface MockQuestion {
  question: string;
  options: string[];
  correct: number;
}

const getMockQuestions = (topic: string): MockQuestion[] => [
  {
    question: `Which fundamental principle of ${topic} is considered most critical for optimizing large-scale distributed systems?`,
    options: [
      "Consistent Hashing for Load Balancing",
      "Eventual Consistency at the Database Layer",
      "Synchronous Inter-service Communication",
      "Manual Resource Allocation"
    ],
    correct: 0
  },
  {
    question: `In the context of ${topic}, how does the CAP theorem dictate the trade-offs in a network partition scenario?`,
    options: [
      "You must choose Availability over Consistency",
      "You must choose Consistency over Availability",
      "You must choose between Consistency and Availability",
      "Partition Tolerance is optional"
    ],
    correct: 2
  },
  {
    question: `When implementing a high-performance ${topic} architecture, which caching strategy minimizes the 'Thundering Herd' problem?`,
    options: [
      "LRU Eviction Policy",
      "Cache-Aside with Probabilistic Leases",
      "Write-Through Caching",
      "Short TTLs for all keys"
    ],
    correct: 1
  }
];

export default function BossArena() {
  const { 
    hp, 
    totalLoot, 
    currentBoss, 
    takeDamage, 
    heal, 
    addLoot, 
    setBossArenaOpen 
  } = usePlayerStore();

  const [competency, setCompetency] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'victory' | 'defeat'>('playing');

  const questions = getMockQuestions(currentBoss || 'Advanced Systems');
  const currentQuestion = questions[currentQuestionIndex];

  // Monitor HP and Competency for win/loss
  useEffect(() => {
    if (hp <= 0) {
      setGameStatus('defeat');
    } else if (competency >= 99) {
      setGameStatus('victory');
      addLoot(500);
      heal(30);
    }
  }, [hp, competency, addLoot, heal]);

  const handleAnswer = (index: number) => {
    if (gameStatus !== 'playing') return;

    if (index === currentQuestion.correct) {
      setCompetency(prev => Math.min(prev + 34, 100)); // ~33.3% per question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      setIsShaking(true);
      takeDamage(20);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleRespawn = () => {
    // Reset local state if needed, but the prompt says close modal and reset HP
    // usePlayerStore doesn't have a full reset, but we can call heal to 100
    heal(100);
    setBossArenaOpen(false);
  };

  const handleClaim = () => {
    setBossArenaOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center backdrop-blur-lg overflow-hidden"
    >
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">HEALTH POINTS</span>
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  animate={{ width: `${hp}%` }}
                />
              </div>
              <span className="text-sm font-black text-white">{hp}%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60">STAGGER METER</span>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                  className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  animate={{ width: `${competency}%` }}
                />
              </div>
              <span className="text-sm font-black text-white">{Math.round(competency)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-xl">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="text-xl font-black text-white">{totalLoot.toLocaleString()}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameStatus === 'playing' && (
          <motion.div
            key="quiz"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-3xl w-full px-8 flex flex-col items-center gap-12"
          >
            <div className="text-center space-y-4">
              <span className="text-xs font-black uppercase tracking-[1em] text-red-500 animate-pulse">Critical Interrogation</span>
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(idx)}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-red-500/50 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white relative z-10">{option}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-500">
              <span className="text-red-500">Question {currentQuestionIndex + 1}</span>
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span>Target: {currentBoss}</span>
            </div>
          </motion.div>
        )}

        {gameStatus === 'defeat' && (
          <motion.div
            key="defeat"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-4 text-center">
              <Skull className="w-24 h-24 text-red-600 mx-auto drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
              <h2 className="text-8xl font-black uppercase tracking-[0.3em] text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
                YOU DIED
              </h2>
              <p className="text-red-500/60 font-black uppercase tracking-[0.5em]">System Overload | Integrity Failure</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(220,38,38,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRespawn}
              className="px-16 py-6 rounded-full border-2 border-red-600 bg-red-600/10 text-red-600 font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)]"
            >
              Respawn
            </motion.button>
          </motion.div>
        )}

        {gameStatus === 'victory' && (
          <motion.div
            key="victory"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-4 text-center">
              <Trophy className="w-24 h-24 text-amber-500 mx-auto drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
              <h2 className="text-8xl font-black uppercase tracking-[0.2em] text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">
                ENEMY FELLED
              </h2>
              <p className="text-amber-500/60 font-black uppercase tracking-[0.5em]">Sector Neutralized | Mastery Achieved</p>
            </div>

            <div className="flex gap-12 text-center">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bounty Claimed</span>
                <span className="text-4xl font-black text-white">+500 LOOT</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Repairs Applied</span>
                <span className="text-4xl font-black text-white">+30 HP</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClaim}
              className="px-16 py-6 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-500 font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)]"
            >
              Claim Reward
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Borders */}
      <div className="absolute inset-0 border-[40px] border-black pointer-events-none" />
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 pointer-events-none" />
    </motion.div>
  );
}
