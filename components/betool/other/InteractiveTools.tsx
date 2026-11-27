"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "@/src/config/brand";
import { randomInteger } from "../academic/random";
import styles from "./other.module.css";

export function Barrage() {
  const [text, setText] = useState(BRAND_NAME);
  const [speed, setSpeed] = useState(5);
  const [size, setSize] = useState(100);
  const [color, setColor] = useState("#ffffff");
  const [background, setBackground] = useState("#000000");
  const player = useRef<HTMLDialogElement>(null);

  return <>
    <label htmlFor="barrage-text">弹幕内容</label>
    <textarea id="barrage-text" value={text} onChange={(event) => setText(event.target.value)} />
    <div className={styles.fields}>
      <label>播放速度<input type="range" min="1" max="10" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
      <label>文字大小<input type="range" min="28" max="260" value={size} onChange={(event) => setSize(Number(event.target.value))} /></label>
      <label>文字颜色<input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
      <label>背景颜色<input type="color" value={background} onChange={(event) => setBackground(event.target.value)} /></label>
    </div>
    <button type="button" className={styles.primary} disabled={!text.trim()} onClick={() => player.current?.showModal()}>播放</button>
    <dialog ref={player} className={styles.barrage} aria-label="弹幕播放" onDoubleClick={() => player.current?.close()}
      style={{ color, background }}>
      <button type="button" onClick={() => player.current?.close()}>退出</button>
      <span style={{ fontSize: size, animationDuration: `${16 - speed * 1.2}s` }}>{text}</span>
    </dialog>
  </>;
}

const timerFields = [
  { key: "work", label: "工作时间", initial: 25, min: 1, max: 120 },
  { key: "short", label: "短休息", initial: 5, min: 1, max: 60 },
  { key: "long", label: "长休息", initial: 15, min: 1, max: 120 },
  { key: "rounds", label: "工作轮数", initial: 4, min: 1, max: 12 },
] as const;
type TimerSettings = Record<(typeof timerFields)[number]["key"], number>;
type TimerMode = Exclude<keyof TimerSettings, "rounds">;
const initialSettings = { work: 25, short: 5, long: 15, rounds: 4 };
const today = () => new Date().toLocaleDateString("sv-SE");

