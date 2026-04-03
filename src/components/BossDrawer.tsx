'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export default function BossDrawer() {
  const { isDrawerOpen, setDrawerOpen, currentChallenge, activeNodeData } = usePlayerStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[450px] flex-col border-l border-white/10 bg-[#0a0a0c]/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6]">
                  Active Challenge
                </h2>
                <h1 className="mt-1 text-2xl font-bold text-white">{currentChallenge || "Unknown Boss"}</h1>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Loot Content (Exa Data) */}
            <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Discovered Resources
              </h3>

              <div className="flex flex-col gap-4">
                {activeNodeData && activeNodeData.length > 0 ? (
                  activeNodeData.map((resource: any, index: number) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex flex-col gap-2 rounded-2xl border p-4 transition-all hover:-translate-y-1 ${
                        resource.quality === 3
                          ? 'border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]'
                          : 'border-white/5 bg-white/5 hover:border-[#8b5cf6]/40 hover:bg-white/10'
                      }`}
                    >
                      {/* Legendary Badge */}
                      {resource.quality === 3 && (
                        <div className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-black shadow-lg">
                          <Sparkles className="h-3 w-3" />
                          Legendary Drop
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm font-bold text-gray-200 group-hover:text-white leading-tight">
                          {resource.title}
                        </h4>
                        <ExternalLink className={`h-4 w-4 shrink-0 ${resource.quality === 3 ? 'text-yellow-500' : 'text-gray-500 group-hover:text-white'}`} />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          resource.type === 'video' ? 'bg-red-500/20 text-red-400' :
                          resource.type === 'repo' ? 'bg-gray-500/20 text-gray-300' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {resource.type}
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-sm text-gray-500">
                    Scanning for resources...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}