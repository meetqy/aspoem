/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: "/neutral-card-bg/:path*",
        destination: "https://r2.aspoem.com/:path*",
      },
    ];
  },
};

export default config;
