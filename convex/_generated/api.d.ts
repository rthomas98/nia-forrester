/* eslint-disable */
/**
 * Generated API types. Regenerate with `npx convex dev`.
 */
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as community from "../community.js";
import type * as contact from "../contact.js";
import type * as content from "../content.js";
import type * as events from "../events.js";
import type * as imports from "../imports.js";
import type * as newsletter from "../newsletter.js";
import type * as profiles from "../profiles.js";
import type * as progress from "../progress.js";
import type * as seed from "../seed.js";
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  billing: typeof billing;
  community: typeof community;
  contact: typeof contact;
  content: typeof content;
  events: typeof events;
  imports: typeof imports;
  newsletter: typeof newsletter;
  profiles: typeof profiles;
  progress: typeof progress;
  seed: typeof seed;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

// The Convex CLI expands this to the installed Better Auth component API.
export declare const components: any;
