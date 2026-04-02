# 🌌 Pathweaver AI: The Autonomous Skill-Tree Orchestrator

![Pathweaver AI Banner](https://via.placeholder.com/1200x400/0f172a/00ffcc?text=Pathweaver+AI:+Gamified+Agentic+Learning)

[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![React Flow](https://img.shields.io/badge/UI-React_Flow-ff007f?logo=react)](https://reactflow.dev/)
[![Claude 3.5 Sonnet](https://img.shields.io/badge/LLM-Claude_3.5_Sonnet-D97757?logo=anthropic)](https://anthropic.com/)
[![Exa AI](https://img.shields.io/badge/Search-Exa_AI-blue)](https://exa.ai/)

## ⚠️ The Problem: Curing "Tutorial Hell"
[cite_start]The current landscape of self-directed technical education suffers from a systemic failure: "Tutorial Hell". [cite_start]Learners become trapped in a passive consumption loop, and traditional, rigid educational roadmaps force them to manually skip ahead or study obsolete frameworks. [cite_start]Furthermore, standard quizzes fail to prove actual conceptual understanding. 

## 🚀 The Solution: Pathweaver AI
[cite_start]**Pathweaver AI** dismantles this broken educational model by functioning as an Autonomous Skill-Tree Orchestrator, translating the addictive progression loops of RPGs into a legitimate, AI-driven educational tool.

### The Four Technological Pillars
1. [cite_start]**Multimodal Feature Extraction:** The system analyzes a user's resume or digital profile to generate a customized "RPG Character Sheet," assigning baseline statistics to skills.
2. [cite_start]**Dynamic Knowledge Graph Synthesis:** The system generates a Directed Acyclic Graph (DAG). [cite_start]Advanced topics remain hidden behind a visual "Fog of War" to prevent cognitive overload.
3. [cite_start]**Agentic Verification (Boss Fights):** To clear a node and lift the Fog of War, the user must survive a "Boss Fight," where an advanced AI model interrogates them with dynamic, unscripted technical questions.
4. [cite_start]**Real-Time Grounding (Loot Drops):** Defeating a boss yields "Loot"—highly relevant, up-to-the-minute documentation, code repositories, and research papers fetched dynamically from the live internet.

---

## 🛠️ The Tech Stack & Toolchain

Our environment leverages an elite, AI-driven stack:
* [cite_start]**The Development Environments:** **Antigravity IDE** (an "Agent-First" IDE powered by Gemini 3.1 Pro for complex planning and terminal execution) and **Trae IDE** (utilizing Builder Mode for rapid UI generation).
* [cite_start]**Frontend Scaffolding:** **v0.dev** for rapid initial layout generation.
* [cite_start]**Backend & DB:** **Supabase** (PostgreSQL database, Realtime broadcasting, and Edge Functions running Deno).
* [cite_start]**AI Engine:** **Claude 3.5 Sonnet** (generating skill trees and conducting boss interrogations).
* [cite_start]**Search/Scouting:** **Exa AI** (semantic search engine built for autonomous agents).
* [cite_start]**UI/State:** **React Flow** (DAG rendering), **Zustand** (global state management), and **Framer Motion** (complex visual effects and animations).
* [cite_start]**Asset Generation:** **Nano Banana 2** (flat vector UI icons) and **Midjourney** (cyberpunk boss portraits).
* [cite_start]**Validation:** **Zod** (acting as the "digital bouncer" to ensure AI-generated data perfectly matches our expected JSON structures).

---

## 🧠 The Global JSON Contract (Single Source of Truth)

[cite_start]To ensure our backend (Supabase Edge Functions) and frontend (React Flow) communicate flawlessly without integration failures, we use a strict TypeScript JSON contract. Every generated component strictly adheres to this structure:

```typescript
type NodeType = "skill" | "boss" | "loot" | "milestone";
type NodeStatus = "locked" | "available" | "in_progress" | "completed";
type EdgeType = "prerequisite" | "optional" | "boss_gate";

interface SkillNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  xp: number;
  status: NodeStatus;
  position: { x: number; y: number };
  resources: Resource[];
  tags: string[];
  boss_prompt?: string;
  estimated_minutes?: number;
}

// ... Includes strictly typed interfaces for Resource, SkillEdge, and SkillTree
