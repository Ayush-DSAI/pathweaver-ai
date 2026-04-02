'use client';

import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import type { Edge, Node, NodeMouseHandler } from '@xyflow/react';

import CustomSkillNode from '@/components/CustomSkillNode';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import usePlayerStore from '@/store/playerStore';

const nodeTypes = {
  custom: CustomSkillNode,
};

const initialNodes: Node<CustomSkillNodeData, 'custom'>[] = [
  {
    id: 'skill',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { type: 'skill', label: 'Skill' },
  },
  {
    id: 'boss',
    type: 'custom',
    position: { x: 0, y: 180 },
    data: { type: 'boss', label: 'Boss' },
  },
  {
    id: 'loot',
    type: 'custom',
    position: { x: 0, y: 360 },
    data: { type: 'loot', label: 'Loot' },
  },
  {
    id: 'milestone',
    type: 'custom',
    position: { x: 0, y: 540 },
    data: { type: 'milestone', label: 'Milestone' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-skill-boss',
    source: 'skill',
    target: 'boss',
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e-boss-loot',
    source: 'boss',
    target: 'loot',
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e-loot-milestone',
    source: 'loot',
    target: 'milestone',
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
];

export default function SkillTree() {
  const { setDrawerOpen, setCurrentChallenge } = usePlayerStore();

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
        nodes={initialNodes}
        edges={initialEdges}
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
