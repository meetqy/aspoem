import baseConfig, { restrictEnvAccess } from "@aspoem/eslint-config/base";
import nextjsConfig from "@aspoem/eslint-config/nextjs";
import reactConfig from "@aspoem/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
