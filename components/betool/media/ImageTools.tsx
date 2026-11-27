"use client";

import { useState } from "react";
import { CanvasPreview } from "./CanvasPreview";
import { FilePicker, MediaResult, NumberField } from "./MediaControls";
import { analyzeImage, canvasPoint, colorFormats, compressImage, drawTextLines, splitCanvas } from "./imageBrowser";
import { basename, canvasBlob, canvasContext, createCanvas, downloadBlob, downloadZip, drawImageFile } from "./mediaBrowser";
import { useMediaTask } from "./useMediaTask";
import styles from "./media.module.css";

type ImageMode = "imagecolorpicker" | "imgCut" | "imagewatermark" | "imageauthenticity";

const POSITIONS = ["右下角", "左下角", "右上角", "左上角", "居中"];
const FORMATS = ["image/png", "image/jpeg"];

export function ImageProcessingTool({ mode }: { mode: ImageMode }) {
  const [source, setSource] = useState<HTMLCanvasElement>();
  const [filename, setFilename] = useState("");
  const [result, setResult] = useState<HTMLCanvasElement>();
  const [tiles, setTiles] = useState<HTMLCanvasElement[]>([]);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [text, setText] = useState("水印");
  const [size, setSize] = useState(24);
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState(POSITIONS[0]);
  const [color, setColor] = useState("#ffffff");
  const [quality, setQuality] = useState(90);
  const [gain, setGain] = useState(10);
  const [sample, setSample] = useState<ReturnType<typeof colorFormats>>();
  const task = useMediaTask();
  const crop = mode === "imgCut";
  const watermark = mode === "imagewatermark";
  const ela = mode === "imageauthenticity";
  const picker = mode === "imagecolorpicker";

  function reset() {
    setSource(undefined);
    setFilename("");
    setResult(undefined);
    setTiles([]);
    setSample(undefined);
    task.setError("");
    task.setMessage("");
  }

  function upload([file]: File[]) {
    reset();
    void task.run(async () => {
      if (ela && file.size > 10 * 1024 * 1024) throw new Error("请选择不超过 10 MB 的图片。");
      const input = await drawImageFile(file);
      setSource(input);
      setFilename(basename(file.name));
      if (ela) setResult(await analyzeImage(input, quality / 100, gain));
      if (crop && rows <= input.height && columns <= input.width) setTiles(splitCanvas(input, rows, columns));
    });
  }

  function process() {
    if (!source) return;
    void task.run(async () => {
      if (ela) setResult(await analyzeImage(source, quality / 100, gain));
      if (crop) setTiles(splitCanvas(source, rows, columns));
      if (watermark) {
        const output = createCanvas(source.width, source.height);
        const ctx = canvasContext(output);
        ctx.drawImage(source, 0, 0);
        ctx.font = `600 ${size}px sans-serif`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity / 100;
        const center = position === "居中";
        const inset = Math.min(12, source.width / 8, source.height / 8);
        ctx.textAlign = center ? "center" : position.startsWith("左") ? "left" : "right";
        ctx.textBaseline = center ? "middle" : position.includes("上") ? "top" : "bottom";
        ctx.fillText(text, center ? source.width / 2 : position.startsWith("左") ? inset : source.width - inset,
          center ? source.height / 2 : position.includes("上") ? inset : source.height - inset, source.width - 2 * inset);
        setResult(output);
      }
    });
  }

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <div className={styles.actions}>
          <FilePicker label={crop ? "请上传需要切割的图片" : "上传图片"} accept={ela ? "image/jpeg,image/png,image/webp" : "image/*"}
            disabled={task.busy} onFiles={upload} />
          {source && <button type="button" onClick={reset}>清空</button>}
        </div>
        {crop && (
          <div className={styles.fields}>
            <NumberField label="行数" value={rows} min={1} max={20} onChange={(value) => { setRows(value); setTiles([]); }} />
            <NumberField label="列数" value={columns} min={1} max={20} onChange={(value) => { setColumns(value); setTiles([]); }} />
            <button type="button" disabled={!source || rows < 1 || columns < 1 || rows > 20 || columns > 20} data-variant="primary" onClick={process}>切割图片</button>
          </div>
        )}
        {watermark && (
          <div className={styles.fields}>
            <label className={styles.field}>水印文字<input type="text" placeholder="请输入水印文字" value={text} onChange={(event) => setText(event.target.value)} /></label>
            <label className={styles.field}>位置<select value={position} onChange={(event) => setPosition(event.target.value)}>{POSITIONS.map((name) => <option key={name}>{name}</option>)}</select></label>
            <NumberField label="字体大小" value={size} min={1} max={500} onChange={setSize} />
            <label className={styles.field}>透明度<input type="range" min="0" max="100" value={opacity} onChange={(event) => setOpacity(event.target.valueAsNumber)} /></label>
            <label className={styles.field}>颜色<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
            <button type="button" disabled={!source || !text.trim() || size < 1 || size > 500} data-variant="primary" onClick={process}>添加水印</button>
          </div>
        )}
        {ela && (
          <div className={styles.fields}>
            <label className={styles.field}>JPEG 质量 <input type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(event.target.valueAsNumber)} />{quality}%</label>
            <label className={styles.field}>差异增益 <input type="range" min="1" max="40" value={gain} onChange={(event) => setGain(event.target.valueAsNumber)} />{gain} 倍</label>
            <button type="button" disabled={!source} data-variant="primary" onClick={process}>重新分析</button>
          </div>
        )}
        {crop && tiles.length > 0 && (
          <>
            <div className={styles.gridPreview} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {tiles.map((tile, index) => <CanvasPreview key={index} source={tile} label={`切片 ${index + 1}`} />)}
            </div>
            <div className={styles.result}>
              <button type="button" onClick={() => void task.run(async () => {
                const files = [];
                for (const [index, tile] of tiles.entries()) files.push({ name: `${filename}-${index + 1}.png`, data: await canvasBlob(tile) });
                await downloadZip(files, `${filename}-tiles.zip`);
              })}>下载全部切片 ZIP</button>
            </div>
          </>
        )}
        {source && !tiles.length && (
          <CanvasPreview source={watermark && result ? result : source} label="图片预览" interactive={picker}
            onClick={picker ? (event) => {
              const point = canvasPoint(event.currentTarget, event.clientX, event.clientY);
              const [red, green, blue] = canvasContext(source).getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1).data;
              setSample(colorFormats(red, green, blue));
            } : undefined} />
        )}
        {picker && (
          <div className={styles.result}>
            <strong>颜色信息</strong>
            {sample && <>
              <div className={styles.swatch} style={{ background: sample.HEX }} aria-hidden="true" />
              {Object.entries(sample).map(([format, value]) => <div key={format} className={styles.actions}>
                <output aria-label={format}>{value}</output>
                <button type="button" onClick={() => void task.run(async () => { await navigator.clipboard.writeText(value); task.setMessage("已复制"); })}>复制 {format}</button>
              </div>)}
            </>}
          </div>
        )}
        {result && (
          <div className={styles.result}>
            {ela && <CanvasPreview source={result} label="ELA 差异图" />}
            <button type="button" onClick={() => void task.run(async () => downloadBlob(await canvasBlob(result), `${filename}-${ela ? "ela" : "watermark"}.png`))}>下载结果</button>
          </div>
        )}
      </fieldset>
      <MediaResult {...task} />
    </div>
  );
}

