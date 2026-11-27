import { useId, useState } from "react";
import { Action, Copy, Failure, Panel, SelectField, TextArea, TextField, Toggle, saveText } from "./controls";
import { replaceText, uniqueLines } from "./transform";
import styles from "./dev-text.module.css";

const chinese = /[\u4e00-\u9fa5]/g;
const letter = /[A-Za-z]/g;
const digit = /[0-9]/g;
const punctuation = /[!-/:-@[-\`{-~]/g;
const fullPunctuation = /[，。！？；：、‘’“”（）【】《》〈〉〔〕［］｛｝·…—￥]/g;

export function countText(text: string) {
  const counts = [chinese, letter, digit, punctuation, fullPunctuation, /\s/g].map((pattern) => text.match(pattern)?.length ?? 0);
  return [counts.reduce((sum, value) => sum + value, 0), ...counts];
}

const countLabels = ["总字数", "汉字", "字母", "数字", "标点符号半角", "标点符号全角", "空白字符"];

export function WordCount() {
  const [text, setText] = useState("");
  const counts = countText(text);
  return (
    <Panel>
      <TextArea label="请输入或者粘贴需要统计的文本" change={setText} value={text} />
      <dl className={styles.stats} aria-live="polite">
        {countLabels.map((label, index) => <div key={label}><dt>{label}</dt><dd>{counts[index]}</dd></div>)}
      </dl>
    </Panel>
  );
}

export function TextDeduplication() {
  const [text, setText] = useState("");
  const result = uniqueLines(text);
  return (
    <Panel>
      <TextArea label="待处理的文本" placeholder="请输入或者粘贴需要处理的文本" change={setText} value={text} />
      <div className={styles.row}><Copy value={result} /><Action onClick={() => setText("")}>清空内容</Action></div>
      <TextArea label="处理结果" value={result} />
    </Panel>
  );
}

export function TextReplacement() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replacement, setReplacement] = useState("");
  const [regular, setRegular] = useState(false);
  const [sensitive, setSensitive] = useState(false);
  let result = "";
  let error = "";
  try {
    result = replaceText(text, find, replacement, regular, sensitive);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "查找表达式无效";
  }
  return (
    <Panel>
      <TextArea label="请输入要处理的文本" value={text} change={setText} />
      <div className={styles.row}>
        <TextField label="请输入要查找的文本" value={find} change={setFind} />
        <TextField label="请输入要替换的文本" value={replacement} change={setReplacement} />
        <Toggle label="使用正则表达式" checked={regular} change={setRegular} />
        <Toggle label="区分大小写" checked={sensitive} change={setSensitive} />
      </div>
      <div className={styles.row}>
        <Copy value={result} />
        <Action onClick={() => { setText(""); setFind(""); setReplacement(""); }}>清空</Action>
      </div>
      <Failure message={error} />
      <TextArea label="替换结果" value={result} />
    </Panel>
  );
}

const stepOperations = [
  { name: "去除首尾空格", run: (text) => text.trim() },
  { name: "转为小写", run: (text) => text.toLowerCase() },
  { name: "转为大写", run: (text) => text.toUpperCase() },
  { name: "移除空行", run: (value) => value.split("\n").filter((line) => line.trim()).join("\n") },
  { name: "去除每行首尾空格", run: (value) => value.split("\n").map((line) => line.trim()).join("\n") },
  { name: "按字母排序", run: (value) => value.split("\n").filter((line) => line.trim()).sort().join("\n") },
] satisfies { name: string; run: (value: string) => string }[];
type Step = { id: number; operation: number };

export function TextWorkflow() {
  const [text, setText] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { id: 0, operation: 0 }, { id: 1, operation: 1 },
  ]);
  const [nextId, setNextId] = useState(2);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const choicesId = useId();

  function move(index: number, direction: 1 | -1) {
    const next = steps.slice();
    const other = index + direction;
    [next[index], next[other]] = [next[other], next[index]];
    setSteps(next);
  }

  function addStep(operation: number) {
    setSteps([...steps, { id: nextId, operation }]);
    setNextId(nextId + 1);
    setAdding(false);
  }

  return (
    <Panel>
      <TextArea label="请输入要处理的文本" value={text} change={setText} />
      <fieldset className={styles.group}>
        <legend>工作流步骤</legend>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.step}>
            <Action disabled={index === 0} aria-label={"向上移动步骤 " + (index + 1)} onClick={() => move(index, -1)}>↑</Action>
            <Action disabled={index === steps.length - 1} aria-label={"向下移动步骤 " + (index + 1)} onClick={() => move(index, 1)}>↓</Action>
            <span>{stepOperations[step.operation].name}</span>
            <Action aria-label={"删除步骤 " + (index + 1)} onClick={() => setSteps(steps.filter(({ id }) => id !== step.id))}>删</Action>
          </div>
        ))}
        <Action aria-expanded={adding} aria-controls={choicesId} onClick={() => setAdding(!adding)}>添加步骤</Action>
        {adding && <div id={choicesId} className={styles.step}>
          {stepOperations.map(({ name }, index) => <Action key={name} onClick={() => addStep(index)}>{name}</Action>)}
        </div>}
      </fieldset>
      <div className={styles.row}>
        <Action variant="primary" onClick={() => {
          try {
            if (!text) throw new Error("请输入要处理的文本");
            setValue(steps.reduce((value, { operation }) => stepOperations[operation].run(value), text));
            setError("");
          } catch (cause) {
            setValue("");
            setError(cause instanceof Error ? cause.message : "工作流执行失败");
          }
        }}>执行工作流</Action>
        <Action onClick={() => { setText(""); setValue(""); setError(""); }}>清空</Action>
        <Copy value={value} label="复制" />
      </div>
      <TextArea label="处理结果" value={value} />
      <Failure message={error} />
    </Panel>
  );
}

const segmenter = new Intl.Segmenter("zh-Hans", { granularity: "word" });

export function frequencies(value: string, minLength: number) {
  const counts = new Map<string, number>();
  for (const { segment, isWordLike } of segmenter.segment(value)) {
    if (!isWordLike || Array.from(segment).length < minLength) continue;
    const key = segment.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans"));
}

export function WordFrequency() {
  const [text, setText] = useState("");
  const [length, setLength] = useState("2");
  const [result, setResult] = useState<[string, number][] | null>(null);
  const [error, setError] = useState("");
  return (
    <Panel>
      <TextArea label="请输入要统计词频的文本" value={text} change={setText} />
      <div className={styles.row}>
        <TextField label="最小单词长度" type="number" min={1} value={length} change={setLength} />
        <Action variant="primary" onClick={() => {
          const minimum = Number(length);
          if (!Number.isSafeInteger(minimum) || minimum < 1) {
            setError("最小单词长度必须为正整数");
            return;
          }
          setResult(frequencies(text, minimum));
          setError("");
        }}>统计词频</Action>
        <Action onClick={() => { setText(""); setResult(null); setError(""); }}>清空</Action>
        {result?.length ? <Action onClick={() => saveText("词频.tsv", "词语\t次数\n" + result.map((row) => row.join("\t")).join("\n"))}>下载词频</Action> : null}
      </div>
      <Failure message={error} />
      {result && (result.length ? <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead><tr><th>词语</th><th>次数</th></tr></thead>
          <tbody>{result.map(([word, count]) => <tr key={word}><td>{word}</td><td>{count}</td></tr>)}</tbody>
        </table>
      </div> : <p role="status">没有匹配的词语</p>)}
    </Panel>
  );
}

type Change = { value: string; added?: boolean; removed?: boolean; count?: number };
const compareModes = [["lines", "按行"], ["words", "按词"], ["characters", "按字符"]] as const;

export function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<(typeof compareModes)[number][0]>("lines");
  const [changes, setChanges] = useState<Change[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const leftId = useId();
  const rightId = useId();

  async function compare() {
    setPending(true);
    try {
      const { diffLines, diffWords, diffChars } = await import("diff");
      const options = { timeout: 1000 };
      const next = mode === "lines" ? diffLines(left, right, options) :
        mode === "words" ? diffWords(left, right, options) : diffChars(left, right, options);
      if (!next) throw new Error("比较超时，请缩短待比较文本");
      setChanges(next);
      setError("");
    } catch (cause) {
      setChanges([]);
      setError(cause instanceof Error ? cause.message : "无法比较文本");
    } finally {
      setPending(false);
    }
  }

  const additions = changes.filter((change) => change.added).reduce((sum, change) => sum + (change.count ?? 0), 0);
  const deletions = changes.filter((change) => change.removed).reduce((sum, change) => sum + (change.count ?? 0), 0);
  return (
    <Panel>
      <div className={styles.columns}>
        <TextArea label="请输入文本1" id={leftId} value={left} change={setLeft} mono />
        <TextArea label="请输入文本2" id={rightId} value={right} change={setRight} mono />
      </div>
      <div className={styles.row}>
        <SelectField label="对比方式" options={compareModes} value={mode} change={setMode} />
        <Action variant="primary" onClick={() => void compare()} disabled={pending} aria-controls={leftId + " " + rightId}>对比文本</Action>
        <Action onClick={() => { setLeft(""); setRight(""); setChanges([]); setError(""); }}>清空</Action>
      </div>
      <p role="status">+{additions} additions / -{deletions} deletions</p>
      <Failure message={error} />
      <pre className={styles.pre} aria-label="文本差异">
        {changes.map((change, index) => change.added ? <ins key={index} className={styles.added}>{change.value}</ins> :
          change.removed ? <del key={index} className={styles.removed}>{change.value}</del> : <span key={index}>{change.value}</span>)}
      </pre>
    </Panel>
  );
}
