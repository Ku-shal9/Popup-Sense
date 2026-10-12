# Product Requirement Document (PRD) & Specification
## Project: PopupSense
**Subtitle**: AI-Powered, Context-Aware Browser Popup & Overlay Interceptor  
**Target Event**: Frogtoberfest Hackathon ("Build with AI")

---

## 1. Problem Statement

Modern web browsing is cluttered with aggressive popups, intrusive modal overlays, deceptive newsletter gates, and cookie-wall consent banners. At the same time, critical user actions—OAuth login popups (e.g. *Sign in with Google*, *GitHub*), payment gateways (e.g. *Stripe*, *PayPal* checkout windows), multi-factor verification, and legitimate document viewers—also rely on window popups or overlay dialogs.

Existing popup and ad blockers rely on brittle, static heuristics:
- Aggressive blocking breaks legitimate site workflows (login popups silently fail, leaving users confused).
- Lenient blocking lets deceptive, click-jacking, or intrusive adware slip right through.
- Traditional blockers detect **what** appeared (`window.open` or a high `z-index` div) without understanding **why** it appeared, what triggered it, or whether it serves the user's intent.

Users need an intelligent gatekeeper that inspects context, understands user intent versus opportunistic intrusion, and autonomously decides whether to allow, suppress, or verify with the user.

---

## 2. Frogtoberfest Compliance & Rules Checklist

| Hackathon Rule | PopupSense Fulfillment & Architectural Guarantee |
| :--- | :--- |
| **Open Source / Open Weight AI Only** | Only open-weight models qualify (e.g., Qwen 2.5 1.5B/3B, Llama 3.2 1B/3B, Mistral Nemo). **Zero proprietary API usage** (no OpenAI, Anthropic Claude, or Google Gemini keys in production runtime). Run via local Ollama, vLLM, or Hugging Face Inference Endpoints / OpenRouter open-weight endpoints with strict model parameter pinning. |
| **"Build with AI" Core Qualification** | AI does real programmatic work inside the critical execution path. The model ingests raw unstructured context (DOM snapshot, event stack, initiator origin, window geometry) and emits a strict JSON decision schema (`action`, `confidence`, `risk_score`, `category`, `reasoning_signals`). |
| **The Deletion Test** | *If we delete the AI decision engine, does the product work?* **No.** Without the AI reasoning layer, the extension cannot disambiguate between an OAuth login popup vs a malicious redirect/ad popup, or a genuine terms modal vs a deceptive dark-pattern blocker. The AI output directly controls the browser DOM / webRequest interception lifecycle. |
| **AI Usage Disclosure Ready** | Exact files & functions are isolated in a clean deep seam: `src/core/engine/decide-popup.ts` (`decidePopupAction()`) and `src/adapters/ai/open-weight-client.ts` (`classifyPopupContext()`). |
| **Public GitHub Repo & Demo** | Ready for public GitHub release with automated end-to-end tests, demo site, and reproducible fixtures. |

---

## 3. Reference Analysis: Munder Difflin & Moli Browser

### 3.1 Munder Difflin ([chaitanyagiri/munder-difflin](https://github.com/chaitanyagiri/munder-difflin))
- **Key Pattern**: Local-first orchestration harness. AI agents don't just output text; they take actions via system boundaries (PTYs, file boundaries, tools).
- **Takeaway for PopupSense**: The extension must treat the AI as an *autonomous decision harness*. The AI output isn't a recommendation card displayed for human reading; it is a structured command consumed by the browser's execution interception layer (`suppress`, `quarantine`, `passthrough`, `challenge_user`).

### 3.2 Moli Browser Engine ([lexmount/moli](https://github.com/lexmount/moli))
- **Key Pattern**: A lightweight headless browser built in Rust tailored for AI agents, optimizing DOM tree extraction and cutting visual rendering overhead.
- **Takeaway for PopupSense**: Context extraction must be *hyper-efficient*. Rather than sending thousands of raw HTML tags to the open-weight LLM, PopupSense extracts a distilled "Agent-Optimized DOM Subtree" (focusing on initiator triggers, interactive elements, forms, anchor attributes, and overlay styling cues) to minimize tokens and achieve sub-300ms evaluation latency.

---

## 4. User Stories

