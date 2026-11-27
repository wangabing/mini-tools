"use client";

import { ChevronDown, ExternalLink, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { ResultPanel } from "./ResultPanel";
import { ScenarioWorkspace } from "./ScenarioWorkspace";
import { PlatformHandoff } from "./PlatformHandoff";
import { NumberField } from "@/components/ui/NumberField";
import {
  getCategories,
  PLATFORMS,
  resolvePreset,
  SOURCE_ACCESS_LABELS,
  type CategoryId,
  type PlatformId,
} from "@/src/data/presets";
import {
  getProfessionalTemplate,
  isProfessionalTemplateReviewDue,
} from "@/src/data/professional-templates";
import { calculateProfit, DEFAULT_PROFIT_INPUT } from "@/src/domain/profit/calculate";
import { CURRENCY_SYMBOLS } from "@/src/domain/profit/format";
import { assessCalculationReadiness, type ReadinessCheckId } from "@/src/domain/profit/readiness";
import { isScenarioCurrent, type SavedScenario } from "@/src/domain/profit/scenarios";
import type {
  CalculationMode,
  FeeBasis,
  ProfitInput,
  ProfitInputKey,
  SalesChannel,
} from "@/src/domain/profit/types";

type FeeInputKey =
  | "platformFeeRate"
  | "platformFeeFixed"
  | "paymentFeeRate"
  | "paymentFixedFee"
  | "creatorCommissionRate"
  | "creatorCommissionFixed"
  | "refundLossRate";

const FEE_KEYS: readonly FeeInputKey[] = [
  "platformFeeRate",
  "platformFeeFixed",
  "paymentFeeRate",
  "paymentFixedFee",
  "creatorCommissionRate",
  "creatorCommissionFixed",
  "refundLossRate",
];

const FEE_VERIFICATION_KEYS: readonly FeeInputKey[] = [
  "platformFeeRate",
  "platformFeeFixed",
  "paymentFeeRate",
  "paymentFixedFee",
  "creatorCommissionRate",
  "creatorCommissionFixed",
];

const FEE_BASE_OPTIONS: readonly { value: FeeBasis; label: string }[] = [
  { value: "item-amount", label: "优惠后商品金额" },
  { value: "buyer-paid", label: "买家实付（含运费）" },
  { value: "seller-settlement", label: "商家结算（含平台补贴）" },
];

const SALES_CHANNEL_OPTIONS: readonly { value: SalesChannel; label: string }[] = [
  { value: "organic", label: "自然 / 店铺成交" },
  { value: "advertising", label: "广告投放成交" },
  { value: "creator", label: "达人 / 分销成交" },
];

interface BasisFieldProps {
  id: string;
  label: string;
  value: FeeBasis;
  onChange: (value: FeeBasis) => void;
}

function BasisField({ id, label, value, onChange }: BasisFieldProps) {
  return (
    <label className="select-field fee-basis-field" htmlFor={id}>
      <span>{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as FeeBasis)}
      >
        {FEE_BASE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProfitCalculator() {
  const [platformId, setPlatformId] = useState<PlatformId>("generic");
  const [categoryId, setCategoryId] = useState<CategoryId>("generic");
  const [input, setInput] = useState<ProfitInput>(DEFAULT_PROFIT_INPUT);
  const [manualOverrides, setManualOverrides] = useState<Set<FeeInputKey>>(() => new Set());
  const [feesConfirmed, setFeesConfirmed] = useState(true);
  const [isExample, setIsExample] = useState(true);
  const [acknowledgedZeroCosts, setAcknowledgedZeroCosts] = useState<ReadinessCheckId[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [revision, setRevision] = useState(0);

  const categories = getCategories(platformId);
  const resolvedPreset = useMemo(
    () => resolvePreset(platformId, categoryId),
    [platformId, categoryId],
  );
  const professionalTemplate = useMemo(
    () => getProfessionalTemplate(platformId),
    [platformId],
  );
  const isTemplateReviewDue = isProfessionalTemplateReviewDue(professionalTemplate);
  const result = useMemo(() => calculateProfit(input), [input]);
  const readiness = useMemo(
    () => assessCalculationReadiness(input, {
      feeVerificationRequired: resolvedPreset.preset.verificationRequired,
      feesConfirmed,
      acknowledgedZeroCosts,
    }),
    [feesConfirmed, input, resolvedPreset.preset.verificationRequired, acknowledgedZeroCosts],
  );
  const currencySymbol = CURRENCY_SYMBOLS.CNY;
  const activeAdvancedCount = (
    input.calculationMode === "professional"
      ? [
          input.buyerShipping,
          input.discount,
          input.platformSubsidy,
          input.packagingCost,
          input.insuranceCost,
          input.otherFixedCost,
          input.platformFeeRate,
          input.platformFeeFixed,
          input.paymentFeeRate,
          input.paymentFixedFee,
          input.creatorCommissionRate,
          input.creatorCommissionFixed,
          input.taxRate,
          input.returnRate,
          input.returnShippingCost,
          input.returnHandlingCost,
          input.returnValueLossRate,
          input.nonRefundableFeeRate,
          input.monthlyPlatformCost,
          input.monthlyOperatingCost,
        ]
      : [
          input.buyerShipping,
          input.discount,
          input.packagingCost,
          input.paymentFixedFee,
          input.taxRate,
          input.refundLossRate,
          input.otherFixedCost,
        ]
  ).filter((value) => value > 0).length;

  function updateInput(key: ProfitInputKey, value: number, trackOverride = false) {
    if (isExample) setFeesConfirmed(false);
    setIsExample(false);
    setInput((current) => ({ ...current, [key]: value }));
    const areas: Partial<Record<ProfitInputKey, ReadinessCheckId>> = {
      productCost: "product", fulfillmentCost: "fulfillment", packagingCost: "order-costs",
      otherFixedCost: "order-costs", insuranceCost: "order-costs", advertisingCost: "acquisition",
      creatorCommissionRate: "acquisition", creatorCommissionFixed: "acquisition",
      refundLossRate: "after-sales", returnRate: "after-sales", returnShippingCost: "after-sales",
      returnHandlingCost: "after-sales", returnValueLossRate: "after-sales", nonRefundableFeeRate: "after-sales", taxRate: "tax",
    };
    setAcknowledgedZeroCosts((current) => current.filter((area) => area !== areas[key]));
    if (trackOverride && FEE_KEYS.includes(key as FeeInputKey)) {
      setManualOverrides((current) => new Set(current).add(key as FeeInputKey));
      if (
        FEE_VERIFICATION_KEYS.includes(key as FeeInputKey)
      ) {
        setFeesConfirmed(false);
      }
    }
  }

  function updateCalculationMode(calculationMode: CalculationMode) {
    setIsExample(false);
    setFeesConfirmed(false);
    setAcknowledgedZeroCosts([]);
    setAdvancedOpen(calculationMode === "professional");
    setInput((current) => ({ ...current, calculationMode }));
  }

  function updateSalesChannel(salesChannel: SalesChannel) {
    setIsExample(false);
    setFeesConfirmed(false);
    setAcknowledgedZeroCosts((current) => current.filter((id) => id !== "acquisition"));
    setInput((current) => ({ ...current, salesChannel }));
  }

  function updateFeeBasis(
    key: "platformFeeBase" | "paymentFeeBase" | "creatorCommissionBase" | "taxFeeBase",
    value: FeeBasis,
  ) {
    setIsExample(false);
    setFeesConfirmed(false);
    setInput((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(nextPlatformId: PlatformId, nextCategoryId: CategoryId) {
    setIsExample(false);
    setAcknowledgedZeroCosts([]);
    const { preset } = resolvePreset(nextPlatformId, nextCategoryId);
    const template = getProfessionalTemplate(nextPlatformId);
    setInput((current) => ({
      ...current,
      platformFeeRate: preset.platformFeeRate,
      platformFeeFixed: 0,
      platformFeeBase: template.suggestedBases.platform,
      paymentFeeRate: preset.paymentFeeRate,
      paymentFixedFee: preset.paymentFixedFee,
      paymentFeeBase: template.suggestedBases.payment,
      creatorCommissionRate: 0,
      creatorCommissionFixed: 0,
      creatorCommissionBase: template.suggestedBases.creator,
      taxFeeBase: template.suggestedBases.tax,
      refundLossRate: preset.refundLossRate,
    }));
    setManualOverrides(new Set());
    setFeesConfirmed(false);
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
    setInput(DEFAULT_PROFIT_INPUT);
    setManualOverrides(new Set());
    setFeesConfirmed(true);
    setIsExample(true);
    setAcknowledgedZeroCosts([]);
    setAdvancedOpen(false);
    setRevision((current) => current + 1);
  }

  function startPersonalPlan() {
    const empty = Object.fromEntries(Object.entries(DEFAULT_PROFIT_INPUT).map(([key, value]) => [key, typeof value === "number" ? 0 : value])) as unknown as ProfitInput;
    setInput({ ...empty, targetMarginRate: 20, monthlyOrders: 100 });
    setIsExample(false);
    setFeesConfirmed(false);
    setAcknowledgedZeroCosts([]);
    setManualOverrides(new Set());
    setRevision((current) => current + 1);
  }

  function restoreScenario(plan: SavedScenario) {
    const current = isScenarioCurrent(plan);
    setPlatformId(plan.platformId);
    setCategoryId(plan.categoryId);
    setInput({ ...plan.input });
    setFeesConfirmed(current && plan.feesConfirmed);
    setAcknowledgedZeroCosts(current ? plan.acknowledgedZeroCosts : []);
    setManualOverrides(new Set(plan.manualOverrides.filter((key): key is FeeInputKey => FEE_KEYS.includes(key as FeeInputKey))));
    setIsExample(plan.isExample);
    setAdvancedOpen(plan.input.calculationMode === "professional");
    setRevision((currentRevision) => currentRevision + 1);
  }

  return (
    <>
    <Suspense fallback={null}><PlatformHandoff onSelect={handlePlatformChange} /></Suspense>
    <section className="calculator-grid" aria-label="电商利润计算器">
      <article className="input-panel" id="calculator-inputs" key={revision}>
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

        <div className="plan-start">
          {isExample ? <><span>正在查看示例，金额与费率不代表你的店铺。</span><button type="button" onClick={startPersonalPlan}>填写我的商品</button></> : <><span>修改售价或成本，结果即时更新。</span><a href="#saved-plans">保存与对比 ↓</a></>}
        </div>
            <div className="calculation-mode" aria-label="核算模式">
              <span>核算模式</span>
              <div role="group" aria-label="选择核算模式">
                <button
                  type="button"
                  aria-pressed={input.calculationMode === "quick"}
                  onClick={() => updateCalculationMode("quick")}
                >
                  快速估算
                </button>
                <button
                  type="button"
                  aria-pressed={input.calculationMode === "professional"}
                  onClick={() => updateCalculationMode("professional")}
                >
                  专业核算
                </button>
              </div>
            </div>
        <p className="mode-help">{input.calculationMode === "quick" ? "先填售价和核心成本，快速看利润空间。" : "按每笔发出订单核算，包含退货回收与月费分摊。"}</p>

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

          <div className="select-field select-field--currency">
            <span>币种</span>
            <div className="currency-readout" aria-label="币种：人民币 CNY，不换算汇率">
              <strong>人民币 CNY</strong>
              <small>不换算汇率</small>
            </div>
          </div>
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
            <span>{input.calculationMode === "professional" ? "核算模式" : "当前费率"}</span>
            <strong>
              {input.calculationMode === "professional"
                ? "专业核算"
                : `${result.totalVariableRate.toFixed(1)}%`}
            </strong>
          </div>
          <div>
            <span>费率状态</span>
            <strong className={readiness.needsFeeVerification ? "verification-required" : undefined}>
              {isExample ? "示例假设" : feesConfirmed ? "已自行核对" : "待核对"}
            </strong>
          </div>
          <small>
            {!isExample && readiness.needsFeeVerification
              ? "当前 0 费率不代表免佣，请在高级设置填入后台或合同费率"
              : resolvedPreset.preset.verificationRequired
                ? "按你确认的费用估算，平台规则变化后请重新核对"
              : resolvedPreset.resolution === "category"
                ? "已应用类目参考"
                : `通用假设：支付${input.paymentFeeRate}%、退款预留${input.refundLossRate}%，请按实际修改`}
          </small>
        </div>

        {!isExample ? (
          <label className="fee-confirmation">
            <input
              type="checkbox"
              checked={feesConfirmed}
              onChange={(event) => { setFeesConfirmed(event.target.checked); setIsExample(false); }}
            />
            <span>
              <strong>我已按后台或合同核对当前费用</strong>
              <small>仅确认你的输入，不代表平台官方认证</small>
            </span>
          </label>
        ) : null}

        <details className="advanced-settings" open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}>
          <summary>
            <span>
              高级设置
              <small>{activeAdvancedCount} 项已计入</small>
            </span>
            <ChevronDown size={18} aria-hidden="true" />
          </summary>

          <div className="advanced-settings__body">


            {input.calculationMode === "quick" ? (
              <>
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
              </>
            ) : (
              <div className="professional-settings">
                <section aria-labelledby="professional-revenue-title">
                  <div className="subsection-title">
                    <h3 id="professional-revenue-title">收入与订单成本</h3>
                    <small>01</small>
                  </div>
                  <div className="advanced-grid">
                    <NumberField id="professional-buyer-shipping" label="买家支付运费" prefix={currencySymbol} value={input.buyerShipping} onChange={(value) => updateInput("buyerShipping", value)} />
                    <NumberField id="professional-discount" label="商家承担优惠" prefix={currencySymbol} value={input.discount} onChange={(value) => updateInput("discount", value)} />
                    <NumberField id="platform-subsidy" label="平台补贴收入" prefix={currencySymbol} value={input.platformSubsidy} onChange={(value) => updateInput("platformSubsidy", value)} />
                    <NumberField id="professional-packaging" label="包装成本" prefix={currencySymbol} value={input.packagingCost} onChange={(value) => updateInput("packagingCost", value)} />
                    <NumberField id="insurance-cost" label="运费险 / 保险" prefix={currencySymbol} value={input.insuranceCost} onChange={(value) => updateInput("insuranceCost", value)} />
                    <NumberField id="professional-other-cost" label="其他单笔成本" prefix={currencySymbol} value={input.otherFixedCost} onChange={(value) => updateInput("otherFixedCost", value)} />
                  </div>
                </section>

                <section aria-labelledby="professional-fees-title">
                  <div className="subsection-title">
                    <h3 id="professional-fees-title">成交渠道与平台费用</h3>
                    {manualOverrides.size > 0 ? <small className="manual-badge">已手动调整</small> : <small>02</small>}
                  </div>
                  <label className="select-field professional-channel">
                    <span>成交渠道</span>
                    <select
                      aria-label="成交渠道"
                      value={input.salesChannel}
                      onChange={(event) => updateSalesChannel(event.target.value as SalesChannel)}
                    >
                      {SALES_CHANNEL_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="fee-rule">
                    <strong>{professionalTemplate.platformFeeLabel}</strong>
                    <div className="fee-rule__fields">
                      <NumberField id="professional-platform-rate" label="费率" suffix="%" value={input.platformFeeRate} max={100} onChange={(value) => updateInput("platformFeeRate", value, true)} testId="platform-fee" />
                      <NumberField id="professional-platform-fixed" label="每单固定费" prefix={currencySymbol} value={input.platformFeeFixed} onChange={(value) => updateInput("platformFeeFixed", value, true)} />
                      <BasisField id="platform-fee-base" label="计费基数" value={input.platformFeeBase} onChange={(value) => updateFeeBasis("platformFeeBase", value)} />
                    </div>
                  </div>

                  <div className="fee-rule">
                    <strong>{professionalTemplate.paymentFeeLabel}</strong>
                    <div className="fee-rule__fields">
                      <NumberField id="professional-payment-rate" label="费率" suffix="%" value={input.paymentFeeRate} max={100} onChange={(value) => updateInput("paymentFeeRate", value, true)} />
                      <NumberField id="professional-payment-fixed" label="每单固定费" prefix={currencySymbol} value={input.paymentFixedFee} onChange={(value) => updateInput("paymentFixedFee", value, true)} />
                      <BasisField id="payment-fee-base" label="计费基数" value={input.paymentFeeBase} onChange={(value) => updateFeeBasis("paymentFeeBase", value)} />
                    </div>
                  </div>

                  {input.salesChannel === "creator" ? (
                    <div className="fee-rule" data-testid="creator-fee-fields">
                      <strong>{professionalTemplate.creatorCommissionLabel}</strong>
                      <div className="fee-rule__fields">
                        <NumberField id="creator-commission-rate" label="佣金率" suffix="%" value={input.creatorCommissionRate} max={100} onChange={(value) => updateInput("creatorCommissionRate", value, true)} />
                        <NumberField id="creator-commission-fixed" label="每单固定佣金" prefix={currencySymbol} value={input.creatorCommissionFixed} onChange={(value) => updateInput("creatorCommissionFixed", value, true)} />
                        <BasisField id="creator-commission-base" label="佣金基数" value={input.creatorCommissionBase} onChange={(value) => updateFeeBasis("creatorCommissionBase", value)} />
                      </div>
                    </div>
                  ) : null}

                  <div className="fee-rule">
                    <strong>税费预留</strong>
                    <div className="fee-rule__fields fee-rule__fields--two">
                      <NumberField id="professional-tax-rate" label="预留比例" suffix="%" value={input.taxRate} max={100} onChange={(value) => updateInput("taxRate", value)} />
                      <BasisField id="tax-fee-base" label="计算基数" value={input.taxFeeBase} onChange={(value) => updateFeeBasis("taxFeeBase", value)} />
                    </div>
                  </div>
                </section>

                <section aria-labelledby="professional-return-title">
                  <div className="subsection-title">
                    <h3 id="professional-return-title">售后风险</h3>
                    <small>03</small>
                  </div>
                  <p className="mode-help">按发出订单统计全额退货；退款收入与可回收货品会一并扣回。暂不含部分退款。交易费不退比例对平台、支付和达人费用统一适用。</p>
                  <div className="advanced-grid">
                    <NumberField id="return-rate" label="预计退货率" suffix="%" value={input.returnRate} max={100} onChange={(value) => updateInput("returnRate", value)} />
                    <NumberField id="return-shipping" label="单次逆向运费" prefix={currencySymbol} value={input.returnShippingCost} onChange={(value) => updateInput("returnShippingCost", value)} />
                    <NumberField id="return-handling" label="单次处理成本" prefix={currencySymbol} value={input.returnHandlingCost} onChange={(value) => updateInput("returnHandlingCost", value)} />
                    <NumberField id="return-value-loss" label="货值损失比例" suffix="%" value={input.returnValueLossRate} max={100} onChange={(value) => updateInput("returnValueLossRate", value)} />
                    <NumberField id="nonrefundable-fee" label="交易费不退比例" suffix="%" value={input.nonRefundableFeeRate} max={100} onChange={(value) => updateInput("nonRefundableFeeRate", value)} />
                  </div>
                </section>

                <section aria-labelledby="professional-monthly-title">
                  <div className="subsection-title">
                    <h3 id="professional-monthly-title">月度规划</h3>
                    <small>04</small>
                  </div>
                  <div className="advanced-grid">
                    <NumberField id="monthly-platform-cost" label="平台 / 软件月费" prefix={currencySymbol} value={input.monthlyPlatformCost} onChange={(value) => updateInput("monthlyPlatformCost", value)} />
                    <NumberField id="monthly-operating-cost" label="运营固定月成本" prefix={currencySymbol} value={input.monthlyOperatingCost} onChange={(value) => updateInput("monthlyOperatingCost", value)} />
                    <NumberField id="professional-monthly-orders" label="预计月订单" hint="专业模式按发出订单计数" suffix="单" value={input.monthlyOrders} step={1} onChange={(value) => updateInput("monthlyOrders", value)} />
                    <NumberField id="professional-target-margin" label="目标利润率" suffix="%" value={input.targetMarginRate} max={95} onChange={(value) => updateInput("targetMarginRate", value)} />
                  </div>
                </section>
              </div>
            )}

            <section className="preset-source" aria-label="费率参考来源">
              <div>
                <span>费用参考</span>
                <strong>{resolvedPreset.preset.market}</strong>
              </div>
              <div className="preset-source__status">
                <span>
                  {SOURCE_ACCESS_LABELS[
                    input.calculationMode === "professional"
                      ? professionalTemplate.sourceAccess
                      : resolvedPreset.preset.sourceAccess
                  ]}
                </span>
                {resolvedPreset.preset.verificationRequired ? <strong>费率待核对</strong> : null}
                {input.calculationMode === "professional" && isTemplateReviewDue ? (
                  <strong>模板待复核</strong>
                ) : null}
              </div>
              <p>{resolvedPreset.preset.verification}</p>
              <p>{resolvedPreset.preset.note}</p>
              <div>
                {input.calculationMode === "professional" ? (
                  <small>
                    {professionalTemplate.version} · 复核于 {professionalTemplate.reviewedAt} · {isTemplateReviewDue ? "已到复核时间" : `下次复核 ${professionalTemplate.nextReviewAt}`}
                  </small>
                ) : resolvedPreset.preset.reviewedAt ? (
                  <small>复核于 {resolvedPreset.preset.reviewedAt}</small>
                ) : (
                  <small>通用假设，无平台来源</small>
                )}
                {(input.calculationMode === "professional"
                  ? professionalTemplate.sourceUrl
                  : resolvedPreset.preset.sourceUrl) ? (
                  <a href={(input.calculationMode === "professional" ? professionalTemplate.sourceUrl : resolvedPreset.preset.sourceUrl) ?? undefined} target="_blank" rel="noreferrer">
                    官方来源 <ExternalLink size={13} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              {input.calculationMode === "professional" ? (
                <ul className="preset-source__checklist">
                  {professionalTemplate.checklist.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </section>
          </div>
        </details>
      </article>

      <ResultPanel result={result} currency="CNY" readiness={readiness} isExample={isExample}
        onAcknowledge={(id) => { setAcknowledgedZeroCosts((current) => [...current, id]); setIsExample(false); }} />
    </section>
    <ScenarioWorkspace draft={{ platformId, categoryId, input, feesConfirmed, acknowledgedZeroCosts, manualOverrides: [...manualOverrides], isExample }} onRestore={restoreScenario} />
    </>
  );
}
