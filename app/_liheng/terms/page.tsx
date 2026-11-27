import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { getSiteUrl } from "@/src/config/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "使用条款",
  description: "利衡电商利润计算器的使用范围、费率限制和免责声明。",
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="使用条款"
      title="把结果用于判断，也要回到真实账单验证"
      summary="使用本工具即表示你理解计算结果是基于输入和公开参考资料形成的估算。"
    >
      <section>
        <h2>使用范围</h2>
        <p>本工具用于电商经营测算、定价比较和广告预算判断。它不提供会计、税务、法律、投资或平台合规建议。</p>
      </section>

      <section>
        <h2>费率与结果</h2>
        <p>平台会按照地区、商品分类、售价、订阅等级、履约方式和促销计划调整费用。参考预设可能滞后、简化或不适用于你的账号。作出经营决策前，请以平台政策、合同和实际账单为准。</p>
      </section>

      <section>
        <h2>责任限制</h2>
        <p>在法律允许的范围内，工具提供者不对因输入错误、费率变化、规则例外、服务中断或依据估算作出的经营决定承担间接损失。用户应自行核实关键数据并保留必要记录。</p>
      </section>

      <section>
        <h2>变更</h2>
        <p>功能、费率资料和条款可能随平台政策变化而更新。重要的隐私处理变化会清楚说明，并在需要时重新征得同意。</p>
      </section>
    </ContentPage>
  );
}
