'use client';

import { motion } from 'framer-motion';
import { Skull, X, Users, Trophy, Target, CheckCircle2, Circle } from 'lucide-react';

const BossDrawer = () => {
  return (
    <motion.aside 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed right-0 top-24 bottom-0 w-96 glass border-l border-white/10 z-40 p-8 flex flex-col gap-10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40">
            <Skull className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Boss Encounter</span>
        </div>
        <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-4xl font-black text-white leading-tight">Linear Regression</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Master the fundamentals of predictive modeling with linear regression.
        </p>
        <div className="flex gap-2">
          {['regression', 'supervised', 'boss'].map((tag) => (
            <span key={tag} className="text-[10px] font-bold text-[#8b5cf6] bg-[#8b5cf6]/20 px-3 py-1 rounded-full uppercase tracking-widest border border-[#8b5cf6]/30">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Completed by</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">12.4K</span>
            <span className="text-xs text-gray-500 font-medium">learners</span>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Success Rate</span>
          </div>
          <span className="text-2xl font-black text-green-500 tracking-tight">78%</span>
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
          Implement a linear regression model from scratch using only NumPy, then compare its performance against scikit-learn's implementation on the Boston Housing dataset.
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-400">Prerequisites</span>
          <span className="text-green-500">1/2 Complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-green-500 w-1/2 rounded-full accent-glow" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm font-bold text-white transition-all hover:translate-x-1">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Data Preprocessing</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold text-gray-500 transition-all hover:translate-x-1">
            <Circle className="w-5 h-5" />
            <span>Statistical Foundations</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default BossDrawer;
