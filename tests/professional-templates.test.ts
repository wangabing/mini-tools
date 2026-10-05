import { describe, expect, it } from "vitest";
import {
  FIRST_SIX_PROFESSIONAL_PLATFORM_IDS,
  getProfessionalTemplate,
  isProfessionalTemplateReviewDue,
  PROFESSIONAL_TEMPLATES,
} from "@/src/data/professional-templates";
import { resolvePreset } from "@/src/data/presets";

describe("professional platform templates", () => {
  it("covers the first six domestic platforms with versioned field vocabulary", () => {
    for (const platformId of FIRST_SIX_PROFESSIONAL_PLATFORM_IDS) {
      const template = getProfessionalTemplate(platformId);

      expect(template.platformId).toBe(platformId);
      expect(template.platformFeeLabel.length).toBeGreaterThan(0);
      expect(template.creatorCommissionLabel.length).toBeGreaterThan(0);
      expect(template.supportedChannels).toContain("creator");
      expect(template.checklist.length).toBeGreaterThanOrEqual(3);
      expect(template.version).toMatch(/^2026\.10/);
      expect(template.nextReviewAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("links each first-six template to the official source carried by its preset", () => {
    for (const platformId of FIRST_SIX_PROFESSIONAL_PLATFORM_IDS) {
      const template = getProfessionalTemplate(platformId);
      const { preset } = resolvePreset(platformId, "generic");

      expect(template.sourceUrl).toBe(preset.sourceUrl);
      expect(template.sourceAccess).toBe(preset.sourceAccess);
    }
  });

  it("uses the generic editable template for other platforms", () => {
    const template = getProfessionalTemplate("xiaohongshu");
    const { preset } = resolvePreset("xiaohongshu", "generic");

    expect(template.platformId).toBe("generic");
    expect(template.platformFeeLabel).toBe("平台服务费");
    expect(template.supportedChannels).toEqual(["organic", "advertising", "creator"]);
    expect(template.sourceUrl).toBe(preset.sourceUrl);
  });

  it("contains no numeric platform rate defaults", () => {
    for (const template of PROFESSIONAL_TEMPLATES) {
      expect(Object.keys(template).some((key) => key.toLowerCase().includes("rate"))).toBe(false);
    }
  });

  it("reports template freshness at and after the review deadline", () => {
    const template = getProfessionalTemplate("douyin");

    expect(isProfessionalTemplateReviewDue(template, new Date("2027-01-03T12:00:00+08:00"))).toBe(false);
    expect(isProfessionalTemplateReviewDue(template, new Date("2027-01-04T00:00:00+08:00"))).toBe(true);
  });
});
