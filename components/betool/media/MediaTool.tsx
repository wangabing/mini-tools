"use client";

import { BETOOL_CATEGORIES } from "@/src/data/betool";
import { ImageEditorTool } from "./ImageEditorTool";
import { ImageCompressionTool, ImageProcessingTool, TextToImageTool } from "./ImageTools";
import { PaymentQrTool, QrTool } from "./MatrixTools";
import { PdfTools } from "./PdfTools";
import styles from "./media.module.css";

export const MEDIA_SLUGS = [
  "mergepdf", "splitpdf", "managepdf", "rotatepdf", "compresspdf", "imagetopdf", "pdftoimage",
  "qrcode", "payqrcode", "signimage", "textToImg", "imgCut", "imagecolorpicker", "imagewatermark", "imagecompress", "imageauthenticity",
] as const;

function ToolPanel({ slug, basePath }: { slug: string; basePath: string }) {
  switch (slug) {
    case "mergepdf":
    case "splitpdf":
    case "managepdf":
    case "rotatepdf":
    case "compresspdf":
    case "imagetopdf":
    case "pdftoimage":
      return <PdfTools slug={slug} basePath={basePath} />;
    case "qrcode": return <QrTool />;
    case "payqrcode": return <PaymentQrTool />;
    case "signimage": return <ImageEditorTool />;
    case "textToImg": return <TextToImageTool />;
    case "imagecompress": return <ImageCompressionTool />;
    case "imgCut":
    case "imagecolorpicker":
    case "imagewatermark":
    case "imageauthenticity":
      return <ImageProcessingTool mode={slug} />;
    default: return null;
  }
}

const descriptions: Partial<Record<string, string>> = {
  imageauthenticity: "比较重新压缩前后的像素差异。差异图可辅助判断压缩是否均匀，无法单独证明图片经过篡改。",
  payqrcode: "将已有的支付宝和微信收款码合成一张可打印的图片。",
};

export function MediaTool({ slug, basePath = "" }: { slug: string; basePath?: string }) {
  const entry = BETOOL_CATEGORIES.flatMap((category) => category.tools).find((tool) => tool.href === `/${slug}/`);
  if (!entry) return null;
  return <main className={styles.workbench}>
    <h1>{entry.title}</h1>
    <ToolPanel slug={slug} basePath={basePath} key={slug} />
    <section className={styles.description} aria-labelledby="media-tool-description">
      <h2 id="media-tool-description">描述</h2>
      <p>{descriptions[slug] ?? entry.description}</p>
    </section>
  </main>;
}
