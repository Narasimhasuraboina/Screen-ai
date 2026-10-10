# Project Orchestration Plan: ScreenAI

## Objective
Deliver the complete ScreenAI project conforming to all requirements in ORIGINAL_REQUEST.md.

## Phase 0: Survey & Discovery
1. Spawn 3 Explorers in parallel to inspect:
   - Explorer 1: Monorepo configuration, existing code in packages/ and apps/, build scripts, tsconfig, shared package contracts.
   - Explorer 2: Backend API structure, endpoints (/api/health, /api/summarize, /api/chat), validation schemas, AI provider adapters, rate limiting, and testing setup.
   - Explorer 3: Browser Extension (Manifest V3, side panel, DOM extractor, content/background scripts) and Public Website (dark theme, interactive demo, guide, privacy statement).
2. Merge Explorer reports into `PROJECT.md` Feature Inventory & Architecture.

## Phase 1: Decomposition & Track Launch
1. Formulate milestones and interface contracts in `PROJECT.md`.
2. Spawn E2E Testing Orchestrator (Opaque-box test suite: Tiers 1-4).
3. Spawn Implementation Sub-orchestrators for milestones:
   - M1: Shared packages & contracts (types, schemas, utilities, build:shared)
   - M2: Backend API (Express TS, Zod validation, rate limiting, provider adapters, tests, build:api)
   - M3: Browser Extension (Manifest V3, Side Panel, DOM extractor, dist-extension/, build:extension)
   - M4: Public Website (dark theme, interactive demo, visual narrative, install guide, privacy statement, build:web)

## Phase 2: Implementation & E2E Test Convergence
1. Monitor sub-orchestrators and aggregate handoffs.
2. Verify all package builds (`build:shared`, `build:api`, `build:extension`, `build:web`, `typecheck`, `test`).
3. E2E Testing Orchestrator signals `TEST_READY.md`.

## Phase 3: Final Milestone (Dual-Phase E2E & Hardening)
1. Phase 1: Sub-orchestrator passes 100% of E2E tests (Tiers 1-4).
2. Phase 2: Adversarial Coverage Hardening (Tier 5 white-box challenger cycle).
3. Full forensic audit verification.

## Phase 4: Final Handover & Reporting
1. Comprehensive verification check across all acceptance criteria.
2. Final report via `send_message` to Sentinel (72ffd869-e10e-4afb-8233-e7c6c4696797).
