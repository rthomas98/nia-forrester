# Orca workflow

The base is codex/reader-hub-launch, which includes the full reader hub beyond main. Local disk-maintenance changes remain in the primary checkout; they are not copied into workers.

Codex GPT-6 Astra medium Standard owns backend/integration. Fable 5.1 medium owns frontend/design. Use Manual permissions and reciprocal review of exact final revisions.

## Preparation

Run by default and wait for setup using:

```sh
python3 "$ORCA_ROOT_PATH/.agents/skills/nia-agent-pair/scripts/orca_setup.py"
```

The hook copies six allowlisted collaboration files, installs locked dependencies with npm ci --ignore-scripts, and creates an owner-only .env.local from the blank committed template when absent. It preserves existing environment files, rejects conflicting instruction edits, and never copies primary credentials or provider state. Shared paths stay empty. Dependency lifecycle scripts are disabled; enable a specific required script only after review.

## Runtime and verification

No service starts automatically. For local UI work, choose an unused port and run `npm run dev -- --hostname 127.0.0.1 --port PORT` in that worker with SITE_URL and NEXT_PUBLIC_SITE_URL matching that address. Check listener ownership before starting and stop only that process. Each worker has its own node_modules and .next. Never run both workers on the same port.

Convex is the database; no SQL database is needed. A dedicated nonproduction Convex deployment and its matching auth origins must be configured before persisted/authenticated checks. Do not inherit a production deployment, Stripe keys, Resend keys or live user data. Do not run convex dev, imports, seed operations, deploys or email/payment mutations as setup smoke checks.

Run npm run typecheck and npm run lint. Build and persisted journeys depend on scoped provider configuration. The existing Playwright config is fixed to port 3000 with reuseExistingServer; adapt it to an owned worker port before parallel browser verification. Do not claim provider-backed behavior from a rendered page alone.

## Setup scope

Prepared checkouts are not running agents. Dispatch agents when an actual implementation task is assigned. Existing product checks and future handoffs need their own evidence. Setup changes remain local until commit/push is requested.
