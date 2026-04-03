'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ExternalLink } from 'lucide-react';

export interface Resource {
  title: string;
  snippet: string;
  link: string;
  quality: number;
}

interface LootPanelProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
}

export function LootPanel({ isOpen, onClose, resources }: LootPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/10 overflow-y-auto glass accent-glow"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-wide uppercase">
                      Loot Resources
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      Gathered from your journey
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {resources.map((resource, index) => {
                  const isLegendary = resource.quality === 3;
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className={`relative p-5 rounded-xl border transition-all glass ${
                        isLegendary 
                          ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {isLegendary && (
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-400 text-yellow-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-yellow-300/50 flex items-center gap-1">
                          <Sparkles size={10} />
                          Legendary
                        </div>
                      )}
                      
                      <h3 className={`text-lg font-bold mb-2 pr-12 ${isLegendary ? 'text-yellow-400' : 'text-gray-100'}`}>
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                        {resource.snippet}
                      </p>
                      
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${
                          isLegendary 
                            ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        View Resource
                        <ExternalLink size={12} />
                      </a>
                    </motion.div>
                  );
                })}
                
                {resources.length === 0 && (
                  <div className="text-center text-gray-500 py-12 glass rounded-xl border border-white/5">
                    <p className="text-sm font-medium uppercase tracking-widest">No loot found yet.</p>
                    <p className="text-xs mt-2 opacity-60">Keep exploring to discover resources.</p>
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
