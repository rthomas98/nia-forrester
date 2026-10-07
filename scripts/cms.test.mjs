import {describe,it,expect} from "vitest";
import {convexTest} from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import {api,components} from "../convex/_generated/api";
import { internal } from "../convex/_generated/api";
import { signInDestination } from "../lib/signin-destination";
import {extractLegacy,sitemapLinks,legacyImageUrl} from "./legacy-extractor.mjs";
const modules=import.meta.glob("../convex/**/*.ts");
async function setup(role="editor"){
 const t=convexTest(schema,modules);betterAuth.register(t);const now=Date.now();
 const user=await t.mutation(components.betterAuth.adapter.create,{input:{model:"user",data:{name:"CMS Test",email:"cms@example.test",emailVerified:true,createdAt:now,updatedAt:now}}});
 const session=await t.mutation(components.betterAuth.adapter.create,{input:{model:"session",data:{userId:user._id,token:"cms-test",expiresAt:now+86400000,createdAt:now,updatedAt:now}}});
 await t.run(ctx=>ctx.db.insert("profiles",{authUserId:user._id,email:user.email,displayName:"CMS Test",role,membershipTier:"free",membershipStatus:"free",preferences:[],chapterAlerts:false,newsletterOptIn:false,createdAt:now,updatedAt:now}));
 return {t,actor:t.withIdentity({subject:user._id,sessionId:session._id})};
}
const post={kind:"blog",title:"Real Test Article",slug:"test-article",excerpt:"Preview",author:"Nia Forrester",category:"Writing",tags:["Craft"],blocks:[{type:"paragraph",text:"Private draft text"}],status:"draft"};
it("preserves legacy line breaks instead of joining story paragraphs",()=>{
 const row=extractLegacy('<main><h1>Another Life</h1><p>First line.<br>Second line.<br><br>Third paragraph.</p></main>',"https://www.niaforrester.com/another-life");
 expect(JSON.parse(row.payload).blocks[1].text).toBe("First line.\nSecond line.\n\nThird paragraph.");
});
it("preserves the legacy deferred YouTube video block",()=>{
 const row=extractLegacy('<div data-hook="post-description"><p>Enjoy this song.</p><figure data-hook="figure-VIDEO"><button style="background-image:url(https://i.ytimg.com/vi/mmK71ZfaZO4/maxresdefault.jpg)"></button></figure></div>',"https://www.niaforrester.com/post/writing-to-music");
 expect(JSON.parse(row.payload).blocks[1]).toEqual({type:"video",url:"https://www.youtube.com/watch?v=mmK71ZfaZO4",title:"Video from the original article"});
});
it("operator import is idempotent, audited and never overwrites authored posts",async()=>{
 const {t,actor}=await setup();
 const record={...post,title:"Legacy Article",slug:"legacy-publication",status:"published",sourceUrl:"https://www.niaforrester.com/post/legacy-publication",checksum:"c".repeat(64)};
 expect(await t.mutation(internal.cmsBootstrap.publishLegacy,{records:[record]})).toEqual({published:1,unchanged:0});
 expect(await t.mutation(internal.cmsBootstrap.publishLegacy,{records:[record]})).toEqual({published:0,unchanged:1});
 expect((await t.query(api.cms.bySlug,{slug:record.slug,kind:"blog"})).title).toBe(record.title);
 const imported=await t.query(api.cms.bySlug,{slug:record.slug,kind:"blog"});
 expect(imported.publishedAt).toBeUndefined();
 await actor.mutation(api.cms.save,{...post,title:record.title,slug:record.slug,status:"published",id:imported._id,expectedVersion:1});
 expect((await t.query(api.cms.bySlug,{slug:record.slug,kind:"blog"})).publishedAt).toBeUndefined();
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,checksum:"d".repeat(64)}]})).rejects.toThrow(/changed/);
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,sourceUrl:"https://evil.test/post/legacy"}]})).rejects.toThrow(/source/);
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,title:"TEST QA",slug:"test-qa"}]})).rejects.toThrow(/reviewed/);
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,slug:"testing-article"}]})).rejects.toThrow(/reviewed/);
 await t.run(ctx=>ctx.db.insert("editorialImports",{sourceUrl:"https://www.niaforrester.com/post/skipped",checksum:"b".repeat(64),payload:"{}",status:"skipped",createdAt:1,updatedAt:1}));
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,sourceUrl:"https://www.niaforrester.com/post/skipped",slug:"skipped"}]})).rejects.toThrow(/skipped/);
 await actor.mutation(api.cms.save,{...post,slug:"authored"});
 await expect(t.mutation(internal.cmsBootstrap.publishLegacy,{records:[{...record,slug:"authored",sourceUrl:"https://www.niaforrester.com/post/authored"}]})).rejects.toThrow(/overwrite/);
});
it("retains original Wix images instead of blurred SSR thumbnails",()=>{
 expect(legacyImageUrl("https://static.wixstatic.com/media/asset.png/v1/fill/w_49,h_49,blur_2/asset.png","https://www.niaforrester.com")).toBe("https://static.wixstatic.com/media/asset.png");
 expect(legacyImageUrl("https://other.test/media/asset.png/v1/fill/x","https://www.niaforrester.com")).toBe("https://other.test/media/asset.png/v1/fill/x");
});
describe("CMS role isolation",()=>{
 for(const role of ["reader","moderator","editor","admin"]){it(`${role} permissions`,async()=>{const {t,actor}=await setup(role);const allowed=["editor","admin"].includes(role);expect((await actor.query(api.cms.access,{})).allowed).toBe(allowed);expect(await t.query(api.cms.access,{})).toEqual({allowed:false,role:null});if(allowed)expect(await actor.mutation(api.cms.save,post)).toHaveProperty("version",1);else{await expect(actor.mutation(api.cms.save,post)).rejects.toThrow(/FORBIDDEN/);await expect(actor.query(api.cms.listStaff,{})).rejects.toThrow();await expect(actor.mutation(api.cms.uploadUrl,{})).rejects.toThrow();}await expect(t.mutation(api.cms.save,post)).rejects.toThrow();});}
});
it("draft/publish/archive and optimistic revisions",async()=>{const {t,actor}=await setup();const first=await actor.mutation(api.cms.save,post);expect(await t.query(api.cms.bySlug,{slug:post.slug,kind:"blog"})).toBeNull();expect((await t.query(api.cms.listPublic,{kind:"blog",paginationOpts:{numItems:20,cursor:null}})).page).toEqual([]);await expect(actor.mutation(api.cms.save,{...post,id:first.id,expectedVersion:0})).rejects.toThrow(/CONFLICT/);const second=await actor.mutation(api.cms.save,{...post,status:"published",id:first.id,expectedVersion:1});expect((await t.query(api.cms.bySlug,{slug:post.slug,kind:"blog"})).blocks[0].text).toBe("Private draft text");expect(await t.query(api.cms.bySlug,{slug:post.slug,kind:"quick_bite"})).toBeNull();expect(await actor.query(api.cms.revisions,{id:first.id})).toHaveLength(1);await actor.mutation(api.cms.save,{...post,status:"archived",id:first.id,expectedVersion:second.version});expect(await t.query(api.cms.bySlug,{slug:post.slug,kind:"blog"})).toBeNull();});
it("rejects duplicate slugs, unsafe media, and empty publications",async()=>{const {actor}=await setup();await actor.mutation(api.cms.save,post);await expect(actor.mutation(api.cms.save,post)).rejects.toThrow(/CONFLICT/);for(const url of ["javascript:alert(1)","data:text/html,evil","https://user:pass@example.test/x"]){await expect(actor.mutation(api.cms.save,{...post,slug:"unsafe",blocks:[{type:"link",url,text:"Bad"}]})).rejects.toThrow(/VALIDATION/);}await expect(actor.mutation(api.cms.save,{...post,slug:"empty",status:"published",blocks:[]})).rejects.toThrow(/empty/);});
it("imports idempotently into drafts without publishing",async()=>{const {t,actor}=await setup();const record={sourceUrl:"https://www.niaforrester.com/post/legacy",checksum:"a".repeat(64),payload:JSON.stringify({...post,slug:"legacy"})};expect(await actor.mutation(api.cms.stageImports,{records:[record]})).toEqual({staged:1,unchanged:0});expect(await actor.mutation(api.cms.stageImports,{records:[record]})).toEqual({staged:0,unchanged:1});const queue=await actor.query(api.cms.importQueue,{});await expect(actor.mutation(api.cms.reviewImport,{id:queue[0]._id,decision:"approve",expectedChecksum:"b".repeat(64)})).rejects.toThrow(/CONFLICT/);const id=await actor.mutation(api.cms.reviewImport,{id:queue[0]._id,decision:"approve",expectedChecksum:record.checksum});expect((await actor.query(api.cms.preview,{id})).status).toBe("draft");expect(await t.query(api.cms.bySlug,{slug:"legacy",kind:"blog"})).toBeNull();});
it("rejects unmapped and malformed imports and foreign sources",async()=>{const {actor}=await setup();await expect(actor.mutation(api.cms.stageImports,{records:[{sourceUrl:"https://evil.test/a",checksum:"a".repeat(64),payload:"{}"}]})).rejects.toThrow();await actor.mutation(api.cms.stageImports,{records:[{sourceUrl:"https://www.niaforrester.com/books",checksum:"a".repeat(64),payload:JSON.stringify({...post,kind:null})}]});const row=(await actor.query(api.cms.importQueue,{}))[0];await expect(actor.mutation(api.cms.reviewImport,{id:row._id,decision:"approve",expectedChecksum:row.checksum})).rejects.toThrow(/Unsupported/);});
it("search and categories only expose published matching posts",async()=>{const {t,actor}=await setup();await actor.mutation(api.cms.save,{...post,status:"published"});await actor.mutation(api.cms.save,{...post,slug:"draft",title:"Unpublished Real",status:"draft"});const result=await t.query(api.cms.listPublic,{kind:"blog",search:"Real",category:"Writing",paginationOpts:{numItems:20,cursor:null}});expect(result.page).toHaveLength(1);expect(result.page[0].blocks).toBeUndefined();});
it("preserves original publication date when an update omits it",async()=>{
 const {t,actor}=await setup();const first=await actor.mutation(api.cms.save,{...post,status:"published",publishedAt:42});
 await actor.mutation(api.cms.save,{...post,status:"published",id:first.id,expectedVersion:1});
 expect((await t.query(api.cms.bySlug,{slug:post.slug,kind:"blog"})).publishedAt).toBe(42);
});
it("blocks insecure remote media while supporting local upload previews",async()=>{
 const {actor}=await setup();
 await expect(actor.mutation(api.cms.save,{...post,coverUrl:"http://example.test/photo.jpg",coverAlt:"Photo"})).rejects.toThrow(/HTTPS/);
 await expect(actor.mutation(api.cms.save,{...post,blocks:[{type:"image",url:"http://example.test/photo.jpg",alt:"Photo"}]})).rejects.toThrow(/HTTPS/);
 const previous=process.env.CONVEX_CLOUD_URL;
 try {
  process.env.CONVEX_CLOUD_URL="https://production.convex.cloud";
  await expect(actor.mutation(api.cms.save,{...post,coverUrl:"http://127.0.0.1:3210/api/storage/test",coverAlt:"Local QA"})).rejects.toThrow(/HTTPS/);
  process.env.CONVEX_CLOUD_URL="http://127.0.0.1:3210";
  expect(await actor.mutation(api.cms.save,{...post,coverUrl:"http://127.0.0.1:3210/api/storage/test",coverAlt:"Local QA"})).toHaveProperty("id");
 } finally {if(previous===undefined)delete process.env.CONVEX_CLOUD_URL;else process.env.CONVEX_CLOUD_URL=previous;}
});
it("denies fixture role grants outside the loopback QA backend",async()=>{
 const {t}=await setup();const previous=process.env.CONVEX_CLOUD_URL;
 process.env.CONVEX_CLOUD_URL="https://production.convex.cloud";
 try {await expect(t.mutation(internal.cmsFixtures.profile,{authUserId:"not-real",role:"editor"})).rejects.toThrow(/local QA/);}
 finally {if(previous===undefined)delete process.env.CONVEX_CLOUD_URL;else process.env.CONVEX_CLOUD_URL=previous;}
});
it("sign-in return destinations stay inside the app",()=>{
 expect(signInDestination("?next=%2Fadmin%2Fcontent")).toBe("/admin/content");
 for(const next of ["https://evil.test","//evil.test","/\\evil.test","javascript:alert(1)","/\n/evil.test"]){
  expect(signInDestination(`?next=${encodeURIComponent(next)}`)).toBe("/dashboard");
 }
});
it("media must be an allowed image and staff-only",async()=>{const {t,actor}=await setup();const bad=await t.run(ctx=>ctx.storage.store(new Blob(["<svg/>"],{type:"image/svg+xml"})));await expect(actor.mutation(api.cms.acceptMedia,{storageId:bad})).rejects.toThrow(/JPEG/);const good=await t.run(ctx=>ctx.storage.store(new Blob(["test image"],{type:"image/webp"})));/* convex-test storeBlob omits contentType: populate the same metadata as HTTP upload. */await t.run(ctx=>ctx.db.patch(good,{contentType:"image/webp"}));expect(await actor.mutation(api.cms.acceptMedia,{storageId:good})).toHaveProperty("url");await expect(t.mutation(api.cms.acceptMedia,{storageId:good})).rejects.toThrow();});
it("extracts full bodies, dates and links without executing scripts",()=>{const html='<title>Legacy</title><script type="application/ld+json">{"@type":"BlogPosting","headline":"Original","datePublished":"2024-07-25T21:47:00Z"}</script><div data-hook="post-description"><p>First <strong>full paragraph</strong>.</p><p>Second paragraph <a href="https://example.test">source</a></p><img src="https://static.wixstatic.com/media/p.jpg" alt="Original"/><script>throw new Error("never run")</script></div>';const record=extractLegacy(html,"https://www.niaforrester.com/post/original"),payload=JSON.parse(record.payload);expect(payload.blocks[0].text).toBe("First full paragraph.");expect(payload.blocks.some(b=>b.type==="link")).toBe(true);expect(payload.publishedAt).toBe(Date.parse("2024-07-25T21:47:00Z"));expect(extractLegacy(html,record.sourceUrl).checksum).toBe(record.checksum);expect(()=>sitemapLinks('<loc>https://evil.test/map.xml</loc>')).toThrow(/Foreign/);});
