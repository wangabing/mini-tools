export type ChartKind = "bar" | "line" | "pie" | "scatter";

export type ChartTable = {
  labels: string[];
  series: { name: string; values: number[] }[];
};

export const defaultChartRows = [
  ["名称", "数值"],
  ["Mon", "23"], ["Tue", "24"], ["Wed", "18"], ["Thu", "25"],
  ["Fri", "27"], ["Sat", "28"], ["Sun", "25"],
];

export const defaultScatterRows = [
  ["X", "Y"], ["10", "8"], ["15", "12"], ["21", "20"], ["22", "16"], ["24", "25"], ["28", "21"], ["30", "32"],
];

export async function readChartFile(bytes: ArrayBuffer, filename: string): Promise<string[][]> {
  const { read, utils } = await import("@e965/xlsx");
  const isCsv = /\.csv$/i.test(filename);
  const options = { sheets: 0, sheetRows: 1002 };
  let workbook;
  if (isCsv) {
    let text: string;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      text = new TextDecoder("gb18030").decode(bytes);
    }
    workbook = read(text, { ...options, type: "string", raw: true });
  } else {
    workbook = read(bytes, { ...options, type: "array" });
  }
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("文件中没有可读的工作表");
  return utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: "" })
    .map((row) => row.map((value) => String(value ?? "")));
}

function isNumeric(value: string | undefined): boolean {
  return Boolean(value?.trim()) && Number.isFinite(Number(value));
}

export function readChartRows(rows: string[][], kind: ChartKind): ChartTable {
  const nonempty = rows.map((row) => row.map((value) => value.trim())).filter((row) => row.some(Boolean));
  if (!nonempty.length) throw new Error("请输入一行以上图表数据");
  const columnLimit = Math.max(...nonempty.map((row) => row.length));
  if (columnLimit < 2) throw new Error("数据至少需要两列");
  if (columnLimit > 12 || nonempty.length > 1001) throw new Error("最多支持 12 列、1000 行数据");
  const hasHeader = nonempty[0].slice(1).some((cell) => Boolean(cell) && !isNumeric(cell));
  const data = hasHeader ? nonempty.slice(1) : nonempty;
  if (!data.length) throw new Error("表头之后需要至少一行数据");
  const seriesCount = kind === "pie" || kind === "scatter" ? 1 : columnLimit - 1;
  const labels = data.map((row, index) => {
    if (kind === "scatter" && !isNumeric(row[0])) throw new Error(`第 ${index + 1} 行 X 值不是数字`);
    return row[0] || `第 ${index + 1} 项`;
  });
  const series = Array.from({ length: seriesCount }, (_, index) => ({
    name: (hasHeader && nonempty[0][index + 1]) || `系列 ${index + 1}`,
    values: data.map((row, rowIndex) => {
      const cell = row[index + 1];
      if (!isNumeric(cell)) throw new Error(`第 ${rowIndex + 1} 行、第 ${index + 2} 列不是有效数字`);
      const value = Number(cell);
      if (kind === "pie" && value < 0) throw new Error("饼图的数值不能为负数");
      return value;
    }),
  }));
  if (kind === "pie" && series[0].values.every((value) => value === 0)) throw new Error("饼图至少需要一个大于 0 的数值");
  return { labels, series };
}

export function readWords(text: string): { name: string; value: number }[] {
  const segmenter = new Intl.Segmenter("zh", { granularity: "word" });
  const counts = new Map<string, number>();
  for (const { segment, isWordLike } of segmenter.segment(text.normalize("NFKC"))) {
    if (!isWordLike) continue;
    const key = segment.toLocaleLowerCase("zh");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 200);
}
