import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/**
 * QurbaniHat — Next.js configuration.
 *
 * `remotePatterns` whitelists the image hosts used by the livestock dataset
 * (Wikimedia Commons + Unsplash) and Google profile pictures. User supplied
 * avatar URLs are rendered with a plain <img> element in components/ui/Avatar.tsx
 * so an arbitrary host can never crash the image optimizer.
 */

// The repository root also contains the legacy Vite project (and its lockfile),
// so the workspace root is pinned to this directory. Without this Next.js may
// infer the parent folder as the root and mis-resolve the app's file watching.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "thumb.wikimedia.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
