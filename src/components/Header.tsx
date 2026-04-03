'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Zap, Coins, Wifi } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-20 right-0 h-24 glass border-b border-white/10 z-40 flex items-center px-10 gap-12"
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#8b5cf6] flex items-center justify-center bg-[#8b5cf6]/20 relative">
            <span className="text-xl font-bold text-white">AI</span>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-[#f59e0b] border-2 border-[#0a0a0c] flex items-center justify-center text-xs font-bold text-[#0a0a0c]">
              12
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-white">DataWizard</h1>
            <span className="text-sm font-semibold text-[#8b5cf6]/80 bg-[#8b5cf6]/20 px-2 py-0.5 rounded uppercase tracking-wider">Lvl 12</span>
          </div>
          <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] w-[65%]" />
            <span className="absolute right-0 -top-6 text-[10px] text-gray-400 font-medium">65% XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 ml-auto">
        <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/40">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">HP</span>
              <span className="text-lg font-bold text-white">85/100</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/40">
              <Shield className="w-5 h-5 text-blue-500 fill-blue-500/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">DEF</span>
              <span className="text-lg font-bold text-white">42</span>
            </div>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40">
              <Zap className="w-5 h-5 text-[#8b5cf6] fill-[#8b5cf6]/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">INT</span>
              <span className="text-lg font-bold text-white">78</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-6 py-3 rounded-2xl accent-glow relative group cursor-pointer transition-all hover:bg-[#f59e0b]/20">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider font-bold">LOOT</span>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-xl font-black text-white">2,450</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#f59e0b] rounded-full flex items-center justify-center text-[10px] font-bold text-[#0a0a0c]">
            !
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/40 bg-green-500/10 text-green-500 text-xs font-bold tracking-widest uppercase">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
