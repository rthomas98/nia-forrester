// Explicit operator release; never called by setup, builds, or local QA.
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const [manifestPath, receiptPath, confirmation] = process.argv.slice(2);
if (!manifestPath || !receiptPath || confirmation !== "--publish") throw new Error("Supply manifest, receipt and --publish after production identity verification.");
const bytes = await readFile(manifestPath), manifest = JSON.parse(bytes);
if (manifest.errors.length || manifest.records.length !== 41) throw new Error("Release requires the complete reviewed 41-article manifest.");
const results = [];
for (let i = 0; i < manifest.records.length; i += 5) {
  const output = execFileSync("npx", ["convex", "run", "cmsBootstrap:publishLegacy", JSON.stringify({ records: manifest.records.slice(i, i + 5) }), "--deployment", "empuls3-agancy:nia-forrester:production"], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], maxBuffer: 100000 });
  const result = JSON.parse(output);
  results.push(result);
  console.log(JSON.stringify({ batch: results.length, ...result }));
  await writeFile(receiptPath, JSON.stringify({ generatedAt: new Date().toISOString(), deployment: "valiant-egret-997", manifestSha256: createHash("sha256").update(bytes).digest("hex"), results }, null, 2), { mode: 0o600 });
}