1. **OAuth / Login Flow**: As a user clicking "Sign in with Google", I want the auth popup to open immediately without interruption, because the AI detects authentic OAuth redirect URLs and recent user click origin.
2. **Deceptive Clickjacking Overlay**: As a user reading an article, I want deceptive full-page invisible overlays that open ad tabs upon any mouse click to be quarantined immediately.
3. **Aggressive Newsletter / Wall Modals**: As a reader, I want intrusive modal overlays that blur the background and demand emails without user interaction to be hidden cleanly, restoring page scrollability.
4. **Uncertain / Ambiguous Popup**: As a user browsing a banking or government portal, if a popup has ambiguous characteristics, I want PopupSense to hold it in a safe quarantine drawer and prompt me ("Allow Bank Statement Viewer?") so my workflow never breaks silently.
5. **Transparency & Audit Log**: As a privacy-conscious user, I want an extension badge and popup dashboard showing the decision log with model confidence, category, and reasoning signals.
6. **Local-First & Offline Resilience**: As a user running Ollama locally, I want PopupSense to route directly to my local model (`http://localhost:11434`), falling back gracefully to lightweight local heuristic scoring if the engine is offline.

---

## 5. Technology Stack Selection

- **Platform**: Chrome Extension Manifest V3 (compatible with Chrome, Brave, Edge).
- **Core Language**: TypeScript (strict mode, ESLint, Prettier).
- **Build Tool**: Vite + CRXJS (instant HMR, fast builds, clean bundle splitting for background service worker, content scripts, and options UI).
- **Testing Framework**: Vitest (unit & integration testing) + `@total-typescript/shoehorn` (type-safe test fixtures) + Playwright / Chrome extension mock fixtures.
- **CSS / UI**: Vanilla CSS with modern tokens (variables, glassmorphism, responsive dark-mode palette, Inter font) for the popup inspector and options page.
- **AI Runtime**: Open-weight provider adapter (Local Ollama / vLLM / OpenRouter with Llama-3.2 / Qwen-2.5) with JSON schema mode and deterministic temperature (0.0).

---

## 6. Architectural Seams & Seam Design

In accordance with deep module design, we define the core seam:

### The Seam: `PopupDecisionEngine`
- **Interface**:
  ```typescript
  export interface PopupDecisionEngine {
    evaluate(context: PopupTriggerContext): Promise<PopupDecision>;
  }
  ```
- **Inputs**:
  - `triggerType`: `'window_open' | 'dom_overlay' | 'tab_create' | 'unsolicited_redirect'`
  - `pageOrigin`: string
  - `targetUrl`: string | null
  - `userInitiated`: boolean (recent user gesture within 250ms)
  - `domSnapshot`: SimplifiedSubtree (elements, aria labels, forms, computed z-indices, pointer-events)
- **Output (`PopupDecision`)**:
  - `action`: `'ALLOW' | 'BLOCK' | 'QUARANTINE_PROMPT'`
  - `riskScore`: number (0.0 to 1.0)
  - `category`: `'AUTH_OAUTH' | 'PAYMENT_GATEWAY' | 'AD_INTRUSIVE' | 'CLICKJACKING' | 'NEWSLETTER_GATE' | 'BENIGN_UI'`
  - `explanation`: string
  - `modelId`: string
  - `consumedAt`: string (file:line marker for Hackathon disclosure)

---

## 7. TDD Strategy (Red-Green-Refactor)

- **Seam 1: Context Extractor**: Extracting minimal, agent-optimized DOM representations without leaking user sensitive inputs (forms stripped of passwords/tokens).
- **Seam 2: Open-Weight Model Adapter**: Strict schema parsing, JSON repair, temperature-0 evaluation, error fallbacks.
- **Seam 3: Decision Engine**: Synthesizing context, executing open-weight reasoning, and calculating action routes.
- **Seam 4: DOM Interceptor & Quarantiner**: Overriding `window.open`, intercepting high-index full-screen overlay insertions, preserving scrollability (`overflow: auto`).

---

## 8. Out of Scope for Hackathon V1
- Training or fine-tuning custom base models from scratch (prompting open-weight models with structured JSON schemas is the target).
- Full ad-network network packet parsing (focus is on popups, new window triggers, and full-page overlay modals).
- Proprietary LLM integrations (strictly forbidden by rules).
