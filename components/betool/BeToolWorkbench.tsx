"use client";

import { useState } from "react";
import type { BeToolLocalTool } from "@/src/data/betool";
import styles from "./betool-tools.module.css";

const toolContent = {
  urlencode: { title: "URL编码/解码", description: "在线url编码，在线url解码工具" },
  base64: {
    title: "Base64加解密工具",
    description: "在线Base64加解密工具，支持文本的Base64编码和解码，可用于URL编码、数据传输等场景。",
  },
  uuid: { title: "UUID生成器", description: "在线UUID批量生成" },
};

function CopyButton({ value, label = "复制", primary = false }: {
  value: string;
  label?: string;
  primary?: boolean;
}) {
  const [status, setStatus] = useState("");

  async function copy() {
    if (!value) {
      setStatus("暂无结果可复制");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setStatus("复制成功");
    } catch {
      setStatus("复制失败，请手动复制结果");
    }
  }

  return (
    <span className={styles.copyControl}>
      <button type="button" data-variant={primary ? "primary" : undefined} onClick={copy}>
        {label}
      </button>
      <span className={styles.message} role="status">{status}</span>
    </span>
  );
}

function ResultField({ value, label }: { value: string; label: string }) {
  return <textarea aria-label={label} placeholder={label} value={value} readOnly spellCheck={false} />;
}

function UrlCodec() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function transform(convert: (value: string) => string) {
    try {
      setResult(convert(input));
      setError("");
    } catch {
      setResult("");
      setError("输入不是有效的 URL 编码");
    }
  }

  return (
    <div className={`${styles.panel} ${styles.urlCodec}`}>
      <textarea
        aria-label="待处理的文本"
        placeholder="请输入或者粘贴需要处理的文本"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        spellCheck={false}
      />
      <div className={styles.actions}>
        <button type="button" data-variant="primary" onClick={() => transform(encodeURIComponent)}>UrlEncode编码</button>
        <button type="button" data-variant="primary" onClick={() => transform(decodeURIComponent)}>UrlDecode解码</button>
        <CopyButton key={result} value={result} label="复制结果" primary />
        <button type="button" data-variant="danger" onClick={() => {
          setInput("");
          setResult("");
          setError("");
        }}>清空内容</button>
      </div>
      <div className={styles.urlResult}><ResultField label="处理结果" value={result} /></div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </div>
  );
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function decodeBase64(value: string) {
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
}

function Base64Field({ decode = false }: { decode?: boolean }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const verb = decode ? "解密" : "加密";
  const placeholder = decode ? "请输入要解密的Base64字符串" : "请输入要加密的文本";

  function transform() {
    try {
      setResult(decode ? decodeBase64(input) : encodeBase64(input));
      setError("");
    } catch {
      setResult("");
      setError("请输入有效的 UTF-8 Base64 字符串");
    }
  }

  return (
    <section className={styles.base64Field} aria-label={verb}>
      <h2>{verb}</h2>
      <textarea aria-label={placeholder} placeholder={placeholder} value={input}
        onChange={(event) => setInput(event.target.value)} spellCheck={false} />
      <div className={styles.actions}>
        <button type="button" data-variant="primary" onClick={transform}>{verb}</button>
      </div>
      <div className={styles.base64Result}>
        <ResultField label={`${verb}结果`} value={result} />
        <CopyButton key={result} value={result} />
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </section>
  );
}

function UuidGenerator() {
  const [count, setCount] = useState("1");
  const [result, setResult] = useState("");

  return (
    <form className={`${styles.panel} ${styles.uuid}`} onSubmit={(event) => {
      event.preventDefault();
      setResult(Array.from({ length: Number(count) }, () => crypto.randomUUID()).join("\n"));
    }}>
      <div className={styles.actions}>
        <label htmlFor="uuid-count">生成数量</label>
        <input id="uuid-count" type="number" value={count} min="1" max="100" step="1" required
          placeholder="范围1~100" onChange={(event) => setCount(event.target.value)} />
        <button type="submit" data-variant="primary">生成UUID</button>
        <CopyButton key={result} value={result} label="复制全部" primary />
      </div>
      <textarea aria-label="生成的 UUID" placeholder="请输入" value={result} readOnly spellCheck={false} />
    </form>
  );
}

export function BeToolWorkbench({ tool }: { tool: BeToolLocalTool }) {
  const { title, description } = toolContent[tool];

  return (
    <main className={styles.workbench}>
      <h1 className={styles.panel}>{title}</h1>
      {tool === "urlencode" && <UrlCodec />}
      {tool === "base64" && (
        <div className={styles.panel}>
          <Base64Field />
          <Base64Field decode />
        </div>
      )}
      {tool === "uuid" && <UuidGenerator />}
      <section className={`${styles.panel} ${styles.description}`} aria-labelledby="tool-description">
        <h2 id="tool-description"><span>描述</span></h2>
        <p>{description}</p>
      </section>
    </main>
  );
}
