import { useEffect, useState } from "react";
import { Action, Copy, Failure, Panel, SelectField, TextArea, TextField, Toggle } from "./controls";
import { convertBase, generatePasswords } from "./transform";
import styles from "./dev-text.module.css";

const characterGroups = [
  ["数字(0-9)", "0123456789"],
  ["小写字母(a-z)", "abcdefghijklmnopqrstuvwxyz"],
  ["大写字母(A-Z)", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
  ["其他符号(~!@#$%^&*()-+_=,.)", "~!@#$%^&*()_+"],
] as const;

export function PasswordGenerator() {
  const [groups, setGroups] = useState(characterGroups.map(() => true));
  const [characters, setCharacters] = useState(characterGroups.map(([, group]) => group).join(""));
  const [length, setLength] = useState("16");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  return (
    <Panel>
      <fieldset className={styles.group}>
        <legend>密码组合</legend>
        <div className={styles.row}>
          {characterGroups.map(([label], index) => (
            <Toggle key={label} label={label} checked={groups[index]} change={(checked) => {
              const next = groups.map((value, at) => at === index ? checked : value);
              setGroups(next);
              setCharacters(characterGroups.filter((_, at) => next[at]).map(([, group]) => group).join(""));
            }} />
          ))}
        </div>
      </fieldset>
      <TextField label="包含字符" value={characters} change={setCharacters} />
      <div className={styles.row}>
        <TextField label="生成长度" type="number" min={1} max={100} value={length} change={setLength} />
        <TextField label="生成数量" type="number" min={1} max={100} value={quantity} change={setQuantity} />
        <Action variant="primary" onClick={() => {
          try {
            setResult(generatePasswords(characters, Number(length), Number(quantity)));
            setError("");
          } catch (cause) {
            setResult("");
            setError(cause instanceof Error ? cause.message : "生成失败");
          }
        }}>生成密码</Action>
        <Copy value={result} label="复制全部" />
      </div>
      <Failure message={error} />
      <TextArea label="生成结果" value={result} mono />
    </Panel>
  );
}

const beijing = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

export function TimestampConverter() {
  const [current, setCurrent] = useState<number | null>(null);
  const [running, setRunning] = useState(true);
  const [timestamp, setTimestamp] = useState("");
  const [date, setDate] = useState("");
  const [timestampResult, setTimestampResult] = useState("");
  const [dateResult, setDateResult] = useState("");
  const [seconds, setSeconds] = useState<"ms" | "s">("ms");
  const [dateError, setDateError] = useState("");
  const [stampError, setStampError] = useState("");

  useEffect(() => {
    const started = Date.now();
    const initial = window.setTimeout(() => {
      setCurrent(started);
      setTimestamp(String(started));
      setDate(beijing.format(started));
    }, 0);
    return () => window.clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setCurrent(Date.now()), 100);
    return () => window.clearInterval(interval);
  }, [running]);

  function convertStamp() {
    const cleaned = timestamp.trim();
    const value = Number(cleaned);
    const millis = cleaned.replace(/^[-+]/, "").split(".")[0].length <= 10 ? value * 1000 : value;
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(cleaned) || !Number.isFinite(new Date(millis).getTime())) {
      setTimestampResult("");
      setStampError("请输入有效的秒或毫秒时间戳");
      return;
    }
    setStampError("");
    setTimestampResult(beijing.format(millis));
  }

  function convertDate() {
    const normalized = date.trim().replace("T", " ");
    const dateTime = /^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}(?::\d{2})?)?$/;
    const full = normalized.length === 10 ? normalized + " 00:00:00" :
      normalized.length === 16 ? normalized + ":00" : normalized;
    const millis = Date.parse(full.replace(" ", "T") + "+08:00");
    if (!dateTime.test(normalized) || !Number.isFinite(millis) || beijing.format(millis) !== full) {
      setDateResult("");
      setDateError("请输入有效的北京时间，例如 2026-01-01 12:30:00");
      return;
    }
    setDateError("");
    setDateResult(String(seconds === "s" ? millis / 1000 : millis));
  }

  return (
    <Panel>
      <div className={styles.row}>
        <strong>现在</strong>
        <Action disabled={current === null} title="将当前值填入时间戳" onClick={() => setTimestamp(String(current ?? ""))}>{current ?? "—"}</Action>
        <Action onClick={() => setRunning(!running)}>{running ? "停止" : "开始"}</Action>
      </div>
      <div className={styles.row}>
        <TextField label="时间戳" placeholder="毫秒/秒" value={timestamp} change={setTimestamp} />
        <Action variant="primary" onClick={convertStamp} aria-label="转换为北京时间">转换</Action>
        <TextField label="北京时间" value={timestampResult} />
        <Copy value={timestampResult} label="复制北京时间" />
      </div>
      <Failure message={stampError} />
      <div className={styles.row}>
        <TextField label="时间" placeholder="YYYY-MM-DD HH:mm:ss" value={date} change={setDate} />
        <Action variant="primary" onClick={convertDate} aria-label="转换为时间戳">转换</Action>
        <SelectField label="输出单位" value={seconds} change={setSeconds} options={[["ms", "毫秒(ms)"], ["s", "秒(s)"]]} />
        <TextField label="转换时间戳结果" value={dateResult} />
        <Copy value={dateResult} label="复制时间戳" />
      </div>
      <Failure message={dateError} />
    </Panel>
  );
}

