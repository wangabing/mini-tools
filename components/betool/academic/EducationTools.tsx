"use client";

import { ClipboardCopy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { convertUnit, decodeMorse, encodeMorse, radices, readRadix, unitCategories, writeRadix } from "./conversions";
import styles from "./academic.module.css";

export function CopyValue({ value, label = "复制" }: { value: string; label?: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("已复制");
    } catch {
      setStatus("无法访问剪贴板，请手动复制");
    }
  }
  return <span className={styles.copy}>
    <button type="button" onClick={copy} disabled={!value} title={label}><ClipboardCopy size={15} />{label}</button>
    {status && <span className={styles.copyStatus} role="status">{status}</span>}
  </span>;
}

function UnitTabs() {
  const params = useSearchParams();
  const [category, name, groups] = unitCategories.find(([id]) => id === params.get("active")) ?? unitCategories[0];
  return <>
    <nav className={styles.tabs} aria-label="换算类别">
      {unitCategories.map(([id, label]) => (
        <button
          type="button"
          key={id}
          aria-current={category === id ? "page" : undefined}
          onClick={() => {
            const query = new URLSearchParams(params.toString());
            query.set("active", id);
            window.history.replaceState(null, "", "?" + query);
          }}
        >{label}</button>
      ))}
    </nav>
    <UnitFields key={category} name={name} groups={groups} />
  </>;
}

function UnitFields({ name, groups }: {
  name: string;
  groups: (typeof unitCategories)[number][2];
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  type Unit = (typeof groups)[number]["units"][number];

  function convert(source: Unit, key: string) {
    const input = values[key]?.trim();
    const value = Number(input);
    if (!input || !Number.isFinite(value)) {
      setError(`请输入有效的${name}数值`);
      return;
    }
    const next = Object.fromEntries(groups.flatMap((group) => group.units.map((target) => {
      const result = convertUnit(value, source, target);
      return [group.name + target[0], Number(Number(result.toPrecision(14))).toString()];
    })));
    if (Object.values(next).some((result) => !Number.isFinite(Number(result)))) {
      setError("换算结果超出数值范围");
      return;
    }
    setError("");
    setValues(next);
  }

  return <>
    {groups.map((group) => (
      <fieldset className={styles.unitGroup} key={group.name}>
        <legend>{group.name}</legend>
        <div className={styles.unitGrid}>
          {group.units.map((unit, index) => {
            const key = group.name + unit[0];
            const field = `unit-${group.name}-${index}`;
            return <form key={key} onSubmit={(event) => { event.preventDefault(); convert(unit, key); }}>
              <label htmlFor={field}>{unit[0]}</label>
              <div className={styles.line}>
                <input id={field} inputMode="decimal" value={values[key] ?? ""} onChange={(event) => setValues({ ...values, [key]: event.target.value })} />
                <button type="submit">转换</button>
              </div>
            </form>;
          })}
        </div>
      </fieldset>
    ))}
    <button type="button" onClick={() => { setValues({}); setError(""); }}>清除全部</button>
    {error && <p role="alert">{error}</p>}
  </>;
}

function UnitConverter() {
  return <Suspense fallback={null}><UnitTabs /></Suspense>;
}

function MorseTool() {
  const [input, setInput] = useState("支持中文的摩斯电码编码(Encode)解码(Decode)");
  const [result, setResult] = useState("");

  return <>
    <textarea aria-label="待处理文本" rows={5} value={input} onChange={(event) => setInput(event.target.value)} />
    <div className={styles.actions}>
      <button type="button" data-primary onClick={() => setResult(encodeMorse(input))}>摩斯编码</button>
      <button type="button" data-primary onClick={() => setResult(decodeMorse(input))}>摩斯解码</button>
      <CopyValue key={result} value={result} label="复制结果" />
      <button type="button" onClick={() => { setInput(""); setResult(""); }}>清空内容</button>
    </div>
    <textarea aria-label="处理结果" placeholder="请输入" rows={5} readOnly value={result} />
  </>;
}

function RadixTool() {
  const [input, setInput] = useState("");
  const [radix, setRadix] = useState(10);
  const [result, setResult] = useState<bigint>();
  const [error, setError] = useState("");

  return <>
    <form className={styles.actions} onSubmit={(event) => {
      event.preventDefault();
      try {
        setResult(readRadix(input, radix)); setError("");
      } catch (error) {
        setResult(undefined); setError((error as Error).message);
      }
    }}>
      <select aria-label="输入进制" value={radix} onChange={(event) => setRadix(Number(event.target.value))}>
        {Array.from({ length: 63 }, (_, index) => index + 2).map((base) => <option key={base} value={base}>{base}进制</option>)}
      </select>
      <input aria-label="待转换的数字" placeholder="请输入" value={input} onChange={(event) => setInput(event.target.value)} />
      <button type="submit" data-primary>转换</button>
    </form>
    {error && <p role="alert">{error}</p>}
    <div className={styles.tableWrap}>
      <table>
        <thead><tr><th>进制</th><th>结果</th><th>操作</th></tr></thead>
        <tbody>{radices.map((base) => {
          const output = result === undefined ? "" : writeRadix(result, base);
          return <tr key={base}><th scope="row">{base}进制</th><td><code>{output}</code></td><td><CopyValue key={output} value={output} /></td></tr>;
        })}</tbody>
      </table>
    </div>
  </>;
}

const asciiControls = "NUL SOH STX ETX EOT ENQ ACK BEL BS HT LF VT FF CR SO SI DLE DC1 DC2 DC3 DC4 NAK SYN ETB CAN EM SUB ESC FS GS RS US".split(" ");
const asciiDescriptions = "空字符 标题开始 正文开始 正文结束 传输结束 询问 收到通知 铃 退格 水平制表符 换行键 垂直制表符 换页键 回车键 移出 移入 数据链路转义 设备控制1 设备控制2 设备控制3 设备控制4 拒绝接收 同步空闲 传输块结束 取消 介质中断 替换 换码符 文件分隔符 组分隔符 记录分离符 单元分隔符".split(" ");
const windows1252Symbols = Array.from("€·‚ƒ„…†‡ˆ‰Š‹Œ·Ž··‘’“”•–—˜™š›œ·žŸ");

function AsciiTable() {
  return <div className={styles.tableWrap}>
    <table>
      <thead><tr><th scope="col">DEC</th><th scope="col">OCT</th><th scope="col">HEX</th><th scope="col">符号</th><th scope="col">描述</th></tr></thead>
      <tbody>{Array.from({ length: 256 }, (_, value) => {
        const symbol = asciiControls[value] ?? (value === 32 ? "Space" : value === 127 ? "DEL" : windows1252Symbols[value - 128] ?? String.fromCharCode(value));
        return <tr key={value}>
          <td>{value}</td><td>{value.toString(8).padStart(3, "0")}</td>
          <td>{value.toString(16).toUpperCase()}</td><td>{symbol}</td>
          <td>{asciiDescriptions[value] ?? (value === 32 ? "空格" : value === 127 ? "删除" : "")}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

export const educationTools = { unit: UnitConverter, morse: MorseTool, scaletran: RadixTool, ascii: AsciiTable };
