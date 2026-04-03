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
        searchQuery: string;
        bossTopic?: string;
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

    // 🔥 THE ZONE LOGIC TRACKER: Keeps track of when we hit Boss 1
    let hasPassedFirstBoss = false;

    const nodes: RFNode[] = steps.map((step, i) => {
        // 🔥 Evaluate the status dynamically for every node
        let initialStatus = "locked"; // Assume locked by default

        if (!hasPassedFirstBoss) {
            initialStatus = "unlocked"; // Unlock everything in Zone 1

            // If this current node is the Boss, trip the wire!
            // This means the NEXT iteration of the loop will stay "locked".
            if (step.nodeType === "boss" || step.nodeType === "milestone") {
                hasPassedFirstBoss = true;
            }
        }

        return {
            id: `node-${i}`,
            type: "customSkill",
            position: { x: CENTER_X, y: i * NODE_GAP_Y },
            data: {
                label: step.label,
                type: (nodeTypeMap[step.nodeType] ?? "skill") as RFNode["data"]["type"],
                status: initialStatus as RFNode["data"]["status"], // Applies our new logic
                searchQuery: step.searchQuery || `${goal} ${step.label} tutorial`,
                bossTopic: step.bossTopic || goal
            },
        };
    });

    const edges: RFEdge[] = nodes.slice(0, -1).map((_, i) => ({
        id: `edge-${i}-${i + 1}`,
        source: `node-${i}`, target: `node-${i + 1}`,
        type: "smoothstep", style: { stroke: "#8b5cf6", strokeWidth: 3 }, animated: true,
    }));

    return { nodes, edges };
}

async function generateStepsWithAI(goal: string): Promise<any[]> {
    const systemPrompt = `You are an expert RPG Dungeon Master and Curriculum Designer. Generate a learning path for: "${goal}". 
    RULES:
    1. DYNAMIC LENGTH & PACING: Generate 5 to 9 steps. 
    2. BOSS PLACEMENT: You MUST dynamically place a "boss" node after every 2 or 3 "skill" nodes as a checkpoint. The final node MUST also be a "boss" or "milestone".
    3. STANDARD NODES: For "skill" nodes, provide a highly specific "label" and a highly optimized YouTube "searchQuery".
    4. BOSS NODES: For "boss" nodes, the label should sound like an RPG boss (e.g., "The Sentinel of Syntax"). You MUST include a "bossTopic" string detailing exactly what concepts this boss will test the user on based on the previous nodes.
    5. Return ONLY a valid JSON array.
    
    EXAMPLE FORMAT:
    [
      { "label": "Call Stack Memory", "nodeType": "skill", "searchQuery": "Python call stack memory execution tutorial" },
      { "label": "Base Cases", "nodeType": "skill", "searchQuery": "Python recursion base cases explained" },
      { "label": "The Infinite Looper", "nodeType": "boss", "bossTopic": "Python call stack limits and identifying missing base cases." },
      { "label": "Tail Recursion", "nodeType": "skill", "searchQuery": "Python tail recursion optimization" },
      { "label": "The Final Compiler", "nodeType": "boss", "bossTopic": "Tail recursion, base cases, and complex recursive algorithms." }
    ]`;

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
        { label: "API Error", nodeType: "boss", searchQuery: "API Quota Error", bossTopic: "API Limits" }
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