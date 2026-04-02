'use client';

import { create } from 'zustand';

export interface PlayerState {
  intelligence: number;
  coding: number;
  creativity: number;
  isDrawerOpen: boolean;
  currentChallenge: string | null;
  updateStat: (stat: 'intelligence' | 'coding' | 'creativity', amount: number) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setCurrentChallenge: (challenge: string | null) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  intelligence: 85,
  coding: 42,
  creativity: 78,
  isDrawerOpen: true,
  currentChallenge: null,
  updateStat: (stat, amount) => set((state) => ({ [stat]: state[stat] + amount })),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
}));

export default usePlayerStore;