export function ImageCompressionTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(75);
  const [compressed, setCompressed] = useState<Blob[]>([]);
  const task = useMediaTask();

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <div className={styles.actions}>
          <FilePicker label="选择图片" accept="image/jpeg,image/png,image/webp" multiple disabled={task.busy}
            onFiles={(selected) => {
              setFiles([]);
              setCompressed([]);
              task.setError("");
              if (selected.length > 30 || selected.some((file) => file.size > 25 * 1024 * 1024)) {
                task.setError("最多选择 30 张图片，单个文件最大 25 MB。");
              } else setFiles(selected);
            }} />
        </div>
        {files.length > 0 && <ul className={styles.queue}>{files.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            <div className={styles.filename}>{file.name} <small>{Math.round(file.size / 1024)} KB</small>
              {compressed[index] && <small> → {(compressed[index].size / 1024).toFixed(1)} KB</small>}</div>
            {compressed[index] && <button type="button" onClick={() => downloadBlob(compressed[index], `compressed-${file.name}`)}>下载</button>}
          </li>
        ))}</ul>}
        <label className={styles.slider}>压缩质量<input type="range" min="5" max="100" value={quality} onChange={(event) => setQuality(event.target.valueAsNumber)} /><output>{quality}%</output></label>
        <div className={styles.actions}>
          <button type="button" disabled={!files.length} data-variant="primary" onClick={() => void task.run(async () => {
            const outputs = [];
            for (const file of files) outputs.push(await compressImage(file, quality / 100));
            setCompressed(outputs);
          })}>压缩图片</button>
          {compressed.length > 1 && <button type="button" onClick={() => void task.run(() => downloadZip(compressed.map((data, index) => ({ name: `${index + 1}-${files[index].name}`, data })), "compressed-images.zip"))}>下载 ZIP</button>}
        </div>
      </fieldset>
      <MediaResult {...task} />
    </div>
  );
}

