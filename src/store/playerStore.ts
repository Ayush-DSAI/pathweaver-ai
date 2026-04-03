import { create } from 'zustand';
import type { Edge, Node } from '@xyflow/react';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import { useSkillStore } from '@/store/useSkillStore';

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
  totalLoot: number;

  // State & AI Data
  activeNode: NodeData | null;
  isDrawerOpen: boolean;
  isBossArenaOpen: boolean;
  isQuestModalOpen: boolean;
  isLevelUpVisible: boolean;
  currentChallenge: string | null; 
  currentBoss: string | null;
  activeNodeData: any | null;

  // Actions
  updateStat: (stat: 'hp' | 'def' | 'int', amount: number) => void;
  setActiveNode: (node: NodeData | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setCurrentChallenge: (challenge: string | null) => void;
  setCurrentBoss: (boss: string | null) => void;
  setBossArenaOpen: (open: boolean) => void;
  setActiveNodeData: (data: any) => void;
  toggleQuestModal: () => void;
  triggerLevelUp: () => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addLoot: (amount: number) => void;
  updateLoot: (amount: number) => void;
  setTreeData: (nodes: Node<CustomSkillNodeData, 'custom'>[], edges: Edge[]) => void;
}

// 3. Store Implementation
export const usePlayerStore = create<PlayerState>((set) => ({
  // Default values
  hp: 100,
  def: 42,
  int: 78,
  totalLoot: 0,
  activeNode: null,
  isDrawerOpen: false,
  isBossArenaOpen: false,
  isQuestModalOpen: false,
  isLevelUpVisible: false,
  currentChallenge: null,
  currentBoss: null,
  activeNodeData: null,

  // Functions
  updateStat: (stat, amount) => 
    set((state) => ({ [stat]: Math.min(state[stat] + amount, 100) })), // Max 100 tak rakha hai
  setActiveNode: (node) => set({ activeNode: node }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setBossArenaOpen: (open) => set({ isBossArenaOpen: open }),
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  setCurrentBoss: (boss) => set({ currentBoss: boss }),
  setActiveNodeData: (data) => set({ activeNodeData: data }),
  toggleQuestModal: () => set((state) => ({ isQuestModalOpen: !state.isQuestModalOpen })),
  triggerLevelUp: () => {
    set({ isLevelUpVisible: true });
     setTimeout(() => set({ isLevelUpVisible: false }), 2500);
  },
  takeDamage: (amount) => set((state) => ({ hp: Math.max(state.hp - amount, 0) })),
  heal: (amount) => set((state) => ({ hp: Math.min(state.hp + amount, 100) })),
  addLoot: (amount) => set((state) => ({ totalLoot: state.totalLoot + amount })),
  updateLoot: (amount) => set((state) => ({ totalLoot: state.totalLoot + amount })),
  setTreeData: (nodes, edges) => {
    useSkillStore.getState().setNodes(nodes);
    useSkillStore.getState().setEdges(edges);
  },
}));