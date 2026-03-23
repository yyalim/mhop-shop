import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    '/*': ['./generated/prisma/**/*'],
  },
};

export default nextConfig;
