import "server-only";

import { cache } from "react";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { admin } from "better-auth/plugins/admin";

import { headers } from "next/headers";

import { env } from "@/env";

import { db } from "../db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  plugins: [admin()],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/sign-up")) {
        return;
      }

      const newSession = ctx.context.newSession;
      if (!newSession?.user) {
        return;
      }

      const { email, id } = newSession.user;
      if (email === env.ADMIN_EMAIL) {
        ctx.context.adapter.update({
          model: "user",
          where: [{ field: "id", value: id }],
          update: {
            role: "admin",
          },
        });
      }
    }),
  },
});

export type Auth = typeof auth;
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));
