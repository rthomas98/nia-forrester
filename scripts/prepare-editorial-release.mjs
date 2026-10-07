// Read-only: re-extract the recognized public editorial sources into a manifest.
import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { extractLegacy, legacyImageUrl } from "./legacy-extractor.mjs";
const execute = promisify(execFile);
const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Supply the reviewed extraction report and output manifest paths.");
const report = JSON.parse(await readFile(input, "utf8"));
const sources = report.records.filter(row => !row.needsMapping);
const records = [], errors = [];
let cursor = 0;
async function worker() {
  while (cursor < sources.length) {
    const source = sources[cursor++];
    try {
      const { stdout } = await execute("curl", ["--fail", "--silent", "--show-error", "--max-time", "45", source.sourceUrl], { maxBuffer: 12000000 });
      const extracted = extractLegacy(stdout, source.sourceUrl), post = JSON.parse(extracted.payload);
      if (!post.kind || !post.blocks.some(b => b.text?.trim())) throw new Error("Missing editorial body");
      if (post.kind === "quick_bite") {
        const start = post.blocks.findIndex(b => b.type === "heading" && /what.*watching/i.test(b.text));
        if (start < 0) throw new Error("Quick Bites boundary not found");
        post.blocks = post.blocks.slice(start);
        post.title = "What I'm Watching, Eating & Reading";
        post.slug = "watching-eating-reading";
        post.excerpt = "Nia's watching, eating and reading notes from the original website.";
      }
      post.status = "published";
      for (const block of post.blocks) {
        if (block.type !== "image") continue;
        block.url = legacyImageUrl(block.url, source.sourceUrl);
        if (/review alternative text|\.(png|jpe?g|gif|webp)|[a-f0-9]{24,}|_UR\d/i.test(block.alt)) block.alt = `Original illustration accompanying ${post.title}`;
        if (block.alt.startsWith("Image by ")) block.caption = block.alt;
      }
      if (post.coverUrl) post.coverUrl = legacyImageUrl(post.coverUrl, source.sourceUrl);
      else {
        const image = post.blocks.find(b => b.type === "image");
        if (image) { post.coverUrl = image.url; post.coverAlt = image.alt; }
      }
      if (post.coverUrl) post.coverAlt = `Original illustration accompanying ${post.title}`;
      const urls = [...new Set([post.coverUrl, ...post.blocks.filter(b => b.type === "image").map(b => b.url)].filter(Boolean))];
      for (const url of urls) await execute("curl", ["--fail", "--silent", "--show-error", "--head", "--max-time", "30", url], { maxBuffer: 100000 });
      const checksum = createHash("sha256").update(JSON.stringify(post)).digest("hex");
      records.push({ ...post, sourceUrl: source.sourceUrl, checksum });
      console.log(JSON.stringify({ title: post.title, blocks: post.blocks.length, mediaChecked: urls.length }));
    } catch (error) { errors.push({ sourceUrl: source.sourceUrl, error: String(error) }); }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
records.sort((a, b) => a.sourceUrl.localeCompare(b.sourceUrl));
await writeFile(output, JSON.stringify({ generatedAt: new Date().toISOString(), records, errors }, null, 2), { mode: 0o600 });
console.log(JSON.stringify({ output, prepared: records.length, errors }));
if (errors.length) process.exitCode = 1;
