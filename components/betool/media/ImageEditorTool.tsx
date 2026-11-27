"use client";

import { ArrowUpRight, Crop, FlipHorizontal, FlipVertical, PenLine, RotateCcw, RotateCw, Square, Type, Undo2 } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { CanvasPreview } from "./CanvasPreview";
import { FilePicker, MediaResult, NumberField } from "./MediaControls";
import { canvasPoint } from "./imageBrowser";
import { canvasBlob, canvasContext, createCanvas, downloadBlob, drawImageFile } from "./mediaBrowser";
import { useMediaTask } from "./useMediaTask";
import styles from "./media.module.css";

type Point = { x: number; y: number };
type Mode = "pen" | "rectangle" | "arrow" | "text" | "crop";

const MODES = [
  { key: "pen", label: "画笔", Icon: PenLine },
  { key: "rectangle", label: "矩形标注", Icon: Square },
  { key: "arrow", label: "箭头标注", Icon: ArrowUpRight },
  { key: "text", label: "图片文字", Icon: Type },
  { key: "crop", label: "拖拽裁剪", Icon: Crop },
] as const;

const FILTERS = [
  { label: "原图", key: "none" },
  { label: "黑白", key: "grayscale(1)" },
  { label: "复古", key: "sepia(1)" },
  { label: "反色", key: "invert(1)" },
  { label: "提亮", key: "brightness(1.25)" },
  { label: "提高对比度", key: "contrast(1.3)" },
  { label: "模糊", key: "blur(3px)" },
];

function cloneCanvas(source: HTMLCanvasElement) {
  const result = createCanvas(source.width, source.height);
  canvasContext(result).drawImage(source, 0, 0);
  return result;
}

