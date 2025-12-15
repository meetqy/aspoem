import type { UserWithRole } from "better-auth/plugins";

export const isAdmin = (user?: UserWithRole) => {
  return user?.role === "admin";
};
