import type { NextConfig } from "next";

const isVercel = Boolean(process.env.VERCEL);
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "export", trailingSlash: true }),
  basePath: isVercel ? "" : isProd ? "/APPRBR" : "",
  assetPrefix: isVercel ? "" : isProd ? "/APPRBR/" : "",
  images: {
    unoptimized: !isVercel,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
