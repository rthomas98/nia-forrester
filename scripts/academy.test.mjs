import { it, expect, vi, afterEach } from "vitest";
import { convexTest } from "convex-test";
import betterAuth from "@convex-dev/better-auth/test";
import schema from "../convex/schema";
import { api, internal, components } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
afterEach(() => vi.unstubAllEnvs());
async function setup() {
  const t = convexTest(schema, modules); betterAuth.register(t);
  async function actor(email, role="reader", verified=true) {
    const now=Date.now();
    const user=await t.mutation(components.betterAuth.adapter.create,{input:{model:"user",data:{name:"Studio Tester",email,emailVerified:verified,createdAt:now,updatedAt:now}}});
    const session=await t.mutation(components.betterAuth.adapter.create,{input:{model:"session",data:{userId:user._id,token:email,expiresAt:now+86400000,createdAt:now,updatedAt:now}}});
    await t.run(ctx=>ctx.db.insert("profiles",{authUserId:user._id,email,displayName:"Studio Tester",role,membershipTier:"free",membershipStatus:"free",preferences:[],chapterAlerts:false,newsletterOptIn:false,createdAt:now,updatedAt:now}));
    return t.withIdentity({subject:user._id,sessionId:session._id});
  }
  vi.stubEnv("SITE_URL","http://127.0.0.1:4321");
  await t.mutation(internal.academy.initializeLocal);
  const catalog=await t.query(api.academy.catalog,{});
  const args={serviceId:catalog.services[0]._id,name:"Test Writer",projectTitle:"A Test Manuscript",genre:"Romance",wordCount:50000,timeline:"Flexible",notes:"I would like feedback on the opening scene.",sample:"This synthetic manuscript excerpt is only for a local automated test.",consent:true};
  return {t,actor,args};
}
it("uses real published catalog records, preserves free review, and guards initialization",async()=>{
  const {t}=await setup(); await t.mutation(internal.academy.initializeLocal);
  const catalog=await t.query(api.academy.catalog,{});expect(catalog.services).toHaveLength(5);expect(catalog.services[0].priceInCents).toBe(0);expect(catalog.courses).toEqual([]);
  await t.run(ctx=>ctx.db.patch(catalog.services[1]._id,{status:"draft"}));expect((await t.query(api.academy.catalog,{})).services).toHaveLength(4);
  vi.stubEnv("SITE_URL","https://example.test");await expect(t.mutation(internal.academy.initializeLocal)).rejects.toThrow();
});
it("validates intake, deduplicates requests and protects private manuscripts",async()=>{
  const {t,actor,args}=await setup(); const a=await actor("writer@example.test"),b=await actor("other@example.test");
  await expect(t.mutation(api.academy.request,args)).rejects.toThrow();
  for(const invalid of [{consent:false},{sample:""},{wordCount:-1},{wordCount:1.5},{genre:""},{sample:"word ".repeat(3001)}]) await expect(a.mutation(api.academy.request,{...args,...invalid})).rejects.toThrow();
  const id=await a.mutation(api.academy.request,args);expect(await a.mutation(api.academy.request,args)).toBe(id);
  const own=await a.query(api.academy.mine,{});expect(own.requests[0].email).toBe("writer@example.test");expect(own.requests[0].sample).toBe(args.sample);
  expect((await b.query(api.academy.mine,{})).requests).toEqual([]);expect(JSON.stringify(await t.query(api.academy.catalog,{}))).not.toContain(args.sample);
  await expect(b.mutation(api.academy.cancelRequest,{id})).rejects.toThrow();await expect(a.query(api.academy.inbox,{})).rejects.toThrow();
  await a.mutation(api.academy.cancelRequest,{id});expect((await a.query(api.academy.mine,{})).requests[0].status).toBe("canceled");
  await expect(a.mutation(api.academy.request,args)).rejects.toThrow(/minute/);
});
it("allows verified staff to reply but rejects ordinary and unverified accounts",async()=>{
  const {t,actor,args}=await setup();const a=await actor("writer@example.test"),staff=await actor("editor@example.test","editor"),unverified=await actor("unverified@example.test","admin",false);
  const id=await a.mutation(api.academy.request,args);
  await expect(unverified.query(api.academy.inbox,{})).rejects.toThrow(/Verify/);
  await expect(a.query(api.academy.interestInbox,{})).rejects.toThrow();
  await expect(unverified.query(api.academy.interestInbox,{})).rejects.toThrow();
  await a.mutation(api.academy.interest,{active:true});
  expect((await staff.query(api.academy.interestInbox,{}))[0].email).toBe("writer@example.test");
  await expect(a.mutation(api.academy.reply,{id,reply:"No access",status:"completed"})).rejects.toThrow();
  await expect(staff.mutation(api.academy.reply,{id,reply:"Let's meet",status:"scheduled"})).rejects.toThrow(/future/);
  await staff.mutation(api.academy.reply,{id,reply:"Your review is ready.",status:"completed"});
  expect((await a.query(api.academy.mine,{})).requests[0].staffReply).toBe("Your review is ready.");expect(await staff.query(api.academy.inbox,{})).toHaveLength(1);
});
it("persists separate course interest and rejects unpublished courses",async()=>{
  const {t,actor}=await setup();const a=await actor("writer@example.test");
  const id=await a.mutation(api.academy.interest,{active:true});expect(await a.mutation(api.academy.interest,{active:true})).toBe(id);
  expect((await a.query(api.academy.mine,{})).interests[0].active).toBe(true);
  await a.mutation(api.academy.interest,{active:false});expect((await a.query(api.academy.mine,{})).interests[0].active).toBe(false);
  const courseId=await t.run(ctx=>ctx.db.insert("studioCourses",{title:"Draft Test",description:"Test",instructor:"Test",format:"self_paced",level:"Beginner",workload:"1 hour",outcomes:[],status:"draft",sortOrder:0,createdAt:Date.now(),updatedAt:Date.now()}));
  await expect(a.mutation(api.academy.interest,{active:true,courseId})).rejects.toThrow();expect((await t.query(api.academy.catalog,{})).courses).toEqual([]);
  await t.run(ctx=>ctx.db.patch(courseId,{status:"coming_soon"}));await a.mutation(api.academy.interest,{active:true,courseId});expect((await t.query(api.academy.catalog,{})).courses).toHaveLength(1);
});
