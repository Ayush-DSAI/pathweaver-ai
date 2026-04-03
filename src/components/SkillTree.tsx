'use client';

import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import type { Edge } from '@xyflow/react';
import { useEffect, useMemo } from 'react';

import CustomSkillNode from '@/components/CustomSkillNode';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import { useSkillStore } from '@/store/useSkillStore';

const nodeTypes = {
  custom: CustomSkillNode,
  customSkill: CustomSkillNode, // Fix for the "customSkill not found" error
};

export default function SkillTree() {
  // 1. Ayush's Supabase Global Database Store
  const { nodes, edges } = useSkillStore();

  useEffect(() => {
    // If Ayush wrote a supabase.channel().subscribe(), drop it here.
  }, []);



  // ─── Fog of War Logic ──────────────────────────────────────────────────────
  const visibleNodes = useMemo(() => nodes.map(node => {
    const incomingEdges = edges.filter(e => e.target === node.id);
    
    const isUnlocked = incomingEdges.length === 0 || incomingEdges.some(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      return sourceNode?.data.status === 'completed';
    });

    const isVisible = isUnlocked || node.data.status === 'unlocked' || node.data.status === 'in_progress' || node.data.status === 'completed';

    return {
      ...node,
      style: { 
        ...node.style, 
        opacity: isVisible ? 1 : 0.15,
        pointerEvents: isVisible ? 'all' as const : 'none' as const,
        transition: 'all 0.8s ease-in-out',
        filter: isVisible ? 'none' : 'grayscale(1) blur(2px)', 
      }
    };
  }), [nodes, edges]);

  const visibleEdges = useMemo(() => edges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const isVisible = sourceNode?.data.status === 'completed' || sourceNode?.data.status === 'in_progress';
    
    return {
      ...edge,
      animated: isVisible,
      style: {
        ...edge.style,
        stroke: isVisible ? '#8b5cf6' : '#1e1e2d',
        strokeWidth: isVisible ? 3 : 1,
        opacity: isVisible ? 0.8 : 0.2,
        filter: isVisible ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' : 'none',
        transition: 'all 0.8s ease-in-out'
      }
    };
  }), [nodes, edges]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={visibleNodes}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
      >
        <Background
          color="#ffffff"
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
        <Controls className="fill-white text-black" />
      </ReactFlow>
    </div>
  );
}