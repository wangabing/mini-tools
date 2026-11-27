import type { MetadataRoute } from "next";
import { getGitHubPagesBasePath } from "@/src/config/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = getGitHubPagesBasePath();
  const appRoot = `${basePath}/`;

  return {
    name: "利衡电商利润计算器",
    short_name: "利衡",
    description: "简单输入，得到专业的电商利润与定价结果。",
    start_url: appRoot,
    scope: appRoot,
    display: "standalone",
    background_color: "#f4f7f5",
    theme_color: "#087f6d",
    lang: "zh-CN",
  };
}
