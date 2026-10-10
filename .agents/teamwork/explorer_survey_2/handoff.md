# Survey Report: ScreenAI Backend API (R3)

**Author:** Explorer 2  
**Date:** 2026-10-10T05:18:00Z  
**Target:** R3 (ScreenAI Backend API) Survey & Gap Analysis  
**Working Directory:** `/Users/JOHN/Desktop/Screen-Ai/.agents/teamwork/explorer_survey_2`

---

## 1. Observation

### 1.1 Root Monorepo & Backend Architecture
- **Root `package.json`**:
  - Defines workspaces `packages/*` and `apps/*`.
  - Backend scripts defined:
    - Line 13: `"dev:api": "npm run --workspace=@screenai/api dev"`
    - Line 18: `"build:api": "npm run --workspace=@screenai/api build"`
    - Line 22: `"test": "npm run test:api"`
    - Line 23: `"test:api": "npm run --workspace=@screenai/api test"`
- **Backend Directory Structure** (`apps/api`):
  - `apps/api/package.json`
  - `apps/api/tsconfig.json`
  - `apps/api/src/config.ts`
  - `apps/api/src/validation.ts`
  - `apps/api/src/app.ts`
  - `apps/api/src/index.ts`
  - `apps/api/src/providers/types.ts`
  - `apps/api/src/providers/index.ts`
  - `apps/api/src/providers/mockProvider.ts`
  - `apps/api/src/providers/openaiProvider.ts`
  - `apps/api/src/providers/geminiProvider.ts`
  - `apps/api/test/api.test.ts`
- **Shared Contracts** (`packages/shared`):
  - `packages/shared/src/types.ts`: Defines `WebpageContent`, `HeadingItem`, `CodeSnippet`, `LinkItem`, `PageCategory`, `SummaryMode`, `SummarizeRequest`, `SummarizeResponse`, `ChatMessage`, `ChatRequest`, `ChatResponse`, `HealthResponse`, `ApiErrorResponse`.
  - `packages/shared/src/utils.ts`: Defines `detectPageCategory`, `estimateReadingTime`, `sanitizeText`, `truncateText`.

### 1.2 Express Server & Middleware Stack (`apps/api/src/app.ts`)
- **Server Initialization**: `createApp()` creates Express instance and instantiates provider adapter via `createAiProvider()`.
- **Security Headers**: `helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })` (lines 20–24).
- **CORS Handling** (lines 27–70):
  - Allows requests with no origin (`!origin` -> callback(null, true)).
  - Allows browser extension schemes: `origin.startsWith('chrome-extension://')` or `origin.startsWith('moz-extension://')`.
  - Enforces optional `config.extensionId` matching when configured.
  - Allows `config.webOrigin` and localhost origins (`http://localhost:*`, `http://127.0.0.1:*`).
  - Disallows unlisted origins by passing `new Error('Origin ... not allowed by CORS')` to callback.
- **Payload Limits**: `app.use(express.json({ limit: '2mb' }))` (line 72).
- **Rate Limiting**: `express-rate-limit` configured with `windowMs: config.rateLimitWindowMs` (60,000ms), `max: config.rateLimitMax` (60 req/min), standard headers enabled (lines 75–84). Applied directly to `/api/summarize` (line 102) and `/api/chat` (line 128). Health endpoint is unthrottled.
- **404 Handler**: Catches unmatched routes, returning HTTP 404 with `{ error: 'Endpoint not found: ${req.method} ${req.path}', code: 'NOT_FOUND' }` (lines 152–157).
- **Global Error Handling** (lines 160–185):
  - Intercepts `ZodError`, returning HTTP 400 with `{ error: 'Invalid request data: ...', code: 'VALIDATION_ERROR', details: err.flatten() }`.
  - Maps CORS errors to HTTP 403.
  - Returns HTTP 500 without leaking stack traces or sensitive credentials.

### 1.3 Endpoints & Schemas (`apps/api/src/app.ts` & `apps/api/src/validation.ts`)
- **`GET /api/health`** (lines 87–97):
  - Returns HTTP 200 with schema `HealthResponse`: `{ status: 'ok', provider: string, model: string, hasKey: boolean, version: '1.0.0', timestamp: string }`.
