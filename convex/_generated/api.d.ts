/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academy from "../academy.js";
import type * as auth from "../auth.js";
import type * as avatars from "../avatars.js";
import type * as billing from "../billing.js";
import type * as catalog from "../catalog.js";
import type * as catalogPolicy from "../catalogPolicy.js";
import type * as community from "../community.js";
import type * as communityAccess from "../communityAccess.js";
import type * as contact from "../contact.js";
import type * as content from "../content.js";
import type * as dashboard from "../dashboard.js";
import type * as email from "../email.js";
import type * as eventFixtures from "../eventFixtures.js";
import type * as events from "../events.js";
import type * as http from "../http.js";
import type * as imports from "../imports.js";
import type * as library from "../library.js";
import type * as newsletter from "../newsletter.js";
import type * as profiles from "../profiles.js";
import type * as progress from "../progress.js";
import type * as readerCircle from "../readerCircle.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as site from "../site.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academy: typeof academy;
  auth: typeof auth;
  avatars: typeof avatars;
  billing: typeof billing;
  catalog: typeof catalog;
  catalogPolicy: typeof catalogPolicy;
  community: typeof community;
  communityAccess: typeof communityAccess;
  contact: typeof contact;
  content: typeof content;
  dashboard: typeof dashboard;
  email: typeof email;
  eventFixtures: typeof eventFixtures;
  events: typeof events;
  http: typeof http;
  imports: typeof imports;
  library: typeof library;
  newsletter: typeof newsletter;
  profiles: typeof profiles;
  progress: typeof progress;
  readerCircle: typeof readerCircle;
  security: typeof security;
  seed: typeof seed;
  site: typeof site;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
