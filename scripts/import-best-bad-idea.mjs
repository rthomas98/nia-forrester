import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Local-only preview import. Production publication requires a separate release.
const raw = readFileSync(new URL("../data/serials/the-best-bad-idea-chapter-1.txt", import.meta.url), "utf8");
const prefix = "Putting the text of Chapter 1 here for ease of access:\n\nONE\n";
if (!raw.startsWith(prefix)) throw new Error("Unexpected source heading");
const body = raw.slice(prefix.length).trim();
const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
if (!/^CONVEX_DEPLOYMENT=anonymous:/m.test(envFile) || !/^NEXT_PUBLIC_CONVEX_URL=http:\/\/127\.0\.0\.1:3210\s*$/m.test(envFile) || process.env.CONVEX_DEPLOY_KEY || process.env.CONVEX_DEPLOYMENT) throw new Error("Requires the isolated anonymous local deployment");
const result = spawnSync("npx", ["convex", "run", "serialBootstrap:bestBadIdea", JSON.stringify({ body })], { stdio: "inherit" });
process.exit(result.status ?? 1);
