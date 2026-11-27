import type { Metadata } from "next";
import { BeToolDirectory } from "@/components/betool/BeToolDirectory";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/src/config/brand";
import { getGitHubPagesBasePath } from "@/src/config/site";

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION,
};

export default function BeToolPage() {
  return <BeToolDirectory basePath={getGitHubPagesBasePath()} />;
}