- **`POST /api/summarize`** (lines 100–123):
  - Validates body against `summarizeRequestSchema`:
    - `page`: `pageContentSchema` (url as valid URL, title 1–500 chars, domain min 1, mainText min 10, headings, codeSnippets, links, category).
    - `mode`: enum `['quick', 'detailed', 'takeaways']` (default `'quick'`).
    - `customPrompt`: optional string max 1000 chars.
  - Content truncation: Checks `if (validated.page.mainText.length > config.maxContentChars)` (default 50,000 chars), invokes `truncateText` from `@screenai/shared`, sets `validated.page.truncated = true`.
  - Executes `provider.summarize(validated)`.
  - Returns HTTP 200 with `SummarizeResponse` (`summary`, `mode`, `mainTopic`, `keyTakeaways`, `whyItMatters`, `whatToExploreNext`, `keySections`, `references`, `confidenceNote`).
- **`POST /api/chat`** (lines 126–149):
  - Validates body against `chatRequestSchema`:
    - `page`: `pageContentSchema`.
    - `messages`: array of `chatMessageSchema` (`id`, `role`, `content`, `timestamp`, `isPageGrounded?`, `references?`).
    - `question`: string min 1, max 2000 chars.
  - Content truncation: Protects token budget with `truncateText`.
  - Executes `provider.chat(validated)`.
  - Returns HTTP 200 with `ChatResponse` (`reply`, `isPageGrounded: boolean`, `references?`).

### 1.4 Pluggable AI Provider Adapter Architecture (`apps/api/src/providers/`)
- **Interface** (`types.ts`): `AiProviderAdapter` requiring `name`, `model`, `isConfigured`, `summarize(request)`, `chat(request)`.
- **Factory** (`index.ts`): `createAiProvider()` inspects `config.aiApiKey` and `config.aiProvider`:
  - If `!aiApiKey || aiApiKey === 'mock' || aiApiKey === 'your_ai_api_key_here'`, returns `MockAiProvider`.
  - If `aiProvider === 'gemini'`, returns `GeminiProvider(aiApiKey, aiModel)`.
  - Else returns `OpenAiCompatibleProvider(aiApiKey, aiModel, aiBaseUrl)`.
- **`MockAiProvider`** (`mockProvider.ts`):
  - Offline heuristic engine (`name = 'mock'`, `model = 'screenai-heuristic-v1'`).
  - Summarize: parses sentences and headings, adapts structure by category (`documentation`, `github`, `news`, `article`, `general`), branches by `mode` (`quick`, `takeaways`, `detailed`).
  - Chat: handles beginner queries ("explain like I'm 5"), code queries, prerequisite queries, sentence keyword matching (`isPageGrounded: true`), and ungrounded fallbacks (`isPageGrounded: false`).
- **`OpenAiCompatibleProvider`** (`openaiProvider.ts`):
  - Compatible with OpenAI, Ollama, Groq, OpenRouter, DeepSeek.
  - Prompts enforce anti-prompt-injection boundaries and page grounding.
  - Requests JSON output format (`response_format: { type: 'json_object' }`).
  - 35s timeout via `AbortController`.
- **`GeminiProvider`** (`geminiProvider.ts`):
  - Targets Google Gemini API v1beta `generateContent`.
  - Enforces `responseMimeType: 'application/json'`.
  - Anti-injection security instructions and grounding rules.
  - 35s timeout via `AbortController`.

### 1.5 Test Suite Observation (`apps/api/test/api.test.ts`)
- **Current Tests**:
  - `GET /api/health`: 200 OK, checks status, provider, model, version.
  - `POST /api/summarize`: Quick mode 200 OK.
  - `POST /api/summarize`: Detailed mode 200 OK.
  - `POST /api/summarize`: Invalid input 400 VALIDATION_ERROR.
  - `POST /api/chat`: Grounded answer 200 OK (`isPageGrounded: true`).
  - `POST /api/chat`: Beginner answer 200 OK.
  - `GET /api/unknown`: 404 NOT_FOUND.
- **Execution Result**:
  - Command: `npm test`
  - Output: `sh: vitest: command not found (exit code 127)`.
  - Reason: `node_modules` does not exist in workspace; `npm install` has not yet been executed.

---

## 2. Logic Chain

1. **Monorepo Dependencies & Build Lifecycle**:
   - The root workspace specifies `packages/shared` as a dependency for `apps/api` (`"@screenai/shared": "*"` in `apps/api/package.json:14`).
   - Root build scripts establish that `npm run build:shared` compiles TypeScript declarations and CommonJS bundles into `packages/shared/dist/`, which are consumed by `apps/api` via NodeNext module resolution.
   - Zero dependencies are installed currently (`node_modules` does not exist), so automated tests and TypeScript compilation require an initial workspace installation step before build verification can pass.

