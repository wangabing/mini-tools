import type { ReactNode } from "react";
import { BeToolDirectory } from "@/components/betool/BeToolDirectory";
import { getGitHubPagesBasePath } from "@/src/config/site";

export default function BeToolLayout({ children }: { children: ReactNode }) {
  return <BeToolDirectory basePath={getGitHubPagesBasePath()}>{children}</BeToolDirectory>;
}
