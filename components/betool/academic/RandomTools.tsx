"use client";

import { useEffect, useRef, useState } from "react";
import { drawOptions, randomInteger } from "./random";
import styles from "./academic.module.css";

function RandomNumber() {
  const [minimum, setMinimum] = useState("1");
  const [maximum, setMaximum] = useState("100");
  const [number, setNumber] = useState(0);
  const [error, setError] = useState("");

  return <form onSubmit={(event) => {
    event.preventDefault();
    try {
      setNumber(randomInteger(Number(minimum), Number(maximum))); setError("");
    } catch (error) { setError((error as Error).message); }
  }}>
    <output className={styles.largeResult}>{number}</output>
    <div className={styles.actions}>
      <label>最小值<input type="number" required step="1" value={minimum} onChange={(event) => setMinimum(event.target.value)} /></label>
      <label>最大值<input type="number" required step="1" value={maximum} onChange={(event) => setMaximum(event.target.value)} /></label>
      <button type="submit" data-primary>生成</button>
    </div>
    {error && <p role="alert">{error}</p>}
  </form>;
}

const choices = [
  { title: "吃什么", value: "沙县,烧腊,小炒肉,兰州拉面,汤饭,黄焖鸡,卤肉饭,蛋炒饭,羊肉粉,螺蛳粉,猪脚饭,白切鸡,肯德基,火锅,烧烤,泡面,西北风,煎饼果子" },
  { title: "干什么", value: "电影,听音乐,游戏,逛街,看电视,睡觉,吃饭,清洁,锻炼,学习,发呆,散步,购物,回家,唱歌" },
];

function readOptions(value: string, delimiter: RegExp) {
  return value.split(delimiter).map((option) => option.trim()).filter(Boolean);
}

function Decision() {
  const [preset, setPreset] = useState(0);
  const [input, setInput] = useState(choices[0].value);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  return <>
    <div className={styles.tabs}>
      {choices.map(({ title, value }, index) => <button type="button" aria-pressed={preset === index} key={title}
        onClick={() => { setPreset(index); setInput(value); setResult(""); setError(""); }}>{title}</button>)}
    </div>
    <textarea aria-label="决定选项" placeholder="用逗号或换行分隔选项" value={input} rows={4} onChange={(event) => setInput(event.target.value)} />
    <div className={styles.actions}>
      <button type="button" data-primary onClick={() => {
        const options = readOptions(input, /[，,\n]/);
        if (!options.length) { setError("请输入至少一个决定选项"); return; }
        setResult(options[randomInteger(0, options.length - 1)]);
        setError("");
      }}>帮我决定</button>
      <button type="button" onClick={() => { setInput(""); setResult(""); setError(""); }}>清空</button>
    </div>
    {error && <p role="alert">{error}</p>}
    {result && <output className={styles.largeResult}>{result}</output>}
  </>;
}

function Coin() {
  const [face, setFace] = useState("正面");
  const [flip, setFlip] = useState(0);

  return <div className={styles.center}>
    <output key={flip} className={styles.coin} data-moving={flip > 0} aria-live="polite">{face}</output>
    <button type="button" data-primary onClick={() => {
      setFace(randomInteger(0, 1) ? "正面" : "反面");
      setFlip((count) => count + 1);
    }}>抛硬币</button>
  </div>;
}

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

function Dice() {
  const [count, setCount] = useState(2);
  const [values, setValues] = useState<number[]>([1, 1]);
  const [roll, setRoll] = useState(0);
  return <>
    <div className={styles.actions}>
      <label>骰子数量
        <select value={count} onChange={(event) => {
          const nextCount = Number(event.target.value);
          setCount(nextCount); setValues(Array.from({ length: nextCount }, () => 1)); setRoll(0);
        }}>
          {Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}
        </select>
      </label>
      <button type="button" data-primary onClick={() => {
        setValues(Array.from({ length: count }, () => randomInteger(1, 6)));
        setRoll((current) => current + 1);
      }}>投骰子</button>
      <button type="button" onClick={() => { setValues(Array.from({ length: count }, () => 1)); setRoll(0); }}>重置</button>
    </div>
    <div key={roll} className={styles.dice} data-moving={roll > 0} aria-label="骰子">
      {values.map((value, index) => <span key={index} aria-label={`${value} 点`}>{diceFaces[value - 1]}</span>)}
    </div>
    {roll > 0 && <output className={styles.sum}>总点数 {values.reduce((total, value) => total + value, 0)}</output>}
  </>;
}

