# Survey Report: ScreenAI Monorepo, Shared Core, Build Pipeline & Contracts

**Author:** Explorer 1  
**Date:** 2026-10-10T05:31:00Z  
**Scope:** Monorepo Workspace Survey, Shared Packages, Contracts, Build Pipeline, Typecheck & Test Evaluation  
**Working Directory:** `/Users/JOHN/Desktop/Screen-Ai/.agents/teamwork/explorer_survey_1`  
**Reference Document:** `/Users/JOHN/Desktop/Screen-Ai/.agents/teamwork/ORIGINAL_REQUEST.md`  
**Synthesized Peer Reports:**
- Explorer 2: `/Users/JOHN/Desktop/Screen-Ai/.agents/teamwork/explorer_survey_2/handoff.md` (R3 Backend API)
- Explorer 3: `/Users/JOHN/Desktop/Screen-Ai/.agents/teamwork/explorer_survey_3/handoff.md` (R1 Website & R2 Extension)

---

## 1. Observation

### 1.1 Monorepo Workspace Configuration & Scripts
- **Root `package.json` (`/Users/JOHN/Desktop/Screen-Ai/package.json`)**:
  - Defines npm workspaces:
    ```json
    "workspaces": [
      "packages/*",
      "apps/*"
    ]
    ```
  - Defines the following build, check, and test scripts:
    - Line 11: `"dev": "npm run --workspace=@screenai/web dev"`
    - Line 12: `"dev:all": "concurrently -n \"API,WEB\" -c \"blue,green\" \"npm run dev:api\" \"npm run dev:web\""`
    - Line 13: `"dev:api": "npm run --workspace=@screenai/api dev"`
    - Line 14: `"dev:web": "npm run --workspace=@screenai/web dev"`
    - Line 15: `"dev:extension": "npm run --workspace=@screenai/extension dev"`
    - Line 16: `"build": "npm run build:shared && npm run build:api && npm run build:extension && npm run build:web"`
    - Line 17: `"build:shared": "npm run --workspace=@screenai/shared build"`
    - Line 18: `"build:api": "npm run --workspace=@screenai/api build"`
    - Line 19: `"build:web": "npm run --workspace=@screenai/web build"`
    - Line 20: `"build:extension": "npm run --workspace=@screenai/extension build"`
    - Line 21: `"typecheck": "npm run --workspace=@screenai/shared typecheck && npm run --workspace=@screenai/api typecheck && npm run --workspace=@screenai/extension typecheck && npm run --workspace=@screenai/web typecheck"`
    - Line 22: `"test": "npm run test:api"`
    - Line 23: `"test:api": "npm run --workspace=@screenai/api test"`
- **Root `tsconfig.json` (`/Users/JOHN/Desktop/Screen-Ai/tsconfig.json`)**:
  - Base TypeScript compiler options: `"target": "ES2022"`, `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`, `"strict": true`, `"declaration": true`, `"declarationMap": true`.

---

### 1.2 Packages Directory: Shared Package (`packages/shared`)
- **Package Manifest (`packages/shared/package.json`)**:
  - Name: `"@screenai/shared"`, version: `"1.0.0"`.
  - Main entry: `"./dist/index.js"`.
  - Types entry: `"./dist/index.d.ts"`.
  - Scripts: `"build": "tsc"`, `"typecheck": "tsc --noEmit"`.
- **TypeScript Configuration (`packages/shared/tsconfig.json`)**:
  - `"target": "ES2022"`
  - `"module": "CommonJS"`
  - `"moduleResolution": "node"`
  - `"outDir": "./dist"`, `"rootDir": "./src"`.
