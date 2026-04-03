'use client';

import SkillTree from '@/components/SkillTree';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BossDrawer from '@/components/BossDrawer';
import BossArena from '@/components/BossArena';
import QuestModal from '@/components/QuestModal';
import LevelUpOverlay from '@/components/LevelUpOverlay';
import { Layers, Maximize2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { useSkillStore } from '@/store/useSkillStore';

const legendItems = [
  {
    dotClassName: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.45)]',
    label: 'Completed',
  },
  {
    dotClassName: 'bg-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.45)]',
    label: 'In Progress',
  },
  {
    dotClassName: 'bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.45)]',
    label: 'Available',
  },
  {
    dotClassName: 'bg-gray-600 shadow-[0_0_12px_rgba(75,85,99,0.35)]',
    label: 'Locked',
  },
];

export default function Home() {
  const { isBossArenaOpen, setBossArenaOpen, currentBoss } = usePlayerStore();
  const { currentQuestName } = useSkillStore();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0a0a0c] font-sans text-white selection:bg-[#8b5cf6]/30 flex">
      {/* Background VFX */}
      {/* ── Background VFX Layers ────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050507]">
        {/* Layer 1: Deep Pulse Gradient */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent blur-[120px]"
        />

        {/* Layer 2: Scrolling Cyber-Grid */}
        <motion.div
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Layer 3: Vertical Data Streams */}
        <div className="absolute inset-0 opacity-[0.05]">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ top: '-100%', left: `${15 + i * 15}%` }}
              animate={{ top: '100%' }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 3,
                ease: 'linear',
              }}
              className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-violet-400 to-transparent"
            />
          ))}
        </div>

        {/* Layer 4: Ambient Glow Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <Sidebar />
      
      <div className="flex-1 relative flex flex-col min-w-0">
        <Header />
        <BossDrawer />
        <QuestModal />
        <LevelUpOverlay />

        {/* Main 12-Column Layout Container */}
        <div className="relative flex-1 p-8 pt-32 h-full w-full overflow-hidden">
          <div className="relative h-full w-full grid grid-cols-12 grid-rows-12 gap-6">
            
            {/* Map Canvas (Expands across 12 columns for maximum immersion) */}
            <div id="map-canvas" className="col-span-12 row-span-12 relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0c]/40 backdrop-blur-3xl shadow-2xl">
              <SkillTree />
              
              {/* HUD Elements inside the canvas */}
              <div className="absolute top-8 left-8 z-10 flex flex-col gap-6">
                {/* Active Goal Badge */}
                <div className="glass accent-glow flex cursor-pointer items-center gap-6 rounded-2xl border-white/5 px-6 py-3 transition-all hover:scale-105 hover:border-[#8b5cf6]/40">
                  <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                    Skill Tree
                  </span>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-sm font-bold text-gray-200 capitalize">
                    {currentQuestName ? `Master ${currentQuestName}` : 'Select a Quest'}
                  </span>
                  <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-2 py-0.5 rounded">v3</span>
                </div>

                {/* Status Indicator */}
                <div className="glass flex items-center gap-3 rounded-xl border-white/5 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-400 transition-all hover:text-white hover:bg-white/5 w-fit">
                  <div className="h-2 w-2 rotate-45 border border-[#8b5cf6] bg-[#0a0a0c]" />
                  Active Archive
                </div>
              </div>

              {/* Map Terminal Controls */}
              <div className="glass absolute bottom-8 left-8 z-10 flex gap-2 rounded-2xl border-white/5 p-2 backdrop-blur-md">
                <button title="Recenter View" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-all hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
                  <Maximize2 className="h-5 w-5" />
                </button>
                <button title="Search Archive" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-all hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
                  <Search className="h-5 w-5" />
                </button>
                <div className="mx-1 w-px bg-white/10" />
                <button title="Filter Layers" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-400 transition-all hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
                  <Layers className="h-5 w-5" />
                </button>
              </div>

              {/* Minimap Widget */}
              <div className="glass accent-glow absolute bottom-8 right-8 z-10 flex h-40 w-56 flex-col rounded-2xl border-white/5 p-3 backdrop-blur-xl transition-all hover:scale-105">
                <span className="mb-2 text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Local Archive Minimap</span>
                <div className="relative flex-1 overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0c]/80">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
                      backgroundSize: '8px 8px',
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 h-12 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#8b5cf6]/40 bg-[#8b5cf6]/5 shadow-[0_0_15px_rgba(139,92,246,0.1)]" />
                </div>
              </div>
            </div>

            {/* Map Legend (Bottom Info Block) */}
            <div className="glass accent-glow absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-8 rounded-full border-white/5 px-10 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-8">
                {legendItems.map((item) => (
                  <div key={item.label} className="group/item flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ring-2 ring-transparent ring-offset-2 ring-offset-[#0a0a0c] transition-all group-hover/item:scale-125 ${item.dotClassName}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 transition-colors group-hover/item:text-white">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Boss Arena Overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {isBossArenaOpen && <BossArena />}
      </AnimatePresence>
    </main>
  );
}
