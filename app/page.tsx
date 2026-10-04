import { ShieldCheck } from "lucide-react";
import { ProfitCalculator } from "@/components/calculator/ProfitCalculator";
import { getSiteUrl } from "@/src/config/site";

const siteUrl = getSiteUrl();

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "利衡电商利润计算器",
  url: siteUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "zh-CN",
  isAccessibleForFree: true,
  description: "核算电商订单利润、利润率、ROI、保本售价、目标售价和广告投放边界。",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
};

export default function HomePage() {
  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <section className="page-intro">
        <div>
          <p className="eyebrow">算清每一笔生意 · 利衡</p>
          <h1>电商利润计算器</h1>
        </div>
        <div className="intro-support">
          <p>把售价与真实成本放在同一张账上，得到可以直接用于定价的答案。</p>
          <span><ShieldCheck size={15} aria-hidden="true" /> 经营数据仅在浏览器内计算</span>
        </div>
      </section>

      <ProfitCalculator />

      <aside className="ad-slot" aria-label="广告位">
        <span>广告</span>
      </aside>

      <section className="trust-band" aria-labelledby="trust-title">
        <header>
          <p className="eyebrow">计算口径</p>
          <h2 id="trust-title">每个结果都有明确口径</h2>
        </header>
        <div>
          <article>
            <span>收入</span>
            <h3>订单实际收入</h3>
            <p>商品售价，加买家支付运费，再扣除订单折扣。</p>
          </article>
          <article>
            <span>成本</span>
            <h3>固定与比例成本</h3>
            <p>商品、履约、广告、平台费与风险预留全部进入同一模型。</p>
          </article>
          <article>
            <span>边界</span>
            <h3>从结果反推决策</h3>
            <p>保本售价、目标售价与广告上限均由同一个正向公式闭环。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