- **Exported Interfaces & Types (`packages/shared/src/types.ts`)**:
  - Page categorization: `PageCategory = 'article' | 'documentation' | 'github' | 'news' | 'educational' | 'general'`.
  - Structural DOM models:
    - `HeadingItem`: `{ level: number; text: string; }`
    - `CodeSnippet`: `{ language?: string; code: string; }`
    - `LinkItem`: `{ text: string; href: string; }`
    - `WebpageContent`: `{ url: string; title: string; domain: string; description?: string; author?: string; publishedTime?: string; headings: HeadingItem[]; mainText: string; wordCount: number; readingTimeMinutes: number; codeSnippets: CodeSnippet[]; links: LinkItem[]; category: PageCategory; extractedAt: number; truncated?: boolean; }`
  - Summarization contracts:
    - `SummaryMode = 'quick' | 'detailed' | 'takeaways'`
    - `SummarizeRequest`: `{ page: WebpageContent; mode: SummaryMode; customPrompt?: string; }`
    - `KeySection`: `{ title: string; content: string; }`
    - `SummarizeResponse`: `{ summary: string; mode: SummaryMode; mainTopic?: string; keyTakeaways: string[]; whyItMatters?: string; whatToExploreNext?: string; keySections?: KeySection[]; references?: string[]; confidenceNote?: string; }`
  - Chat contracts:
    - `ChatMessage`: `{ id: string; role: 'user' | 'assistant' | 'system'; content: string; timestamp: number; isPageGrounded?: boolean; references?: string[]; }`
    - `ChatRequest`: `{ page: WebpageContent; messages: ChatMessage[]; question: string; }`
    - `ChatResponse`: `{ reply: string; isPageGrounded: boolean; references?: string[]; }`
  - System health & error contracts:
    - `HealthResponse`: `{ status: 'ok' | 'degraded' | 'error'; provider: string; model: string; hasKey: boolean; version: string; timestamp: string; }`
    - `ApiErrorResponse`: `{ error: string; code?: string; details?: unknown; }`
- **Exported Utilities (`packages/shared/src/utils.ts`)**:
  - `detectPageCategory(url: string, title?: string, text?: string): PageCategory`: URL hostname/path heuristics + length checks.
  - `estimateReadingTime(wordCount: number): number`: Assumes 200 words/min, minimum 1 minute.
  - `sanitizeText(text: string): string`: Collapses whitespace and line breaks.
  - `truncateText(text: string, maxLength: number): { text: string; truncated: boolean; }`: Slices at boundary and appends warning note.
- **Entrypoint (`packages/shared/src/index.ts`)**:
  - `export * from './types';`
  - `export * from './utils';`

---

### 1.3 Monorepo Consuming Apps & Dependency Mapping
The monorepo contains three consuming applications:

| Application | Path | Workspace Name | Internal Dependency | Consumed Interfaces & Functions |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | `apps/api` | `@screenai/api` | `"@screenai/shared": "*"` | `truncateText`, `HealthResponse`, `ApiErrorResponse`, `SummarizeRequest`, `SummarizeResponse`, `ChatRequest`, `ChatResponse`, `WebpageContent` |
| **Browser Extension** | `apps/extension` | `@screenai/extension` | `"@screenai/shared": "*"` | `WebpageContent`, `HeadingItem`, `CodeSnippet`, `LinkItem`, `detectPageCategory`, `estimateReadingTime`, `SummarizeRequest`, `SummarizeResponse`, `ChatRequest`, `ChatResponse`, `HealthResponse`, `SummaryMode`, `ChatMessage` |
| **Public Website** | `apps/web` | `@screenai/web` | `"@screenai/shared": "*"` | Listed in `package.json:dependencies`, but operates with local simulated article mock models in `InteractiveDemo.tsx` |

---

### 1.4 Empirical Build, Typecheck, and Test Execution Results
All scripts defined in the root `package.json` were tested on Node.js v24.12.0 and npm 11.6.2 after `npm install`:

1. **`npm run build:shared`**:
   - **Command:** `npm run --workspace=@screenai/shared build` (`tsc`)
   - **Exit Code:** `0` (Success)
   - **Artifacts Generated:** `packages/shared/dist/index.js`, `index.d.ts`, `types.js`, `types.d.ts`, `utils.js`, `utils.d.ts`.

2. **`npm run build:api`**:
   - **Command:** `npm run --workspace=@screenai/api build` (`tsc`)
   - **Exit Code:** `0` (Success)
   - **Artifacts Generated:** `apps/api/dist/index.js`, `app.js`, `config.js`, `validation.js`, `providers/`.

