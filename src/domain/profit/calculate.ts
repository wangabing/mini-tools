import type {
  CalculationMode,
  FeeBasis,
  ProfitInput,
  ProfitInputKey,
  ProfitResult,
  SalesChannel,
} from "./types";

export const DEFAULT_PROFIT_INPUT: ProfitInput = {
  calculationMode: "quick",
  salesChannel: "organic",
  itemPrice: 199,
  buyerShipping: 0,
  discount: 0,
  platformSubsidy: 0,
  productCost: 68,
  fulfillmentCost: 18,
  packagingCost: 3,
  advertisingCost: 22,
  insuranceCost: 0,
  otherFixedCost: 0,
  platformFeeRate: 0,
  platformFeeFixed: 0,
  platformFeeBase: "buyer-paid",
  paymentFeeRate: 3,
  paymentFixedFee: 0,
  paymentFeeBase: "buyer-paid",
  creatorCommissionRate: 0,
  creatorCommissionFixed: 0,
  creatorCommissionBase: "seller-settlement",
  taxRate: 0,
  taxFeeBase: "seller-settlement",
  refundLossRate: 3,
  returnRate: 0,
  returnShippingCost: 0,
  returnHandlingCost: 0,
  returnValueLossRate: 0,
  nonRefundableFeeRate: 0,
  targetMarginRate: 20,
  monthlyOrders: 100,
  monthlyPlatformCost: 0,
  monthlyOperatingCost: 0,
};

const AMOUNT_KEYS: ProfitInputKey[] = [
  "itemPrice",
  "buyerShipping",
  "discount",
  "platformSubsidy",
  "productCost",
  "fulfillmentCost",
  "packagingCost",
  "advertisingCost",
  "insuranceCost",
  "otherFixedCost",
  "platformFeeFixed",
  "paymentFixedFee",
  "creatorCommissionFixed",
  "returnShippingCost",
  "returnHandlingCost",
  "monthlyPlatformCost",
  "monthlyOperatingCost",
];

const RATE_KEYS: ProfitInputKey[] = [
  "platformFeeRate",
  "paymentFeeRate",
  "creatorCommissionRate",
  "taxRate",
  "refundLossRate",
  "returnRate",
  "returnValueLossRate",
  "nonRefundableFeeRate",
  "targetMarginRate",
];

export function normalizeProfitInput(input: ProfitInput): ProfitInput {
  const normalized: ProfitInput = {
    ...DEFAULT_PROFIT_INPUT,
    ...input,
    calculationMode: normalizeCalculationMode(input.calculationMode),
    salesChannel: normalizeSalesChannel(input.salesChannel),
    platformFeeBase: normalizeFeeBasis(input.platformFeeBase, "buyer-paid"),
    paymentFeeBase: normalizeFeeBasis(input.paymentFeeBase, "buyer-paid"),
    creatorCommissionBase: normalizeFeeBasis(input.creatorCommissionBase, "seller-settlement"),
    taxFeeBase: normalizeFeeBasis(input.taxFeeBase, "seller-settlement"),
  };

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
  return input.calculationMode === "professional"
    ? calculateProfessionalProfit(input)
    : calculateQuickProfit(input);
}

