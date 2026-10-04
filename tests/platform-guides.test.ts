import { describe, expect, it } from "vitest";
import { PLATFORM_GUIDES, SELLER_PATHS } from "@/src/data/platform-guides";
import { PLATFORMS } from "@/src/data/presets";

describe("domestic platform guides", () => {
  it("covers every domestic calculator platform exactly once", () => {
    const calculatorIds = PLATFORMS
      .filter((platform) => platform.id !== "generic")
      .map((platform) => platform.id)
      .sort();
    const guideIds = PLATFORM_GUIDES.map((platform) => platform.id).sort();

    expect(PLATFORM_GUIDES).toHaveLength(20);
    expect(new Set(guideIds).size).toBe(20);
    expect(guideIds).toEqual(calculatorIds);
  });

  it("includes decision content, current caveats, and official entrances", () => {
    for (const platform of PLATFORM_GUIDES) {
      expect(platform.positioning).toBeTruthy();
      expect(platform.costModel).toBeTruthy();
      expect(platform.bestFor).toBeTruthy();
      expect(platform.notIdealFor).toBeTruthy();
      expect(platform.strengths.length).toBeGreaterThanOrEqual(2);
      expect(platform.tradeoffs.length).toBeGreaterThanOrEqual(2);
      expect(platform.selectionAdvice).toBeTruthy();
      expect(platform.recentSignal).toBeTruthy();
      expect(platform.benefitNote.length).toBeGreaterThan(12);
      expect(platform.officialUrl).toMatch(/^https:\/\//);
      expect(platform.reviewedAt).toBe("2026-10-03");
    }
  });

  it("defines all five operating paths plus the all-platform view", () => {
    expect(SELLER_PATHS.map((path) => path.id)).toEqual([
      "all",
      "low-barrier",
      "content",
      "brand",
      "local",
      "b2b",
    ]);
    expect(PLATFORM_GUIDES.every((platform) => platform.paths.length > 0)).toBe(true);
  });
});
