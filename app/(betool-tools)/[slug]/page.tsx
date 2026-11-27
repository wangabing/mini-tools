import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AcademicTool } from "@/components/betool/academic/AcademicTool";
import { DevTextTool } from "@/components/betool/devText/DevTextTool";
import { MediaTool } from "@/components/betool/media/MediaTool";
import { OtherTool } from "@/components/betool/other/OtherTool";
import { getGitHubPagesBasePath } from "@/src/config/site";
import { BETOOL_BASIC_TOOLS, BETOOL_TOOLS, BETOOL_TOOL_SLUGS } from "@/src/data/betool";
import styles from "@/components/betool/betool-tools.module.css";

type PageProps = { params: Promise<{ slug: string }> };

const categories = {
  cate_2: DevTextTool,
  cate_3: DevTextTool,
  cate_4: AcademicTool,
  cate_8: AcademicTool,
  cate_9: AcademicTool,
  cate_7: OtherTool,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return BETOOL_TOOL_SLUGS.filter((slug) => !BETOOL_BASIC_TOOLS.some((tool) => tool === slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = BETOOL_TOOLS.find((entry) => entry.slug === slug);
  return tool ? { title: tool.title, description: tool.description } : {};
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = BETOOL_TOOLS.find((entry) => entry.slug === slug);
  if (!tool) notFound();

  if (tool.category === "cate_5" || tool.category === "cate_10") {
    return <MediaTool slug={slug} basePath={getGitHubPagesBasePath()} />;
  }

  const Implementation = categories[tool.category as keyof typeof categories];

  return (
    <main className={styles.workbench}>
      <h1 className={styles.panel}>{tool.title}</h1>
      <Suspense>
        <Implementation slug={slug} />
      </Suspense>
    </main>
  );
}