export function Pomodoro() {
  const [settings, setSettings] = useState<TimerSettings>(initialSettings);
  const [mode, setMode] = useState<TimerMode>("work");
  const [rounds, setRounds] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(25 * 60);
  const [deadline, setDeadline] = useState<number>();

  useEffect(() => {
    const id = window.setTimeout(() => {
      try { setTotal(Number(localStorage.getItem(`xiaozhan.pomodoro.${today()}`)) || 0); } catch {}
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (deadline === undefined) return;
    const id = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds > 0) return;
      setDeadline(undefined);
      if (mode === "work") {
        const complete = rounds + 1;
        const next = complete >= settings.rounds ? "long" : "short";
        setMode(next);
        setRounds(complete);
        setRemaining(settings[next] * 60);
        setTotal(total + 1);
        try { localStorage.setItem(`xiaozhan.pomodoro.${today()}`, String(total + 1)); } catch {}
      } else {
        setMode("work");
        if (mode === "long") setRounds(0);
        setRemaining(settings.work * 60);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [deadline, mode, rounds, settings, total]);

  function reset() {
    setDeadline(undefined);
    setRounds(0);
    setMode("work");
    setRemaining(settings.work * 60);
  }

  return <>
    <output className={styles.timer} aria-label="剩余时间">{String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}</output>
    <div className={styles.actions}>
      <button type="button" className={styles.primary} disabled={deadline !== undefined} onClick={() => setDeadline(Date.now() + remaining * 1000)}>开始</button>
      <button type="button" disabled={deadline === undefined} onClick={() => {
        if (deadline !== undefined) setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        setDeadline(undefined);
      }}>暂停</button>
      <button type="button" onClick={reset}>重置</button>
    </div>
    <h2>时间设置（分钟）</h2>
    <div className={styles.fields}>
      {timerFields.map(({ key, label, min, max }) => <label key={key}>{label}<input
        type="number" min={min} max={max} value={settings[key]} disabled={deadline !== undefined}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (!Number.isInteger(value) || value < min || value > max) return;
          setSettings({ ...settings, [key]: value });
          if (key === mode) setRemaining(value * 60);
        }} /></label>)}
    </div>
    <dl className={styles.stats}>
      <div><dt>当前模式</dt><dd>{{ work: "工作", short: "短休息", long: "长休息" }[mode]}</dd></div>
      <div><dt>已完成轮数</dt><dd>{rounds}/{settings.rounds}</dd></div>
      <div><dt>今日完成</dt><dd>{total}</dd></div>
    </dl>
  </>;
}

type ReactionPhase = "idle" | "waiting" | "ready" | "early" | "complete";

export function ReactionTest() {
  const [phase, setPhase] = useState<ReactionPhase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const timeout = useRef<number>(undefined);
  const started = useRef(0);
  useEffect(() => () => window.clearTimeout(timeout.current), []);

  function start() {
    window.clearTimeout(timeout.current);
    setPhase("waiting");
    timeout.current = window.setTimeout(() => {
      started.current = performance.now();
      setPhase("ready");
    }, 1000 + Math.random() * 3000);
  }

  return <>
    <button type="button" className={styles.reaction} data-phase={phase} onClick={() => {
      if (phase === "waiting") {
        window.clearTimeout(timeout.current);
        setPhase("early");
      } else if (phase === "ready") {
        setTimes((values) => [Math.round(performance.now() - started.current), ...values]);
        setPhase("complete");
      } else start();
    }}>{{
      idle: "点击开始测试", waiting: "等待变绿", ready: "现在点击", early: "点击过早，点击重试",
      complete: `${times[0]} ms · 点击再试`,
    }[phase]}</button>
    <div className={styles.actions}>
      <button type="button" onClick={start}>开始测试</button>
      <button type="button" onClick={() => { window.clearTimeout(timeout.current); setTimes([]); setPhase("idle"); }}>重置</button>
    </div>
    <dl className={styles.stats}>
      <div><dt>最佳反应时间</dt><dd>{times.length ? Math.min(...times) : 0} ms</dd></div>
      <div><dt>平均反应时间</dt><dd>{times.length ? Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0} ms</dd></div>
      <div><dt>测试次数</dt><dd>{times.length}</dd></div>
    </dl>
    <h2>测试历史</h2>
    <ol>{times.map((time, index) => <li key={index}>{time} ms</li>)}</ol>
  </>;
}

const gestures = [{ name: "剪刀", icon: "✂️" }, { name: "石头", icon: "🪨" }, { name: "布", icon: "📄" }];
const scores = { win: 0, loss: 0, draw: 0 };

export function RockPaperScissors() {
  const [round, setRound] = useState<{ user: number; computer: number; result: keyof typeof scores }>();
  const [stats, setStats] = useState(scores);

  function play(user: number) {
    const computer = randomInteger(0, gestures.length - 1);
    const difference = (user - computer + gestures.length) % gestures.length;
    const result = difference === 0 ? "draw" : difference === 1 ? "win" : "loss";
    setRound({ user, computer, result });
    setStats((previous) => ({ ...previous, [result]: previous[result] + 1 }));
  }

  return <>
    <h2>你的选择</h2>
    <div className={styles.actions}>{gestures.map(({ name, icon }, index) => <button type="button" key={name} onClick={() => play(index)}><span aria-hidden="true">{icon}</span> {name}</button>)}</div>
    <p role="status">{round ? `你：${gestures[round.user].name}　电脑：${gestures[round.computer].name}　${{ win: "胜利", loss: "失败", draw: "平局" }[round.result]}` : "等待选择"}</p>
    <dl className={styles.stats}>
      <div><dt>总游戏数</dt><dd>{stats.win + stats.loss + stats.draw}</dd></div>
      <div><dt>胜利</dt><dd>{stats.win}</dd></div><div><dt>失败</dt><dd>{stats.loss}</dd></div><div><dt>平局</dt><dd>{stats.draw}</dd></div>
    </dl>
    <button type="button" onClick={() => { setRound(undefined); setStats(scores); }}>重置统计</button>
  </>;
}

export function HlsPlayer() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!url || !video.current) return;
    const element = video.current;
    let canceled = false;
    let dispose: (() => void) | undefined;
    if (element.canPlayType("application/vnd.apple.mpegurl")) {
      element.src = url;
      dispose = () => { element.removeAttribute("src"); element.load(); };
    } else {
      void import("hls.js").then(({ default: Hls }) => {
        if (canceled) return;
        if (!Hls.isSupported()) { setError("当前浏览器不支持 HLS 播放"); return; }
        const player = new Hls();
        player.on(Hls.Events.ERROR, (_, details) => {
          if (details.fatal) setError("无法播放该视频，请检查流地址和跨域设置");
        });
        player.attachMedia(element);
        player.loadSource(url);
        dispose = () => player.destroy();
      }).catch(() => { if (!canceled) setError("无法加载播放器"); });
    }
    return () => { canceled = true; dispose?.(); };
  }, [url]);

  function load(value: string) {
    try {
      const parsed = new URL(value);
      if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
      setError("");
      setUrl(parsed.href);
    } catch {
      setError("请输入有效的 HTTP 或 HTTPS 视频地址");
    }
  }

  return <form onSubmit={(event) => { event.preventDefault(); load(input); }}>
    <label>m3u8地址<input type="url" value={input} placeholder="请输入m3u8格式的视频地址" onChange={(event) => setInput(event.target.value)} /></label>
    <div className={styles.actions}>
      <button type="submit" className={styles.primary}>加载视频</button>
      <button type="button" onClick={() => {
        const example = new URL("../media/hls/demo.m3u8", window.location.href).href;
        setInput(example);
        load(example);
      }}>加载示例</button>
      <button type="button" onClick={() => { setInput(""); setUrl(""); setError(""); }}>清空</button>
    </div>
    {url && <video ref={video} controls playsInline onError={() => setError("无法播放该视频")} aria-label="视频播放" />}
    {error && <p role="alert">{error}</p>}
  </form>;
}