export function ImageEditorTool() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [history, setHistory] = useState<HTMLCanvasElement[]>([]);
  const [filename, setFilename] = useState("edited.png");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(800);
  const [mode, setMode] = useState<Mode>("pen");
  const [color, setColor] = useState("#ffbb3b");
  const [stroke, setStroke] = useState(4);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("none");
  const drag = useRef<{ start: Point; previous: Point; original: HTMLCanvasElement }>(undefined);
  const task = useMediaTask();

  function apply(result: HTMLCanvasElement) {
    if (canvas) setHistory((previous) => [...previous.slice(-11), canvas]);
    setCanvas(result);
    setWidth(result.width);
    setHeight(result.height);
  }

  function replace(result: HTMLCanvasElement) {
    setCanvas(result);
    setHistory([]);
    setWidth(result.width);
    setHeight(result.height);
  }

  function transform(kind: "left" | "right" | "horizontal" | "vertical" | "resize" | "filter") {
    if (!canvas) return;
    let result: HTMLCanvasElement;
    if (kind === "left" || kind === "right") {
      result = createCanvas(canvas.height, canvas.width);
      const context = canvasContext(result);
      context.translate(result.width / 2, result.height / 2);
      context.rotate(kind === "left" ? -Math.PI / 2 : Math.PI / 2);
      context.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    } else {
      result = kind === "resize" ? createCanvas(width, height) : createCanvas(canvas.width, canvas.height);
      const context = canvasContext(result);
      if (kind === "horizontal") { context.translate(result.width, 0); context.scale(-1, 1); }
      if (kind === "vertical") { context.translate(0, result.height); context.scale(1, -1); }
      if (kind === "filter") context.filter = filter;
      context.drawImage(canvas, 0, 0, result.width, result.height);
    }
    apply(result);
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!canvas || stroke < 1 || stroke > 100 || (event.pointerType === "mouse" && event.button !== 0)) return;
    const point = canvasPoint(event.currentTarget, event.clientX, event.clientY);
    if (mode === "text") {
      if (!text.trim()) return;
      const result = cloneCanvas(canvas);
      const context = canvasContext(result);
      context.font = `600 ${Math.max(12, stroke * 6)}px sans-serif`;
      context.fillStyle = color;
      context.textBaseline = "top";
      context.fillText(text, point.x, point.y);
      apply(result);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { start: point, previous: point, original: canvas };
  }

  function moveDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const active = drag.current;
    if (!active) return;
    const target = event.currentTarget;
    const point = canvasPoint(target, event.clientX, event.clientY);
    const context = canvasContext(target);
    const { start, previous, original } = active;
    context.lineWidth = stroke;
    context.strokeStyle = color;
    context.lineCap = "round";
    if (mode !== "pen") {
      context.clearRect(0, 0, target.width, target.height);
      context.drawImage(original, 0, 0);
    }
    context.beginPath();
    if (mode === "rectangle" || mode === "crop") {
      context.save();
      if (mode === "crop") { context.setLineDash([8, 6]); context.lineWidth = Math.min(3, stroke); }
      context.strokeRect(start.x, start.y, point.x - start.x, point.y - start.y);
      context.restore();
    } else {
      const from = mode === "pen" ? previous : start;
      context.moveTo(from.x, from.y);
      context.lineTo(point.x, point.y);
      if (mode === "arrow") {
        const angle = Math.atan2(point.y - start.y, point.x - start.x);
        const arm = stroke * 4;
        context.lineTo(point.x - arm * Math.cos(angle - Math.PI / 6), point.y - arm * Math.sin(angle - Math.PI / 6));
        context.moveTo(point.x, point.y);
        context.lineTo(point.x - arm * Math.cos(angle + Math.PI / 6), point.y - arm * Math.sin(angle + Math.PI / 6));
      }
      context.stroke();
    }
    active.previous = point;
  }

  function endDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const active = drag.current;
    if (!active) return;
    drag.current = undefined;
    const point = canvasPoint(event.currentTarget, event.clientX, event.clientY);
    if (mode === "crop" && Math.abs(point.x - active.start.x) > 1 && Math.abs(point.y - active.start.y) > 1) {
      const result = createCanvas(Math.abs(point.x - active.start.x), Math.abs(point.y - active.start.y));
      canvasContext(result).drawImage(active.original, Math.min(point.x, active.start.x), Math.min(point.y, active.start.y), result.width, result.height, 0, 0, result.width, result.height);
      apply(result);
    } else if (mode === "crop") {
      const context = canvasContext(event.currentTarget);
      context.clearRect(0, 0, event.currentTarget.width, event.currentTarget.height);
      context.drawImage(active.original, 0, 0);
    } else {
      apply(cloneCanvas(event.currentTarget));
    }
  }

  return (
    <div className={styles.panel}>
      <fieldset className={styles.fieldset} disabled={task.busy}>
        <div className={styles.actions}>
          <FilePicker label="打开图片" accept="image/*" disabled={task.busy} onFiles={([file]) => void task.run(async () => {
            replace(await drawImageFile(file));
            setFilename(file.name.replace(/\.[^.]+$/, "") + "-edited.png");
          })} />
          <button type="button" onClick={() => replace(createCanvas(800, 800))}>新建画布</button>
          <button type="button" data-variant="primary" disabled={!canvas} onClick={() => void task.run(async () => {
            if (canvas) downloadBlob(await canvasBlob(canvas), filename);
          })}>保存</button>
        </div>
        {canvas && <>
          <div className={styles.actions}>
            {MODES.map(({ key, label, Icon }) => <button type="button" key={key} aria-pressed={mode === key} aria-label={label} title={label}
              data-variant={mode === key ? "primary" : undefined} onClick={() => setMode(key)}><Icon size={17} /></button>)}
            <button type="button" aria-label="向左旋转" title="向左旋转" onClick={() => transform("left")}><RotateCcw size={17} /></button>
            <button type="button" aria-label="向右旋转" title="向右旋转" onClick={() => transform("right")}><RotateCw size={17} /></button>
            <button type="button" aria-label="水平翻转" title="水平翻转" onClick={() => transform("horizontal")}><FlipHorizontal size={17} /></button>
            <button type="button" aria-label="垂直翻转" title="垂直翻转" onClick={() => transform("vertical")}><FlipVertical size={17} /></button>
            <button type="button" aria-label="撤销" title="撤销" disabled={!history.length} onClick={() => {
              const previous = history.at(-1);
              if (!previous) return;
              setCanvas(previous);
              setWidth(previous.width);
              setHeight(previous.height);
              setHistory((entries) => entries.slice(0, -1));
            }}><Undo2 size={17} /></button>
          </div>
          <div className={styles.fields}>
            <label className={styles.field}>标注颜色<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
            <NumberField label="笔触大小" value={stroke} min={1} max={100} onChange={setStroke} />
            {mode === "text" && <label className={styles.field}>文字<input value={text} onChange={(event) => setText(event.target.value)} /></label>}
            <NumberField label="图片宽度" value={width} min={1} max={8192} onChange={setWidth} />
            <NumberField label="图片高度" value={height} min={1} max={8192} onChange={setHeight} />
            <button type="button" disabled={Math.min(width, height) < 1 || Math.max(width, height) > 8192} onClick={() => transform("resize")}>调整尺寸</button>
            <label className={styles.field}>滤镜<select value={filter} onChange={(event) => setFilter(event.target.value)}>
              {FILTERS.map(({ label, key }) => <option key={key} value={key}>{label}</option>)}
            </select></label>
            <button type="button" disabled={filter === "none"} onClick={() => transform("filter")}>应用滤镜</button>
          </div>
          <CanvasPreview source={canvas} label="图片编辑画布" interactive onPointerDown={startDrawing} onPointerMove={moveDrawing} onPointerUp={endDrawing}
            onPointerCancel={(event) => {
              if (!drag.current) return;
              const target = event.currentTarget;
              const context = canvasContext(target);
              context.clearRect(0, 0, target.width, target.height);
              context.drawImage(drag.current.original, 0, 0);
              drag.current = undefined;
            }} />
        </>}
      </fieldset>
      <MediaResult {...task} />
    </div>
  );
}
