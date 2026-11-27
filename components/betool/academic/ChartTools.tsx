"use client";

import { Download, FileUp, Plus, Table2, Trash2 } from "lucide-react";
import type { EChartsOption, EChartsType } from "echarts";
import { type ChangeEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { type ChartKind, type ChartTable, defaultChartRows, defaultScatterRows, readChartFile, readChartRows, readWords } from "./chartData";
import styles from "./academic.module.css";

const titles = { bar: "柱状图", line: "折线图", pie: "饼图", scatter: "散点图" };
type GraphicOptions = {
  title: string;
  subtitle: string;
  titleVisible: boolean;
  subtitleVisible: boolean;
  titleLocation: "left" | "center" | "right";
  color: string;
  watermark: string;
  watermarkVisible: boolean;
};
const initialOptions: GraphicOptions = {
  title: "图表",
  subtitle: "在线图表制作工具",
  titleVisible: true,
  subtitleVisible: true,
  titleLocation: "center",
  color: "#5470c6",
  watermark: "",
  watermarkVisible: false,
};

function getChartOption(kind: ChartKind, table: ChartTable, config: GraphicOptions): EChartsOption {
  const shared: EChartsOption = {
    backgroundColor: "#fff",
    animation: false,
    title: {
      text: config.titleVisible ? config.title : "",
      subtext: config.subtitleVisible ? config.subtitle : "",
      left: config.titleLocation,
    },
    tooltip: { trigger: "item", renderMode: "richText" },
    color: kind === "pie" ? ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272"] : [config.color, "#ee6666", "#91cc75", "#fac858", "#3ba272", "#73c0de"],
    graphic: config.watermarkVisible && config.watermark ? [{
      type: "text", right: 18, bottom: 12, z: 100, silent: true,
      style: { text: config.watermark, fill: "rgba(35, 49, 69, 0.40)", fontSize: 16 },
    }] : [],
  };
  if (kind === "pie") {
    return {
      ...shared,
      series: [{ type: "pie", radius: "54%", center: ["50%", "55%"], data: table.labels.map((name, i) => ({ name, value: table.series[0].values[i] })) }],
    };
  }
  if (kind === "scatter") {
    return {
      ...shared,
      xAxis: { type: "value" }, yAxis: { type: "value" },
      series: [{ type: "scatter", name: table.series[0].name, data: table.labels.map((name, index) => [Number(name), table.series[0].values[index]]) }],
    };
  }
  return {
    ...shared,
    legend: table.series.length > 1 ? { bottom: 10 } : undefined,
    grid: { top: 65, bottom: table.series.length > 1 ? 57 : 42, left: 60, right: 32 },
    xAxis: { type: "category", data: table.labels, axisLabel: { overflow: "truncate", width: 84 } },
    yAxis: { type: "value" },
    series: table.series.map(({ name, values }) => ({ type: kind, name, data: values })),
  };
}

function useChart(option: EChartsOption, width: number, height: number, wordcloud = false) {
  const host = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<EChartsType>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let current: EChartsType | undefined;
    async function start() {
      try {
        const echarts = await import("echarts");
        if (wordcloud) await import("echarts-wordcloud");
        if (active && host.current) {
          current = echarts.init(host.current, undefined, { renderer: "canvas" });
          setChart(current);
        }
      } catch {
        if (active) setError("无法初始化图表");
      }
    }
    void start();
    return () => { active = false; current?.dispose(); };
  }, [wordcloud]);
  useEffect(() => {
    if (chart && !chart.isDisposed()) {
      chart.resize({ width, height });
      chart.setOption(option, { notMerge: true });
    }
  }, [chart, height, option, width]);

  function download(name: string, type: "png" | "jpeg") {
    if (!chart || chart.isDisposed()) return;
    const link = document.createElement("a");
    link.href = chart.getDataURL({ type, pixelRatio: 1, backgroundColor: "#fff" });
    link.download = `${name}.${type === "jpeg" ? "jpg" : "png"}`;
    link.click();
  }
  return { host, ready: Boolean(chart), error, download };
}

function ChartPreview({ host, error, width, height, zoom = 100, label }: {
  host: RefObject<HTMLDivElement | null>;
  error: string;
  width: number;
  height: number;
  zoom?: number;
  label: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(width);
  useEffect(() => {
    if (!wrapper.current) return;
    const resize = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    resize.observe(wrapper.current);
    return () => resize.disconnect();
  }, []);
  const scale = Math.min(available / width, zoom / 100);
  return <div className={styles.chartPreview} ref={wrapper}>
    {error && <p role="alert">{error}</p>}
    <div style={{ width: width * scale, height: height * scale }}>
      <div ref={host} role="img" aria-label={label}
        style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }} />
    </div>
  </div>;
}

