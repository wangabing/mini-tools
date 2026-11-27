import { canvasBlob, canvasContext, createCanvas, drawImageFile } from "./mediaBrowser";

export function canvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(canvas.width - 1, (clientX - bounds.left) * canvas.width / bounds.width)),
    y: Math.max(0, Math.min(canvas.height - 1, (clientY - bounds.top) * canvas.height / bounds.height)),
  };
}

export function colorFormats(red: number, green: number, blue: number) {
  const [r, g, b] = [red, green, blue].map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  const hue = delta ? max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4 : 0;
  return {
    HEX: `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`,
    RGB: `rgb(${red}, ${green}, ${blue})`,
    HSL: `hsl(${Math.round(hue * 60) % 360}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`,
  };
}

export function splitCanvas(source: HTMLCanvasElement, rows: number, columns: number) {
  if (rows < 1 || columns < 1 || !Number.isInteger(rows) || !Number.isInteger(columns) || rows > source.height || columns > source.width) {
    throw new Error("行列数需要是整数，且不能超过图片像素尺寸。");
  }
  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = Math.floor(column * source.width / columns);
      const y = Math.floor(row * source.height / rows);
      const width = Math.floor((column + 1) * source.width / columns) - x;
      const height = Math.floor((row + 1) * source.height / rows) - y;
      const piece = createCanvas(width, height);
      canvasContext(piece).drawImage(source, x, y, width, height, 0, 0, width, height);
      tiles.push(piece);
    }
  }
  return tiles;
}

export async function compressImage(file: File, quality: number) {
  const type = file.type || (/\.png$/i.test(file.name) ? "image/png" : /\.webp$/i.test(file.name) ? "image/webp" : "image/jpeg");
  if (!["image/png", "image/jpeg", "image/webp"].includes(type)) throw new Error(`${file.name} 不是 JPG、PNG 或 WebP 图片。`);
  const canvas = await drawImageFile(file);
  if (type === "image/png" && quality < 1) {
    const ctx = canvasContext(canvas);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const level = 1 + Math.round((1 - quality) * 43);
    for (let index = 0; index < pixels.data.length; index += 4) {
      for (let channel = 0; channel < 3; channel++) {
        pixels.data[index + channel] = Math.round(pixels.data[index + channel] / level) * level;
      }
    }
    ctx.putImageData(pixels, 0, 0);
  }
  const compressed = await canvasBlob(canvas, type, quality);
  return compressed.type === type && compressed.size < file.size ? compressed : file;
}

export async function analyzeImage(source: HTMLCanvasElement, quality: number, gain: number) {
  const jpeg = await drawImageFile(await canvasBlob(source, "image/jpeg", quality));
  const original = canvasContext(source).getImageData(0, 0, source.width, source.height);
  const comparison = canvasContext(jpeg).getImageData(0, 0, source.width, source.height);
  for (let index = 0; index < original.data.length; index += 4) {
    const alpha = original.data[index + 3] / 255;
    for (let channel = 0; channel < 3; channel++) {
      comparison.data[index + channel] = Math.abs(original.data[index + channel] - comparison.data[index + channel]) * alpha * gain;
    }
    comparison.data[index + 3] = 255;
  }
  const heatmap = createCanvas(source.width, source.height);
  canvasContext(heatmap).putImageData(comparison, 0, 0);
  return heatmap;
}

export function drawTextLines(context: CanvasRenderingContext2D, text: string, width: number) {
  return text.split(/\r?\n/).flatMap((line) => {
    const rows: string[] = [];
    let row = "";
    for (const character of line) {
      if (row && context.measureText(row + character).width > width) {
        rows.push(row);
        row = character;
      } else {
        row += character;
      }
    }
    return [...rows, row];
  });
}
