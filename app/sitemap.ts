import type { MetadataRoute } from "next";
import { BETOOL_TOOL_SLUGS } from "@/src/data/betool";
import { getSiteUrl } from "@/src/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...BETOOL_TOOL_SLUGS.map((tool) => ({ url: `${siteUrl}/${tool}/` })),
    { url: `${siteUrl}/donate/` },
    { url: `${siteUrl}/privacy/` },
  ];
}
