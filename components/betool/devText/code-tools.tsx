import { useRef, useState } from "react";
import { Action, Copy, Failure, Panel, SelectField, TextArea, TextField, Toggle } from "./controls";
import { decodeJwt, textToUnicode, unicodeToText } from "./transform";
import styles from "./dev-text.module.css";

type Operation = readonly [label: string, apply: (value: string) => string | Promise<string>];

async function formatJavaScript(source: string) {
  const [prettier, babel, estree] = await Promise.all([
    import("prettier/standalone"), import("prettier/plugins/babel"), import("prettier/plugins/estree"),
  ]);
  return prettier.format(source, { parser: "babel", plugins: [babel, estree] });
}

async function formatHtml(source: string) {
  const [prettier, html] = await Promise.all([import("prettier/standalone"), import("prettier/plugins/html")]);
  return prettier.format(source, { parser: "html", plugins: [html] });
}

async function formatCss(source: string) {
  const [prettier, postcss] = await Promise.all([import("prettier/standalone"), import("prettier/plugins/postcss")]);
  return prettier.format(source, { parser: "css", plugins: [postcss] });
}

function unescapeJson(source: string) {
  const value: unknown = JSON.parse(source.startsWith('"') && source.endsWith('"') ? source : '"' + source + '"');
  if (typeof value !== "string") throw new Error("请输入 JSON 转义字符串");
  return value;
}

export const codeTools: Record<string, { operations: Operation[]; inPlace?: boolean }> = {
  json: {
    inPlace: true,
    operations: [
      ["校验/格式化", (source) => JSON.stringify(JSON.parse(source), null, 2)],
      ["压缩", (source) => JSON.stringify(JSON.parse(source))],
      ["转义", (source) => JSON.stringify(source).slice(1, -1)],
      ["去转义", unescapeJson],
    ],
  },
  unicode: {
    operations: [["unicode转中文", unicodeToText], ["中文转unicode", textToUnicode]],
  },
  HtmlEntity: {
    operations: [
      ["HTML转实体", async (source) => (await import("entities")).escapeUTF8(source)],
      ["实体转HTML", async (source) => (await import("entities")).decodeHTML(source)],
    ],
  },
  JSForamt: {
    inPlace: true,
    operations: [
      ["格式化", formatJavaScript],
      ["混淆压缩", async (source) => (await (await import("terser")).minify(source, { toplevel: false })).code ?? ""],
    ],
  },
  HtmlFormat: {
    inPlace: true,
    operations: [["格式化", formatHtml]],
  },
  CssFormat: {
    inPlace: true,
    operations: [
      ["格式化", formatCss],
      ["压缩", async (source) => {
        const css = await import("css-tree");
        return css.generate(css.parse(source, { onParseError: (error) => { throw error; } }));
      }],
    ],
  },
};

export function CodeTransformer({ slug }: { slug: string }) {
  const { inPlace, operations } = codeTools[slug];
  const [source, setSource] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function run(operation: Operation[1]) {
    setPending(true);
    setError("");
    try {
      const output = await operation(source);
      if (inPlace) setSource(output);
      else setResult(output);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "输入格式无效");
      if (!inPlace) setResult("");
    } finally {
      setPending(false);
    }
  }

  return (
    <Panel>
      <TextArea label={inPlace ? "代码" : "待处理的文本"} placeholder={inPlace ? "这里是代码..." : "请输入或者粘贴需要处理的文本"}
        value={source} readOnly={pending} change={setSource} mono />
      <div className={styles.row}>
        {operations.map(([label, action]) => <Action key={label} variant="primary"
          disabled={pending} onClick={() => void run(action)}>{label}</Action>)}
        <Copy value={inPlace ? source : result} label={inPlace ? "复制" : "复制结果"} />
        {slug !== "unicode" && <Action disabled={pending} onClick={() => {
          setSource("");
          setResult("");
          setError("");
        }}>{slug === "HtmlEntity" ? "清除" : "清空"}</Action>}
      </div>
      <Failure message={error} />
      {!inPlace && <TextArea label="处理结果" value={result} mono />}
    </Panel>
  );
}

// Keep string literals and comment line endings intact during SQL compaction.
function compactSql(value: string) {
  const tokens = value.match(/--[^\r\n]*(?:\r\n?|\n|$)|\/\*[\s\S]*?\*\/|(\$(?:[A-Za-z_]\w*)?\$)[\s\S]*?\1|'(?:''|\\[\s\S]|[^'])*'|"(?:\"\"|\\[\s\S]|[^"])*"|[\x60](?:[\x60][\x60]|[^\x60])*[\x60]|\[(?:\]\]|[^\]])*\]|\s+|[^]/g) ?? [];
  return tokens.map((token) => /^\s+$/.test(token) ? " " : token).join("").trim();
}

