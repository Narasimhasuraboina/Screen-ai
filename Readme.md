# ScreenAI — Complete AI Browser Assistant

> **Understand the web. Instantly.**  
> An intelligent, privacy-conscious browser companion that turns the pages you browse into clear summaries, scannable takeaways, and grounded answers — right inside your browser side panel.

---

## 1. Project Status & Progress Summary

The ScreenAI monorepo has been architected and implemented across three integrated tiers:

| Component | Technology | Status | Key Implemented Capabilities |
| :--- | :--- | :---: | :--- |
| **Shared Core** (`packages/shared`) | TypeScript | **Complete** | Shared data contracts (`WebpageContent`, `SummaryMode`, `ChatMessage`), category heuristics, reading time estimators, and text sanitizers. |
| **Backend API** (`apps/api`) | Node.js, Express, TypeScript, Zod | **Complete** | Endpoints (`/api/health`, `/api/summarize`, `/api/chat`), rate limiting, CORS configuration, and pluggable AI providers (OpenAI, Gemini, and an intelligent offline fallback engine). |
| **Browser Extension** (`apps/extension`) | React 18, Vite, Manifest V3 | **Complete** | Chromium Manifest V3 extension with Chrome Side Panel API, active tab detection, readable DOM content extraction, multi-mode summaries, contextual in-page chat, and tab-switch context invalidation. |
| **Product Website** (`apps/web`) | React 18, Vite, TypeScript | **Complete** | Public marketing website featuring a hero section, an interactive browser demo (with live simulation without an API key), how-it-works workflow, feature matrix, installation guide, and transparent privacy policy. |
| **Multi-Agent Coordination** | Teamwork Multi-Agent System | **Delegated** | Automated orchestrator active in tracking verification criteria, end-to-end assertions, and package builds. |

---

## 2. Monorepo Architecture

```text
Screen-Ai/
├── apps/
│   ├── api/                     # Node.js + Express backend service
│   │   ├── src/
│   │   │   ├── providers/       # OpenAI, Gemini, and Mock AI providers
│   │   │   ├── app.ts           # Middleware, CORS, rate limiting, and routes
│   │   │   ├── config.ts        # Environment variable bindings
│   │   │   ├── validation.ts    # Zod request validation schemas
│   │   │   └── index.ts         # Server entry point (port 3001)
│   │   └── test/                # Automated API and extraction tests
│   │
│   ├── extension/               # Chromium browser extension (Manifest V3)
│   │   ├── public/
│   │   │   ├── manifest.json    # Manifest V3 (Side Panel, activeTab, storage)
│   │   │   └── icons/           # Extension PNG icons (16, 32, 48, 128px)
│   │   ├── src/
│   │   │   ├── background/      # Service worker managing side panel & tabs
│   │   │   ├── content/         # Content script DOM extractor
│   │   │   ├── sidepanel/       # Main React side panel user interface
│   │   │   ├── popup/           # Quick launcher toolbar popup
│   │   │   ├── components/      # UI tabs: Overview, Summary, Ask AI, Settings
│   │   │   ├── services/        # Backend API client, DOM cleaner, and storage
│   │   │   └── styles/          # Dark charcoal cinematic design system
│   │   ├── sidepanel.html
│   │   ├── popup.html
│   │   └── vite.config.ts       # Bundles to root dist-extension/
│   │
│   └── web/                     # Public marketing and demo website
│       ├── src/
│       │   ├── components/      # Hero, Demo, HowItWorks, Features, Install, Privacy
│       │   ├── styles/          # Custom responsive CSS system
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── index.html
│
├── packages/
│   └── shared/                  # Shared TypeScript interfaces & utilities
│       └── src/
│           ├── types.ts         # API schemas, data models, and payloads
│           ├── utils.ts         # Page category detection & text truncation
│           └── index.ts
│
├── dist-extension/              # Generated loadable unpacked extension
├── .env.example                 # Template for backend secrets and origins
├── package.json                 # Monorepo root workspace configuration
└── tsconfig.json                # Base TypeScript configuration
3. Prerequisites

Before running the project on your laptop, ensure you have:

Node.js: v20.x or higher (verified compatible up to v24.x)
npm: v10.x or higher
Browser: Google Chrome, Microsoft Edge, Brave, or any Chromium browser supporting the Chrome Side Panel API.
4. Local Setup & Installation
Step 1: Install Dependencies

From the repository root, install all workspace packages:

bash
npm install
Step 2: Configure Environment Variables

Copy the example environment configuration into the API package or root:

bash
cp .env.example apps/api/.env

Edit apps/api/.env if you wish to connect an external AI model:

env
PORT=3001
NODE_ENV=development
WEB_ORIGIN=http://localhost:5173
# AI Provider ("openai" | "gemini" | "mock")
# If AI_API_KEY is omitted or set to "mock", the backend runs in
# intelligent local fallback mode (fully functional offline).
AI_PROVIDER=openai
AI_API_KEY=your_openai_or_gemini_api_key_here
AI_MODEL=gpt-4o-mini
5. Running the Application
Option A: Run Backend & Web Concurrently

To start both the API server and the marketing website at the same time:

bash
npm run dev:all
Backend API: http://localhost:3001
Public Website: http://localhost:5173
Option B: Run Components Individually
1. Start the Backend API
bash
npm run dev:api

Verify the server is healthy by visiting http://localhost:3001/api/health in your browser.

2. Start the Website
bash
npm run dev:web

Open http://localhost:5173 to interact with the landing page and the zero-dependency interactive demo.

3. Build the Browser Extension
bash
npm run build:extension

This generates a self-contained, valid Chromium Manifest V3 bundle inside the root dist-extension/ directory containing:

manifest.json
sidepanel.html
popup.html
background.js (service worker)
content.js (DOM extractor)
assets/ and icons/
6. Loading the Extension into Chrome or Edge
Open your browser and navigate to:
Google Chrome: chrome://extensions
Microsoft Edge: edge://extensions
Toggle Developer mode in the top-right corner.
Click the "Load unpacked" button in the top-left toolbar.
Select the dist-extension directory located at the root of this project.
Click the Extensions puzzle piece icon in your browser toolbar and Pin ScreenAI.
Open any article (e.g., react.dev
 or github.com
) and click the ScreenAI icon to launch the side panel!
7. Automated Testing & Verification

Run the test suite to verify backend input validation, rate limiting, and extraction sanitizers:

bash
npm test

Perform type checking across all workspaces:

bash
npm run typecheck

Build all packages for production:

bash
npm run build
8. Privacy & Security Architecture
User-Initiated Processing Only: Content is extracted and transmitted only when the user explicitly clicks "Generate Summary" or sends a chat message.
Zero Form / Password Scraping: Form inputs, password fields, cookies, and hidden elements are completely stripped by the content cleaner before processing.
API Key Security: LLM credentials are strictly stored on the backend server. The extension never bundles or exposes API keys.
Anti-Prompt-Injection Safeguards: Webpage content is framed as untrusted external data within system prompts to resist indirect injection attempts.