2. **Compliance with Requirement R3**:
   - *Express TS Server*: Implemented in `apps/api/src/app.ts` and `apps/api/src/index.ts`.
   - *Route Structure*: `/api/health`, `/api/summarize`, and `/api/chat` are fully implemented with exact method signatures and return types matching contracts in `@screenai/shared`.
   - *Zod Input Validation*: Implemented in `apps/api/src/validation.ts` covering URL validity, character length boundaries, structure, and enums.
   - *Payload Limits*: Network payload capped at `2mb` in Express JSON body parser; text payload capped at `config.maxContentChars` (50,000 chars) via `truncateText`.
   - *Rate Limiting*: Implemented via `express-rate-limit` (60 req/min default), protecting summarize and chat endpoints.
   - *CORS Handling*: Implemented in `apps/api/src/app.ts`, allowing chrome/moz extensions and localhost web origins while blocking foreign origins.
   - *Secrets Isolation*: `AI_API_KEY` is loaded on the server and never exposed in client bundles or responses.
   - *Pluggable AI Providers*: `OpenAiCompatibleProvider`, `GeminiProvider`, and `MockAiProvider` implemented with uniform `AiProviderAdapter` interface.

3. **Gap Analysis against Acceptance Criteria**:
   - Acceptance Criteria #4 states: *"Automated tests (npm test) verify API validation, rate limiting, and core extraction utilities"*.
   - **Gap 1 (Rate Limiting Test)**: While rate limiting is implemented in `apps/api/src/app.ts`, `apps/api/test/api.test.ts` contains ZERO assertions testing rate limit behavior (e.g., verifying `ratelimit-limit`/`ratelimit-remaining` headers or HTTP 429 `RATE_LIMIT_EXCEEDED` response).
   - **Gap 2 (Core Extraction Utilities Test)**: Neither `apps/api/test/` nor `packages/shared/` contains tests for the 4 core extraction utilities (`detectPageCategory`, `estimateReadingTime`, `sanitizeText`, `truncateText`). Because `npm test` delegates exclusively to `npm run test:api`, utility tests must be added to `apps/api/test/` (or shared package tests hooked into `npm test`) to satisfy the acceptance criterion.
   - **Gap 3 (Summarize Mode 'takeaways')**: `api.test.ts` tests `'quick'` and `'detailed'`, but omits an explicit test for `mode: 'takeaways'`.
   - **Gap 4 (Chat Ungrounded Test)**: `api.test.ts` tests questions that are grounded, but does not assert the contract for out-of-domain queries where `isPageGrounded` returns `false`.
   - **Gap 5 (CORS Rejection Test)**: No test verifies that unauthorized origins receive HTTP 403 from the CORS handler.

---

## 3. Caveats

1. **Uninstalled Node Modules**: Investigation confirmed that `node_modules` is not yet installed in the workspace root or apps/packages. Commands such as `vitest`, `tsc`, and `tsx` cannot execute until `npm install` is run. As an Explorer under read-only constraints, workspace package installation was not performed.
2. **Provider Network Calls**: `OpenAiCompatibleProvider` and `GeminiProvider` make live network fetch requests to upstream AI endpoints (`https://api.openai.com/v1/chat/completions` and `https://generativelanguage.googleapis.com/v1beta/...`). In test environments without live API keys, testing relies on `MockAiProvider` or mocked network responses.
3. **No Caveats on Architecture**: The existing architecture of `apps/api` cleanly matches the contracts needed by `apps/extension` and `packages/shared`.

---

## 4. Conclusion & Feature Inventory for R3

The ScreenAI Backend API (R3) codebase is well-structured, modular, and adheres to the specified design patterns. However, specific enhancements and test additions are required during the implementation phase to fully satisfy acceptance criteria.

### Detailed Feature Inventory for R3

