import { cp, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const source = dirname(require.resolve("pdfjs-dist/package.json"));
const destination = fileURLToPath(new URL("../public/pdfjs/", import.meta.url));

await mkdir(destination, { recursive: true });
await Promise.all([
  ...["cmaps", "standard_fonts", "wasm", "iccs", "LICENSE"].map((name) =>
    cp(join(source, name), join(destination, name), { recursive: true })),
  cp(join(source, "build", "pdf.worker.min.mjs"), join(destination, "pdf.worker.min.mjs")),
]);
