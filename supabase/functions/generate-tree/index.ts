// Supabase Edge Function — generate-tree
// Deno runtime / no npm imports
// POST { goal: string } → { nodes: ReactFlowNode[], edges: ReactFlowEdge[] }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";

// ─── Types (mirrors the React Flow shapes expected by the frontend) ─────────────

interface RFNode {
  id: string;
  type: "custom";               // CRITICAL: must be "custom" to hit CustomSkillNode
  position: { x: number; y: number };
  data: {
    label: string;
    type: "skill" | "boss" | "loot" | "milestone";
    status: "locked" | "unlocked" | "in_progress" | "completed";
  };
}

interface RFEdge {
  id: string;
  source: string;
  target: string;
  type: "smoothstep";
  style: { stroke: string; strokeWidth: number };
  animated: boolean;
}

interface TreeResponse {
  nodes: RFNode[];
  edges: RFEdge[];
}

// ─── Layout helpers ─────────────────────────────────────────────────────────────

const NODE_GAP_Y = 180;
const CENTER_X = 300;

function buildPositionedTree(steps: { label: string; nodeType: string }[]): TreeResponse {
  const nodeTypeMap: Record<string, RFNode["data"]["type"]> = {
    skill: "skill",
    boss: "boss",
    loot: "loot",
    milestone: "milestone",
  };

  const nodes: RFNode[] = steps.map((step, i) => ({
    id: `node-${i}`,
    type: "custom",
    position: { x: CENTER_X, y: i * NODE_GAP_Y },
    data: {
      label: step.label,
      type: nodeTypeMap[step.nodeType] ?? "skill",
      status: i === 0 ? "unlocked" : "locked",
    },
  }));

  const edges: RFEdge[] = nodes.slice(0, -1).map((_, i) => ({
    id: `edge-${i}-${i + 1}`,
    source: `node-${i}`,
    target: `node-${i + 1}`,
    type: "smoothstep",
    style: { stroke: "#8b5cf6", strokeWidth: 2 },
    animated: true,
  }));

  return { nodes, edges };
}

// ─── AI call — tries Mistral → Gemini → OpenAI → falls back to mock ────────────

async function generateStepsWithAI(goal: string): Promise<{ label: string; nodeType: string }[]> {
  const systemPrompt = `You are a skill tree architect for a learning RPG app called PathWeaver AI.
Given a learning goal, generate a structured skill tree as a JSON array.
Each item must have:
  - "label": concise skill name (3-6 words max)
  - "nodeType": one of "skill", "boss", "loot", "milestone"

Rules:
  • 6–10 steps total
  • Start with foundational skills, escalate to boss challenges, end with a milestone
  • Every 3rd step should be a "boss" node (a challenging checkpoint)
  • At least one "loot" drop (reward/project/resource)
  • Last step is always "milestone"
  • Return ONLY a valid JSON array, no markdown, no explanation

Example output for "Machine Learning":
[
  {"label":"Python Fundamentals","nodeType":"skill"},
  {"label":"NumPy & Pandas","nodeType":"skill"},
  {"label":"Statistics Boss","nodeType":"boss"},
  {"label":"Project: EDA Toolkit","nodeType":"loot"},
  {"label":"Supervised Learning","nodeType":"skill"},
  {"label":"Model Tuning Boss","nodeType":"boss"},
  {"label":"Deep Learning Basics","nodeType":"skill"},
  {"label":"Capstone: Full Pipeline","nodeType":"milestone"}
]`;

  const userMessage = `Generate a skill tree for: "${goal}"`;

  // ── Try Mistral first ──────────────────────────────────────────────────────
  if (MISTRAL_API_KEY) {
    try {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content ?? "[]";
        // response_format json_object wraps in {}, unwrap if needed
        const parsed = JSON.parse(raw);
        const steps = Array.isArray(parsed) ? parsed : parsed.steps ?? parsed.nodes ?? Object.values(parsed)[0];
        if (Array.isArray(steps) && steps.length > 0) return steps;
      }
    } catch (_) { /* fall through */ }
  }

  // ── Try Gemini ─────────────────────────────────────────────────────────────
  if (GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
            generationConfig: { temperature: 0.7 },
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
        const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        const steps = Array.isArray(parsed) ? parsed : Object.values(parsed)[0];
        if (Array.isArray(steps) && steps.length > 0) return steps;
      }
    } catch (_) { /* fall through */ }
  }

  // ── Try OpenAI ─────────────────────────────────────────────────────────────
  if (OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content ?? "[]";
        const parsed = JSON.parse(raw);
        const steps = Array.isArray(parsed) ? parsed : Object.values(parsed)[0];
        if (Array.isArray(steps) && steps.length > 0) return steps;
      }
    } catch (_) { /* fall through */ }
  }

  // ── Hard-coded fallback (always works, useful for demos) ───────────────────
  console.warn("[generate-tree] All AI providers failed or unconfigured — using mock data");
  const words = goal.split(" ").slice(0, 2).join(" ");
  return [
    { label: `${words}: Foundations`, nodeType: "skill" },
    { label: `Core Concepts`, nodeType: "skill" },
    { label: `Knowledge Boss`, nodeType: "boss" },
    { label: `Project: Mini Build`, nodeType: "loot" },
    { label: `Intermediate Skills`, nodeType: "skill" },
    { label: `Advanced Boss`, nodeType: "boss" },
    { label: `Expert Techniques`, nodeType: "skill" },
    { label: `${words}: Master`, nodeType: "milestone" },
  ];
}

// ─── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const goal: string = body?.goal?.trim();

    if (!goal) {
      return new Response(JSON.stringify({ error: "Missing 'goal' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[generate-tree] Generating skill tree for: "${goal}"`);

    const steps = await generateStepsWithAI(goal);
    const tree = buildPositionedTree(steps);

    console.log(`[generate-tree] Generated ${tree.nodes.length} nodes, ${tree.edges.length} edges`);

    return new Response(JSON.stringify(tree), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[generate-tree] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
