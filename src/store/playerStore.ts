import { create } from 'zustand';

// 1. Node Data Interface (Jo map par click hoga)
export interface NodeData {
  id: string;
  type: 'boss' | 'loot' | 'skill';
  title: string;
}

// 2. Main Store Interface
export interface PlayerState {
  // Stats (Ayush's Sidebar requirement)
  hp: number;
  def: number;
  int: number;

  // State & AI Data
  activeNode: NodeData | null;
  isDrawerOpen: boolean;
  currentChallenge: string | null; 
  activeNodeData: any | null;

  // Actions
  updateStat: (stat: 'hp' | 'def' | 'int', amount: number) => void;
  setActiveNode: (node: NodeData | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setCurrentChallenge: (challenge: string | null) => void;
  setActiveNodeData: (data: any) => void;
}

// 3. Store Implementation
export const usePlayerStore = create<PlayerState>((set) => ({
  // Default values
  hp: 85,
  def: 42,
  int: 78,
  activeNode: null,
  isDrawerOpen: false,
  currentChallenge: null,
  activeNodeData: null,

  // Functions
  updateStat: (stat, amount) => 
    set((state) => ({ [stat]: Math.min(state[stat] + amount, 100) })), // Max 100 tak rakha hai
  setActiveNode: (node) => set({ activeNode: node }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  setActiveNodeData: (data) => set({ activeNodeData: data }),
}));