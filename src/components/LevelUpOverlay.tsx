'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';

const glowKeyframes = `
@keyframes text-glow {
  0%, 100% { text-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
  50% { text-shadow: 0 0 35px rgba(139, 92, 246, 0.8), 0 0 70px rgba(139, 92, 246, 0.5); }
}
`;

export default function LevelUpOverlay() {
  const { isLevelUpVisible } = usePlayerStore();

  return (
    <AnimatePresence>
      {isLevelUpVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Background Wash */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-violet-600/10 blur-[120px] rounded-full"
          />

          <style>{glowKeyframes}</style>

          {/* Main Content */}
          <div className="relative flex flex-col items-center">
            {/* LEVEL UP Title */}
            <motion.h1
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.1 
              }}
              className="text-7xl font-black italic tracking-tighter text-white uppercase sm:text-8xl md:text-9xl"
              style={{ 
                fontFamily: 'system-ui, sans-serif',
                animation: 'text-glow 2s ease-in-out infinite'
              }}
            >
              Level Up
            </motion.h1>

            {/* XP Gain */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ 
                duration: 1, 
                delay: 0.4,
                ease: "easeOut"
              }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500" />
              <span className="text-2xl font-black tracking-[0.3em] text-violet-400 uppercase">
                +500 XP Gained
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500" />
            </motion.div>

            {/* Subtext Flare */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: 0.8, repeat: Infinity }}
              className="mt-8 text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase"
            >
              Syncing Archive Data...
            </motion.p>
          </div>

          {/* Particle Flare (Simplified CSS) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  scale: 0, 
                  opacity: 0 
                }}
                animate={{ 
                  x: `${20 + Math.random() * 60}%`, 
                  y: `${20 + Math.random() * 60}%`, 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 2.5, 
                  delay: 0.2 + (i * 0.1),
                  ease: "circOut",
                  repeat: Infinity
                }}
                className="absolute h-1 w-1 bg-violet-400 rounded-full shadow-[0_0_10px_#8b5cf6]"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
