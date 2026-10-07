import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { magicLink } from "better-auth/plugins/magic-link";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import { authEmailTemplate, sendTransactionalEmail } from "./email";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!siteUrl || !secret) {
    throw new Error("Authentication is not configured: SITE_URL and BETTER_AUTH_SECRET are required");
  }
  return betterAuth({
    appName: "Nia Forrester Reader Hub",
    baseURL: siteUrl,
    secret,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      requireEmailVerification: false,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      sendResetPassword: async ({ user, url }) => {
        const content = authEmailTemplate({
          eyebrow: "Reader Hub",
          heading: "Reset your password",
          body: "Use the secure link below to choose a new password. It expires in one hour.",
          actionLabel: "Choose a new password",
          actionUrl: url,
        });
        await sendTransactionalEmail({
          to: user.email,
          subject: "Reset your Nia Forrester Reader Hub password",
          ...content,
        });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    plugins: [
      magicLink({
        expiresIn: 60 * 15,
        sendMagicLink: async ({ email, url }) => {
          const content = authEmailTemplate({
            eyebrow: "Reader Hub",
            heading: "Your sign-in link",
            body: "Use this private link to sign in. It expires in fifteen minutes and can only be used once.",
            actionLabel: "Sign in to the Reader Hub",
            actionUrl: url,
          });
          await sendTransactionalEmail({
            to: email,
            subject: "Your Nia Forrester Reader Hub sign-in link",
            ...content,
          });
        },
      }),
      convex({ authConfig }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.safeGetAuthUser(ctx),
});
