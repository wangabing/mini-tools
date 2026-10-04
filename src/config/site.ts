const DEFAULT_SITE_URL = "https://tool.xiaozhan.info";

interface SiteEnvironment {
  GITHUB_PAGES?: string;
  GITHUB_REPOSITORY?: string;
  NEXT_PUBLIC_SITE_URL?: string;
}

export function getGitHubPagesBasePath(
  env: SiteEnvironment = process.env as unknown as SiteEnvironment,
): string {
  if (env.GITHUB_PAGES !== "true") {
    return "";
  }

  if (env.NEXT_PUBLIC_SITE_URL?.trim()) {
    try {
      const pathname = new URL(env.NEXT_PUBLIC_SITE_URL).pathname.replace(/\/+$/, "");
      return pathname === "" ? "" : pathname;
    } catch {
      // Fall back to the repository name when the public URL is not yet valid.
    }
  }

  const repositoryName = env.GITHUB_REPOSITORY?.split("/").at(-1)?.trim();
  if (!repositoryName || repositoryName.endsWith(".github.io")) {
    return "";
  }

  return `/${repositoryName}`;
}

export function getSiteUrl(
  env: SiteEnvironment = process.env as unknown as SiteEnvironment,
): string {
  return (env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}