3. **`npm run build:extension`**:
   - **Command:** `npm run --workspace=@screenai/extension build` (`vite build`)
   - **Exit Code:** `1` (Failure)
   - **Verbatim Error:**
     ```text
     error during build:
     src/services/pageExtractor.ts (7:2): "estimateReadingTime" is not exported by "../../packages/shared/dist/index.js", imported by "src/services/pageExtractor.ts".
     file: /Users/JOHN/Desktop/Screen-Ai/apps/extension/src/services/pageExtractor.ts:7:2

     5:   LinkItem,
     6:   detectPageCategory,
     7:   estimateReadingTime,
          ^
     8: } from '@screenai/shared';
     ```

4. **`npm run build:web`**:
   - **Command:** `npm run --workspace=@screenai/web build` (`tsc && vite build`)
   - **Exit Code:** `0` (Success)
   - **Artifacts Generated:** `apps/web/dist/index.html`, `dist/assets/index-*.js`, `dist/assets/index-*.css`.

5. **`npm run typecheck`**:
   - **Command:** `npm run --workspace=@screenai/shared typecheck && npm run --workspace=@screenai/api typecheck && npm run --workspace=@screenai/extension typecheck && npm run --workspace=@screenai/web typecheck`
   - **Exit Code:** `2` (Failure)
   - **Shared typecheck:** Passed.
   - **API typecheck:** Passed.
   - **Extension typecheck:** Failed with TS error TS2339:
     ```text
     src/sidepanel/SidePanel.tsx:103:23 - error TS2339: Property 'innerText' does not exist on type 'Element'.

     103                     ).innerText.slice(0, 40000);
                               ~~~~~~~~~

     Found 1 error in src/sidepanel/SidePanel.tsx:103
     ```
   - **Web typecheck:** Not reached due to short-circuit on extension failure. (When run independently, `apps/web` typecheck passes).

6. **`npm test`**:
   - **Command:** `npm run test:api` (`vitest run` in `apps/api`)
   - **Exit Code:** `1` (Failure)
   - **Test Results:** 7 tests total, 6 passed, 1 failed:
     ```text
     FAIL  test/api.test.ts > ScreenAI API Endpoints > POST /api/chat should answer beginner questions with structured simplicity
     AssertionError: expected '### simple explanation of "understand…' to contain 'beginner'

     - Expected
     + Received

     - beginner
     + ### simple explanation of "understanding react hooks architecture"
     +
     + imagine you are explaining this to a newcomer: **understanding react hooks architecture** is essentially about helping you understand example.com's core message without getting lost in technical jargon.
     ```

---

## 2. Logic Chain

### 2.1 Why `build:extension` Failed (CommonJS Dynamic Re-export in Vite/Rollup)
1. `packages/shared/tsconfig.json` compiles TypeScript to CommonJS (`"module": "CommonJS"`).
2. `packages/shared/src/index.ts` uses wildcard re-exports: `export * from './types'; export * from './utils';`.
3. In `packages/shared/dist/index.js`, the TypeScript compiler outputs runtime helper loops:
   `__exportStar(require("./utils"), exports);`.
4. When `apps/extension` runs `vite build`, Rollup bundles ESM modules and attempts static named import analysis on `@screenai/shared`.
5. Rollup cannot statically infer properties attached to `exports` via dynamic runtime loops in CommonJS files, so Rollup asserts that `estimateReadingTime` is not exported by `packages/shared/dist/index.js`.
6. **Solution/Fix Options:**
   - Option A (Recommended for Vite monorepos): Add alias in `apps/extension/vite.config.ts`:
     ```ts
     resolve: {
       alias: {
         '@screenai/shared': resolve(__dirname, '../../packages/shared/src'),
       },
     },
     ```
   - Option B: Explicitly re-export all named functions in `packages/shared/src/index.ts` (e.g. `export { detectPageCategory, estimateReadingTime, sanitizeText, truncateText } from './utils';`).
   - Option C: Provide dual ESM/CJS build or set `"type": "module"` in `packages/shared/package.json`.

---

### 2.2 Why `typecheck` Failed in `apps/extension`
1. In `apps/extension/src/sidepanel/SidePanel.tsx:101-103`:
   ```ts
   const mainText = (
     document.querySelector('article, main, [role="main"]') || document.body
   ).innerText.slice(0, 40000);
   ```