const sqlDialects = [
  ["sql", "标准 SQL"], ["mysql", "MySQL"], ["postgresql", "PostgreSQL"],
  ["sqlite", "SQLite"], ["tsql", "Transact-SQL"],
] as const;

export function StructuredFormatter({ slug }: { slug: "xmlformat" | "sqlformat" }) {
  const [source, setSource] = useState("");
  const [indent, setIndent] = useState("2");
  const [dialect, setDialect] = useState<(typeof sqlDialects)[number][0]>("sql");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const xml = slug === "xmlformat";

  async function run(compact: boolean) {
    setPending(true);
    setError("");
    try {
      const spaces = Number(indent);
      if (!Number.isInteger(spaces) || spaces < 1 || spaces > 8) throw new Error("缩进大小应为 1 到 8 的整数");
      if (!source.trim()) throw new Error(xml ? "请输入 XML" : "请输入 SQL");
      if (xml) {
        const { default: format } = await import("xml-formatter");
        const parsed = new DOMParser().parseFromString(source, "application/xml");
        const problem = parsed.getElementsByTagName("parsererror")[0];
        if (problem) throw new Error(problem.textContent || "XML 格式无效");
        setResult(compact ? format.minify(source, { collapseContent: true }) :
          format(source, { indentation: " ".repeat(spaces), lineSeparator: "\n", collapseContent: true }));
      } else {
        const { format } = await import("sql-formatter");
        const formatted = format(source, { language: dialect, tabWidth: spaces, linesBetweenQueries: 1 });
        setResult(compact ? compactSql(formatted) : formatted);
      }
    } catch (cause) {
      setResult("");
      setError(cause instanceof Error ? cause.message : "格式错误");
    } finally {
      setPending(false);
    }
  }

  return (
    <Panel>
      <TextArea label={xml ? "请输入要格式化的XML文本" : "请输入要格式化的SQL"} value={source} change={setSource} readOnly={pending} mono />
      <div className={styles.row}>
        <TextField type="number" min={1} max={8} label="缩进大小" value={indent} change={setIndent} />
        {!xml && <SelectField label="SQL 方言" value={dialect} options={sqlDialects} change={setDialect} />}
        <Action variant="primary" disabled={pending} onClick={() => void run(false)}>格式化</Action>
        <Action disabled={pending} onClick={() => void run(true)}>压缩</Action>
        <Action disabled={pending} onClick={() => { setSource(""); setResult(""); setError(""); }}>清空</Action>
      </div>
      <TextArea label="格式化结果" value={result} mono />
      <Copy value={result} label="复制" />
      <Failure message={error} />
    </Panel>
  );
}

const algorithms = [
  ["MD5", "MD5"], ["SHA-1", "SHA-1"], ["SHA-256", "SHA-256"], ["SHA-384", "SHA-384"], ["SHA-512", "SHA-512"],
  ["HMAC-MD5", "Hmac-MD5"], ["HMAC-SHA-1", "Hmac-SHA1"], ["HMAC-SHA-256", "Hmac-SHA256"],
  ["HMAC-SHA-384", "Hmac-SHA384"], ["HMAC-SHA-512", "Hmac-SHA512"],
] as const;

export async function calculateHash(value: string, algorithm: string, secret = "") {
  if (algorithm === "MD5" || algorithm === "HMAC-MD5") {
    const { md5 } = await import("js-md5");
    return algorithm === "MD5" ? md5(value) : md5.hmac(secret, value);
  }

  const encoder = new TextEncoder();
  const input = encoder.encode(value);
  let digest: ArrayBuffer;
  if (algorithm.startsWith("HMAC-")) {
    const bytes = encoder.encode(secret);
    const key = await crypto.subtle.importKey("raw", bytes.length ? bytes : new Uint8Array(1),
      { name: "HMAC", hash: algorithm.slice(5) }, false, ["sign"]);
    digest = await crypto.subtle.sign("HMAC", key, input);
  } else {
    digest = await crypto.subtle.digest(algorithm, input);
  }
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function HashCalculator({ md5Only = false }: { md5Only?: boolean }) {
  const [source, setSource] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number][0]>("MD5");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const short = result.slice(8, 24);
  return (
    <Panel>
      <TextArea label="请输入要计算哈希的文本" value={source} change={setSource} readOnly={pending} />
      {!md5Only && <div className={styles.row}>
        <SelectField label="哈希算法" value={algorithm} options={algorithms} change={setAlgorithm} />
        {algorithm.startsWith("HMAC-") && <TextField label="密钥" type="password" value={secret} change={setSecret} />}
      </div>}
      <div className={styles.row}>
        <Action variant="primary" disabled={pending} onClick={async () => {
          setPending(true);
          setError("");
          try {
            setResult(await calculateHash(source, algorithm, secret));
          } catch (cause) {
            setResult("");
            setError(cause instanceof Error ? cause.message : "哈希计算失败");
          } finally {
            setPending(false);
          }
        }}>{md5Only ? "MD5加密" : "计算哈希"}</Action>
        <Copy value={result} />
        <Action disabled={pending} onClick={() => { setSource(""); setResult(""); setError(""); setSecret(""); }}>清空</Action>
      </div>
      <Failure message={error} />
      {md5Only ? (
        <div className={styles.columns}>
          {[["32位小写", result], ["32位大写", result.toUpperCase()], ["16位小写", short], ["16位大写", short.toUpperCase()]].map(([label, value]) => (
            <div key={label} className={styles.stack}><TextField label={label} value={value} /><Copy value={value} label={"复制" + label} /></div>
          ))}
        </div>
      ) : <TextArea label="哈希结果" value={result} mono />}
    </Panel>
  );
}

