import { AlertTriangle, CheckCircle2, Gauge, TrendingDown } from "lucide-react";
import { ContributionScale } from "./ContributionScale";
import { Metric } from "@/components/ui/Metric";
import { formatMoney, formatPercent, formatRatio } from "@/src/domain/profit/format";
import type { CalculationReadiness } from "@/src/domain/profit/readiness";
import type { CurrencyCode, ProfitResult } from "@/src/domain/profit/types";

interface ResultPanelProps {
  result: ProfitResult;
  currency: CurrencyCode;
  readiness: CalculationReadiness;
}

const BREAKDOWN_CLASS: Record<string, string> = {
  product: "cost-product",
  fulfillment: "cost-fulfillment",
  advertising: "cost-advertising",
  fees: "cost-fees",
  risk: "cost-risk",
  "after-sales": "cost-after-sales",
  recurring: "cost-recurring",
  other: "cost-other",
};

export function ResultPanel({ result, currency, readiness }: ResultPanelProps) {
  const hasAllocationIssue =
    result.input.calculationMode === "professional" && result.recurringCostAllocation === null;
  const tone = readiness.needsFeeVerification
    ? "warning"
    : hasAllocationIssue
      ? "warning"
    : result.profit > 0 ? "positive" : result.profit < 0 ? "negative" : "neutral";
  const statusText = readiness.needsFeeVerification
    ? "费用待核对"
    : hasAllocationIssue
      ? "订单量待补充"
    : result.profit > 0 ? "当前盈利" : result.profit < 0 ? "当前亏损" : "刚好持平";
  const StatusIcon = readiness.needsFeeVerification || hasAllocationIssue
    ? AlertTriangle
    : result.profit > 0 ? CheckCircle2 : result.profit < 0 ? TrendingDown : Gauge;
  const coveragePercent = (readiness.coveredCount / readiness.totalCount) * 100;

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
        <span>
          {hasAllocationIssue
            ? "订单贡献利润（未含月费分摊）"
            : readiness.needsFeeVerification
              ? "订单贡献利润（预览）"
              : "订单贡献利润"}
        </span>
        <strong data-testid="profit-value">{formatMoney(result.profit, currency)}</strong>
        <p>
          按当前已填写项目，每完成一笔订单预计{result.profit >= 0 ? "留下" : "损失"}{" "}
          <b>{formatMoney(Math.abs(result.profit), currency)}</b>
        </p>
      </section>

      {readiness.needsFeeVerification ? (
        <div className="readiness-banner" role="status">
          <AlertTriangle size={17} aria-hidden="true" />
          <div>
            <strong>这还是一份不完整估算</strong>
            <span>先填写并确认平台与支付费用，再用于定价或投流判断。</span>
          </div>
        </div>
      ) : null}

      {result.validationMessage ? (
        <div className="validation-banner" role="alert">
          <AlertTriangle size={17} aria-hidden="true" />
          {result.validationMessage}
        </div>
      ) : null}

      <div className="primary-metrics">
        <Metric
          label="贡献利润率"
          value={formatPercent(result.profitMargin)}
          tone={result.profitMargin >= 0 ? "positive" : "negative"}
        />
        <Metric
          label="订单成本回报"
          value={formatPercent(result.roi)}
          tone={result.roi === null ? "default" : result.roi >= 0 ? "positive" : "negative"}
        />
        <Metric
          label={`预计月贡献（${result.input.monthlyOrders} 单）`}
          value={formatMoney(result.monthlyProfit, currency)}
          tone={result.monthlyProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      {result.input.calculationMode === "professional" ? (
        <section className="professional-result" aria-labelledby="professional-result-title">
          <div className="section-heading">
            <div>
              <p className="panel-kicker">专业核算明细</p>
              <h3 id="professional-result-title">从结算到月度分摊</h3>
            </div>
            <small>按当前计费基数</small>
          </div>
          <dl>
            <div>
              <dt>商家结算收入</dt>
              <dd>{formatMoney(result.sellerSettlement, currency)}</dd>
              <small>买家实付 {formatMoney(result.buyerPaid, currency)} + 平台补贴 {formatMoney(result.input.platformSubsidy, currency)}</small>
            </div>
            <div>
              <dt>交易费用</dt>
              <dd>{formatMoney(result.transactionFees, currency)}</dd>
              <small>
                平台 {formatMoney(result.platformFee, currency)} · 支付 {formatMoney(result.paymentFee, currency)}
                {result.input.salesChannel === "creator" ? ` · 达人 ${formatMoney(result.creatorCommission, currency)}` : ""}
              </small>
            </div>
            <div>
              <dt>预期售后损失</dt>
              <dd>{formatMoney(result.expectedReturnLoss, currency)}</dd>
              <small>退货率 {result.input.returnRate.toFixed(1)}% · 单次损失 {formatMoney(result.singleReturnLoss, currency)}</small>
            </div>
            <div>
              <dt>单笔月费分摊</dt>
              <dd>{formatMoney(result.recurringCostAllocation, currency)}</dd>
              <small>每月固定成本 {formatMoney(result.monthlyRecurringCosts, currency)}</small>
            </div>
          </dl>
        </section>
      ) : null}

      <section className="completeness" aria-labelledby="completeness-title">
        <div className="completeness__heading">
          <div>
            <span id="completeness-title">核算完整度</span>
            <small>按常见经营项目检查</small>
          </div>
          <strong>{readiness.coveredCount} / {readiness.totalCount} 项</strong>
        </div>
        <div
          className="completeness__track"
          role="progressbar"
          aria-label="核算完整度"
          aria-valuemin={0}
          aria-valuemax={readiness.totalCount}
          aria-valuenow={readiness.coveredCount}
        >
          <span style={{ width: `${coveragePercent}%` }} />
        </div>
        {readiness.suggestedChecks.length > 0 ? (
          <p>
            <strong>建议确认：</strong>{readiness.suggestedChecks.join("、")}
            <small>0 元可能符合实际，但应先确认。</small>
          </p>
        ) : (
          <p>常见经营项目已覆盖，仍请以实际账单为准。</p>
        )}
      </section>

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
        结果为订单贡献估算，不等同于会计净利润，未覆盖平台全部例外及法定税务处理。
      </p>
    </aside>
  );
}