2. In TypeScript's `lib.dom.d.ts`, `document.querySelector` returns `Element | null`.
3. While `HTMLElement` has the `.innerText` property, the generic DOM `Element` interface does not define `innerText` (only `textContent`).
4. **Solution/Fix:** Cast the matched element to `HTMLElement`:
   ```ts
   const container = (document.querySelector('article, main, [role="main"]') || document.body) as HTMLElement;
   const mainText = (container.innerText || container.textContent || '').slice(0, 40000);
   ```

---

### 2.3 Why `npm test` Failed in `apps/api`
1. Test line in `apps/api/test/api.test.ts:114`:
   `expect(res.body.reply.toLowerCase()).toContain('beginner');`
2. In `apps/api/src/providers/mockProvider.ts:134`:
   The mock provider generates:
   `Imagine you are explaining this to a newcomer: ...`
   It uses the word "newcomer" rather than "beginner".
3. **Solution/Fix:** Update the copy in `MockAiProvider.chat` to include "beginner":
   `Imagine you are explaining this to a beginner newcomer: ...`

---

### 2.4 Acceptance Criteria Test Suite Coverage Gaps
The acceptance criterion states:
> *"Automated tests (npm test) verify API validation, rate limiting, and core extraction utilities"*

Current test suite analysis (`apps/api/test/api.test.ts`):
1. **Rate Limiting (Gap):** Rate limiting is configured in `apps/api/src/app.ts:75-84`, but `api.test.ts` has zero tests checking rate limits (e.g. rapid requests returning HTTP 429 `RATE_LIMIT_EXCEEDED` or checking rate limit headers).
2. **Core Extraction Utilities (Gap):** Neither `apps/api/test/` nor `packages/shared/` has unit tests for:
   - `detectPageCategory`
   - `estimateReadingTime`
   - `sanitizeText`
   - `truncateText`
3. **Summarize Takeaways Mode (Gap):** Tested modes are only `'quick'` and `'detailed'`; `'takeaways'` mode is untested.
4. **Chat Ungrounded Response (Gap):** Chat queries outside page context where `isPageGrounded: false` are untested.
5. **CORS Rejection (Gap):** Unauthorized origins returning HTTP 403 are untested.

---

## 3. Caveats

1. **Read-Only Scope Compliance:** As an Explorer agent, no application source files or configurations were modified during this survey. Fixes and proposals are communicated via this report for downstream implementers.
2. **Node Modules Installation:** `npm install` was run to enable empirical execution of build and test scripts. `node_modules` is gitignored and does not affect version-controlled source files.
3. **External AI Provider Secrets:** Testing of external LLM APIs (OpenAI and Google Gemini) was verified structurally via provider classes. In local development and automated testing, the backend operates in deterministic intelligent fallback mode via `MockAiProvider`.
4. **No Other Discrepancies Found:** All other components, assets, icons, and HTML shells conform to the monorepo architecture.

---

## 4. Conclusion & Feature Inventory

The ScreenAI monorepo architecture is robust, clean, and comprehensive. The three components (Marketing Website, Chrome Manifest V3 Extension, and Secure Node.js Backend) share contracts smoothly through `@screenai/shared`.

To reach 100% acceptance criteria pass rates across all build and test commands, exactly three minor code adjustments and four unit test additions are required during the implementation phase.

### Complete Feature Inventory

