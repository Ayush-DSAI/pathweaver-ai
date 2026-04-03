'use client';

import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import type { Node, NodeMouseHandler } from '@xyflow/react';

import CustomSkillNode from '@/components/CustomSkillNode';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import { usePlayerStore } from '@/store/playerStore';
import { useSkillStore } from '@/store/useSkillStore';

const nodeTypes = {
  custom: CustomSkillNode,
};


export default function SkillTree() {
  const { setDrawerOpen, setCurrentChallenge } = usePlayerStore();
  const { nodes, edges } = useSkillStore();

  const onNodeClick: NodeMouseHandler = (_, node) => {
    const customNode = node as Node<CustomSkillNodeData, 'custom'>;
    if (customNode.data.type === 'boss' || customNode.data.type === 'boss node') {
      setCurrentChallenge(customNode.data.label);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="w-full h-full bg-[#05050a]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        className="h-full w-full bg-[#05050a]"
      >
        <Background variant={BackgroundVariant.Lines} gap={28} size={1} color="rgba(255,255,255,0.06)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
