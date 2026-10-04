import type { ProfitInput, ProfitInputKey, ProfitResult } from "./types";

export const DEFAULT_PROFIT_INPUT: ProfitInput = {
  itemPrice: 199,
  buyerShipping: 0,
  discount: 0,
  productCost: 68,
  fulfillmentCost: 18,
  packagingCost: 3,
  advertisingCost: 22,
  otherFixedCost: 0,
  platformFeeRate: 0,
  paymentFeeRate: 3,
  paymentFixedFee: 0,
  taxRate: 0,
  refundLossRate: 3,
  targetMarginRate: 20,
  monthlyOrders: 100,
};

const AMOUNT_KEYS: ProfitInputKey[] = [
  "itemPrice",
  "buyerShipping",
  "discount",
  "productCost",
  "fulfillmentCost",
  "packagingCost",
  "advertisingCost",
  "otherFixedCost",
  "paymentFixedFee",
];

const RATE_KEYS: ProfitInputKey[] = [
  "platformFeeRate",
  "paymentFeeRate",
  "taxRate",
  "refundLossRate",
  "targetMarginRate",
];

export function normalizeProfitInput(input: ProfitInput): ProfitInput {
  const normalized = { ...input };

  for (const key of AMOUNT_KEYS) {
    normalized[key] = nonNegative(input[key]);
  }

  for (const key of RATE_KEYS) {
    normalized[key] = nonNegative(input[key]);
  }

  normalized.monthlyOrders = Math.floor(nonNegative(input.monthlyOrders));
  return normalized;
}

export function calculateProfit(rawInput: ProfitInput): ProfitResult {
  const input = normalizeProfitInput(rawInput);
  const grossRevenue = Math.max(0, input.itemPrice + input.buyerShipping - input.discount);

  const totalVariableRate =
    input.platformFeeRate +
    input.paymentFeeRate +
    input.taxRate +
    input.refundLossRate;
  const variableRateDecimal = totalVariableRate / 100;
  const hasValidVariableRate = totalVariableRate < 100;

  const platformFee = grossRevenue * (input.platformFeeRate / 100);
  const paymentPercentageFee = grossRevenue * (input.paymentFeeRate / 100);
  const paymentFee = paymentPercentageFee + input.paymentFixedFee;
  const taxAllowance = grossRevenue * (input.taxRate / 100);
  const refundLoss = grossRevenue * (input.refundLossRate / 100);
  const percentageCosts = platformFee + paymentPercentageFee + taxAllowance + refundLoss;

  const fixedCosts =
    input.productCost +
    input.fulfillmentCost +
    input.packagingCost +
    input.advertisingCost +
    input.otherFixedCost +
    input.paymentFixedFee;
  const totalCosts = fixedCosts + percentageCosts;
  const profit = grossRevenue - totalCosts;
  const profitMargin = grossRevenue > 0 ? (profit / grossRevenue) * 100 : 0;
  const roi = totalCosts > 0 ? (profit / totalCosts) * 100 : null;

  const breakEvenGrossRevenue = hasValidVariableRate
    ? fixedCosts / (1 - variableRateDecimal)
    : null;
  const breakEvenItemPrice =
    breakEvenGrossRevenue === null
      ? null
      : Math.max(0, breakEvenGrossRevenue - input.buyerShipping + input.discount);

  const targetDenominator =
    1 - variableRateDecimal - input.targetMarginRate / 100;
  const targetGrossRevenue = targetDenominator > 0 ? fixedCosts / targetDenominator : null;
  const targetItemPrice =
    targetGrossRevenue === null
      ? null
      : Math.max(0, targetGrossRevenue - input.buyerShipping + input.discount);

  const nonAdvertisingCosts = totalCosts - input.advertisingCost;
  const maximumAdvertisingCost = Math.max(0, grossRevenue - nonAdvertisingCosts);
  const breakEvenRoas = maximumAdvertisingCost > 0 ? grossRevenue / maximumAdvertisingCost : null;

  const costBreakdown = [
    { id: "product" as const, label: "商品", value: input.productCost },
    { id: "fulfillment" as const, label: "履约", value: input.fulfillmentCost },
    { id: "advertising" as const, label: "广告", value: input.advertisingCost },
    { id: "fees" as const, label: "平台与支付", value: platformFee + paymentFee },
    { id: "risk" as const, label: "税费与退款", value: taxAllowance + refundLoss },
    {
      id: "other" as const,
      label: "包装与其他",
      value: input.packagingCost + input.otherFixedCost,
    },
  ];

  return {
    input,
    grossRevenue,
    platformFee,
    paymentFee,
    taxAllowance,
    refundLoss,
    percentageCosts,
    fixedCosts,
    totalCosts,
    profit,
    profitMargin,
    roi,
    totalVariableRate,
    breakEvenItemPrice,
    targetItemPrice,
    maximumAdvertisingCost,
    breakEvenRoas,
    monthlyProfit: profit * input.monthlyOrders,
    costBreakdown,
    validationMessage: hasValidVariableRate
      ? targetDenominator > 0
        ? null
        : "费率与目标利润率合计过高，无法反推目标售价。"
      : "平台、支付、税费和退款费率合计必须低于 100%。",
  };
}

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
