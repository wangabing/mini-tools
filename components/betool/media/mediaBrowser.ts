export function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function canvasContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("浏览器无法使用画布");
  return context;
}

export function canvasBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("图片导出失败")), type, quality);
  });
}

export async function drawImageFile(file: Blob) {
  const image = await createImageBitmap(file);
  try {
    const canvas = createCanvas(image.width, image.height);
    canvasContext(canvas).drawImage(image, 0, 0);
    return canvas;
  } finally {
    image.close();
  }
}

export function basename(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function downloadZip(files: { name: string; data: Blob | Uint8Array }[], name: string) {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  for (const file of files) zip.file(file.name, file.data);
  downloadBlob(await zip.generateAsync({ type: "blob" }), name);
}

export function messageFor(error: unknown) {
  if (error instanceof Error && /password|encrypt/i.test(error.message)) {
    return "文件带有密码保护，请解锁后重试。";
  }
  return error instanceof Error ? error.message : "文件处理失败。";
}
