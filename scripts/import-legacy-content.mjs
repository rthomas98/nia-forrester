#!/usr/bin/env node
// Read-only extraction by default; database staging is explicit and local-only.
import {writeFile} from "node:fs/promises";
import {execFileSync} from "node:child_process";
import {ConvexHttpClient} from "convex/browser";
import {makeFunctionReference} from "convex/server";
import {extractLegacy,legacyUrl,sitemapLinks} from "./legacy-extractor.mjs";
const args=process.argv.slice(2),output=args.includes("--output")?args[args.indexOf("--output")+1]:"/private/tmp/nia-legacy-review.json",stage=args.includes("--stage"),useCurl=args.includes("--curl");
async function download(url){url=legacyUrl(url);if(useCurl)return execFileSync("curl",["--fail","--silent","--show-error","--max-time","30",url],{encoding:"utf8",maxBuffer:12000000});const response=await fetch(url,{redirect:"error",signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.text();}
const queue=[legacyUrl(process.env.LEGACY_SITEMAP_URL??"https://www.niaforrester.com/sitemap.xml")],visited=new Set(),pages=new Set(),errors=[];
while(queue.length){const url=queue.shift();if(visited.has(url))continue;visited.add(url);try{const xml=await download(url),links=sitemapLinks(xml);if(/<sitemapindex\b/.test(xml))queue.push(...links);else links.forEach(u=>pages.add(u));}catch(error){errors.push({url,error:String(error)});}}
const records=[];
for(const url of pages){try{records.push(extractLegacy(await download(url),url));}catch(error){errors.push({url,error:String(error)});}}
const report={generatedAt:new Date().toISOString(),sitemaps:[...visited],discovered:pages.size,extracted:records.length,errors,records};
await writeFile(output,JSON.stringify(report,null,2),{mode:0o600});console.log(JSON.stringify({output,discovered:pages.size,extracted:records.length,errors:errors.length,editorial:records.filter(r=>!r.needsMapping).length,requiresManualMapping:records.filter(r=>r.needsMapping).length}));
if(stage){const url=process.env.NEXT_PUBLIC_CONVEX_URL,token=process.env.CONVEX_AUTH_TOKEN;if(!url||!token)throw new Error("Staging requires NEXT_PUBLIC_CONVEX_URL and an editor/admin CONVEX_AUTH_TOKEN.");if(!["127.0.0.1","localhost"].includes(new URL(url).hostname))throw new Error("Production staging requires separate release authorization.");const client=new ConvexHttpClient(url);client.setAuth(token);for(let i=0;i<records.length;i+=20){const batch=records.slice(i,i+20).map(({sourceUrl,checksum,payload})=>({sourceUrl,checksum,payload}));console.log(await client.mutation(makeFunctionReference("cms:stageImports"),{records:batch}));}}
if(errors.length)process.exitCode=1;
