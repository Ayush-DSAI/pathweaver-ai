'use client';

import { Background, BackgroundVariant, Controls, ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
import type { Edge, Node, NodeMouseHandler } from '@xyflow/react';
import { useEffect } from 'react';

import CustomSkillNode from '@/components/CustomSkillNode';
import type { CustomSkillNodeData } from '@/components/CustomSkillNode';
import { usePlayerStore } from '@/store/playerStore';
import { getLootDrops } from '@/lib/exa';

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
  const { setDrawerOpen, setCurrentChallenge, setActiveNodeData } = usePlayerStore();

  // Locked the static data into proper React Flow state so it doesn't force re-renders
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // THE SAFE ZONE: Any Supabase or Exa fetching MUST go inside here
  useEffect(() => {
    // If Ayush wrote a supabase.channel().subscribe(), drop it here.
    // The empty brackets below act as emergency brakes to stop the infinite loop.
  }, []);

  const onNodeClick: NodeMouseHandler = async (_, node) => {
      const customNode = node as Node<CustomSkillNodeData, 'custom'>;
      if (customNode.data.type === 'boss') {
        setDrawerOpen(true);
        setCurrentChallenge(customNode.data.label);

        // Boom! Using the real function name and passing the empty tags array
        const results = await getLootDrops(customNode.data.label, []); 
        setActiveNodeData(results);
      }
    };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
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