```
========================================================================================
FEATURE INVENTORY & STATUS MATRIX
========================================================================================
Component               Requirement   Feature / File               Status     Notes
----------------------------------------------------------------------------------------
Shared Core             Core Types    packages/shared/src/types.ts Complete   Full data models
Shared Core             Utilities     packages/shared/src/utils.ts Complete   4 core utilities
Shared Core             Build         packages/shared build (tsc)  PASSING    Clean CJS/types
----------------------------------------------------------------------------------------
Backend API             R3            apps/api/src/app.ts          Complete   Express server
Backend API             R3            apps/api/src/validation.ts   Complete   Zod schemas
Backend API             R3            apps/api/src/providers/     Complete   3 AI providers
Backend API             R3            Build (tsc)                  PASSING    Clean compile
Backend API             R3            npm test (vitest)            1 FAIL     Copy mismatch
Backend API             R3            Test Coverage Gaps           INCOMPLETE Missing RL & util tests
----------------------------------------------------------------------------------------
Browser Extension       R2            Manifest V3 (manifest.json)  Complete   Sidepanel API
Browser Extension       R2            Background Service Worker    Complete   Tab tracking
Browser Extension       R2            Content Extractor            Complete   Clean DOM scrape
Browser Extension       R2            React Side Panel UI          Complete   Overview/Summary/Chat
Browser Extension       R2            Build (vite build)           FAILING    CJS named re-export
Browser Extension       R2            Typecheck (tsc --noEmit)     FAILING    Element.innerText TS2339
----------------------------------------------------------------------------------------
Public Website          R1            Hero Section                 Complete   Simulated mockup
Public Website          R1            Interactive Local Demo       Complete   Zero API key demo
Public Website          R1            How It Works (3 Steps)       Complete   Visual narrative
Public Website          R1            Product Features Matrix      Complete   8 capabilities
Public Website          R1            Developer Install Guide      Complete   Unpacked setup
Public Website          R1            Transparent Privacy Policy   Complete   Security pillars
Public Website          R1            Build (tsc && vite build)    PASSING    Production bundle
========================================================================================
```

### Proposed Code Adjustments for Implementer

#### 1. Fix `apps/extension/vite.config.ts` (Resolves `build:extension`)
```ts
// In apps/extension/vite.config.ts:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@screenai/shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../../dist-extension'),
    emptyOutDir: true,
    // ... rest unchanged
```

#### 2. Fix `apps/extension/src/sidepanel/SidePanel.tsx:101-104` (Resolves `typecheck`)
```ts
// Replace:
const mainText = (
  document.querySelector('article, main, [role="main"]') || document.body
).innerText.slice(0, 40000);

// With:
const container = (document.querySelector('article, main, [role="main"]') || document.body) as HTMLElement;
const mainText = (container.innerText || container.textContent || '').slice(0, 40000);
```

#### 3. Fix `apps/api/src/providers/mockProvider.ts:134` (Resolves existing failing test)
```ts
// In MockAiProvider.chat:
if (lowerQuestion.includes('beginner') || lowerQuestion.includes('explain like i\'m 5') || lowerQuestion.includes('eli5')) {
  return {
    reply: `### Simple Explanation of "${page.title}"\n\nImagine you are explaining this to a beginner newcomer: **${page.title}** is essentially about helping you understand ${page.domain}'s core message without getting lost in technical jargon.\n\n- **The main idea:** It focuses on ${page.headings[0]?.text || 'the primary subject'} in an approachable way.\n- **Why people care:** It solves real problems by making things clearer and easier to follow.\n- **Bottom line:** You get the main benefits without needing years of background knowledge.`,
    isPageGrounded: true,
    references: page.headings.slice(0, 2).map((h) => h.text),
  };
}
```

#### 4. Add Missing Tests to `apps/api/test/api.test.ts` (Fulfills Acceptance Criteria #4)
- **Rate limiting test**: Test with a fast loop or test express-rate-limit headers.
- **Extraction utilities unit tests**: Add tests verifying `detectPageCategory`, `estimateReadingTime`, `sanitizeText`, and `truncateText`.
- **Takeaways mode test**: `POST /api/summarize` with `mode: 'takeaways'` returning `keyTakeaways`, `whyItMatters`, `whatToExploreNext`.
- **Ungrounded query test**: `POST /api/chat` with arbitrary unrelated question returning `isPageGrounded: false`.

---

## 5. Verification Method

To independently verify the status and subsequent fixes across the codebase:

```bash
# 1. Clean installation check
npm install

# 2. Build shared package
npm run build:shared

# 3. Build backend service
npm run build:api

# 4. Build extension package (targets dist-extension/)
npm run build:extension

# 5. Build public website package
npm run build:web

# 6. Typecheck across all 4 workspaces
npm run typecheck

# 7. Run full automated test suite
npm test
```

### Invalidation Conditions
- Any change to `packages/shared/src/types.ts` that breaks backwards compatibility with `pageContentSchema` in `apps/api/src/validation.ts` or `extractPageContentFromDocument` in `apps/extension/src/services/pageExtractor.ts`.
- Manifest V3 bundle output path diverging from `dist-extension/` in `apps/extension/vite.config.ts`.

