'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BossDrawer from '@/components/BossDrawer';
import { motion } from 'framer-motion';
import { Search, Layers, Maximize2, MousePointer2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0c] overflow-hidden text-white font-sans selection:bg-[#8b5cf6]/30">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#8b5cf6]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main UI Components */}
      <Sidebar />
      <Header />
      <BossDrawer />

      {/* Main Canvas Area */}
      <div className="pl-20 pr-96 pt-24 h-screen relative z-10">
        <div id="map-canvas" className="w-full h-full relative group">
          {/* Canvas Overlay Info */}
          <div className="absolute top-10 left-10 flex items-center gap-6 glass px-8 py-4 rounded-3xl border-white/5 accent-glow transition-all hover:scale-105 cursor-pointer group-hover:border-[#8b5cf6]/40">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b5cf6] flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#8b5cf6] animate-pulse" />
              Skill Tree
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-bold text-gray-300">Master Machine Learning</span>
            <span className="text-[10px] font-black text-green-500 uppercase">v3</span>
          </div>

          <div className="absolute top-32 left-10 flex items-center gap-2 glass px-4 py-2 rounded-xl border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
            <div className="w-2 h-2 rotate-45 border-2 border-[#8b5cf6] bg-[#0a0a0c]" />
            Active Quests
          </div>

          {/* Canvas Interaction HUD */}
          <div className="absolute bottom-10 left-10 glass p-3 rounded-3xl border-white/5 flex flex-col gap-4">
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 text-gray-400 hover:text-white transition-all hover:scale-110">
              <Maximize2 className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 text-gray-400 hover:text-white transition-all hover:scale-110">
              <Search className="w-6 h-6" />
            </button>
            <div className="w-full h-px bg-white/10 my-1" />
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 text-gray-400 hover:text-white transition-all hover:scale-110">
              <Layers className="w-6 h-6" />
            </button>
          </div>

          {/* Placeholder for Skill Tree nodes as seen in screenshot */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="text-gray-600 font-black text-[12rem] opacity-5 select-none uppercase tracking-tighter"
             >
               MAP VIEW
             </motion.div>
          </div>
          
          {/* Cursor Follower Effect Placeholder */}
          <div className="absolute inset-0 cursor-none">
            <div className="absolute w-full h-full" />
          </div>
        </div>
      </div>

      {/* Minimap Placeholder */}
      <div className="fixed bottom-10 right-[26rem] w-64 h-48 glass rounded-3xl border-white/5 p-4 accent-glow flex flex-col items-center justify-center group hover:scale-105 transition-all cursor-crosshair">
        <div className="absolute top-4 right-4 text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">Minimap</div>
        <div className="w-full h-full rounded-2xl bg-[#0a0a0c]/80 border border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
              backgroundSize: '10px 10px'
            }} 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 border border-[#8b5cf6]/40 rounded-lg bg-[#8b5cf6]/5" />
        </div>
      </div>
      
      {/* Legend */}
      <div className="fixed bottom-10 left-[8rem] glass px-8 py-6 rounded-3xl border-white/5 flex flex-col gap-4 accent-glow group">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">Legend</span>
        <div className="flex flex-col gap-3">
          {[
            { color: 'bg-green-500', label: 'Completed' },
            { color: 'bg-[#8b5cf6]', label: 'In Progress' },
            { color: 'bg-[#f59e0b]', label: 'Available' },
            { color: 'bg-gray-600', label: 'Locked' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 group/item cursor-pointer">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg shadow-${item.color}/20 group-hover/item:scale-125 transition-transform`} />
              <span className="text-xs font-bold text-gray-400 group-hover/item:text-white transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
