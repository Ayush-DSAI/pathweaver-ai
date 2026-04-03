'use client';

import SkillTree from '@/components/SkillTree';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BossDrawer from '@/components/BossDrawer';
import QuestModal from '@/components/QuestModal';
import { Layers, Maximize2, Search } from 'lucide-react';

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
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0c] font-sans text-white selection:bg-[#8b5cf6]/30">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]/5 blur-[150px]" />

      <Sidebar />
      <Header />
      <BossDrawer />
      <QuestModal />

      <div className="relative z-10 h-screen pl-20 pr-96 pt-24">
        <div id="map-canvas" className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <SkillTree />

          <div className="glass accent-glow absolute top-10 left-10 z-10 flex cursor-pointer items-center gap-6 rounded-3xl border-white/5 px-8 py-4 transition-all hover:scale-105 hover:border-[#8b5cf6]/40">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">
              <div className="h-1 w-1 rounded-full bg-[#8b5cf6] animate-pulse" />
              Skill Tree
            </span>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-sm font-bold text-gray-300">Master Machine Learning</span>
            <span className="text-[10px] font-black uppercase text-green-500">v3</span>
          </div>

          <div className="glass absolute top-32 left-10 z-10 flex items-center gap-2 rounded-xl border-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-white">
            <div className="h-2 w-2 rotate-45 border-2 border-[#8b5cf6] bg-[#0a0a0c]" />
            Active Quests
          </div>

          <div className="glass absolute bottom-10 left-10 z-10 flex flex-col gap-4 rounded-3xl border-white/5 p-3">
            <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition-all hover:scale-110 hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
              <Maximize2 className="h-6 w-6" />
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition-all hover:scale-110 hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
              <Search className="h-6 w-6" />
            </button>
            <div className="my-1 h-px w-full bg-white/10" />
            <button className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-400 transition-all hover:scale-110 hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/20 hover:text-white">
              <Layers className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass accent-glow fixed right-[26rem] bottom-10 flex h-48 w-64 cursor-crosshair flex-col items-center justify-center rounded-3xl border-white/5 p-4 transition-all hover:scale-105">
        <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Minimap</div>
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]/80">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
              backgroundSize: '10px 10px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 h-20 w-32 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#8b5cf6]/40 bg-[#8b5cf6]/5" />
        </div>
      </div>

      <div className="glass accent-glow fixed bottom-10 left-[8rem] flex flex-col gap-4 rounded-3xl border-white/5 px-8 py-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b5cf6]">Legend</span>
        <div className="flex flex-col gap-3">
          {legendItems.map((item) => (
            <div key={item.label} className="group/item flex cursor-pointer items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full transition-transform group-hover/item:scale-125 ${item.dotClassName}`} />
              <span className="text-xs font-bold text-gray-400 transition-colors group-hover/item:text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
