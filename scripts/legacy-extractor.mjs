import { createHash } from "node:crypto";
import { JSDOM, VirtualConsole } from "jsdom";
export const legacyOrigin = "https://www.niaforrester.com";
const shorts = new Set(["it-started-with-ayesha","better-left-unsaid","bright-young-things","people-you-don-t-see","freshman-fifteen","paper-house","still-here","another-life","tricks-of-light","life-plan","stranger","steal-him-away","thirty-seven-days"]);
const outtakes = new Set(["forty-six","the-haircut","call-me"]);
export function legacyUrl(value) {const url=new URL(value,legacyOrigin);if(url.origin!==legacyOrigin||url.username||url.password)throw new Error("Foreign legacy source rejected");url.hash="";return url.href;}
export function sitemapLinks(xml) {return [...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map(m=>legacyUrl(m[1].replaceAll("&amp;","&")));}
function safeUrl(value,base) {if(!value)return undefined;try{const url=new URL(value,base);return ["https:","http:"].includes(url.protocol)&&!url.username&&!url.password?url.href:undefined;}catch{return undefined;}}
const clean=value=>value?.replace(/&#(x[\da-f]+|\d+);/gi, (entity, code)=>{const point=code.toLowerCase().startsWith("x")?parseInt(code.slice(1),16):Number(code);return point>0&&point<=0x10ffff?String.fromCodePoint(point):entity;}).replace(/[\u200b\uFEFF]/g,"").replace(/\u00a0/g," ").replace(/[ \t]+/g," ").trim()??"";
function readableText(node) {
 const copy=node.cloneNode(true);
 for(const br of copy.querySelectorAll("br"))br.replaceWith(copy.ownerDocument.createTextNode("\n"));
 return clean(copy.textContent);
}
export function legacyImageUrl(value,base) {
 const safe=safeUrl(value,base);if(!safe)return undefined;
 const url=new URL(safe);
 // Wix SSR often supplies a tiny blurred placeholder; retain the original asset.
 if(url.hostname==="static.wixstatic.com" && url.pathname.startsWith("/media/") && url.pathname.includes("/v1/")) {
  url.pathname=url.pathname.split("/v1/")[0];url.search="";
 }
 return url.href;
}
export function extractBlocks(root,base) {
 const blocks=[],seen=new Set();
 for(const node of root.querySelectorAll('p,h1,h2,h3,h4,h5,h6,blockquote,img,a,iframe,figure[data-hook="figure-VIDEO"]')) {
  if(node.closest("nav,header,footer,[data-hook=recent-posts]"))continue;
  const name=node.tagName.toLowerCase(),text=readableText(node);if(["p","blockquote"].includes(name)&&node.parentElement?.closest("p,blockquote"))continue;
  let block;
  if(name==="figure") {const match=node.querySelector("button[style]")?.getAttribute("style")?.match(/https:\/\/i\.ytimg\.com\/vi\/([A-Za-z0-9_-]{11})\//);if(match)block={type:"video",url:`https://www.youtube.com/watch?v=${match[1]}`,title:"Video from the original article"};}
  else if(name==="img"){const url=legacyImageUrl(node.getAttribute("src"),base);if(!url)continue;block={type:"image",url,alt:clean(node.getAttribute("alt"))||"Image from the original article — review alternative text"};}
  else if(name==="iframe"){const url=safeUrl(node.getAttribute("src"),base);if(url)block={type:"video",url,title:node.getAttribute("title")||"Video from the original page"};}
  else if(name==="a"){const url=safeUrl(node.getAttribute("href"),base);if(url&&text)block={type:"link",url,text};}
  else if(text)block={type:name==="blockquote"?"quote":name.startsWith("h")?"heading":"paragraph",text,...(name.startsWith("h")?{level:name==="h3"?3:2}:{})};
  if(block){const key=JSON.stringify(block);if(!seen.has(key)){blocks.push(block);seen.add(key);}}
 }
 return blocks;
}
export function extractLegacy(html,sourceUrl) {
 sourceUrl=legacyUrl(sourceUrl);const dom=new JSDOM(html,{url:sourceUrl,virtualConsole:new VirtualConsole()}),doc=dom.window.document,path=new URL(sourceUrl).pathname,slug=path.split("/").filter(Boolean).at(-1)||"home";
 const root=path.startsWith("/post/")?doc.querySelector('[data-hook="post-description"]'):doc.querySelector("main,[role=main]");let metadata={};
 for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){try{const value=JSON.parse(script.textContent),entries=Array.isArray(value)?value:[value],article=entries.find(v=>v?.["@type"]==="BlogPosting");if(article)metadata=article;}catch{/* Metadata is optional. */}}
 const title=clean(metadata.headline)||clean(doc.querySelector('[data-hook="post-title"],main h1,[role=main] h1')?.textContent)||clean(doc.title).split(" | ")[0];
 const blocks=root?extractBlocks(root,sourceUrl):[],publishedAt=typeof metadata.datePublished==="string"?Date.parse(metadata.datePublished):undefined,coverUrl=safeUrl(typeof metadata.image==="string"?metadata.image:metadata.image?.url,sourceUrl);
 const kind=path.startsWith("/post/")?"blog":shorts.has(slug)?"short_read":outtakes.has(slug)?"outtake":path==="/what-im-up-to"?"quick_bite":null;
 const categoryLinks=[...doc.querySelectorAll('a[href*="/blog/categories/"]')].filter(a=>a.closest('[data-hook="post-footer"]')),categories=[...new Set(categoryLinks.map(a=>clean(a.textContent)).filter(Boolean))];
 const payload={kind,title,slug,excerpt:clean(metadata.description)||clean(doc.querySelector('meta[name="description"]')?.getAttribute("content")).slice(0,1000),author:clean(metadata.author?.name)||"Nia Forrester",category:categories[0]||(kind==="quick_bite"?"Watching, Eating & Reading":""),tags:categories,blocks,status:"draft",...(Number.isFinite(publishedAt)?{publishedAt}:{}),...(coverUrl?{coverUrl,coverAlt:`Original illustration for ${title}`}:{})};
 const serialized=JSON.stringify(payload);dom.window.close();return {sourceUrl,checksum:createHash("sha256").update(serialized).digest("hex"),payload:serialized,needsMapping:kind===null,blockCount:blocks.length};
}
