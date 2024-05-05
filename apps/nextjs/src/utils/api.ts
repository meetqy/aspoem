import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@aspoem/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@aspoem/api";
