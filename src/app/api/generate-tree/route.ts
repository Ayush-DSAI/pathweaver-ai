import { NextRequest, NextResponse } from 'next/server';

// ─── Types (must match what CustomSkillNode and useSkillStore expect) ──────────

interface RFNode {
  id: string;
  type: 'custom';
  position: { x: number; y: number };
  data: {
    label: string;
    type: 'skill' | 'boss' | 'loot' | 'milestone';
    status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
    searchQuery: string;
  };
}

interface RFEdge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
  style: { stroke: string; strokeWidth: number };
  animated: boolean;
}

interface Step {
  label: string;
  nodeType: string;
  searchQuery: string;
}

// ─── Layout builder ────────────────────────────────────────────────────────────

const NODE_GAP_Y = 180;
const CENTER_X   = 500;

function buildTree(steps: Step[]): { nodes: RFNode[]; edges: RFEdge[] } {
  const typeMap: Record<string, RFNode['data']['type']> = {
    skill: 'skill', boss: 'boss', loot: 'loot', milestone: 'milestone',
  };

  const nodes: RFNode[] = steps.map((step, i) => ({
    id: `node-${i}`,
    type: 'custom',                           // ← matches nodeTypes={{ custom: CustomSkillNode }}
    position: { x: CENTER_X, y: i * NODE_GAP_Y },
    data: {
      label: step.label,
      type: typeMap[step.nodeType] ?? 'skill',
      status: i === 0 ? 'unlocked' : 'locked',
      searchQuery: step.searchQuery,
    },
  }));

  const edges: RFEdge[] = nodes.slice(0, -1).map((_, i) => ({
    id: `edge-${i}-${i + 1}`,
    source: `node-${i}`,
    target: `node-${i + 1}`,
    type: 'smoothstep',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
    animated: true,
  }));

  return { nodes, edges };
}

// ─── AI generation ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a skill tree architect for a gamified learning app called PathWeaver AI.
Given a learning goal, return a JSON array of 7–9 skill tree steps.
Each object must have exactly three keys:
  "label": a concise skill name (3–6 words)
  "nodeType": one of "skill" | "boss" | "loot" | "milestone"
  "searchQuery": a technically optimized search term (4–7 words) to find high-quality articles/videos on this specific sub-topic.

Rules:
  • Start with foundational skills
  • Every 3rd node is a "boss" (challenging checkpoint)
  • Include one "loot" (project/resource reward)
  • Last node is always "milestone"
  • Return ONLY a valid JSON array — no markdown, no explanation, no wrapper object`;

async function callMistral(goal: string): Promise<Step[] | null> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Goal: "${goal}"` },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? '';
  return parseSteps(raw);
}

async function callGemini(goal: string): Promise<Step[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nGoal: "${goal}"` }] }],
        generationConfig: { temperature: 0.7 },
      }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseSteps(raw);
}

async function callOpenAI(goal: string): Promise<Step[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Goal: "${goal}"` },
      ],
      temperature: 0.7,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? '';
  return parseSteps(raw);
}

function parseSteps(raw: string): Step[] | null {
  try {
    // Strip markdown code fences if present
    const clean = raw.replace(/```(?:json)?\n?/g, '').replace(/```\n?/g, '').trim();
    // Find the first JSON array in the response
    const match = clean.match(/\[[\s\S]*\]/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Step[];
  } catch {
    return null;
  }
}

function mockSteps(goal: string): Step[] {
  const title = goal.split(' ').slice(0, 3).join(' ');
  return [
    { label: `${title}: Foundations`,   nodeType: 'skill',     searchQuery: `${goal} foundations tutorial` },
    { label: 'Core Concepts',            nodeType: 'skill',     searchQuery: `${goal} key concepts for beginners` },
    { label: 'Knowledge Boss',           nodeType: 'boss',      searchQuery: `${goal} intermediate mastery challenges` },
    { label: 'Project: Mini Build',      nodeType: 'loot',      searchQuery: `hands-on projects for ${goal}` },
    { label: 'Intermediate Skills',      nodeType: 'skill',     searchQuery: `${goal} advanced techniques and best practices` },
    { label: 'Advanced Boss',            nodeType: 'boss',      searchQuery: `scaling ${goal} for production` },
    { label: 'Expert Techniques',        nodeType: 'skill',     searchQuery: `expert-level ${goal} optimizations` },
    { label: `${title}: Mastery`,        nodeType: 'milestone', searchQuery: `future trends in ${goal}` },
  ];
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const goal: string = body?.goal?.trim();

    if (!goal) {
      return NextResponse.json({ error: "Missing 'goal'" }, { status: 400 });
    }

    console.log(`[generate-tree] goal="${goal}"`);

    // Try AI providers in order, fallback to mock
    let steps: Step[] | null = null;
    steps ??= await callMistral(goal).catch(() => null);
    steps ??= await callGemini(goal).catch(() => null);
    steps ??= await callOpenAI(goal).catch(() => null);

    if (!steps) {
      console.warn('[generate-tree] All AI providers failed — using mock data');
      steps = mockSteps(goal);
    }

    const tree = buildTree(steps);
    console.log(`[generate-tree] → ${tree.nodes.length} nodes, ${tree.edges.length} edges`);

    return NextResponse.json(tree);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[generate-tree] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
