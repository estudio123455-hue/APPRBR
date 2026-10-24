import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Calcula basePath dinámicamente para GitHub Pages:
 * 1. Usa NEXT_PUBLIC_BASE_PATH si está definido explícitamente.
 * 2. Si corre en GitHub Actions (GITHUB_REPOSITORY="usuario/repo"), extrae "/repo".
 * 3. En desarrollo local usa "" (raíz).
 */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const dynamicBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : isProd && repoName
      ? `/${repoName}`
      : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: dynamicBasePath || undefined,
  assetPrefix: dynamicBasePath || undefined,
  images: {
    unoptimized: true,
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
