'use client';

import { create } from 'zustand';

export interface PlayerState {
  intelligence: number;
  coding: number;
  creativity: number;
  updateStat: (stat: 'intelligence' | 'coding' | 'creativity', amount: number) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  intelligence: 85,
  coding: 42,
  creativity: 78,
  updateStat: (stat, amount) => set((state) => ({ [stat]: state[stat] + amount })),
}));

export default usePlayerStore;
