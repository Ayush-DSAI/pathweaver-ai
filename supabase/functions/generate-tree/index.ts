import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { goal } = await req.json()
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

        console.log(`📡 Goal: ${goal}`)
        // This will help you see if the key is actually loading in the terminal
        console.log(`🔑 Key check: ${GEMINI_API_KEY ? "LOADED (Starts with " + GEMINI_API_KEY.slice(0, 4) + ")" : "NOT FOUND"}`)

        if (!GEMINI_API_KEY) throw new Error("Missing API Key")

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a skill tree for ${goal}. Return a JSON object with "nodes" (id, label) and "edges" (from, to). Limit to 5 nodes. Return ONLY the JSON block.` }] }]
            })
        })

        const data = await geminiRes.json()

        if (data.error) {
            console.error("❌ GOOGLE API REJECTED KEY:", data.error.message)
            throw new Error(`Google API: ${data.error.message}`)
        }

        const rawText = data.candidates[0].content.parts[0].text
        console.log("📝 RAW AI TEXT RECEIVED")

        // 🔥 THE FUCK-UP FIX: Extract JSON even if Gemini adds "Sure, here is your JSON"
        const jsonStart = rawText.indexOf('{')
        const jsonEnd = rawText.lastIndexOf('}') + 1
        const jsonString = rawText.slice(jsonStart, jsonEnd)

        const tree = JSON.parse(jsonString)

        const finalNodes = tree.nodes.map((node: any) => ({
            ...node,
            loot: "https://www.youtube.com/results?search_query=" + encodeURIComponent(node.label)
        }))

        console.log("✅ SUCCESS: Sending tree to Ayush's frontend")
        return new Response(JSON.stringify({ nodes: finalNodes, edges: tree.edges }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error("🔥 BACKEND CRASHED:", error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})