function Lottery() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState("1");
  const [repeats, setRepeats] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  return <form onSubmit={(event) => {
    event.preventDefault();
    try {
      setResult(drawOptions(readOptions(input, /\r?\n/), Number(count), repeats)); setError("");
    } catch (error) { setError((error as Error).message); setResult([]); }
  }}>
    <label>抽签选项（每行一个）
      <textarea placeholder="请输入抽签选项，每行一个" value={input} rows={5} onChange={(event) => setInput(event.target.value)} />
    </label>
    <h2>抽取设置</h2>
    <div className={styles.actions}>
      <label>抽取数量<input type="number" required min="1" max="1000" step="1" value={count} onChange={(event) => setCount(event.target.value)} /></label>
      <label className={styles.check}><input type="checkbox" checked={repeats} onChange={(event) => setRepeats(event.target.checked)} />是否允许重复</label>
    </div>
    <div className={styles.actions}>
      <button type="submit" data-primary>开始抽签</button>
      <button type="button" onClick={() => { setInput(""); setCount("1"); setRepeats(false); setResult([]); setError(""); }}>清空</button>
    </div>
    {error && <p role="alert">{error}</p>}
    <section aria-label="抽签结果" aria-live="polite">
      <h2>抽签结果</h2>
      {result.length ? <ol>{result.map((value, index) => <li key={index}>{value}</li>)}</ol> : <p>点击开始抽签按钮开始抽取</p>}
    </section>
  </form>;
}

const defaultWheel = ["选项1", "选项2", "选项3", "选项4", "选项5"];
const wheelColors = ["#236b85", "#82364c", "#437957", "#aa541b", "#50487b", "#946417", "#3a688c", "#496878", "#7b4282", "#356f64"];

function Wheel() {
  const [input, setInput] = useState(defaultWheel.join("\n"));
  const [options, setOptions] = useState(defaultWheel);
  const [rotation, setRotation] = useState(0);
  const [moving, setMoving] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const step = 360 / Math.max(options.length, 1);
  const segments = options.map((_, index) => `${wheelColors[index % wheelColors.length]} ${index * step}deg ${(index + 1) * step}deg`);

  function spin() {
    const index = randomInteger(0, options.length - 1);
    const target = (360 - (index + .5) * step + 360) % 360;
    const delta = (target - rotation % 360 + 360) % 360;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2500;
    setRotation(rotation + 5 * 360 + delta);
    setMoving(true);
    setResult("");
    timer.current = setTimeout(() => { setMoving(false); setResult(options[index]); }, duration);
  }

  return <div className={styles.split}>
    <div>
      <label>转盘选项（每行一个）
        <textarea aria-label="转盘选项（每行一个）" value={input} rows={8} placeholder="请输入转盘选项，每行一个" disabled={moving} onChange={(event) => setInput(event.target.value)} />
      </label>
      <div className={styles.actions}>
        <button type="button" data-primary disabled={moving} onClick={() => {
          const next = readOptions(input, /\r?\n/);
          if (next.length < 2 || next.length > 50) { setError("请输入 2 到 50 个转盘选项"); return; }
          setOptions(next); setResult(""); setError(""); setRotation(0);
        }}>更新转盘</button>
        <button type="button" disabled={moving} onClick={() => {
          setInput(""); setOptions([]); setResult(""); setError(""); setRotation(0);
        }}>清空</button>
      </div>
      {error && <p role="alert">{error}</p>}
    </div>
    <div className={styles.center}>
      <div className={styles.wheelWrap}>
        <span className={styles.pointer} aria-hidden="true" />
        <div className={styles.wheel} data-moving={moving} style={{
          transform: `rotate(${rotation}deg)`,
          background: segments.length ? `conic-gradient(${segments.join(", ")})` : "var(--backdrop, #f5f5fb)",
        }} aria-label="转盘">
          {options.map((label, index) => <div className={styles.wheelSegment} key={index}
            style={{ transform: `rotate(${(index + .5) * step}deg)` }}>
            <span title={label}>{label}</span>
          </div>)}
        </div>
      </div>
      <button type="button" data-primary disabled={moving || options.length < 2} onClick={spin}>开始旋转</button>
      <output className={styles.sum} aria-live="polite">{result}</output>
    </div>
  </div>;
}

export const randomTools = { random: RandomNumber, decision: Decision, coin: Coin, dice: Dice, lottery: Lottery, wheel: Wheel };
