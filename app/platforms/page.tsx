import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlatformExplorer } from "@/components/platforms/PlatformExplorer";
import { getSiteUrl } from "@/src/config/site";
import { PLATFORM_GUIDES } from "@/src/data/platform-guides";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "国内电商平台对比与选择指南",
  description: "面向个体户和中小商家的国内 20 个电商平台对比：入驻门槛、成本结构、优缺点、适合人群、近期经营信号和官方入口。",
  alternates: { canonical: `${siteUrl}/platforms` },
  openGraph: {
    title: "国内电商平台怎么选｜利衡",
    description: "按低门槛、内容、品牌、本地零售和 B2B 路径，对比 20 个国内电商平台。",
    url: `${siteUrl}/platforms`,
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "国内电商平台对比",
  numberOfItems: PLATFORM_GUIDES.length,
  itemListElement: PLATFORM_GUIDES.map((platform) => ({
    "@type": "ListItem",
    position: platform.rank,
    name: platform.name,
    url: platform.officialUrl,
  })),
};

export default function PlatformsPage() {
  return (
    <main className="page-shell platform-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <section className="platform-page__intro">
        <div>
          <p className="eyebrow">20 个国内平台 · 信息复核于 2026-10-03</p>
          <h1>国内电商平台怎么选</h1>
        </div>
        <div>
          <p>先按经营方式排除不合适的平台，再用真实费用验证剩下的 2–3 个候选。</p>
          <Link href="/">
            打开利润计算器
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <PlatformExplorer />
    </main>
  );
}
