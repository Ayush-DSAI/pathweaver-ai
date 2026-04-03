'use client';

import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import type { Edge, Node, NodeMouseHandler } from '@xyflow/react';
import { useEffect } from 'react';

import CustomSkillNode from '@/components/CustomSkillNode';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import { usePlayerStore } from '@/store/playerStore';
import { getLootDrops } from '@/lib/exa';
import { useSkillStore } from '@/store/useSkillStore';

const nodeTypes = {
  custom: CustomSkillNode,
};

export default function SkillTree() {
  // 1. Your Exa UI Store
  const { setDrawerOpen, setCurrentChallenge, setActiveNodeData } = usePlayerStore();
  
  // 2. Ayush's Supabase Global Database Store
  const { nodes, edges } = useSkillStore();

  useEffect(() => {
    // If Ayush wrote a supabase.channel().subscribe(), drop it here.
  }, []);

  const onNodeClick: NodeMouseHandler = async (_, node) => {
    const customNode = node as Node<CustomSkillNodeData, 'custom'>;
    if (customNode.data.type === 'boss') {
      setDrawerOpen(true);
      setCurrentChallenge(customNode.data.label);

      // Your Exa Engine firing!
      const results = await getLootDrops(customNode.data.label, []);
      setActiveNodeData(results);
    }
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
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