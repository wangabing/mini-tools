import type { Metadata } from "next";
import { ContentPage } from "@/components/ContentPage";
import { getSiteUrl } from "@/src/config/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "计算口径",
  description: "了解利衡电商利润计算器的收入、成本、利润率、ROI、保本售价和广告边界公式。",
  alternates: { canonical: `${siteUrl}/methodology` },
};

export default function MethodologyPage() {
  return (
    <ContentPage
      eyebrow="计算口径"
      title="同一套公式，正向核算，也能反推决策"
      summary="所有指标都来自同一个订单模型。平台参考费率可以覆盖，但不会取代你的实际账单。"
    >
      <section>
        <h2>收入</h2>
        <p>订单收入 = 商品售价 + 买家支付运费 - 订单折扣。</p>
        <p>平台佣金、支付费、税费预留和退款损失均以订单收入为计算基数。</p>
      </section>

      <section>
        <h2>成本与利润</h2>
        <p>固定成本包括商品、履约、包装、广告、其他成本和固定支付费用。</p>
        <div className="formula-block">
          <code>单笔利润 = 订单收入 - 固定成本 - 比例成本</code>
          <code>利润率 = 单笔利润 / 订单收入</code>
          <code>ROI = 单笔利润 / 总成本</code>
        </div>
      </section>

      <section>
        <h2>定价与广告边界</h2>
        <p>保本售价通过令单笔利润等于 0 反推；目标售价通过令利润率等于目标利润率反推。反推后的售价会重新进入正向公式验证，因此不会把当前售价产生的平台费错误地当作固定成本。</p>
        <p>最大广告成本是其他成本不变时，利润降到 0 之前仍可承担的单笔获客费用。盈亏平衡 ROAS 等于订单收入除以该广告上限。</p>
      </section>

      <section>
        <h2>费率与精度</h2>
        <p>平台费用参考会标明官方入口、复核日期和未包含的成本。页面显示“待核对”时，0 费率不代表免费，请填入商家后台或合同中的实际费率。</p>
        <p>达人佣金、活动让利、即时配送、类目阶梯和固定费用摊销需要结合实际账单补充。计算中不会提前四舍五入，页面金额统一显示到小数点后两位；结果仅供经营估算。</p>
      </section>
    </ContentPage>
  );
}
