'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useState, useEffect } from 'react';

export default function BossDrawer() {
  const { isDrawerOpen, setDrawerOpen, currentChallenge, activeNodeData } = usePlayerStore();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading state for UX when challenge changes or drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen, currentChallenge]);

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
            className="fixed right-0 top-0 z-50 flex h-screen w-[450px] flex-col border-l border-white/10 bg-[#0a0a0c]/95 p-0 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Boss Art Header */}
            <div className="relative h-64 w-full shrink-0 overflow-hidden bg-black">
              {/* The "Screen" Blended Art */}
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop')`, // Cyberpunk Placeholder
                  mixBlendMode: 'screen' 
                }}
              />
              
              {/* Violet Color Overlay */}
              <div className="absolute inset-0 z-10 bg-violet-600/20 mix-blend-multiply" />
              
              {/* Bottom Fade */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />

              {/* Close Button Overlay */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 z-30 rounded-xl border border-white/10 bg-black/40 p-2 text-white/70 backdrop-blur-md transition-all hover:bg-black/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-8 z-30">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">
                  Target Identified
                </h2>
                <h1 className="mt-1 text-3xl font-black text-white uppercase tracking-tight">
                  {currentChallenge || "Unknown Entity"}
                </h1>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 flex flex-col flex-1 overflow-hidden">
            {/* Loot Content (Exa Data) */}
            <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Discovered Resources
              </h3>

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="relative h-24 w-full overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                          <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: i * 0.2 }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          />
                          <div className="p-4 flex flex-col gap-3">
                            <div className="h-4 w-3/4 rounded bg-white/10" />
                            <div className="h-3 w-1/2 rounded bg-white/5" />
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 flex items-center justify-center gap-2">
                         <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400/60 animate-pulse">
                           [ SYSTEM DECODING... ]
                         </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
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
                          No resources found.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}