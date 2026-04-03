'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import { motion, type Variants } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { getLootDrops } from '@/lib/exa';

// ─── Type definitions ──────────────────────────────────────────────────────────

export type CustomSkillNodeType =
  | 'skill'
  | 'boss'
  | 'loot'
  | 'milestone'
  | 'skill node'
  | 'boss node'
  | 'loot node'
  | 'milestone node';

export type SkillNodeStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export type CustomSkillNodeData = {
  type: CustomSkillNodeType;
  label: string;
  status?: SkillNodeStatus;
  searchQuery?: string;
};

type CustomSkillFlowNode = Node<CustomSkillNodeData, 'customSkillNode'>;
type CanonicalSkillNodeType = 'skill' | 'boss' | 'loot' | 'milestone';

type VariantStyle = {
  containerClassName: string;
  clipPath?: string;
  /** Default neon border colour (used for unlocked / in-progress) */
  borderColor: string;
  /** Default glow rgba */
  glowColor: string;
};

// ─── Type → canonical mapping ──────────────────────────────────────────────────

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

// ─── Type-based visual variants ────────────────────────────────────────────────

const variantStyleByType: Record<CanonicalSkillNodeType, VariantStyle> = {
  skill: {
    containerClassName: 'rounded-xl border-2 bg-black/40',
    borderColor: 'rgba(52,211,153,0.9)',       // emerald-400
    glowColor: 'rgba(16,185,129,0.5)',
  },
  boss: {
    containerClassName: 'border-2 bg-black/50',
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    borderColor: 'rgba(239,68,68,0.9)',         // red-500
    glowColor: 'rgba(239,68,68,0.55)',
  },
  loot: {
    containerClassName:
      'border bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700',
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    borderColor: 'rgba(254,240,138,0.8)',       // yellow-200
    glowColor: 'rgba(245,158,11,0.55)',
  },
  milestone: {
    containerClassName: 'rounded-full border-2 bg-black/40',
    borderColor: 'rgba(167,139,250,0.9)',       // violet-400
    glowColor: 'rgba(139,92,246,0.6)',
  },
};

// ─── Completed aura colours ────────────────────────────────────────────────────
const COMPLETED_BORDER = 'rgba(6,222,206,0.95)';   // bright cyan-ish emerald
const COMPLETED_GLOW  = '0 0 24px 6px rgba(6,222,206,0.6), 0 0 48px 12px rgba(16,185,129,0.25)';

// ─── Framer-Motion helpers ─────────────────────────────────────────────────────

/** Pulsing border brightness for the "in_progress" state */
const inProgressPulse: Variants = {
  pulse: {
    boxShadow: [
      '0 0 12px 2px var(--glow)',
      '0 0 28px 8px var(--glow)',
      '0 0 12px 2px var(--glow)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CustomSkillNode({ data, isConnectable }: NodeProps<CustomSkillFlowNode>) {
  const { setDrawerOpen, setCurrentChallenge, setActiveNodeData } = usePlayerStore();
  const status: SkillNodeStatus = data.status ?? 'unlocked';
  const canonicalType = canonicalTypeByType[data.type];
  const variant = variantStyleByType[canonicalType];

  const isLocked    = status === 'locked';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';

  // ── Icon sources (unchanged logic) ─────────────────────────────────────────
  const iconSources = [
    `/assets/icons/${encodeURIComponent(canonicalType)}.png`,
    `/assets/icons/${encodeURIComponent(data.type)}.png`,
    `/assets/icons/${encodeURIComponent(`${canonicalType} node`)}.png`,
    `/assets/icons/${encodeURIComponent(`${canonicalType} node`)}.jpg`,
  ];
  const [iconIndex, setIconIndex] = useState(0);
  const iconSrc = iconSources[iconIndex] ?? iconSources[iconSources.length - 1];

  // ── Resolve colours based on status ────────────────────────────────────────
  const borderColor = isCompleted ? COMPLETED_BORDER : variant.borderColor;
  const glowColor   = variant.glowColor;

  const baseBoxShadow = isCompleted
    ? COMPLETED_GLOW
    : `0 0 15px ${glowColor}`;

  // ── Outer wrapper filter for locked state ──────────────────────────────────
  const outerFilter = isLocked ? 'grayscale(1) opacity(0.4)' : 'none';

  return (
    <motion.div
      className="relative w-28 h-28 flex items-center justify-center cursor-pointer"
      onClick={async () => {
        if (isLocked) return;
        setCurrentChallenge(data.label);
        setDrawerOpen(true);
        const queryToSearch = data.searchQuery || data.label;
        const results = await getLootDrops(queryToSearch, []);
        setActiveNodeData(results);
      }}
      style={{
        filter: outerFilter,
        pointerEvents: isLocked ? 'none' : 'auto',
        // CSS custom property consumed by the pulse animation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--glow' as any]: glowColor,
      }}
      whileHover={isLocked ? undefined : { scale: 1.12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="opacity-0"
      />

      {/* Main visual container — animated for status transitions */}
      <motion.div
        className={[
          'w-full h-full flex flex-col items-center justify-center gap-2 select-none text-center px-3',
          variant.containerClassName,
        ].join(' ')}
        style={{
          borderColor,
          boxShadow: baseBoxShadow,
          ...(variant.clipPath ? { clipPath: variant.clipPath } : {}),
        }}
        // Animate border / glow changes smoothly between status switches
        animate={isInProgress ? 'pulse' : undefined}
        variants={isInProgress ? inProgressPulse : undefined}
        layout
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Active Scanning Ring (Only for In Progress) */}
        {isInProgress && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] border border-cyan-400/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 30%, 0% 30%)',
              filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))'
            }}
          />
        )}

        <Image
          src={iconSrc}
          alt={data.label}
          className="w-9 h-9 object-contain"
          width={36}
          height={36}
          draggable={false}
          unoptimized
          onError={() => {
            setIconIndex((cur) => Math.min(cur + 1, iconSources.length - 1));
          }}
        />
        <div className="text-[10px] leading-tight font-black tracking-widest uppercase text-white/90">
          {data.label}
        </div>
      </motion.div>

      {/* ── Status overlay icons ──────────────────────────────────────────── */}

      {/* 🔒 Locked — top-right lock badge */}
      {isLocked && (
        <motion.div
          className="absolute -top-1 -right-1 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/70 border border-white/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
        >
          <Lock className="w-3.5 h-3.5 text-white/80" />
        </motion.div>
      )}

      {/* ✅ Completed — top-right checkmark badge with glow */}
      {isCompleted && (
        <motion.div
          className="absolute -top-1 -right-1 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 border border-cyan-300/60 shadow-[0_0_10px_rgba(6,222,206,0.7)]"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
        >
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="opacity-0"
      />
    </motion.div>
  );
}