export function JwtDecoder() {
  const [source, setSource] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel>
      <TextArea label="JWT" placeholder="请输入 JWT" value={source} change={setSource} mono />
      <div className={styles.row}>
        <Action variant="primary" onClick={() => {
          try {
            const [nextHeader, nextPayload] = decodeJwt(source);
            setHeader(nextHeader);
            setPayload(nextPayload);
            setError("");
          } catch (cause) {
            setHeader("");
            setPayload("");
            setError(cause instanceof Error ? cause.message : "JWT 格式无效");
          }
        }}>解析</Action>
        <Action onClick={() => { setSource(""); setHeader(""); setPayload(""); setError(""); }}>清除</Action>
      </div>
      <Failure message={error} />
      <div className={styles.columns}>
        <TextArea label="Header(头部)" value={header} mono />
        <TextArea label="Payload(载荷)" value={payload} mono />
      </div>
    </Panel>
  );
}

const patterns = [
  ["匹配手机号", "1[3-9]\\d{9}"],
  ["匹配网址URL", "https?://[^\\s]+"],
  ["匹配Email", "[\\w.+-]+@[\\w.-]+\\.[A-Za-z]{2,}"],
  ["匹配中文字符", "[\\u4e00-\\u9fa5]"],
  ["匹配双字节字符(包含汉字)", "[^\\x00-\\xff]"],
  ["匹配18位身份证号", "\\d{17}[\\dXx]"],
  ["匹配整数", "[+-]?\\d+"],
  ["匹配IP(IPV4)", "(?:\\d{1,3}\\.){3}\\d{1,3}"],
  ["匹配日期(年-月-日)", "\\d{4}-\\d{2}-\\d{2}"],
] as const;

export function RegexTester() {
  const [source, setSource] = useState("一些测试实例:\n邮箱1：demo@163.com\n邮箱2：demo2@163.com\n手机号：13012341234\nurl: https://example.com\nIP: 192.168.0.1\n时间：2023-11-24");
  const [pattern, setPattern] = useState("");
  const [global, setGlobal] = useState(true);
  const [insensitive, setInsensitive] = useState(false);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const request = useRef(0);

  function run() {
    const id = ++request.current;
    setError("");
    setResult([]);
    if (!pattern) return;
    setPending(true);
    const worker = new Worker(new URL("./regex.worker.ts", import.meta.url));
    const timeout = window.setTimeout(() => finish("匹配超时，请缩短文本或简化正则表达式"), 1500);
    function finish(error: string, matches: string[] = []) {
      window.clearTimeout(timeout);
      worker.terminate();
      if (request.current !== id) return;
      setPending(false);
      setError(error);
      setResult(matches);
    }
    worker.onmessage = (event: MessageEvent<{ error: string; matches: string[] }>) =>
      finish(event.data.error, event.data.matches);
    worker.onerror = () => finish("正则匹配失败");
    worker.postMessage({ pattern, source, global, insensitive });
  }

  return (
    <Panel>
      <TextArea label="测试文本" value={source} change={setSource} mono />
      <div className={styles.row}><span>常用正则</span>
        {patterns.map(([label, value]) => <Action key={label} onClick={() => setPattern(value)}>{label}</Action>)}
      </div>
      <TextField label="正则表达式" value={pattern} change={setPattern} />
      <div className={styles.row}>
        <Toggle label="全局搜索" checked={global} change={setGlobal} />
        <Toggle label="忽略大小写" checked={insensitive} change={setInsensitive} />
        <Action variant="primary" disabled={pending} onClick={run}>测试匹配</Action>
      </div>
      <p role="status">共找到 {result.length} 处匹配结果</p>
      <TextArea label="匹配结果" value={result.join("\n")} mono />
      <Failure message={error} />
    </Panel>
  );
}