function ChartEditor({ rows, kind, apply, close }: {
  rows: string[][];
  kind: ChartKind;
  apply: (rows: string[][], table: ChartTable) => void;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(rows);
  const [error, setError] = useState("");
  useEffect(() => { dialog.current?.showModal(); }, []);
  const columns = Math.max(2, ...draft.map((row) => row.length));
  return <dialog ref={dialog} className={styles.editor} onClose={close} aria-labelledby="chart-editor-title">
    <form onSubmit={(event) => {
      event.preventDefault();
      try {
        const table = readChartRows(draft, kind); apply(draft, table);
      } catch (error) { setError((error as Error).message); }
    }}>
      <h2 id="chart-editor-title">编辑数据</h2>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>行</th>{Array.from({ length: columns }, (_, index) => <th key={index}>{String.fromCharCode(65 + index)}</th>)}<th>操作</th></tr></thead>
          <tbody>
            {draft.map((row, rowIndex) => <tr key={rowIndex}>
              <th scope="row">{rowIndex + 1}</th>
              {Array.from({ length: columns }, (_, index) => <td key={index}>
                <input aria-label={`${rowIndex + 1} 行 ${String.fromCharCode(65 + index)} 列`} value={row[index] ?? ""} onChange={(event) => {
                  const nextRow = Array.from({ length: columns }, (_, col) => col === index ? event.target.value : (row[col] ?? ""));
                  setDraft(draft.map((current, position) => position === rowIndex ? nextRow : current));
                }} />
              </td>)}
              <td><button type="button" aria-label={`删除第 ${rowIndex + 1} 行`} title="删除此行" onClick={() => setDraft(draft.filter((_, index) => index !== rowIndex))}><Trash2 size={16} /></button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={styles.actions}>
        <button type="button" onClick={() => setDraft([...draft, Array<string>(columns).fill("")])}><Plus size={16} />添加行</button>
        <button type="button" disabled={columns >= 12} onClick={() => setDraft((draft.length ? draft : [["", ""]]).map((row) => [...row, ""]))}><Plus size={16} />添加列</button>
        <button type="submit" data-primary>应用数据</button>
        <button type="button" onClick={close}>取消</button>
      </div>
    </form>
  </dialog>;
}

function SizeInput({ label, value, min, max, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  return <label>{label}
    <input type="number" value={draft} min={min} max={max} onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        const number = draft.trim() ? Number(draft) : value;
        const next = Number.isFinite(number) ? Math.round(Math.min(max, Math.max(min, number))) : value;
        onChange(next); setDraft(String(next));
      }} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} />
  </label>;
}

export function ChartTool({ kind }: { kind: ChartKind }) {
  const [rows, setRows] = useState(kind === "scatter" ? defaultScatterRows : defaultChartRows);
  const [table, setTable] = useState(() => readChartRows(rows, kind));
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(400);
  const [zoom, setZoom] = useState(100);
  const [options, setOptions] = useState(initialOptions);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const option = useMemo(() => getChartOption(kind, table, options), [kind, options, table]);
  const { host, error: chartError, ready, download } = useChart(option, width, height);
  const update = <K extends keyof GraphicOptions>(key: K, value: GraphicOptions[K]) => setOptions((previous) => ({ ...previous, [key]: value }));

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      if (file.size > 5000000) throw new Error("文件不能超过 5 MB");
      const next = await readChartFile(await file.arrayBuffer(), file.name);
      const nextTable = readChartRows(next, kind);
      setRows(next); setTable(nextTable); setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "无法读取此文件");
    } finally { setBusy(false); }
  }

  return <div className={styles.chartLayout}>
    <div className={styles.chartWork}>
      <div className={styles.zoom}><SizeInput label="缩放 (%)" value={zoom} min={10} max={200} onChange={setZoom} /></div>
      <ChartPreview host={host} error={chartError} width={width} height={height} zoom={zoom} label={titles[kind] + "预览"} />
    </div>
    <aside className={styles.chartControls}>
      <button type="button" data-primary disabled={!ready} onClick={() => download(titles[kind], format)}><Download size={17} />下载图表</button>
      <fieldset className={styles.format}>
        <legend>文件类型</legend>
        <label className={styles.check}><input type="radio" value="png" checked={format === "png"} onChange={() => setFormat("png")} />PNG</label>
        <label className={styles.check}><input type="radio" value="jpeg" checked={format === "jpeg"} onChange={() => setFormat("jpeg")} />JPEG</label>
      </fieldset>
      <div className={styles.actions}>
        <input type="file" accept=".xls,.xlsx,.csv" aria-label="选择图表数据文件" ref={input} onChange={importData} hidden />
        <button type="button" disabled={busy} onClick={() => input.current?.click()}><FileUp size={16} />上传数据</button>
        <button type="button" onClick={() => setEditing(true)}><Table2 size={16} />编辑数据</button>
      </div>
      {error && <p role="alert">{error}</p>}
      <details open>
        <summary>画布设置</summary>
        <div className={styles.settings}>
          <SizeInput label="宽度" value={width} min={160} max={2400} onChange={setWidth} />
          <SizeInput label="高度" value={height} min={160} max={2400} onChange={setHeight} />
        </div>
      </details>
      <details>
        <summary>标题设置</summary>
        <div className={styles.settings}>
          <label>位置<select value={options.titleLocation} onChange={(event) => update("titleLocation", event.target.value as GraphicOptions["titleLocation"])}>
            <option value="left">左</option><option value="center">中</option><option value="right">右</option>
          </select></label>
          <label className={styles.check}><input type="checkbox" checked={options.titleVisible} onChange={(event) => update("titleVisible", event.target.checked)} />显示标题</label>
          <label>标题<input value={options.title} onChange={(event) => update("title", event.target.value)} /></label>
          <label className={styles.check}><input type="checkbox" checked={options.subtitleVisible} onChange={(event) => update("subtitleVisible", event.target.checked)} />显示副标题</label>
          <label>副标题<input value={options.subtitle} onChange={(event) => update("subtitle", event.target.value)} /></label>
        </div>
      </details>
      {kind !== "pie" && <details>
        <summary>图形属性</summary>
        <div className={styles.settings}><label>颜色<input type="color" value={options.color} onChange={(event) => update("color", event.target.value)} /></label></div>
      </details>}
      <details>
        <summary>水印设置</summary>
        <div className={styles.settings}>
          <label className={styles.check}><input type="checkbox" checked={options.watermarkVisible} onChange={(event) => update("watermarkVisible", event.target.checked)} />显示</label>
          <label>水印内容<input value={options.watermark} onChange={(event) => update("watermark", event.target.value)} /></label>
        </div>
      </details>
    </aside>
    {editing && <ChartEditor rows={rows} kind={kind} close={() => setEditing(false)} apply={(next, nextTable) => {
      setRows(next); setTable(nextTable); setEditing(false); setError("");
    }} />}
  </div>;
}

