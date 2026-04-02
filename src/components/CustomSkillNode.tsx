'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

export type CustomSkillNodeType =
  | 'skill'
  | 'boss'
  | 'loot'
  | 'milestone'
  | 'skill node'
  | 'boss node'
  | 'loot node'
  | 'milestone node';

export type CustomSkillNodeData = {
  type: CustomSkillNodeType;
  label: string;
};

type CustomSkillFlowNode = Node<CustomSkillNodeData, 'customSkillNode'>;
type CanonicalSkillNodeType = 'skill' | 'boss' | 'loot' | 'milestone';

type VariantStyle = {
  containerClassName: string;
  clipPath?: string;
};

const canonicalTypeByType: Record<CustomSkillNodeType, CanonicalSkillNodeType> = {
  skill: 'skill',
  boss: 'boss',
  loot: 'loot',
  milestone: 'milestone',
  'skill node': 'skill',
  'boss node': 'boss',
  'loot node': 'loot',
  'milestone node': 'milestone',
};

const variantStyleByType: Record<CanonicalSkillNodeType, VariantStyle> = {
  skill: {
    containerClassName:
      'rounded-xl border-2 border-emerald-400/90 bg-black/40 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
  },
  boss: {
    containerClassName:
      'border-2 border-red-500/90 bg-black/50 animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.55)]',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  },
  loot: {
    containerClassName:
      'border border-yellow-200/80 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 shadow-[0_0_16px_rgba(245,158,11,0.55)]',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  },
  milestone: {
    containerClassName:
      'rounded-full border-2 border-violet-400/90 bg-black/40 shadow-[0_0_18px_rgba(139,92,246,0.6)]',
  },
};

export default function CustomSkillNode({ data, isConnectable }: NodeProps<CustomSkillFlowNode>) {
  const canonicalType = canonicalTypeByType[data.type];
  const variant = variantStyleByType[canonicalType];
  const iconSources = [
    `/assets/icons/${encodeURIComponent(canonicalType)}.png`,
    `/assets/icons/${encodeURIComponent(data.type)}.png`,
    `/assets/icons/${encodeURIComponent(`${canonicalType} node`)}.png`,
    `/assets/icons/${encodeURIComponent(`${canonicalType} node`)}.jpg`,
  ];
  const [iconIndex, setIconIndex] = useState(0);
  const iconSrc = iconSources[iconIndex] ?? iconSources[iconSources.length - 1];

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-white/80 !border-2 !border-black/60"
      />

      <div
        className={[
          'w-full h-full flex flex-col items-center justify-center gap-2 select-none text-center px-3',
          variant.containerClassName,
        ].join(' ')}
        style={variant.clipPath ? { clipPath: variant.clipPath } : undefined}
      >
        <Image
          src={iconSrc}
          alt={data.label}
          className="w-9 h-9 object-contain"
          width={36}
          height={36}
          draggable={false}
          unoptimized
          onError={() => {
            setIconIndex((currentIndex) => Math.min(currentIndex + 1, iconSources.length - 1));
          }}
        />
        <div className="text-[10px] leading-tight font-black tracking-widest uppercase text-white/90">
          {data.label}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-white/80 !border-2 !border-black/60"
      />
    </div>
  );
}

