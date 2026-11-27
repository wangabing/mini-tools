"use client";

import { useState } from "react";
import { FilePicker, MediaResult, NumberField } from "./MediaControls";
import { canvasBlob, canvasContext, createCanvas, downloadBlob, drawImageFile } from "./mediaBrowser";
import { useMediaTask } from "./useMediaTask";
import { CanvasPreview } from "./CanvasPreview";
import styles from "./media.module.css";

export function QrTool() {
  const [content, setContent] = useState("");
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(1);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("Q");
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [logo, setLogo] = useState<File>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const task = useMediaTask();

  return (
    <form className={styles.panel} onSubmit={(event) => {
      event.preventDefault();
      setCanvas(undefined);
      void task.run(async () => {
        const { default: QRCode } = await import("qrcode");
        const output = createCanvas(size, size);
        await QRCode.toCanvas(output, content, { width: size, margin, errorCorrectionLevel: level, color: { dark: foreground, light: background } });
        if (logo) {
          const image = await drawImageFile(logo);
          const logoSize = output.width * 0.18;
          const scale = logoSize / Math.max(image.width, image.height);
          const context = canvasContext(output);
          context.fillStyle = background;
          context.fillRect((output.width - logoSize) / 2 - 3, (output.height - logoSize) / 2 - 3, logoSize + 6, logoSize + 6);
          context.drawImage(image, (output.width - image.width * scale) / 2, (output.height - image.height * scale) / 2, image.width * scale, image.height * scale);
        }
        setCanvas(output);
      });
    }}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <label className={styles.field}>内容<textarea required placeholder="请输入文本内容" value={content} onChange={(event) => setContent(event.target.value)} /></label>
        <div className={styles.fields}>
          <NumberField label="尺寸（px）" min={100} max={2000} value={size} onChange={setSize} />
          <label className={styles.field}>纠错级别<select value={level} onChange={(event) => setLevel(event.currentTarget.value as typeof level)}>
            <option value="L">L 可遮挡 7%</option><option value="M">M 可遮挡 15%</option><option value="Q">Q 可遮挡 25%</option><option value="H">H 可遮挡 30%</option>
          </select></label>
          <NumberField label="边距" min={0} max={20} value={margin} onChange={setMargin} />
          <label className={styles.field}>颜色<input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} /></label>
          <label className={styles.field}>背景色<input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /></label>
        </div>
        <div className={styles.actions}>
          <FilePicker label="添加 Logo" accept="image/*" disabled={task.busy} onFiles={([file]) => setLogo(file)} />
          {logo && <button type="button" onClick={() => setLogo(undefined)}>移除 Logo</button>}
          <button type="submit" data-variant="primary">生成二维码</button>
        </div>
        {canvas && <div className={styles.result}>
          <CanvasPreview source={canvas} label="生成的二维码" />
          <button type="button" onClick={() => void task.run(async () => downloadBlob(await canvasBlob(canvas), "qrcode.png"))}>下载二维码</button>
        </div>}
      </fieldset>
      <MediaResult {...task} />
    </form>
  );
}

const THEMES = [
  { title: "默认", background: "#ffffff", text: "#253343" },
  { title: "主题 A", background: "#e6f4ff", text: "#083866" },
  { title: "主题 B", background: "#e6f7ef", text: "#12583a" },
  { title: "主题 C", background: "#ffefed", text: "#852f28" },
  { title: "主题 D", background: "#242932", text: "#ffffff" },
];

export function PaymentQrTool() {
  const [alipay, setAlipay] = useState<File>();
  const [wechat, setWechat] = useState<File>();
  const [theme, setTheme] = useState(0);
  const [percentage, setPercentage] = useState(50);
  const [result, setResult] = useState<HTMLCanvasElement>();
  const task = useMediaTask();

  function combine() {
    if (!alipay || !wechat) return;
    setResult(undefined);
    void task.run(async () => {
      const images = await Promise.all([drawImageFile(alipay), drawImageFile(wechat)]);
      const output = createCanvas(960, 590);
      const context = canvasContext(output);
      const themeColors = THEMES[theme];
      context.fillStyle = themeColors.background;
      context.fillRect(0, 0, output.width, output.height);
      const widths = [percentage / 100 * 864, (100 - percentage) / 100 * 864];
      const labels = ["支付宝", "微信支付"];
      let offset = 32;
      images.forEach((image, index) => {
        const cardWidth = widths[index];
        const scale = Math.min((cardWidth - 32) / image.width, 460 / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.fillStyle = "#ffffff";
        context.fillRect(offset, 62, cardWidth, 488);
        context.imageSmoothingEnabled = false;
        context.drawImage(image, offset + (cardWidth - width) / 2, 62 + (488 - height) / 2, width, height);
        context.fillStyle = themeColors.text;
        context.font = "600 28px sans-serif";
        context.textAlign = "center";
        context.fillText(labels[index], offset + cardWidth / 2, 43);
        offset += cardWidth + 32;
      });
      setResult(output);
    });
  }

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <FilePicker label="上传支付宝收款码" accept="image/*" onFiles={([file]) => { setAlipay(file); setResult(undefined); }} />
            <span>{alipay?.name ?? "尚未上传"}</span>
          </div>
          <div className={styles.field}>
            <FilePicker label="上传微信收款码" accept="image/*" onFiles={([file]) => { setWechat(file); setResult(undefined); }} />
            <span>{wechat?.name ?? "尚未上传"}</span>
          </div>
        </div>
        <div className={styles.options} role="group" aria-label="组合样式">组合样式{THEMES.map((entry, index) => (
          <label key={entry.title}><input type="radio" name="theme" checked={index === theme}
            onChange={() => { setTheme(index); setResult(undefined); }} />{entry.title}</label>
        ))}</div>
        <label className={styles.slider}>缺省比例 <input type="range" min="30" max="70" value={percentage}
          onChange={(event) => { setPercentage(event.currentTarget.valueAsNumber); setResult(undefined); }} />{percentage}%</label>
        <button type="button" data-variant="primary" disabled={!alipay || !wechat} onClick={combine}>生成收款码</button>
        {result && <div className={styles.result}>
          <CanvasPreview source={result} label="组合后的收款码" />
          <button type="button" onClick={() => void task.run(async () => downloadBlob(await canvasBlob(result), "payment-qrcode.png"))}>下载收款码</button>
        </div>}
      </fieldset>
      <MediaResult {...task} />
    </div>
  );
}
