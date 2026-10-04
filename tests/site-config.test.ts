import { describe, expect, it } from "vitest";
import { getGitHubPagesBasePath, getSiteUrl } from "@/src/config/site";

describe("site deployment configuration", () => {
  it("uses the repository name for GitHub project Pages", () => {
    expect(
      getGitHubPagesBasePath({
        GITHUB_PAGES: "true",
        GITHUB_REPOSITORY: "merchant/mini-tools",
      }),
    ).toBe("/mini-tools");
  });

  it("keeps user Pages and normal builds at the domain root", () => {
    expect(
      getGitHubPagesBasePath({
        GITHUB_PAGES: "true",
        GITHUB_REPOSITORY: "merchant/merchant.github.io",
      }),
    ).toBe("");
    expect(getGitHubPagesBasePath({ GITHUB_REPOSITORY: "merchant/mini-tools" })).toBe("");
  });

  it("uses the public URL path and keeps a custom domain at the root", () => {
    expect(
      getGitHubPagesBasePath({
        GITHUB_PAGES: "true",
        GITHUB_REPOSITORY: "merchant/mini-tools",
        NEXT_PUBLIC_SITE_URL: "https://merchant.github.io/mini-tools/",
      }),
    ).toBe("/mini-tools");
    expect(
      getGitHubPagesBasePath({
        GITHUB_PAGES: "true",
        GITHUB_REPOSITORY: "merchant/mini-tools",
        NEXT_PUBLIC_SITE_URL: "https://tool.xiaozhan.info/",
      }),
    ).toBe("");
  });

  it("normalizes the public URL before metadata paths are appended", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://merchant.github.io/mini-tools/" })).toBe(
      "https://merchant.github.io/mini-tools",
    );
  });

  it("uses the production domain by default", () => {
    expect(getSiteUrl({})).toBe("https://tool.xiaozhan.info");
  });
});
