import type { NextConfig } from "next";
import { getGitHubPagesBasePath } from "./src/config/site";

const basePath = getGitHubPagesBasePath();

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