function calculateQuickProfit(input: ProfitInput): ProfitResult {
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
    itemAmount: Math.max(0, input.itemPrice - input.discount),
    buyerPaid: grossRevenue,
    sellerSettlement: grossRevenue,
    platformFee,
    paymentFee,
    creatorCommission: 0,
    transactionFees: platformFee + paymentFee,
    taxAllowance,
    refundLoss,
    singleReturnLoss: 0,
    expectedReturnLoss: refundLoss,
    recurringCostAllocation: 0,
    monthlyRecurringCosts: 0,
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

interface ProfessionalEvaluation {
  itemAmount: number;
  buyerPaid: number;
  sellerSettlement: number;
  platformPercentageFee: number;
  paymentPercentageFee: number;
  creatorPercentageFee: number;
  platformFee: number;
  paymentFee: number;
  creatorCommission: number;
  transactionFees: number;
  taxAllowance: number;
  singleReturnLoss: number;
  expectedReturnLoss: number;
  recurringCostAllocation: number | null;
  monthlyRecurringCosts: number;
  percentageCosts: number;
  fixedCosts: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  roi: number | null;
}

function calculateProfessionalProfit(input: ProfitInput): ProfitResult {
  const evaluation = evaluateProfessionalOrder(input);
  const hasAllocation = evaluation.recurringCostAllocation !== null;

  const breakEvenItemPrice = hasAllocation
    ? solveProfessionalPrice(input, (candidate) => candidate.profit >= 0)
    : null;
  const targetItemPrice = hasAllocation
    ? solveProfessionalPrice(
        input,
        (candidate) => candidate.profitMargin >= input.targetMarginRate,
      )
    : null;

  const nonAdvertisingCosts = evaluation.totalCosts - input.advertisingCost;
  const maximumAdvertisingCost = hasAllocation
    ? Math.max(0, evaluation.sellerSettlement - nonAdvertisingCosts)
    : null;
  const breakEvenRoas =
    maximumAdvertisingCost !== null && maximumAdvertisingCost > 0
      ? evaluation.sellerSettlement / maximumAdvertisingCost
      : null;

  const totalVariableRate =
    input.platformFeeRate +
    input.paymentFeeRate +
    input.taxRate +
    (input.salesChannel === "creator" ? input.creatorCommissionRate : 0);

  const costBreakdown = [
    { id: "product" as const, label: "商品", value: input.productCost },
    { id: "fulfillment" as const, label: "履约", value: input.fulfillmentCost },
    { id: "advertising" as const, label: "广告", value: input.advertisingCost },
    { id: "fees" as const, label: "交易费用", value: evaluation.transactionFees },
    {
      id: "risk" as const,
      label: "税费与保险",
      value: evaluation.taxAllowance + input.insuranceCost,
    },
    {
      id: "after-sales" as const,
      label: "预期售后损失",
      value: evaluation.expectedReturnLoss,
    },
    {
      id: "recurring" as const,
      label: "月费分摊",
      value: evaluation.recurringCostAllocation ?? 0,
    },
    {
      id: "other" as const,
      label: "包装与其他",
      value: input.packagingCost + input.otherFixedCost,
    },
  ];

  let validationMessage: string | null = null;
  if (!hasAllocation) {
    validationMessage = "有月度固定成本时，预计月订单必须大于 0，才能分摊成本并反推售价。";
  } else if (breakEvenItemPrice === null) {
    validationMessage = "当前费率或成本结构下，无法在安全价格范围内反推售价。";
  } else if (targetItemPrice === null) {
    validationMessage = "当前费率与目标利润率组合下，无法反推目标售价。";
  }

  return {
    input,
    grossRevenue: evaluation.sellerSettlement,
    itemAmount: evaluation.itemAmount,
    buyerPaid: evaluation.buyerPaid,
    sellerSettlement: evaluation.sellerSettlement,
    platformFee: evaluation.platformFee,
    paymentFee: evaluation.paymentFee,
    creatorCommission: evaluation.creatorCommission,
    transactionFees: evaluation.transactionFees,
    taxAllowance: evaluation.taxAllowance,
    refundLoss: evaluation.expectedReturnLoss,
    singleReturnLoss: evaluation.singleReturnLoss,
    expectedReturnLoss: evaluation.expectedReturnLoss,
    recurringCostAllocation: evaluation.recurringCostAllocation,
    monthlyRecurringCosts: evaluation.monthlyRecurringCosts,
    percentageCosts: evaluation.percentageCosts,
    fixedCosts: evaluation.fixedCosts,
    totalCosts: evaluation.totalCosts,
    profit: evaluation.profit,
    profitMargin: evaluation.profitMargin,
    roi: evaluation.roi,
    totalVariableRate,
    breakEvenItemPrice,
    targetItemPrice,
    maximumAdvertisingCost,
    breakEvenRoas,
    monthlyProfit:
      input.monthlyOrders > 0
        ? evaluation.profit * input.monthlyOrders
        : -evaluation.monthlyRecurringCosts,
    costBreakdown,
    validationMessage,
  };
}

function evaluateProfessionalOrder(input: ProfitInput): ProfessionalEvaluation {
  const itemAmount = Math.max(0, input.itemPrice - input.discount);
  const buyerPaid = itemAmount + input.buyerShipping;
  const sellerSettlement = buyerPaid + input.platformSubsidy;
  const bases: Readonly<Record<FeeBasis, number>> = {
    "item-amount": itemAmount,
    "buyer-paid": buyerPaid,
    "seller-settlement": sellerSettlement,
  };

  const platformPercentageFee = bases[input.platformFeeBase] * (input.platformFeeRate / 100);
  const paymentPercentageFee = bases[input.paymentFeeBase] * (input.paymentFeeRate / 100);
  const creatorPercentageFee =
    input.salesChannel === "creator"
      ? bases[input.creatorCommissionBase] * (input.creatorCommissionRate / 100)
      : 0;
  const platformFee = platformPercentageFee + input.platformFeeFixed;
  const paymentFee = paymentPercentageFee + input.paymentFixedFee;
  const creatorCommission =
    input.salesChannel === "creator"
      ? creatorPercentageFee + input.creatorCommissionFixed
      : 0;
  const transactionFees = platformFee + paymentFee + creatorCommission;
  const taxAllowance = bases[input.taxFeeBase] * (input.taxRate / 100);

  const singleReturnLoss =
    input.returnShippingCost +
    input.returnHandlingCost +
    input.productCost * (input.returnValueLossRate / 100) +
    transactionFees * (input.nonRefundableFeeRate / 100);
  const expectedReturnLoss = input.returnRate * singleReturnLoss / 100;

  const monthlyRecurringCosts = input.monthlyPlatformCost + input.monthlyOperatingCost;
  const recurringCostAllocation =
    input.monthlyOrders > 0
      ? monthlyRecurringCosts / input.monthlyOrders
      : monthlyRecurringCosts > 0
        ? null
        : 0;

  const directOrderCosts =
    input.productCost +
    input.fulfillmentCost +
    input.packagingCost +
    input.advertisingCost +
    input.insuranceCost +
    input.otherFixedCost;
  const percentageCosts =
    platformPercentageFee +
    paymentPercentageFee +
    creatorPercentageFee +
    taxAllowance +
    expectedReturnLoss;
  const fixedCosts =
    directOrderCosts +
    input.platformFeeFixed +
    input.paymentFixedFee +
    (input.salesChannel === "creator" ? input.creatorCommissionFixed : 0) +
    (recurringCostAllocation ?? 0);
  const totalCosts = fixedCosts + percentageCosts;
  const profit = sellerSettlement - totalCosts;

  return {
    itemAmount,
    buyerPaid,
    sellerSettlement,
    platformPercentageFee,
    paymentPercentageFee,
    creatorPercentageFee,
    platformFee,
    paymentFee,
    creatorCommission,
    transactionFees,
    taxAllowance,
    singleReturnLoss,
    expectedReturnLoss,
    recurringCostAllocation,
    monthlyRecurringCosts,
    percentageCosts,
    fixedCosts,
    totalCosts,
    profit,
    profitMargin: sellerSettlement > 0 ? (profit / sellerSettlement) * 100 : 0,
    roi: totalCosts > 0 ? (profit / totalCosts) * 100 : null,
  };
}

function solveProfessionalPrice(
  input: ProfitInput,
  meetsTarget: (evaluation: ProfessionalEvaluation) => boolean,
): number | null {
  const atZero = evaluateProfessionalOrder({ ...input, itemPrice: 0 });
  if (meetsTarget(atZero)) return 0;

  const maximumPrice = 1_000_000_000;
  let lower = 0;
  let upper = Math.max(1, input.itemPrice);

  while (upper < maximumPrice) {
    if (meetsTarget(evaluateProfessionalOrder({ ...input, itemPrice: upper }))) break;
    lower = upper;
    upper = Math.min(maximumPrice, upper * 2);
  }

  if (!meetsTarget(evaluateProfessionalOrder({ ...input, itemPrice: upper }))) return null;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (meetsTarget(evaluateProfessionalOrder({ ...input, itemPrice: midpoint }))) {
      upper = midpoint;
    } else {
      lower = midpoint;
    }
  }

  return upper;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function normalizeCalculationMode(value: CalculationMode): CalculationMode {
  return value === "professional" ? "professional" : "quick";
}

function normalizeSalesChannel(value: SalesChannel): SalesChannel {
  return value === "advertising" || value === "creator" ? value : "organic";
}

function normalizeFeeBasis(value: FeeBasis, fallback: FeeBasis): FeeBasis {
  return value === "item-amount" || value === "buyer-paid" || value === "seller-settlement"
    ? value
    : fallback;
}
