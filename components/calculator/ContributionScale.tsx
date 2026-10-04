import type { ProfitResult } from "@/src/domain/profit/types";

interface ContributionScaleProps {
  result: ProfitResult;
}

export function ContributionScale({ result }: ContributionScaleProps) {
  const hasRevenue = result.grossRevenue > 0;
  const costShare = hasRevenue ? (result.totalCosts / result.grossRevenue) * 100 : 0;
  const costWidth = Math.min(100, Math.max(0, costShare));
  const profitWidth = result.profit > 0 ? Math.max(0, 100 - costWidth) : 0;
  const overrun = result.profit < 0 ? Math.abs(result.profit) : 0;

  return (
    <figure className="contribution-scale" aria-label="订单收入、成本与利润贡献刻度">
      <figcaption>
        <span>单笔贡献刻度</span>
        <small>{result.profit >= 0 ? "收入覆盖成本后的剩余" : "当前成本已经超过收入"}</small>
      </figcaption>
      <div className="contribution-scale__rail" aria-hidden="true">
        <span className="contribution-scale__cost" style={{ width: `${costWidth}%` }} />
        <span className="contribution-scale__profit" style={{ width: `${profitWidth}%` }} />
      </div>
      <div className="contribution-scale__labels">
        <span>收入 100%</span>
        <span>{result.profit >= 0 ? `成本 ${costShare.toFixed(1)}%` : `超支 ${overrun.toFixed(2)}`}</span>
      </div>
    </figure>
  );
}
