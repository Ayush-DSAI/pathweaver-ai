# pathweaver-ai
Project under *Karke Dikha* 24 Buildathon
# 🌌 Pathweaver AI: The Autonomous Skill-Tree Orchestrator

![Pathweaver AI Banner](https://via.placeholder.com/1200x400/0f172a/00ffcc?text=Pathweaver+AI:+Gamified+Agentic+Learning)

[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?logo=next.js)](https://nextjs.org/)
[![React Flow](https://img.shields.io/badge/UI-React_Flow-ff007f?logo=react)](https://reactflow.dev/)
[![Mistral AI](https://img.shields.io/badge/LLM-Mistral_Small_4-orange?logo=mistral)](https://mistral.ai/)
[![Exa AI](https://img.shields.io/badge/Search-Exa_AI-blue)](https://exa.ai/)

## ⚠️ The Problem: "Tutorial Hell" & Static Decay
Current learning platforms suffer from **Static Information Decay**. Students are overwhelmed by linear, outdated roadmaps that do not adapt to their existing knowledge or real-time industry shifts. Furthermore, there is no active feedback loop to verify actual competency before moving forward, leading to a 90% drop-off rate in self-paced learning.

## 🚀 The Solution: Gamified, Agentic Learning
**Pathweaver AI** moves beyond static roadmaps. We utilize a multi-agent LLM architecture to generate personalized, directed acyclic graphs (DAGs) of learning modules. 

It doesn't just tell you what to learn; it **verifies** your understanding through Natural Language Understanding (NLU) "Boss Fights," grounding every curriculum in real-time 2026 data.

---

## ✨ Key Technical Features

### 1. Multimodal Character Initialization
Instead of a manual onboarding form, users upload their existing resume or syllabus. We use **Mistral Pixtral (Vision)** to extract latent skills and dynamically initialize the user's "RPG Stats" (e.g., Intelligence, Coding Execution).

### 2. Dynamic Knowledge Graph Synthesis
Using **Mistral Small 4**, we perform unstructured-to-structured transformation. The agent maps the gap between the user's current state and their target goal, generating a strict JSON curriculum rendered via **React Flow**.

### 3. Semantic Gatekeeping (The "Boss Fight")
To unlock new nodes, users must defeat an AI "Gatekeeper." A **Mistral Large 3** agent conducts a real-time semantic interview, grading the user's conceptual understanding rather than relying on multiple-choice keyword matching.

### 4. Live Agentic Grounding
We eliminate AI hallucinations by equipping our agents with the **Exa AI API**. When a node is generated, the agent fetches the most current, high-quality documentation and repo links ("Loot Drops") from the live web.

---

## 🧠 System Architecture

Our environment utilizes strict JSON contracts to separate frontend rendering from backend agent logic:
1. **The Architect (Antigravity):** Handles the Mistral API prompt chaining and outputs the `SkillTree` DAG schema.
2. **The Cartographer (Trae/Next.js):** Consumes the JSON to render an interactive, animated canvas using React Flow and Framer Motion.
3. **The Scout:** Injects live web data into the node's `resources` array.

---

## 💻 Local Setup & Installation

To run Pathweaver AI locally, follow these steps:

### Prerequisites
* Node.js (v18 or higher)
* API Keys for Mistral AI and Exa AI

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/pathweaver-ai.git](https://github.com/YOUR_USERNAME/pathweaver-ai.git)
   cd pathweaver-ai
