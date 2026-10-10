# Original User Request

## 2026-10-10T05:08:32Z

ScreenAI is a complete AI-powered browser assistant that understands the webpage a user is viewing, summarizes it, extracts important information, and answers questions about its content. It consists of three integrated components in a single monorepo: a public marketing website, a Chromium Manifest V3 browser extension with side panel, and a secure Node.js backend.

Working directory: /Users/JOHN/Desktop/Screen-Ai
Integrity mode: development

## Requirements

### R1. ScreenAI Public Website
A modern, dark-themed public website introducing ScreenAI. Includes a striking hero section, an interactive product demo simulating the extension and webpage locally without requiring an API key, a 3-step "How it works" visual narrative, product feature capabilities, an honest developer installation guide for loading unpacked extensions in Chrome/Edge, a transparent privacy statement, and working navigation.

### R2. ScreenAI Browser Extension (Manifest V3)
A Chromium browser extension utilizing Manifest V3 and the Chrome Side Panel API. Features a toolbar action that opens the side panel, active tab detection, robust semantic DOM content extraction (cleaning noise, scripts, ads, and form fields), three summary modes (Quick 3-5 sentences, Detailed breakdown, Key takeaways with "Why this matters" and "What to explore next"), in-page contextual chat grounded in page text with markdown and code snippet support, and tab-switch detection that invalidates stale context. Builds to a standalone dist-extension/ directory ready for "Load unpacked".

### R3. ScreenAI Backend API
A secure Node.js Express TypeScript server providing /api/health, /api/summarize, and /api/chat. Validates all inputs using Zod, enforces rate limiting and payload limits, handles CORS for local web and extension origins, isolates AI provider secrets, and implements a pluggable provider adapter supporting OpenAI-compatible APIs, Google Gemini, and an intelligent local fallback engine for offline/developer use.

## Acceptance Criteria

### Build & Package Verification
- [ ] npm run build:shared builds shared types and utilities without errors
- [ ] npm run build:api compiles the backend service
- [ ] npm run build:extension generates a valid Manifest V3 directory at dist-extension/ containing manifest.json, sidepanel.html, popup.html, background.js, content.js, and assets
- [ ] npm run build:web builds the public website production bundle
- [ ] npm run typecheck passes across all packages and apps with zero TypeScript errors

### Functional Verification
- [ ] API health endpoint (GET /api/health) responds with HTTP 200 and provider status
- [ ] Summarization endpoint (POST /api/summarize) validates requests, respects modes (quick, detailed, takeaways), and returns structured responses
- [ ] Chat endpoint (POST /api/chat) grounds answers in provided webpage context and distinguishes page facts from general knowledge
- [ ] Automated tests (npm test) verify API validation, rate limiting, and core extraction utilities
- [ ] Extension correctly extracts page title, domain, headings, and clean text while stripping form inputs and sensitive fields
- [ ] Website includes functioning interactive demonstration and honest developer installation guide
