import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static exports (e.g. GitHub Pages) since there is no backend image optimizer server
  },
};

export default nextConfig;
