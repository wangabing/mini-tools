import { canvasBlob, createCanvas, drawImageFile } from "./mediaBrowser";
import type { PDFDocumentProxy } from "pdfjs-dist";

export async function openPdf(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  try {
    const document = await PDFDocument.load(await file.arrayBuffer());
    if (!document.getPageCount()) throw new Error("PDF has no pages");
    return document;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Input document to `PDFDocument.load` is encrypted.")) {
      throw new Error(`「${file.name}」带有密码保护，请解锁后重试。`, { cause: error });
    }
    throw new Error(`无法读取「${file.name}」，请确认文件是有效的 PDF 且包含页面。`, { cause: error });
  }
}

export async function mergePdfs(files: File[]) {
  const { PDFDocument } = await import("pdf-lib");
  const result = await PDFDocument.create();
  for (const file of files) {
    const source = await openPdf(file);
    const pages = await result.copyPages(source, source.getPageIndices());
    for (const page of pages) result.addPage(page);
  }
  return result.save();
}

export async function exportPdfPages(file: File, selections: { index: number; rotation?: number }[]) {
  const { PDFDocument, degrees } = await import("pdf-lib");
  const original = await openPdf(file);
  const result = await PDFDocument.create();
  const pages = await result.copyPages(original, selections.map(({ index }) => index));
  pages.forEach((page, position) => {
    const angle = selections[position].rotation;
    if (angle) page.setRotation(degrees((page.getRotation().angle + angle + 360) % 360));
    result.addPage(page);
  });
  return result.save();
}

export async function readRenderablePdf(file: File, basePath: string) {
  const pdfjs = await import("pdfjs-dist");
  const resources = `${basePath}/pdfjs/`;
  pdfjs.GlobalWorkerOptions.workerSrc = `${resources}pdf.worker.min.mjs`;
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: `${resources}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${resources}standard_fonts/`,
    wasmUrl: `${resources}wasm/`,
    iccUrl: `${resources}iccs/`,
    useSystemFonts: true,
  });
  return task.promise;
}

export async function renderPdfPage(document: PDFDocumentProxy, index: number, scale: number) {
  const page = await document.getPage(index + 1);
  const original = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: Math.min(scale, 4000 / Math.max(original.width, original.height)) });
  const canvas = createCanvas(viewport.width, viewport.height);
  try {
    await page.render({ canvas, viewport }).promise;
    return canvas;
  } finally {
    page.cleanup();
  }
}

export async function pdfThumbnails(file: File, basePath: string) {
  const document = await readRenderablePdf(file, basePath);
  try {
    const results: string[] = [];
    for (let index = 0; index < document.numPages; index++) {
      const page = await document.getPage(index + 1);
      const base = page.getViewport({ scale: 1 });
      const canvas = await renderPdfPage(document, index, 200 / Math.max(base.width, base.height));
      results.push(canvas.toDataURL("image/jpeg", 0.7));
    }
    return results;
  } finally {
    await document.destroy();
  }
}

export async function pdfImages(file: File, format: "jpg" | "png", basePath: string) {
  const document = await readRenderablePdf(file, basePath);
  try {
    const results = [];
    for (let index = 0; index < document.numPages; index++) {
      const canvas = await renderPdfPage(document, index, 1.6);
      const data = await canvasBlob(canvas, format === "jpg" ? "image/jpeg" : "image/png", 0.92);
      results.push({ name: `page-${index + 1}.${format}`, data });
    }
    return results;
  } finally {
    await document.destroy();
  }
}

export async function compressPdf(file: File, quality: number, basePath: string) {
  const { PDFDocument } = await import("pdf-lib");
  const document = await readRenderablePdf(file, basePath);
  try {
    const result = await PDFDocument.create();
    for (let index = 0; index < document.numPages; index++) {
      const original = await document.getPage(index + 1);
      const { width, height } = original.getViewport({ scale: 1 });
      const canvas = await renderPdfPage(document, index, 1.35);
      const jpeg = await result.embedJpg(await (await canvasBlob(canvas, "image/jpeg", quality)).arrayBuffer());
      result.addPage([width, height]).drawImage(jpeg, { x: 0, y: 0, width, height });
    }
    const bytes = await result.save();
    return bytes.byteLength < file.size ? bytes : new Uint8Array(await file.arrayBuffer());
  } finally {
    await document.destroy();
  }
}

export async function imagesToPdf(files: File[], margin: number) {
  const { PDFDocument } = await import("pdf-lib");
  const result = await PDFDocument.create();
  for (const file of files) {
    const canvas = await drawImageFile(file);
    const image = await result.embedPng(await (await canvasBlob(canvas)).arrayBuffer());
    const imageScale = Math.min(1, 1440 / Math.max(image.width, image.height));
    const width = image.width * imageScale;
    const height = image.height * imageScale;
    result.addPage([width + 2 * margin, height + 2 * margin])
      .drawImage(image, { x: margin, y: margin, width, height });
  }
  return result.save();
}
