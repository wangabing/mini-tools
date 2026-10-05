import type { ProfitInput } from "./types";

export type ReadinessCheckId =
  | "revenue"
  | "product"
  | "fulfillment"
  | "order-costs"
  | "acquisition"
  | "fees"
  | "after-sales"
  | "tax"
  | "monthly-plan";

export interface ReadinessCheck {
  id: ReadinessCheckId;
  label: string;
  covered: boolean;
}

export interface CalculationReadiness {
  coveredCount: number;
  totalCount: number;
  needsFeeVerification: boolean;
  suggestedChecks: string[];
  checks: ReadinessCheck[];
}

interface ReadinessOptions {
  feeVerificationRequired: boolean;
  feesConfirmed: boolean;
}

export function assessCalculationReadiness(
  input: ProfitInput,
  { feeVerificationRequired, feesConfirmed }: ReadinessOptions,
): CalculationReadiness {
  const needsFeeVerification = feeVerificationRequired && !feesConfirmed;
  const isProfessional = input.calculationMode === "professional";
  const hasCreatorFee =
    input.creatorCommissionRate > 0 || input.creatorCommissionFixed > 0;
  const hasFeeAssumption =
    input.platformFeeRate > 0 ||
    input.platformFeeFixed > 0 ||
    input.paymentFeeRate > 0 ||
    input.paymentFixedFee > 0 ||
    (isProfessional && input.salesChannel === "creator" && hasCreatorFee);
  const hasProfessionalReturnLoss =
    input.returnShippingCost > 0 ||
    input.returnHandlingCost > 0 ||
    (input.productCost > 0 && input.returnValueLossRate > 0) ||
    input.nonRefundableFeeRate > 0;
  const hasRecurringCosts = input.monthlyPlatformCost > 0 || input.monthlyOperatingCost > 0;

  const checks: ReadinessCheck[] = [
    { id: "revenue", label: "商品售价", covered: input.itemPrice > 0 },
    { id: "product", label: "商品成本", covered: input.productCost > 0 },
    { id: "fulfillment", label: "物流 / 履约", covered: input.fulfillmentCost > 0 },
    {
      id: "order-costs",
      label: "包装 / 其他成本",
      covered:
        input.packagingCost > 0 ||
        input.otherFixedCost > 0 ||
        (isProfessional && input.insuranceCost > 0),
    },
    {
      id: "acquisition",
      label:
        isProfessional && input.salesChannel === "creator"
          ? "达人 / 分销佣金"
          : "推广获客",
      covered:
        isProfessional && input.salesChannel === "creator"
          ? hasCreatorFee
          : input.advertisingCost > 0,
    },
    {
      id: "fees",
      label: "平台 / 支付费",
      covered: feeVerificationRequired ? feesConfirmed : hasFeeAssumption,
    },
    {
      id: "after-sales",
      label: isProfessional ? "退货 / 售后" : "退款 / 售后",
      covered: isProfessional
        ? input.returnRate > 0 && hasProfessionalReturnLoss
        : input.refundLossRate > 0,
    },
    { id: "tax", label: "税费预留", covered: input.taxRate > 0 },
    {
      id: "monthly-plan",
      label: isProfessional && hasRecurringCosts ? "月成本分摊" : "月订单计划",
      covered: input.monthlyOrders > 0,
    },
  ];

  const coveredCount = checks.filter((check) => check.covered).length;

  return {
    coveredCount,
    totalCount: checks.length,
    needsFeeVerification,
    suggestedChecks: checks.filter((check) => !check.covered).map((check) => check.label),
    checks,
  };
}
