'use client';

import { usePlayerStore } from '@/store/playerStore';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, Crosshair, Box, Trophy } from 'lucide-react';

export default function Sidebar() {
  // 1. Store se Live Stats nikal lo
  const { hp, def, int } = usePlayerStore();

  // 2. Stats array for easy mapping
  const stats = [
    { name: 'INT', value: int, color: 'bg-violet-500', shadow: 'shadow-violet-500/50' },
    { name: 'HP', value: hp, color: 'bg-red-500', shadow: 'shadow-red-500/50' },
    { name: 'DEF', value: def, color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-screen bg-[#0a0a0c] border-r border-white/5 flex flex-col justify-between py-6 z-20 relative">
      
      {/* Top Section: Navigation Icons */}
      <div className="flex flex-col items-center lg:items-start lg:px-6 space-y-6">
        <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center border border-violet-500/30 mb-4">
          <LayoutDashboard className="text-violet-400 w-5 h-5" />
        </div>
        
        <nav className="flex flex-col gap-4 w-full">
          <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-3 w-full justify-center lg:justify-start">
            <Map className="w-5 h-5 text-white" />
            <span className="hidden lg:block text-sm font-medium">Map View</span>
          </button>
          <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-3 w-full justify-center lg:justify-start">
            <Crosshair className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Quests</span>
          </button>
          <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-3 w-full justify-center lg:justify-start">
            <Box className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Inventory</span>
          </button>
          <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-3 w-full justify-center lg:justify-start">
            <Trophy className="w-5 h-5" />
            <span className="hidden lg:block text-sm font-medium">Achievements</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section: Live Player Stats (Ayush's Requirement) */}
      <div className="px-4 lg:px-6 w-full">
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 tracking-wider">
                <span>{stat.name}</span>
                <span>{stat.value}%</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                {/* 🚀 The Magic: Framer Motion Animated Bar */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }} 
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${stat.color} shadow-[0_0_10px_rgba(0,0,0,0)] hover:${stat.shadow} transition-shadow`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}