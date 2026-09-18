---
name: nia-agent-pair
description: Coordinate Nia Forrester Orca setup, backend/frontend ownership, image generation and reciprocal review.
---
1. Read AGENTS.md, README.md, docs/PRODUCTION_READINESS.md and the current diff. Preserve ongoing work. Define one bounded task and its acceptance checks.
2. Use separate worktrees and Manual permissions. Codex gpt-6-astra medium Standard owns Convex schema/functions, auth, entitlements, Stripe/Resend integration and shared API contracts. Fable claude-fable-5-1 medium owns Next.js presentation, design and accessibility.
3. Follow docs/ORCA_WORKFLOW.md for setup and provider boundaries. Publish concrete permissions, request/response shapes and error states before dependent UI work. Assign one owner for shared files.
4. Use installed orca-cli and orchestration skills for actual dispatch. Exchange exact revisions for reciprocal review, fix findings, and review the final delta. Run typecheck/lint and appropriate build/browser checks; report unavailable live-provider checks separately.
5. Stop only owned services. Commit/push/deployment and live provider mutations require task authorization.

For images, Fable supplies brand, subject, dimensions and placement. Codex uses the available OpenAI image-generation tool. Select the preferred gpt-6-astr only if the tool supports model selection; otherwise disclose that it cannot be selected. Inspect the asset and verify its consuming UI.
