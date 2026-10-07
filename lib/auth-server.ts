import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

const authUtilities =
  convexUrl && convexSiteUrl
    ? convexBetterAuthNextJs({ convexUrl, convexSiteUrl })
    : null;

const unavailable = () =>
  Response.json(
    {
      error:
        "Authentication is not configured. Add the Convex deployment environment variables.",
    },
    { status: 503 },
  );

export const handler = authUtilities?.handler ?? {
  GET: unavailable,
  POST: unavailable,
};

export const getToken =
  authUtilities?.getToken ?? (async () => undefined as string | undefined);

export const isAuthenticated =
  authUtilities?.isAuthenticated ?? (async () => false);
