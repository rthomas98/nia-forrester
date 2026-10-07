import {it,expect} from "vitest";
import {convexTest} from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import {api} from "../convex/_generated/api";
const modules=import.meta.glob("../convex/**/*.ts");
it("derives counts from published public catalog records and never fabricates content",async()=>{
 const t=convexTest(schema,modules);betterAuth.register(t);
 expect(await t.query(api.site.summary,{})).toEqual({books:0,series:0,featured:[]});
 expect(await t.query(api.content.listPublished,{kind:"serial"})).toEqual([]);
 expect(await t.query(api.billing.plans,{})).toEqual([]);
 await t.run(async ctx=>{for(const visibility of ["public","hidden"])await ctx.db.insert("content",{slug:visibility,kind:"book",title:visibility,excerpt:"Book",status:"published",visibility,accessTier:"free",tags:[],sortOrder:0,createdAt:1,updatedAt:1});});
 expect((await t.query(api.site.summary,{})).books).toBe(1);
});
it("public feeds cannot leak paid bodies or audio and draft parents hide chapters",async()=>{
 const t=convexTest(schema,modules);betterAuth.register(t);
 const id=await t.run(ctx=>ctx.db.insert("content",{slug:"paid",kind:"serial",title:"Paid Serial",excerpt:"Public summary",body:"PRIVATE",audioUrl:"https://example.test/private",status:"published",accessTier:"reader",tags:[],sortOrder:0,createdAt:1,updatedAt:1}));
 await t.run(ctx=>ctx.db.insert("chapters",{contentId:id,slug:"chapter",number:1,title:"Chapter",body:"PRIVATE CHAPTER",audioUrl:"https://example.test/private-chapter",status:"published",accessTier:"free",createdAt:1,updatedAt:1}));
 expect(JSON.stringify(await t.query(api.content.listPublished,{}))).not.toContain("PRIVATE");
 const item=await t.query(api.content.bySlug,{slug:"paid"});expect(item.body).toBeUndefined();expect(item.audioUrl).toBeUndefined();
 const chapters=await t.query(api.content.chaptersForContent,{contentId:id});expect(chapters[0].body).toBeUndefined();expect(chapters[0].audioUrl).toBeUndefined();
 await t.run(ctx=>ctx.db.patch(id,{status:"draft"}));expect(await t.query(api.content.chaptersForContent,{contentId:id})).toEqual([]);
});
