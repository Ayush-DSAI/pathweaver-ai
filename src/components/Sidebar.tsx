'use client';

import usePlayerStore from '../store/playerStore';


import { motion } from 'framer-motion';
import { LayoutGrid, Map, Swords, Package, Trophy, Settings, HelpCircle, Layers, Search, Maximize2 } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutGrid, label: 'Dashboard', active: true },
    { icon: Map, label: 'Map', active: false },
    { icon: Swords, label: 'Quests', active: false },
    { icon: Package, label: 'Inventory', active: false },
    { icon: Trophy, label: 'Achievements', active: false },
  ];
  const { intelligence, coding, creativity } = usePlayerStore();
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6 glass border-r border-white/10 z-50"
    >
      <div className="mb-10 p-3 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 accent-glow">
        <LayoutGrid className="w-8 h-8 text-[#8b5cf6]" />
      </div>

      <nav className="flex flex-col gap-6 flex-1">
        {menuItems.map((item, index) => (
          <Link key={index} href="#" className={`p-3 rounded-xl transition-all duration-300 group relative ${item.active ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/40' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <item.icon className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="my-8 flex flex-col gap-4 w-full px-4">
        {[
          { label: 'INT', value: intelligence, color: 'bg-blue-500' },
          { label: 'COD', value: coding, color: 'bg-green-500' },
          { label: 'CRT', value: creativity, color: 'bg-pink-500' }
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 group relative cursor-help">
            <div className="flex justify-between items-center px-1">
              <span className="text-[8px] font-black text-gray-500 group-hover:text-white transition-colors">{stat.label}</span>
              <span className="text-[8px] font-bold text-gray-400">{stat.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${stat.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
              />
            </div>
            {/* Tooltip for small sidebar */}
            <span className="absolute left-full ml-4 px-2 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
              {stat.label === 'INT' ? 'Intelligence' : stat.label === 'COD' ? 'Coding' : 'Creativity'}: {stat.value}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </button>
        </div>
        
        <button className="p-3 rounded-xl bg-[#059669]/20 border border-[#059669]/40 text-[#059669] hover:bg-[#059669]/30 transition-all">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