export function TextToImageTool() {
  const [text, setText] = useState("文字转图片演示😀\n拥有丰富的样式选择\n可自由调整宽度背景色\n支持一键导出为长图");
  const [width, setWidth] = useState(860);
  const [size, setSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(36);
  const [font, setFont] = useState("sans-serif");
  const [foreground, setForeground] = useState("#253343");
  const [background, setBackground] = useState("#ffffff");
  const [format, setFormat] = useState(FORMATS[0]);
  const [backgroundImage, setBackgroundImage] = useState<File>();
  const [preview, setPreview] = useState<HTMLCanvasElement>();
  const task = useMediaTask();

  async function createImage() {
    const measurement = canvasContext(createCanvas(1, 1));
    measurement.font = `${size}px ${font}`;
    const rows = drawTextLines(measurement, text, width - 48);
    const height = rows.length * lineHeight + 48;
    if (height > 16_384) throw new Error("图片过长。请减少文字、减小字号或增加画布宽度。");
    const canvas = createCanvas(width, height);
    const context = canvasContext(canvas);
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    if (backgroundImage) {
      const image = await drawImageFile(backgroundImage);
      const scale = Math.max(width / image.width, height / image.height);
      context.drawImage(image, (width - image.width * scale) / 2, (height - image.height * scale) / 2, image.width * scale, image.height * scale);
    }
    context.font = measurement.font;
    context.textBaseline = "middle";
    context.fillStyle = foreground;
    rows.forEach((row, index) => context.fillText(row, 24, 24 + (index + .5) * lineHeight));
    return canvas;
  }

  return (
    <form className={styles.panel} onSubmit={(event) => {
      event.preventDefault();
      void task.run(async () => {
        const canvas = await createImage();
        setPreview(canvas);
        downloadBlob(await canvasBlob(canvas, format, .93), format === "image/png" ? "text.png" : "text.jpg");
      });
    }}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <div className={styles.fields}>
          <NumberField label="宽度" value={width} min={100} max={4096} onChange={setWidth} />
          <NumberField label="字号" value={size} min={10} max={160} onChange={setSize} />
          <NumberField label="行高" value={lineHeight} min={12} max={200} onChange={setLineHeight} />
          <label className={styles.field}>字体<select value={font} onChange={(event) => setFont(event.target.value)}><option value="sans-serif">默认字体</option><option value="serif">衬线</option><option value="monospace">等宽</option></select></label>
          <label className={styles.field}>文字颜色<input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} /></label>
          <label className={styles.field}>背景颜色<input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /></label>
          <label className={styles.field}>图片格式<select value={format} onChange={(event) => setFormat(event.target.value)}><option value="image/png">.png</option><option value="image/jpeg">.jpg</option></select></label>
          <FilePicker label="选择背景图" accept="image/*" onFiles={([file]) => setBackgroundImage(file)} />
          {backgroundImage && <button type="button" onClick={() => setBackgroundImage(undefined)}>移除背景图</button>}
        </div>
        <label className={styles.field}>正文<textarea aria-label="正文" value={text} onChange={(event) => setText(event.target.value)} required /></label>
        <div className={styles.result}>
          <div className={styles.actions}>
            <button type="button" onClick={(event) => {
              if (!event.currentTarget.form?.reportValidity()) return;
              void task.run(async () => setPreview(await createImage()));
            }}>预览</button>
            <button type="submit" data-variant="primary">下载</button>
          </div>
          {preview && <CanvasPreview source={preview} label="文字图片预览" />}
        </div>
      </fieldset>
      <MediaResult {...task} />
    </form>
  );
}
