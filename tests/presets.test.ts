import { describe, expect, it } from "vitest";
import {
  FEE_PRESETS,
  getCategories,
  getPlatform,
  PLATFORMS,
  resolvePreset,
} from "@/src/data/presets";

describe("fee presets", () => {
  it("provides a usable global generic mode", () => {
    const resolved = resolvePreset("generic", "generic");

    expect(resolved.resolution).toBe("platform");
    expect(resolved.preset.platformFeeRate).toBe(0);
    expect(resolved.preset.paymentFeeRate).toBeGreaterThanOrEqual(0);
  });

  it("returns platform-dependent categories with a generic first option", () => {
    const xianyu = getCategories("xianyu");
    const wholesale = getCategories("1688");

    expect(xianyu[0].id).toBe("generic");
    expect(wholesale[0].id).toBe("generic");
    expect(xianyu.some((category) => category.id === "collectibles")).toBe(true);
    expect(wholesale.some((category) => category.id === "industrial")).toBe(true);
  });

  it("contains the generic option and all 20 domestic platforms", () => {
    const obsoleteIds = ["amazon-us", "tiktok-us", "etsy-us", "shopify", "ebay-us"];

    expect(PLATFORMS).toHaveLength(21);
    expect(PLATFORMS.filter((platform) => platform.id !== "generic")).toHaveLength(20);
    expect(PLATFORMS.map((platform) => platform.id)).not.toEqual(
      expect.arrayContaining(obsoleteIds),
    );
  });

  it("falls back to the platform generic preset for an unmodeled category", () => {
    const resolved = resolvePreset("douyin", "beauty");

    expect(resolved.resolution).toBe("platform");
    expect(resolved.requestedCategoryId).toBe("beauty");
    expect(resolved.preset.categoryId).toBe("generic");
  });

  it("falls back safely for an unknown platform value", () => {
    const platform = getPlatform("missing" as never);
    expect(platform.id).toBe("generic");
  });

  it("includes complete provenance on every marketplace preset", () => {
    const marketplacePresets = FEE_PRESETS.filter((preset) => preset.platformId !== "generic");

    expect(marketplacePresets).toHaveLength(20);
    for (const preset of marketplacePresets) {
      expect(preset.market).toBeTruthy();
      expect(preset.sourceUrl).toMatch(/^https:\/\//);
      expect(preset.effectiveDate === null || /^\d{4}-\d{2}-\d{2}$/.test(preset.effectiveDate)).toBe(true);
      expect(preset.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(preset.version).toBeTruthy();
      expect(preset.sourceAccess).not.toBe("generic");
      expect(preset.verificationRequired).toBe(true);
      expect(preset.verification).toContain("商家后台或合同");
      expect(preset.note).toBeTruthy();
    }
  });

  it("does not present unknown domestic fees as verified free rates", () => {
    const taobao = resolvePreset("taobao", "generic").preset;

    expect(taobao.platformFeeRate).toBe(0);
    expect(taobao.verificationRequired).toBe(true);
    expect(taobao.sourceAccess).toBe("login-required");
  });
});
