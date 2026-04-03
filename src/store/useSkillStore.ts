import { create } from 'zustand';
import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js';
import type { Edge, Node } from '@xyflow/react';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';

// ─── Supabase client (singleton) ───────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// ─── Row shape coming from the `skill_nodes` table ─────────────────────────────
export interface SkillNodeRow {
  id: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  label: string;
  type: string;
  position_x: number;
  position_y: number;
  search_query?: string;
  [key: string]: unknown; // allow extra columns without breaking types
}

// ─── Store interface ───────────────────────────────────────────────────────────
export interface SkillStoreState {
  /** React Flow nodes */
  nodes: Node<CustomSkillNodeData, 'custom'>[];
  /** React Flow edges */
  edges: Edge[];

  /** Replace the full node list */
  setNodes: (nodes: Node<CustomSkillNodeData, 'custom'>[]) => void;
  /** Replace the full edge list */
  setEdges: (edges: Edge[]) => void;
  /** Atomically replace both nodes and edges (used by the AI tree generator) */
  setTree: (nodes: Node<CustomSkillNodeData, 'custom'>[], edges: Edge[]) => void;

  /**
   * Open a Supabase Realtime channel that listens for UPDATE events on
   * the `skill_nodes` table. When a row changes (e.g. status → 'completed')
   * the corresponding React Flow node in state is patched immediately.
   *
   * Returns an unsubscribe function you can call on cleanup.
   */
  subscribeToSkillUpdates: () => () => void;
}

// ─── Store implementation ──────────────────────────────────────────────────────
export const useSkillStore = create<SkillStoreState>((set, get) => ({
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setTree: (newNodes, newEdges) => set({ nodes: newNodes, edges: newEdges }),

  subscribeToSkillUpdates: () => {
    const channel: RealtimeChannel = supabase
      .channel('skill-nodes-updates')
      .on<SkillNodeRow>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'skill_nodes',
        },
        (payload) => {
          const updatedRow = payload.new;

          set({
            nodes: get().nodes.map((node) => {
              if (node.id !== updatedRow.id) return node;

              // Merge the changed database fields into the node's data
              return {
                ...node,
                data: {
                  ...node.data,
                  label: updatedRow.label,
                  type: updatedRow.type as CustomSkillNodeData['type'],
                  status: updatedRow.status,
                  searchQuery: updatedRow.search_query,
                },
                // Optionally sync position if the DB drives layout
                position: {
                  x: updatedRow.position_x ?? node.position.x,
                  y: updatedRow.position_y ?? node.position.y,
                },
              };
            }),
          });
        },
      )
      .subscribe();

    // Return an unsubscribe function for cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
