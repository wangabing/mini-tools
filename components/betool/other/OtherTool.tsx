"use client";

import { useState } from "react";
import { PaletteTool, ColorConverter, EmojiDirectory } from "./VisualTools";
import { Barrage, Pomodoro, ReactionTest, RockPaperScissors, HlsPlayer } from "./InteractiveTools";
import { Calculator } from "./Calculator";
import { formatRmb, parseRmb } from "./money";
import styles from "./other.module.css";

export function CopyValue({ value, label = "复制" }: { value: string; label?: string }) {
  const [message, setMessage] = useState("");
  return (
    <span className={styles.copy}>
      <button type="button" onClick={async () => {
        try {
          if (!value) throw new Error();
          await navigator.clipboard.writeText(value);
          setMessage("已复制");
        } catch {
          setMessage("复制失败");
        }
      }}>{label}</button>
      {message && <small role="status">{message}</small>}
    </span>
  );
}

function MoneyConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function convert(operation: (value: string) => string) {
    try {
      setResult(operation(input));
      setError("");
    } catch (cause) {
      setResult("");
      setError((cause as Error).message);
    }
  }

  return (
    <>
      <label htmlFor="money-input">金额</label>
      <textarea id="money-input" value={input} onChange={(event) => setInput(event.target.value)} />
      <div className={styles.actions}>
        <button type="button" onClick={() => convert(formatRmb)}>转金额大写</button>
        <button type="button" onClick={() => convert(parseRmb)}>转数字</button>
        <CopyValue value={result} />
        <button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }}>清空</button>
      </div>
      <label htmlFor="money-result">结果</label>
      <textarea id="money-result" readOnly value={result} />
      {error && <p role="alert">{error}</p>}
    </>
  );
}

const tools = {
  numberToChinese: MoneyConverter,
  barrage: Barrage,
  palettes: () => <PaletteTool combinations />,
  ColorPicker: ColorConverter,
  colorpalette: PaletteTool,
  pomodoro: Pomodoro,
  reactiontest: ReactionTest,
  m3u8player: HlsPlayer,
  rockpaperscissors: RockPaperScissors,
  emoji: EmojiDirectory,
  calculator: Calculator,
};

export function OtherTool({ slug }: { slug: string }) {
  const Tool = tools[slug as keyof typeof tools];
  return <div className={styles.tool}><Tool /></div>;
}
