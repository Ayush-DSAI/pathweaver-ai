// Supabase Edge Function — generate-tree
// Deno runtime / no npm imports
// POST { goal: string } → { nodes: ReactFlowNode[], edges: ReactFlowEdge[] }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface RFNode {
    id: string;
    type: "custom";
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

// ─── Helper: Deep Clean JSON strings from AI ──────────────────────────────────

function cleanAIJson(raw: string): string {
    return raw
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .replace(/\\n/g, "")
        .trim();
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
            type: (nodeTypeMap[step.nodeType] ?? "skill") as RFNode["data"]["type"],
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

// ─── AI call ────────────────────────────────────────────────────────────────────

async function generateStepsWithAI(goal: string): Promise<{ label: string; nodeType: string }[]> {
    const systemPrompt = `You are a skill tree architect. Return ONLY a valid JSON array of objects with "label" and "nodeType". No markdown, no backticks.
  nodeType must be one of: "skill", "boss", "loot", "milestone". Generate 6-10 steps.`;

    const userMessage = `Goal: "${goal}"`;

    // ── Try Mistral ─────────────────────────────────────────────────────────────
    if (MISTRAL_API_KEY) {
        try {
            const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
                    temperature: 0.7,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                const cleaned = cleanAIJson(data.choices?.[0]?.message?.content ?? "[]");
                return JSON.parse(cleaned);
            }
        } catch (_) { console.error("Mistral failed"); }
    }

    // ── Try Gemini ─────────────────────────────────────────────────────────────
    if (GEMINI_API_KEY) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
                }),
            });
            if (res.ok) {
                const data = await res.json();
                const cleaned = cleanAIJson(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]");
                return JSON.parse(cleaned);
            }
        } catch (_) { console.error("Gemini failed"); }
    }

    // ── Mock Fallback ──────────────────────────────────────────────────────────
    return [
        { label: `${goal}: Basics`, nodeType: "skill" },
        { label: `First Challenge`, nodeType: "boss" },
        { label: `${goal}: Master`, nodeType: "milestone" },
    ];
}

// ─── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { goal } = await req.json();
        if (!goal) throw new Error("Goal is required");

        const steps = await generateStepsWithAI(goal);
        const tree = buildPositionedTree(steps);

        return new Response(JSON.stringify(tree), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});