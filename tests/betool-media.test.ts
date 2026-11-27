// @vitest-environment node

import { PDFDocument, StandardFonts, degrees } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { colorFormats } from "@/components/betool/media/imageBrowser";
import { messageFor } from "@/components/betool/media/mediaBrowser";
import { exportPdfPages, mergePdfs, openPdf } from "@/components/betool/media/pdfBrowser";

async function pdfFixture(name: string, widths: number[]) {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (const width of widths) {
    const page = document.addPage([width, 240]);
    page.drawText(`${name} ${width}`, { x: 24, y: 100, font, size: 18 });
  }
  return new File([new Uint8Array(await document.save())], name + ".pdf", { type: "application/pdf" });
}

describe("PDF export", () => {
  it("preserves a named file error and recognizes PDF.js password failures", () => {
    const malformed = new Error("无法读取「encrypted.pdf」");
    const secured = new Error("「encrypted.pdf」带有密码保护，请解锁后重试。");
    expect(messageFor(malformed)).toBe(malformed.message);
    expect(messageFor(secured)).toBe(secured.message);
    const pdfJsFailure = new Error("No password given");
    pdfJsFailure.name = "PasswordException";
    expect(messageFor(pdfJsFailure)).toBe("文件带有密码保护，请解锁后重试。");
  });

  it("merges every page in the supplied file order", async () => {
    const first = await pdfFixture("first", [180, 210]);
    const second = await pdfFixture("second", [250, 300]);
    const merged = await PDFDocument.load(await mergePdfs([second, first]));

    expect(merged.getPageCount()).toBe(4);
    expect(merged.getPages().map((page) => page.getWidth())).toEqual([250, 300, 180, 210]);
    expect(merged.getPages().every((page) => Boolean(page.node.Contents()))).toBe(true);
  });

  it("exports selections in the requested order and preserves cumulative rotation", async () => {
    const original = await pdfFixture("source", [180, 210, 250]);
    const document = await PDFDocument.load(await original.arrayBuffer());
    document.getPage(2).setRotation(degrees(90));
    const rotated = new File([new Uint8Array(await document.save())], "rotated.pdf");
    const result = await PDFDocument.load(await exportPdfPages(rotated, [{ index: 2, rotation: 270 }, { index: 0, rotation: 90 }]));

    expect(result.getPages().map((page) => page.getWidth())).toEqual([250, 180]);
    expect(result.getPages().map((page) => page.getRotation().angle)).toEqual([0, 90]);
  });

  it("rejects malformed PDF data", async () => {
    const invalid = new File(["invalid content"], "invalid.pdf", { type: "application/pdf" });
    const valid = await pdfFixture("valid", [180]);
    await expect(mergePdfs([valid, invalid])).rejects.toThrow("无法读取「invalid.pdf」");
  });

  it("identifies an encryption trailer and names the affected file", async () => {
    const document = await PDFDocument.create();
    document.addPage();
    document.context.trailerInfo.Encrypt = document.context.register(
      document.context.obj({ Filter: "Standard", V: 1, R: 2 }),
    );
    const bytes = await document.save({ useObjectStreams: false });
    const file = new File([new Uint8Array(bytes)], "protected.pdf");
    await expect(openPdf(file)).rejects.toThrow("「protected.pdf」带有密码保护");
  });
});

describe("image color sampling", () => {
  it("reports exact RGB and hexadecimal channels with the corresponding HSL conversion", () => {
    expect(colorFormats(255, 128, 0)).toEqual({ HEX: "#ff8000", RGB: "rgb(255, 128, 0)", HSL: "hsl(30, 100%, 50%)" });
    expect(colorFormats(128, 128, 128).HSL).toBe("hsl(0, 0%, 50%)");
  });
});
