"use client";

import { ChevronDown, ExternalLink, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ResultPanel } from "./ResultPanel";
import { NumberField } from "@/components/ui/NumberField";
import {
  getCategories,
  PLATFORMS,
  resolvePreset,
  SOURCE_ACCESS_LABELS,
  type CategoryId,
  type PlatformId,
} from "@/src/data/presets";
import { calculateProfit, DEFAULT_PROFIT_INPUT } from "@/src/domain/profit/calculate";
import { CURRENCY_SYMBOLS } from "@/src/domain/profit/format";
import type { CurrencyCode, ProfitInput, ProfitInputKey } from "@/src/domain/profit/types";

type FeeInputKey = "platformFeeRate" | "paymentFeeRate" | "paymentFixedFee" | "refundLossRate";

const FEE_KEYS: readonly FeeInputKey[] = [
  "platformFeeRate",
  "paymentFeeRate",
  "paymentFixedFee",
  "refundLossRate",
];

export function ProfitCalculator() {
  const [platformId, setPlatformId] = useState<PlatformId>("generic");
  const [categoryId, setCategoryId] = useState<CategoryId>("generic");
  const [currency, setCurrency] = useState<CurrencyCode>("CNY");
  const [input, setInput] = useState<ProfitInput>(DEFAULT_PROFIT_INPUT);
  const [manualOverrides, setManualOverrides] = useState<Set<FeeInputKey>>(() => new Set());

  const categories = getCategories(platformId);
  const resolvedPreset = useMemo(
    () => resolvePreset(platformId, categoryId),
    [platformId, categoryId],
  );
  const result = useMemo(() => calculateProfit(input), [input]);
  const currencySymbol = CURRENCY_SYMBOLS[currency];
  const activeAdvancedCount = [
    input.buyerShipping,
    input.discount,
    input.packagingCost,
    input.paymentFixedFee,
    input.taxRate,
    input.refundLossRate,
    input.otherFixedCost,
  ].filter((value) => value > 0).length;

  function updateInput(key: ProfitInputKey, value: number, trackOverride = false) {
    setInput((current) => ({ ...current, [key]: value }));
    if (trackOverride && FEE_KEYS.includes(key as FeeInputKey)) {
      setManualOverrides((current) => new Set(current).add(key as FeeInputKey));
    }
  }

  function applyPreset(nextPlatformId: PlatformId, nextCategoryId: CategoryId) {
    const { preset } = resolvePreset(nextPlatformId, nextCategoryId);
    setInput((current) => ({
      ...current,
      platformFeeRate: preset.platformFeeRate,
      paymentFeeRate: preset.paymentFeeRate,
      paymentFixedFee: preset.paymentFixedFee,
      refundLossRate: preset.refundLossRate,
    }));
    setManualOverrides(new Set());
  }

  function handlePlatformChange(nextPlatformId: PlatformId) {
    setPlatformId(nextPlatformId);
    setCategoryId("generic");
    applyPreset(nextPlatformId, "generic");
  }

  function handleCategoryChange(nextCategoryId: CategoryId) {
    setCategoryId(nextCategoryId);
    applyPreset(platformId, nextCategoryId);
  }

  function resetCalculator() {
    setPlatformId("generic");
    setCategoryId("generic");
    setCurrency("CNY");
    setInput(DEFAULT_PROFIT_INPUT);
    setManualOverrides(new Set());
  }

  return (
    <section className="calculator-grid" aria-label="电商利润计算器">
      <article className="input-panel">
        <header className="tool-panel__header">
          <div>
            <p className="panel-kicker">填写一笔订单</p>
            <h2>订单参数</h2>
          </div>
          <div className="panel-actions">
            <span className="local-badge">
              <ShieldCheck size={15} aria-hidden="true" />
              本地计算
            </span>
            <button
              className="icon-button"
              type="button"
              onClick={resetCalculator}
              aria-label="重置计算器"
              title="重置计算器"
            >
              <RotateCcw size={17} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="selector-grid">
          <div className="select-field">
            <span className="select-field__label" id="platform-select-label">
              销售平台
              <Link href="/platforms">帮我选平台</Link>
            </span>
            <select
              aria-label="销售平台"
              value={platformId}
              onChange={(event) => handlePlatformChange(event.target.value as PlatformId)}
            >
              {PLATFORMS.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <label className="select-field">
            <span>商品分类</span>
            <select
              aria-label="商品分类"
              value={categoryId}
              onChange={(event) => handleCategoryChange(event.target.value as CategoryId)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="select-field select-field--currency">
            <span>币种</span>
            <select
              aria-label="币种"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            >
              <option value="CNY">CNY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
        </div>

        <div className="basic-inputs">
          <NumberField
            id="item-price"
            label="商品售价"
            prefix={currencySymbol}
            value={input.itemPrice}
            onChange={(value) => updateInput("itemPrice", value)}
            testId="item-price"
          />
          <NumberField
            id="product-cost"
            label="商品成本"
            prefix={currencySymbol}
            value={input.productCost}
            onChange={(value) => updateInput("productCost", value)}
            testId="product-cost"
          />
          <NumberField
            id="fulfillment-cost"
            label="物流 / 履约"
            prefix={currencySymbol}
            value={input.fulfillmentCost}
            onChange={(value) => updateInput("fulfillmentCost", value)}
          />
          <NumberField
            id="advertising-cost"
            label="单笔广告成本"
            prefix={currencySymbol}
            value={input.advertisingCost}
            onChange={(value) => updateInput("advertisingCost", value)}
          />
        </div>

        <div className="assumption-strip">
          <div>
            <span>当前费率</span>
            <strong>{result.totalVariableRate.toFixed(1)}%</strong>
          </div>
          <div>
            <span>费率状态</span>
            <strong className={resolvedPreset.preset.verificationRequired ? "verification-required" : undefined}>
              {resolvedPreset.preset.verificationRequired ? "待核对" : "通用估算"}
            </strong>
          </div>
          <small>
            {resolvedPreset.preset.verificationRequired
              ? "当前 0 费率不代表免佣，请在高级设置填入后台或合同费率"
              : resolvedPreset.resolution === "category"
                ? "已应用类目参考"
                : "使用通用经营假设"}
          </small>
        </div>

        <details className="advanced-settings">
          <summary>
            <span>
              高级设置
              <small>{activeAdvancedCount} 项已计入</small>
            </span>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>

          <div className="advanced-settings__body">
            <section aria-labelledby="revenue-cost-title">
              <div className="subsection-title">
                <h3 id="revenue-cost-title">收入与其他成本</h3>
                <small>非必填</small>
              </div>
              <div className="advanced-grid">
                <NumberField id="buyer-shipping" label="买家支付运费" prefix={currencySymbol} value={input.buyerShipping} onChange={(value) => updateInput("buyerShipping", value)} />
                <NumberField id="discount" label="订单折扣" prefix={currencySymbol} value={input.discount} onChange={(value) => updateInput("discount", value)} />
                <NumberField id="packaging-cost" label="包装成本" prefix={currencySymbol} value={input.packagingCost} onChange={(value) => updateInput("packagingCost", value)} />
                <NumberField id="other-cost" label="其他单笔成本" prefix={currencySymbol} value={input.otherFixedCost} onChange={(value) => updateInput("otherFixedCost", value)} />
              </div>
            </section>

            <section aria-labelledby="fee-title">
              <div className="subsection-title">
                <h3 id="fee-title">费率与风险</h3>
                {manualOverrides.size > 0 ? <small className="manual-badge">已手动调整</small> : <small>可修改参考值</small>}
              </div>
              <div className="advanced-grid">
                <NumberField id="platform-fee" label="平台佣金" suffix="%" value={input.platformFeeRate} max={100} onChange={(value) => updateInput("platformFeeRate", value, true)} testId="platform-fee" />
                <NumberField id="payment-fee" label="支付费率" suffix="%" value={input.paymentFeeRate} max={100} onChange={(value) => updateInput("paymentFeeRate", value, true)} />
                <NumberField id="payment-fixed" label="固定支付费" prefix={currencySymbol} value={input.paymentFixedFee} onChange={(value) => updateInput("paymentFixedFee", value, true)} />
                <NumberField id="refund-loss" label="退款损失预留" suffix="%" value={input.refundLossRate} max={100} onChange={(value) => updateInput("refundLossRate", value, true)} />
                <NumberField id="tax-rate" label="税费预留" suffix="%" value={input.taxRate} max={100} onChange={(value) => updateInput("taxRate", value)} />
                <NumberField id="target-margin" label="目标利润率" suffix="%" value={input.targetMarginRate} max={95} onChange={(value) => updateInput("targetMarginRate", value)} />
                <NumberField id="monthly-orders" label="预计月订单" suffix="单" value={input.monthlyOrders} step={1} onChange={(value) => updateInput("monthlyOrders", value)} />
              </div>
            </section>

            <section className="preset-source" aria-label="费率参考来源">
              <div>
                <span>费用参考</span>
                <strong>{resolvedPreset.preset.market}</strong>
              </div>
              <div className="preset-source__status">
                <span>{SOURCE_ACCESS_LABELS[resolvedPreset.preset.sourceAccess]}</span>
                {resolvedPreset.preset.verificationRequired ? <strong>费率待核对</strong> : null}
              </div>
              <p>{resolvedPreset.preset.verification}</p>
              <p>{resolvedPreset.preset.note}</p>
              <div>
                {resolvedPreset.preset.reviewedAt ? (
                  <small>复核于 {resolvedPreset.preset.reviewedAt}</small>
                ) : (
                  <small>通用假设，无平台来源</small>
                )}
                {resolvedPreset.preset.sourceUrl ? (
                  <a href={resolvedPreset.preset.sourceUrl} target="_blank" rel="noreferrer">
                    官方来源 <ExternalLink size={13} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </section>
          </div>
        </details>
      </article>

      <ResultPanel result={result} currency={currency} />
    </section>
  );
}