| Feature ID | Feature Name | Implementation File(s) | Current Status | Notes / Required Action |
|:---|:---|:---|:---|:---|
| **R3.1** | **Express TypeScript Foundation** | `apps/api/src/app.ts`, `apps/api/src/index.ts` | **Complete** | Server setup with Helmet, CORS, body parser, 404 handler, and global error handler. |
| **R3.2** | **CORS Configuration** | `apps/api/src/app.ts:27-70` | **Complete** | Supports `chrome-extension://*`, `moz-extension://*`, optional `EXTENSION_ID`, web origin (`http://localhost:5173`), and localhost dev ports. |
| **R3.3** | **Rate Limiting & Payload Limits** | `apps/api/src/app.ts:72-84` | **Complete** | 2MB JSON body limit, 50,000 char token truncation via `truncateText`, 60 req/min rate limit with standard headers. |
| **R3.4** | **Input Validation (Zod)** | `apps/api/src/validation.ts` | **Complete** | `pageContentSchema`, `summarizeRequestSchema`, `chatMessageSchema`, `chatRequestSchema` with strict types and defaults. |
| **R3.5** | **`GET /api/health`** | `apps/api/src/app.ts:87-97` | **Complete** | Returns provider name, model, configuration status, version, and ISO timestamp. Excluded from rate limits. |
| **R3.6** | **`POST /api/summarize`** | `apps/api/src/app.ts:100-123` | **Complete** | Validates schema, truncates oversized content, delegates to provider, returns structured `SummarizeResponse`. |
| **R3.7** | **`POST /api/chat`** | `apps/api/src/app.ts:126-149` | **Complete** | Validates schema, supports message history, answers grounded in page text, returns `isPageGrounded` flag. |
| **R3.8** | **AI Adapter Interface & Factory** | `apps/api/src/providers/types.ts`, `apps/api/src/providers/index.ts` | **Complete** | Pluggable `AiProviderAdapter` contract with unified factory choosing mock, gemini, or openai. |
| **R3.9** | **Intelligent Offline Mock Provider** | `apps/api/src/providers/mockProvider.ts` | **Complete** | Category-aware heuristic synthesis, 3 summary modes, grounded chat, beginner explanations, code analysis. |
| **R3.10** | **OpenAI-Compatible Provider** | `apps/api/src/providers/openaiProvider.ts` | **Complete** | JSON mode, anti-prompt-injection system prompt, grounding instructions, 35s timeout. Works with OpenAI/Ollama/Groq. |
| **R3.11** | **Google Gemini Provider** | `apps/api/src/providers/geminiProvider.ts` | **Complete** | REST v1beta integration, `responseMimeType: application/json`, anti-injection prompt, 35s timeout. |
| **R3.12** | **Provider Secrets Isolation** | `apps/api/src/config.ts` | **Complete** | Keys isolated to server environment, never exposed to clients; error handler masks sensitive details. |
| **R3.13** | **API Validation Tests** | `apps/api/test/api.test.ts` | **Complete** | Tests invalid URL rejection, missing required fields, 400 VALIDATION_ERROR. |
| **R3.14** | **Rate Limiting Tests** | `apps/api/test/api.test.ts` | **Needs Implementation** | Acceptance criteria requires verifying rate limiting in automated tests. Need tests for rate limit headers / 429 status. |
| **R3.15** | **Core Extraction Utility Tests** | `apps/api/test/` or `packages/shared/` | **Needs Implementation** | Acceptance criteria requires verifying core extraction utilities in `npm test`. Need unit tests for `detectPageCategory`, `estimateReadingTime`, `sanitizeText`, `truncateText`. |
| **R3.16** | **Summarize 'takeaways' & Chat Ungrounded Tests** | `apps/api/test/api.test.ts` | **Enhancement** | Add explicit tests for `takeaways` mode and out-of-context question answering (`isPageGrounded: false`). |

---

## 5. Verification Method

Once dependencies are installed (`npm install`) during the implementation phase, the backend API and tests can be independently verified using the following exact commands:

1. **Verify Package Compilation**:
   ```bash
   npm run build:shared
   npm run build:api
   ```
   *Expected outcome:* `packages/shared/dist/` and `apps/api/dist/` are generated without TypeScript errors.

2. **Verify TypeScript Typechecking**:
   ```bash
   npm run --workspace=@screenai/api typecheck
   ```
   *Expected outcome:* Exit code 0, zero diagnostic errors.

3. **Run API Test Suite**:
   ```bash
   npm test
   # or
   npm run test:api
   ```
   *Expected outcome:* All Vitest test suites execute and pass.

4. **Verify Live Endpoint Behavior (Manual / Integration)**:
   ```bash
   # Start server
   npm run dev:api
   
   # Health check
   curl -s http://localhost:3001/api/health
   # Expected: {"status":"ok","provider":"mock","model":"screenai-heuristic-v1","hasKey":false,"version":"1.0.0",...}
   
   # Summarize check
   curl -s -X POST http://localhost:3001/api/summarize \
     -H "Content-Type: application/json" \
     -d '{"page":{"url":"https://example.com","title":"Test","domain":"example.com","mainText":"This is a comprehensive test article demonstrating ScreenAI backend capabilities."},"mode":"quick"}'
   # Expected: HTTP 200 with JSON body containing summary, mode, and keyTakeaways.
   ```

5. **Invalidation Conditions**:
   - Any failure in Zod input validation returning HTTP 500 instead of HTTP 400.
   - Any rate-limiting failure where headers are omitted or requests are unbounded.
   - Any leakage of `AI_API_KEY` in API error responses.
   - Missing test coverage for rate limiting or extraction utilities under `npm test`.