const bases = [["2", "2 (二进制)"], ["8", "8 (八进制)"], ["10", "10 (十进制)"], ["16", "16 (十六进制)"]] as const;

export function BaseConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<(typeof bases)[number][0]>("10");
  const [to, setTo] = useState<(typeof bases)[number][0]>("2");
  let output = "";
  let error = "";
  if (value.trim()) {
    try {
      output = convertBase(value, Number(from), Number(to));
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "数值无效";
    }
  }
  return (
    <Panel>
      <TextField label="请输入要转换的数值" value={value} change={setValue} />
      <div className={styles.row}>
        <SelectField label="从进制" options={bases} value={from} change={setFrom} />
        <SelectField label="到进制" options={bases} value={to} change={setTo} />
        <Action onClick={() => setValue("")}>清空</Action>
      </div>
      <TextField label="转换结果" value={output} />
      <Copy value={output} label="复制" />
      <Failure message={error} />
    </Panel>
  );
}

const storageUnits = [
  ["bit", "bit (比特)"], ["B", "B (字节)"], ["KB", "KB (千字节)"], ["MB", "MB (兆字节)"],
  ["GB", "GB (吉字节)"], ["TB", "TB (太字节)"], ["PB", "PB (拍字节)"], ["EB", "EB (艾字节)"],
] as const;
type StorageUnit = typeof storageUnits[number][0];

function storageBytes(unit: StorageUnit) {
  return unit === "bit" ? 1 / 8 : 1024 ** (storageUnits.findIndex(([key]) => key === unit) - 1);
}

function storageValue(value: number) {
  if (!Number.isFinite(value)) return "超出可显示范围";
  if (value && (Math.abs(value) < 0.001 || Math.abs(value) >= 1e12)) return value.toExponential(5);
  return value.toFixed(6);
}

export function StorageConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<StorageUnit>("B");
  const [to, setTo] = useState<StorageUnit>("KB");
  const valid = value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
  const bytes = Number(value) * storageBytes(from);
  const output = valid ? storageValue(bytes / storageBytes(to)) : "";
  return (
    <Panel>
      <TextField label="请输入数值" type="number" min={0} step="any" value={value} change={setValue} />
      <div className={styles.row}>
        <SelectField label="从单位" options={storageUnits} value={from} change={setFrom} />
        <SelectField label="到单位" options={storageUnits} value={to} change={setTo} />
        <Action onClick={() => setValue("")}>清空</Action>
      </div>
      <TextField label="转换结果" value={output} />
      <Copy label="复制" value={output} />
      <Failure message={value && !valid ? "请输入大于或等于零的数值" : ""} />
      {valid && <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>所有单位转换结果</caption>
          <tbody>{storageUnits.map(([key, label]) => <tr key={key}><th scope="row">{label}</th><td>{storageValue(bytes / storageBytes(key))}</td></tr>)}</tbody>
        </table>
      </div>}
    </Panel>
  );
}
