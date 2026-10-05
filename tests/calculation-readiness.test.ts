import { describe, expect, it } from "vitest";
import { DEFAULT_PROFIT_INPUT } from "@/src/domain/profit/calculate";
import { assessCalculationReadiness } from "@/src/domain/profit/readiness";

describe("assessCalculationReadiness", () => {
  it("treats the visible generic assumptions as usable planning coverage", () => {
    const readiness = assessCalculationReadiness(DEFAULT_PROFIT_INPUT, {
      feeVerificationRequired: false,
      feesConfirmed: true,
    });

    expect(readiness.needsFeeVerification).toBe(false);
    expect(readiness.coveredCount).toBe(8);
    expect(readiness.totalCount).toBe(9);
    expect(readiness.suggestedChecks).toEqual(["税费预留"]);
  });

  it("keeps marketplace fees uncovered until explicitly confirmed", () => {
    const readiness = assessCalculationReadiness(
      {
        ...DEFAULT_PROFIT_INPUT,
        platformFeeRate: 5,
        paymentFeeRate: 1,
      },
      { feeVerificationRequired: true, feesConfirmed: false },
    );

    expect(readiness.needsFeeVerification).toBe(true);
    expect(readiness.checks.find((check) => check.id === "fees")?.covered).toBe(false);
    expect(readiness.suggestedChecks).toContain("平台 / 支付费");
  });

  it("accepts a merchant-confirmed zero fee without claiming an official rate", () => {
    const readiness = assessCalculationReadiness(
      {
        ...DEFAULT_PROFIT_INPUT,
        platformFeeRate: 0,
        paymentFeeRate: 0,
        paymentFixedFee: 0,
      },
      { feeVerificationRequired: true, feesConfirmed: true },
    );

    expect(readiness.needsFeeVerification).toBe(false);
    expect(readiness.checks.find((check) => check.id === "fees")?.covered).toBe(true);
    expect(readiness.suggestedChecks).not.toContain("平台 / 支付费");
  });

  it("lists zero-value cost areas as suggestions instead of validation errors", () => {
    const readiness = assessCalculationReadiness(
      {
        ...DEFAULT_PROFIT_INPUT,
        fulfillmentCost: 0,
        packagingCost: 0,
        otherFixedCost: 0,
        advertisingCost: 0,
        refundLossRate: 0,
        taxRate: 0,
      },
      { feeVerificationRequired: false, feesConfirmed: true },
    );

    expect(readiness.suggestedChecks).toEqual([
      "物流 / 履约",
      "包装 / 其他成本",
      "推广获客",
      "退款 / 售后",
      "税费预留",
    ]);
  });

  it("surfaces creator, return, and recurring assumptions in professional mode", () => {
    const readiness = assessCalculationReadiness(
      {
        ...DEFAULT_PROFIT_INPUT,
        calculationMode: "professional",
        salesChannel: "creator",
        creatorCommissionRate: 0,
        creatorCommissionFixed: 0,
        returnRate: 0,
        monthlyOrders: 0,
        monthlyPlatformCost: 300,
      },
      { feeVerificationRequired: true, feesConfirmed: true },
    );

    expect(readiness.suggestedChecks).toContain("达人 / 分销佣金");
    expect(readiness.suggestedChecks).toContain("退货 / 售后");
    expect(readiness.suggestedChecks).toContain("月成本分摊");
  });

  it("recognizes complete professional creator and return assumptions", () => {
    const readiness = assessCalculationReadiness(
      {
        ...DEFAULT_PROFIT_INPUT,
        calculationMode: "professional",
        salesChannel: "creator",
        creatorCommissionRate: 12,
        returnRate: 15,
        returnShippingCost: 8,
        monthlyOrders: 200,
        monthlyOperatingCost: 1000,
      },
      { feeVerificationRequired: true, feesConfirmed: true },
    );

    expect(readiness.checks.find((check) => check.id === "acquisition")?.covered).toBe(true);
    expect(readiness.checks.find((check) => check.id === "after-sales")?.covered).toBe(true);
    expect(readiness.checks.find((check) => check.id === "monthly-plan")?.covered).toBe(true);
  });
});
