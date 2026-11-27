"use client";

import { Download, RotateCcw, RotateCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FilePicker, FileQueue, MediaResult, SortButtons, moveItem } from "./MediaControls";
import { basename, downloadBlob, downloadZip, messageFor } from "./mediaBrowser";
import { compressPdf, exportPdfPages, imagesToPdf, mergePdfs, openPdf, pdfImages, pdfThumbnails } from "./pdfBrowser";
import styles from "./media.module.css";

const PDF_ACCEPT = ".pdf,application/pdf";
const IMAGE_ACCEPT = ".jpg,.jpeg,.png,image/jpeg,image/png";

type PdfToolSlug = "mergepdf" | "splitpdf" | "managepdf" | "rotatepdf" | "compresspdf" | "imagetopdf" | "pdftoimage";
type PdfPage = { index: number; rotation: number; selected: boolean };

function downloadPdf(bytes: Uint8Array, name: string) {
  downloadBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), name);
}

export function PdfTools({ slug, basePath }: { slug: PdfToolSlug; basePath: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [breaks, setBreaks] = useState<number[]>([]);
  const [margin, setMargin] = useState(0);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState<"jpg" | "png">("jpg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const file = files[0];
  const usesQueue = slug === "mergepdf" || slug === "imagetopdf";
  const usesPages = slug === "splitpdf" || slug === "managepdf" || slug === "rotatepdf";
  const canDownload = slug === "mergepdf" ? files.length >= 2 : usesPages ? Boolean(pages.length) : Boolean(file);
  const buttonText: Record<PdfToolSlug, string> = {
    mergepdf: "合并并下载",
    splitpdf: "拆分并下载 ZIP",
    managepdf: "导出 PDF",
    rotatepdf: "保存并下载 PDF",
    compresspdf: "压缩并下载",
    imagetopdf: "生成并下载 PDF",
    pdftoimage: "转换并下载 ZIP",
  };

  async function process(task: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try { await task(); }
    catch (failure) { setError(messageFor(failure)); }
    finally { setBusy(false); }
  }

  function selectFiles(selected: File[]) {
    setError("");
    setMessage("");
    if (usesQueue) {
      setFiles((previous) => [...previous, ...selected]);
      return;
    }
    setFiles([]);
    setPages([]);
    setThumbnails([]);
    setBreaks([]);
    if (!usesPages) {
      setFiles(selected);
      return;
    }
    void process(async () => {
      const document = await openPdf(selected[0]);
      setPages(document.getPageIndices().map((index) => ({ index, rotation: 0, selected: false })));
      setFiles(selected);
      try { setThumbnails(await pdfThumbnails(selected[0], basePath)); }
      catch { setMessage("页面预览暂不可用，仍可按页码处理。"); }
    });
  }

  function rotatePages(turn: number, index?: number) {
    setPages((previous) => previous.map((page) => index === undefined || index === page.index
      ? { ...page, rotation: (page.rotation + turn + 360) % 360 }
      : page));
  }

  function download(selectedOnly = false) {
    void process(async () => {
      if (slug === "mergepdf") {
        downloadPdf(await mergePdfs(files), "merged.pdf");
      } else if (slug === "imagetopdf") {
        downloadPdf(await imagesToPdf(files, margin), "images.pdf");
      } else if (slug === "splitpdf") {
        const bounds = [0, ...breaks.slice().sort((a, b) => a - b), pages.length];
        const parts = [];
        for (let i = 1; i < bounds.length; i++) {
          const start = bounds[i - 1];
          const end = bounds[i];
          parts.push({ name: `${basename(file.name)}-${start + 1}-${end}.pdf`, data: await exportPdfPages(file, pages.slice(start, end)) });
        }
        await downloadZip(parts, `${basename(file.name)}-split.zip`);
      } else if (slug === "pdftoimage") {
        await downloadZip(await pdfImages(file, format, basePath), `${basename(file.name)}-images.zip`);
      } else if (slug === "compresspdf") {
        const bytes = await compressPdf(file, quality / 100, basePath);
        downloadPdf(bytes, `${basename(file.name)}-compressed.pdf`);
        setMessage(bytes.byteLength < file.size ? `文件缩小 ${((1 - bytes.byteLength / file.size) * 100).toFixed(1)}%` : "已下载原始大小的文件，当前质量设置未减少体积。");
        return;
      } else {
        const selected = selectedOnly ? pages.filter((page) => page.selected) : pages;
        const suffix = selectedOnly ? "extracted" : slug === "rotatepdf" ? "rotated" : "arranged";
        downloadPdf(await exportPdfPages(file, selected), `${basename(file.name)}-${suffix}.pdf`);
      }
      setMessage("文件已生成");
    });
  }

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset} disabled={busy}>
        <div className={styles.actions}>
          <FilePicker label={slug === "imagetopdf" ? "选择图片" : "选择 PDF"} accept={slug === "imagetopdf" ? IMAGE_ACCEPT : PDF_ACCEPT}
            multiple={usesQueue} disabled={busy} onFiles={selectFiles} />
          {!usesQueue && file && <span className={styles.filename}>{file.name}</span>}
        </div>
        {usesQueue && <FileQueue files={files} onChange={setFiles} />}
        {slug === "imagetopdf" && (
          <div className={styles.options} role="group" aria-label="页面边距">
            <span>页面边距</span>
            {[[0, "无边距"], [16, "窄边距"], [36, "宽边距"]].map(([size, label]) => (
              <label key={size}><input type="radio" name="margin" checked={margin === size} onChange={() => setMargin(Number(size))} />{label}</label>
            ))}
          </div>
        )}
        {slug === "pdftoimage" && (
          <div className={styles.options} role="group" aria-label="输出格式">
            <span>输出格式</span>
            {(["jpg", "png"] as const).map((type) => (
              <label key={type}><input type="radio" name="format" checked={format === type} onChange={() => setFormat(type)} />{type.toUpperCase()}</label>
            ))}
          </div>
        )}
        {slug === "compresspdf" && (
          <label className={styles.slider}>图片质量 <input type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.currentTarget.value))} /> <output>{quality}%</output></label>
        )}
        {usesPages && Boolean(pages.length) && (
          <>
            {slug === "rotatepdf" && (
              <div className={styles.actions}>
                <button type="button" onClick={() => rotatePages(-90)}><RotateCcw size={16} />全部向左旋转</button>
                <button type="button" onClick={() => rotatePages(90)}><RotateCw size={16} />全部向右旋转</button>
              </div>
            )}
            <ol className={styles.pageGrid}>
              {pages.map((page, position) => {
                const pageLabel = `第 ${page.index + 1} 页`;
                return (
                  <li key={page.index}>
                    <div className={styles.thumbnail}>
                      {thumbnails[page.index] ? <Image src={thumbnails[page.index]} alt={pageLabel} width={141} height={180} unoptimized style={{ transform: `rotate(${page.rotation}deg)` }} /> : <span>{pageLabel}</span>}
                    </div>
                    <span>{pageLabel}</span>
                    {slug === "splitpdf" && position < pages.length - 1 && (
                      <label className={styles.pageOption}>
                        <input type="checkbox" checked={breaks.includes(position + 1)} onChange={(event) => {
                          const point = position + 1;
                          setBreaks((previous) => event.target.checked ? [...previous, point] : previous.filter((value) => value !== point));
                        }} />在此页后拆分
                      </label>
                    )}
                    {slug === "managepdf" && (
                      <>
                        <label className={styles.pageOption}>
                          <input type="checkbox" checked={page.selected} onChange={(event) => {
                            setPages((previous) => previous.map((entry) => page.index === entry.index ? { ...entry, selected: event.target.checked } : entry));
                          }} />选择{pageLabel}
                        </label>
                        <SortButtons index={position} count={pages.length} label={pageLabel}
                          onMove={(step) => setPages((previous) => moveItem(previous, position, step))}
                          onRemove={() => setPages((previous) => previous.filter((entry) => entry.index !== page.index))} />
                      </>
                    )}
                    {slug === "rotatepdf" && (
                      <div className={styles.iconButtons}>
                        <button type="button" aria-label={`${pageLabel}向左旋转`} title="向左旋转" onClick={() => rotatePages(-90, page.index)}><RotateCcw size={16} /></button>
                        <button type="button" aria-label={`${pageLabel}向右旋转`} title="向右旋转" onClick={() => rotatePages(90, page.index)}><RotateCw size={16} /></button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
        <div className={styles.actions}>
          <button type="button" data-variant="primary" disabled={!canDownload || (slug === "splitpdf" && !breaks.length)} onClick={() => download()}>
            <Download size={16} aria-hidden="true" />{buttonText[slug]}
          </button>
          {slug === "managepdf" && (
            <button type="button" disabled={!pages.some((page) => page.selected)} onClick={() => download(true)}>
              <Download size={16} aria-hidden="true" />提取所选页面
            </button>
          )}
        </div>
      </fieldset>
      <MediaResult busy={busy} error={error} message={message} />
    </div>
  );
}
