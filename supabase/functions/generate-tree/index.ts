import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY") ?? "";

interface RFNode {
    id: string;
    type: "customSkill";
    position: { x: number; y: number };
    data: {
        label: string;
        type: "skill" | "boss" | "loot" | "milestone";
        status: "locked" | "unlocked" | "in_progress" | "completed";
        searchQuery: string; // 🔥 THE EXA CHEAT CODE
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

function cleanAIJson(raw: string): string {
    return raw.replace(/```json/gi, "").replace(/```/gi, "").trim();
}

const NODE_GAP_Y = 180;
const CENTER_X = 300;

function buildPositionedTree(steps: any[], goal: string): { nodes: RFNode[], edges: RFEdge[] } {
    const nodeTypeMap: Record<string, RFNode["data"]["type"]> = {
        skill: "skill", boss: "boss", loot: "loot", milestone: "milestone",
    };

    const nodes: RFNode[] = steps.map((step, i) => ({
        id: `node-${i}`,
        type: "customSkill",
        position: { x: CENTER_X, y: i * NODE_GAP_Y },
        data: {
            label: step.label,
            type: (nodeTypeMap[step.nodeType] ?? "skill") as RFNode["data"]["type"],
            status: i === 0 ? "in_progress" : "locked",
            // Pass the AI's custom search query to the frontend for Exa!
            searchQuery: step.searchQuery || `${goal} ${step.label} tutorial`
        },
    }));

    const edges: RFEdge[] = nodes.slice(0, -1).map((_, i) => ({
        id: `edge-${i}-${i + 1}`,
        source: `node-${i}`, target: `node-${i + 1}`,
        type: "smoothstep", style: { stroke: "#8b5cf6", strokeWidth: 3 }, animated: true,
    }));

    return { nodes, edges };
}

async function generateStepsWithAI(goal: string): Promise<any[]> {
    const systemPrompt = `You are an expert curriculum designer. Generate a learning path for: "${goal}". 
    RULES:
    1. DYNAMIC LENGTH: Generate anywhere from 3 to 8 steps depending on the complexity of the topic.
    2. NO generic terms. Use highly specific, real-world technical sub-topics.
    3. For each step, create a "searchQuery" string. This must be a highly optimized, context-heavy search engine query to find the best tutorials for this specific step.
    4. Return ONLY a valid JSON array.
    
    EXAMPLE FORMAT:
    [
      { 
        "label": "The Call Stack", 
        "nodeType": "skill", 
        "searchQuery": "How the call stack works in Python recursion tutorial" 
      },
      { 
        "label": "Base Cases vs Recursive Steps", 
        "nodeType": "boss", 
        "searchQuery": "Python base cases and recursive steps explained with examples" 
      }
    ]`;

    // Try Mistral First (To avoid Google Quota issues)
    if (MISTRAL_API_KEY) {
        try {
            const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
                body: JSON.stringify({
                    model: "mistral-small-latest",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: goal }],
                    temperature: 0.7,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                return JSON.parse(cleanAIJson(data.choices[0].message.content));
            }
        } catch (e) { console.error("Mistral failed", e); }
    }

    // Try Gemini as Backup
    if (GEMINI_API_KEY) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }]
                })
            });
            if (res.ok) {
                const data = await res.json();
                return JSON.parse(cleanAIJson(data.candidates[0].content.parts[0].text));
            }
        } catch (e) { console.error("Gemini failed", e); }
    }

    return [
        { label: "API Error", nodeType: "boss", searchQuery: "API Quota Error" }
    ];
}

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { goal } = await req.json();
        const steps = await generateStepsWithAI(goal);
        const tree = buildPositionedTree(steps, goal);

        return new Response(JSON.stringify(tree), {
            status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});