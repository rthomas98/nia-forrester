import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { randomBytes } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import Stripe from "stripe";

const profile = readFileSync(`${homedir()}/.config/stripe/config.toml`, "utf8").split("[nia-forrester]")[1]?.split(/\n\[/)[0];
function value(name) { return profile?.match(new RegExp(`^${name}\\s*=\\s*['\"]([^'\"]+)`, "m"))?.[1]; }
if (value("account_id") !== "acct_1TFKjUKA03p6jtdP") throw new Error("Wrong Stripe account");
const key = value("test_mode_api_key");
if (!key || !/^[rs]k_test_/.test(key)) throw new Error("Missing test key");
const env = readFileSync(".env.local", "utf8");
if (!env.includes("CONVEX_DEPLOYMENT=anonymous:") || !env.includes("NEXT_PUBLIC_SITE_URL=http://127.0.0.1:4321")) throw new Error("Local test configuration required");
const stripe = new Stripe(key);
const account = await stripe.accounts.retrieve();
if (account.id !== value("account_id")) throw new Error("Account mismatch");
const values = { STRIPE_SECRET_KEY: key };
const products = await stripe.products.list({ limit: 100 });
for (const [tier, name, monthly] of [["reader", "Reader Circle", 700], ["inner", "Inner Circle", 1800], ["writers", "Writers Circle", 4900]]) {
  const product = products.data.find(p => p.metadata.nia_tier === tier) ?? await stripe.products.create({ name, metadata: { nia_tier: tier, project: "nia-forrester" } });
  for (const [cadence, interval, amount] of [["monthly", "month", monthly], ["annual", "year", monthly * 10]]) {
    const lookup = `nia_${tier}_${cadence}`;
    const existing = await stripe.prices.list({ lookup_keys: [lookup], limit: 1 });
    const price = existing.data[0] ?? await stripe.prices.create({ product: product.id, currency: "usd", unit_amount: amount, recurring: { interval }, lookup_key: lookup });
    if (price.unit_amount !== amount || price.currency !== "usd" || price.recurring?.interval !== interval || !price.active) throw new Error(`Price mismatch: ${lookup}`);
    values[`STRIPE_${tier.toUpperCase()}_${cadence.toUpperCase()}_PRICE_ID`] = price.id;
    console.log(`${name}: $${amount / 100}/${interval} (${price.id})`);
  }
}
const configs = await stripe.billingPortal.configurations.list({ limit: 100 });
const portal = configs.data.find(c => c.metadata?.project === "nia-forrester") ?? await stripe.billingPortal.configurations.create({ metadata: { project: "nia-forrester" }, business_profile: { headline: "Manage your Nia Forrester membership" }, features: { customer_update: { enabled: true, allowed_updates: ["email", "name"] }, invoice_history: { enabled: true }, payment_method_update: { enabled: true }, subscription_cancel: { enabled: true, mode: "at_period_end" } } });
values.STRIPE_PORTAL_CONFIGURATION_ID = portal.id;
values.STRIPE_WEBHOOK_SECRET = execFileSync("stripe", ["listen", "--print-secret", "--project-name", "nia-forrester"], { encoding: "utf8" }).trim();
if (!values.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")) throw new Error("Invalid webhook signing secret");
values.INTERNAL_API_SECRET = env.match(/^INTERNAL_API_SECRET=(.+)$/m)?.[1] ?? randomBytes(32).toString("hex");
values.NEXT_PUBLIC_MEMBERSHIP_ENABLED = "true";
let next = env;
for (const [name, val] of Object.entries(values)) {
  const pattern = new RegExp(`^${name}=.*$`, "m");
  next = pattern.test(next) ? next.replace(pattern, `${name}=${val}`) : `${next.trimEnd()}\n${name}=${val}\n`;
}
const patch = `*** Begin Patch\n*** Update File: .env.local\n@@\n${env.trimEnd().split("\n").map(l => `-${l}`).join("\n")}\n${next.trimEnd().split("\n").map(l => `+${l}`).join("\n")}\n*** End Patch\n`;
const result = spawnSync("apply_patch", [], { input: patch, encoding: "utf8" });
if (result.status !== 0) throw new Error("Could not save local environment");
execFileSync("npx", ["convex", "env", "set", "INTERNAL_API_SECRET"], { input: values.INTERNAL_API_SECRET, stdio: ["pipe", "pipe", "pipe"] });
console.log("Test configuration saved. No live-mode objects were created.");
