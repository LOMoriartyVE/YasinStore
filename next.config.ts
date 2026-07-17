import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel runs Next.js with a server — required for Supabase Server Actions.
  // Static export (`output: 'export'`) does not support Server Actions.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
