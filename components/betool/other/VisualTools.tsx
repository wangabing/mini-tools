"use client";

import Color from "colorjs.io";
import { useState } from "react";
import { COLOR_COLLECTIONS, EMOJI, PALETTES } from "./visual-data";
import styles from "./other.module.css";

function useCopyStatus() {
  const [status, setStatus] = useState("");
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`已复制 ${value}`);
    } catch {
      setStatus("复制失败");
    }
  }
  return { copy, status };
}

export function PaletteTool({ combinations = false }: { combinations?: boolean }) {
  const [active, setActive] = useState("基础颜色");
  const { copy, status } = useCopyStatus();
  const categories = Object.keys(COLOR_COLLECTIONS).toSpliced(1, 0, "渐变色");
  const colors: [string, string][] = active === "渐变色"
    ? PALETTES.map((colors, index) => [`渐变 ${index + 1}`, `linear-gradient(90deg, ${colors[0]}, ${colors[4]})`])
    : COLOR_COLLECTIONS[active];

  return <>
    {combinations ? (
      <div className={styles.paletteRows}>{PALETTES.map((row, index) =>
        <div className={styles.paletteRow} key={index}>
          {row.map((color) => <button type="button" key={color} style={{ background: color }}
            title={color} aria-label={`复制 ${color}`} onClick={() => void copy(color)} />)}
        </div>
      )}</div>
    ) : (
      <>
        <div className={styles.tabs} aria-label="颜色分类">
          {categories.map((name) => <button type="button" key={name} aria-pressed={active === name} onClick={() => setActive(name)}>{name}</button>)}
        </div>
        <div className={styles.colorGrid}>{colors.map(([name, color], index) => (
          <button type="button" key={index} onClick={() => void copy(color)} title={`复制 ${color}`}>
            <span className={styles.swatch} style={{ background: color }} />
            <strong>{name}</strong><code>{color}</code>
          </button>
        ))}</div>
      </>
    )}
    <p role="status">{status}</p>
  </>;
}

export function ColorConverter() {
  const [input, setInput] = useState("#3596cf");
  const { copy, status } = useCopyStatus();
  let formats: Array<[string, string]> = [];
  try {
    const color = new Color(input);
    const rgb = color.to("srgb");
    formats = [
      ["HEX", rgb.toString({ format: "hex", collapse: false })],
      ["RGB", rgb.toString({ format: "rgb", precision: 4 })],
      ["HSL", color.to("hsl").toString({ precision: 4 })],
      ["HWB", color.to("hwb").toString({ precision: 4 })],
      ["OKLCH", color.to("oklch").toString({ precision: 4 })],
    ];
  } catch {}
  const hex = formats[0]?.[1].slice(0, 7);

  return <>
    <div className={styles.fields}>
      <label>颜色<input type="color" value={hex || "#000000"} onChange={(event) => setInput(event.target.value)} /></label>
      <label>CSS 颜色值<input value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} /></label>
    </div>
    {formats.length ? (
      <dl className={styles.formats}>{formats.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd><output>{value}</output><button type="button" onClick={() => void copy(value)}>复制</button></dd></div>
      ))}</dl>
    ) : <p role="alert">请输入有效的 CSS 颜色</p>}
    <p role="status">{status}</p>
  </>;
}

export function EmojiDirectory() {
  const [filter, setFilter] = useState("全部");
  const [query, setQuery] = useState("");
  const { copy, status } = useCopyStatus();
  const rows = filter === "全部" ? Object.values(EMOJI).flat() : EMOJI[filter];
  const keyword = query.trim().toLowerCase();
  const matches = rows.filter(([emoji, name]) => (emoji + name).toLowerCase().includes(keyword));

  return <>
    <label>搜索Emoji<input type="search" value={query} placeholder="搜索Emoji" onChange={(event) => setQuery(event.target.value)} /></label>
    <div className={styles.tabs} aria-label="表情分类">
      {["全部", ...Object.keys(EMOJI)].map((name) => <button type="button" key={name} aria-pressed={filter === name}
        onClick={() => setFilter(name)}>{name}</button>)}
    </div>
    <div className={styles.emojiGrid}>{matches.map(([emoji, name], index) => (
      <button type="button" key={index} title={`复制 ${emoji}`} onClick={() => void copy(emoji)}>
        <span>{emoji}</span><small>{name}</small>
      </button>
    ))}</div>
    {matches.length === 0 && <p>没有匹配的表情</p>}
    <p role="status">{status}</p>
  </>;
}
