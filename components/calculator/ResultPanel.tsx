import { AlertTriangle, CheckCircle2, Gauge, TrendingDown } from "lucide-react";
import { ContributionScale } from "./ContributionScale";
import { Metric } from "@/components/ui/Metric";
import { formatMoney, formatPercent, formatRatio } from "@/src/domain/profit/format";
import type { CurrencyCode, ProfitResult } from "@/src/domain/profit/types";

interface ResultPanelProps {
  result: ProfitResult;
  currency: CurrencyCode;
}

const BREAKDOWN_CLASS: Record<string, string> = {
  product: "cost-product",
  fulfillment: "cost-fulfillment",
  advertising: "cost-advertising",
  fees: "cost-fees",
  risk: "cost-risk",
  other: "cost-other",
};

export function ResultPanel({ result, currency }: ResultPanelProps) {
  const tone = result.profit > 0 ? "positive" : result.profit < 0 ? "negative" : "neutral";
  const statusText = result.profit > 0 ? "当前盈利" : result.profit < 0 ? "当前亏损" : "刚好持平";
  const StatusIcon = result.profit > 0 ? CheckCircle2 : result.profit < 0 ? TrendingDown : Gauge;

  return (
    <aside className={`result-panel result-panel--${tone}`} aria-live="polite">
      <header className="tool-panel__header result-panel__header">
        <div>
          <p className="panel-kicker">这笔订单赚不赚钱</p>
          <h2>经营结果</h2>
        </div>
        <span className={`result-status result-status--${tone}`}>
          <StatusIcon size={15} aria-hidden="true" />
          {statusText}
        </span>
      </header>

      <section className="profit-primary">
        <span>单笔贡献利润</span>
        <strong data-testid="profit-value">{formatMoney(result.profit, currency)}</strong>
        <p>
          每完成一笔订单，预计{result.profit >= 0 ? "留下" : "损失"}{" "}
          <b>{formatMoney(Math.abs(result.profit), currency)}</b>
        </p>
      </section>

      {result.validationMessage ? (
        <div className="validation-banner" role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          {result.validationMessage}
        </div>
      ) : null}

      <div className="primary-metrics">
        <Metric
          label="利润率"
          value={formatPercent(result.profitMargin)}
          tone={result.profitMargin >= 0 ? "positive" : "negative"}
        />
        <Metric
          label="成本回报 ROI"
          value={formatPercent(result.roi)}
          tone={result.roi === null ? "default" : result.roi >= 0 ? "positive" : "negative"}
        />
        <Metric
          label={`${result.input.monthlyOrders} 单月利润`}
          value={formatMoney(result.monthlyProfit, currency)}
          tone={result.monthlyProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <ContributionScale result={result} />

      <section className="decision-section" aria-labelledby="decision-title">
        <div className="section-heading">
          <div>
            <p className="panel-kicker">定价与投放边界</p>
            <h3 id="decision-title">定价与投放边界</h3>
          </div>
          <small>按当前成本与费率</small>
        </div>
        <div className="decision-grid">
          <Metric label="保本售价" value={formatMoney(result.breakEvenItemPrice, currency)} />
          <Metric
            label={`目标售价 · ${result.input.targetMarginRate.toFixed(0)}%`}
            value={formatMoney(result.targetItemPrice, currency)}
            tone="accent"
          />
          <Metric
            label="最大广告成本"
            value={formatMoney(result.maximumAdvertisingCost, currency)}
            detail="利润降为 0 前的单笔上限"
          />
          <Metric
            label="盈亏平衡 ROAS"
            value={formatRatio(result.breakEvenRoas)}
            detail="低于该值将进入亏损"
          />
        </div>
      </section>

      <section className="cost-section" aria-labelledby="cost-title">
        <div className="section-heading">
          <div>
            <p className="panel-kicker">钱花在了哪里</p>
            <h3 id="cost-title">成本构成</h3>
          </div>
          <strong>{formatMoney(result.totalCosts, currency)}</strong>
        </div>
        <div className="cost-stack" aria-label="成本构成比例">
          {result.costBreakdown.map((item) => {
            const width = result.totalCosts > 0 ? (item.value / result.totalCosts) * 100 : 0;
            return (
              <span
                key={item.id}
                className={BREAKDOWN_CLASS[item.id]}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
        <div className="cost-list">
          {result.costBreakdown.map((item) => (
            <div key={item.id}>
              <span>
                <i className={BREAKDOWN_CLASS[item.id]} aria-hidden="true" />
                {item.label}
              </span>
              <strong>{formatMoney(item.value, currency)}</strong>
            </div>
          ))}
        </div>
      </section>

      <p className="result-disclaimer">
        结果基于当前输入和参考费率，未覆盖平台全部例外、汇率波动及法定税务处理。
      </p>
    </aside>
  );
}
