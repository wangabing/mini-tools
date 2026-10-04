import { describe, expect, it } from "vitest";
import { calculateProfit, DEFAULT_PROFIT_INPUT } from "@/src/domain/profit/calculate";

describe("calculateProfit", () => {
  it("calculates a profitable order with documented fee bases", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: 100,
      productCost: 30,
      fulfillmentCost: 10,
      packagingCost: 2,
      advertisingCost: 10,
      platformFeeRate: 10,
      paymentFeeRate: 2,
      paymentFixedFee: 0.3,
      refundLossRate: 3,
      monthlyOrders: 20,
    });

    expect(result.grossRevenue).toBe(100);
    expect(result.percentageCosts).toBe(15);
    expect(result.totalCosts).toBeCloseTo(67.3, 10);
    expect(result.profit).toBeCloseTo(32.7, 10);
    expect(result.profitMargin).toBeCloseTo(32.7, 10);
    expect(result.roi).toBeCloseTo(48.5884, 3);
    expect(result.monthlyProfit).toBeCloseTo(654, 10);
  });

  it("preserves a loss instead of clamping it to zero", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: 50,
      productCost: 70,
      fulfillmentCost: 15,
      advertisingCost: 10,
    });

    expect(result.profit).toBeLessThan(0);
    expect(result.profitMargin).toBeLessThan(0);
  });

  it("returns finite values for an empty calculation", () => {
    const empty = Object.fromEntries(
      Object.keys(DEFAULT_PROFIT_INPUT).map((key) => [key, 0]),
    ) as unknown as typeof DEFAULT_PROFIT_INPUT;
    const result = calculateProfit(empty);

    expect(result.grossRevenue).toBe(0);
    expect(result.profit).toBe(0);
    expect(result.profitMargin).toBe(0);
    expect(result.roi).toBeNull();
    expect(result.breakEvenRoas).toBeNull();
    expect(Object.values(result).some((value) => typeof value === "number" && Number.isNaN(value))).toBe(false);
  });

  it("keeps fractional-cent precision inside the model", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: 1,
      productCost: 0,
      fulfillmentCost: 0,
      packagingCost: 0,
      advertisingCost: 0,
      platformFeeRate: 2.9,
      paymentFeeRate: 0,
      refundLossRate: 0,
      monthlyOrders: 1,
    });

    expect(result.platformFee).toBeCloseTo(0.029, 12);
    expect(result.profit).toBeCloseTo(0.971, 12);
  });

  it("normalizes negative and non-finite amounts", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: Number.NaN,
      productCost: -10,
      monthlyOrders: 4.9,
    });

    expect(result.input.itemPrice).toBe(0);
    expect(result.input.productCost).toBe(0);
    expect(result.input.monthlyOrders).toBe(4);
  });

  it("rejects reverse calculations at an impossible variable rate", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      platformFeeRate: 97,
      paymentFeeRate: 3,
      refundLossRate: 0,
    });

    expect(result.breakEvenItemPrice).toBeNull();
    expect(result.targetItemPrice).toBeNull();
    expect(result.validationMessage).toContain("低于 100%");
  });

  it("round-trips the target-margin price through the forward formula", () => {
    const initial = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      buyerShipping: 8,
      discount: 5,
      targetMarginRate: 20,
    });

    expect(initial.targetItemPrice).not.toBeNull();
    const roundTrip = calculateProfit({
      ...initial.input,
      itemPrice: initial.targetItemPrice ?? 0,
    });
    expect(roundTrip.profitMargin).toBeCloseTo(20, 10);
  });

  it("includes buyer shipping and discounts in the percentage fee base", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: 100,
      buyerShipping: 10,
      discount: 5,
      platformFeeRate: 10,
      paymentFeeRate: 0,
      refundLossRate: 0,
    });

    expect(result.grossRevenue).toBe(105);
    expect(result.platformFee).toBe(10.5);
  });

  it("reports no advertising headroom when non-ad costs exceed revenue", () => {
    const result = calculateProfit({
      ...DEFAULT_PROFIT_INPUT,
      itemPrice: 50,
      productCost: 60,
      advertisingCost: 10,
    });

    expect(result.maximumAdvertisingCost).toBe(0);
    expect(result.breakEvenRoas).toBeNull();
  });
});