const defaultWords = "词云 生成 工具 在线 文本 分析 可视化 数据 图表 形状 颜色 字体 大小 频率 统计 单词 词组 自定义 圆形 菱形 三角形 心形 暖色 冷色 多彩";
const shapes = [["circle", "圆形"], ["diamond", "菱形"], ["triangle", "三角形"], ["cardioid", "心形"], ["star", "星形"]];
const palettes = [
  ["默认", ["#3c5171", "#367578", "#5a6398", "#935567", "#725c42"]],
  ["暖色", ["#a83430", "#b85536", "#935829", "#c55862"]],
  ["冷色", ["#27788d", "#4b5498", "#367869", "#254a73"]],
  ["多彩", ["#db3f62", "#067873", "#6554c0", "#a76112", "#49568e"]],
] as const;

export function WordCloudTool() {
  const [text, setText] = useState(defaultWords);
  const [shape, setShape] = useState("circle");
  const [palette, setPalette] = useState(0);
  const [minimum, setMinimum] = useState(12);
  const [maximum, setMaximum] = useState(60);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState({ words: readWords(defaultWords), shape, palette, minimum, maximum });
  const option = useMemo(() => ({
    backgroundColor: "#fff",
    series: [{
      type: "wordCloud",
      shape: applied.shape,
      sizeRange: [applied.minimum, applied.maximum],
      rotationRange: [-45, 45],
      gridSize: 6,
      data: applied.words.map((word, index) => {
        const colors = palettes[applied.palette][1];
        return { ...word, textStyle: { color: colors[index % colors.length] } };
      }),
    }],
  }) as unknown as EChartsOption, [applied]);
  const { host, error: chartError, ready, download } = useChart(option, 720, 480, true);

  return <div className={styles.chartLayout}>
    <div className={styles.chartWork}><ChartPreview host={host} error={chartError} width={720} height={480} label="词云预览" /></div>
    <form className={styles.chartControls} onSubmit={(event) => {
      event.preventDefault();
      if (minimum > maximum) { setError("最小字体不能大于最大字体"); return; }
      const words = readWords(text);
      if (!words.length) { setError("请输入要统计的文字"); return; }
      setApplied({ words, shape, palette, minimum, maximum }); setError("");
    }}>
      <label>输入文本<textarea placeholder="请输入要生成词云的文本" maxLength={50000} rows={5} value={text} onChange={(event) => setText(event.target.value)} /></label>
      <h2>词云设置</h2>
      <label>形状<select value={shape} onChange={(event) => setShape(event.target.value)}>{shapes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>颜色方案<select value={palette} onChange={(event) => setPalette(Number(event.target.value))}>{palettes.map(([name], index) => <option key={name} value={index}>{name}</option>)}</select></label>
      <div className={styles.actions}>
        <SizeInput label="最小字体" value={minimum} min={8} max={180} onChange={setMinimum} />
        <SizeInput label="最大字体" value={maximum} min={8} max={180} onChange={setMaximum} />
      </div>
      <div className={styles.actions}>
        <button type="submit" data-primary>生成词云</button>
        <button type="button" disabled={!ready || !applied.words.length} onClick={() => download("词云", "png")}><Download size={16} />下载图片</button>
        <button type="button" onClick={() => { setText(""); setApplied({ ...applied, words: [] }); setError(""); }}>清空</button>
      </div>
      {error && <p role="alert">{error}</p>}
    </form>
  </div>;
}

export const chartTools = {
  bar: () => <ChartTool kind="bar" />,
  line: () => <ChartTool kind="line" />,
  pie: () => <ChartTool kind="pie" />,
  scatter: () => <ChartTool kind="scatter" />,
  wordcloud: WordCloudTool,
};
