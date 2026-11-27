import { Bold, Code2, Italic, List, ListOrdered, Strikethrough, Underline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Action, Copy, Failure, Panel, SelectField, TextArea, saveText } from "./controls";
import styles from "./dev-text.module.css";

const figletFonts = {
  Alpha: () => import("figlet/fonts/Alpha"),
  Avatar: () => import("figlet/fonts/Avatar"),
  Banner: () => import("figlet/fonts/Banner"),
  "Banner3-D": () => import("figlet/fonts/Banner3-D"),
  Basic: () => import("figlet/fonts/Basic"),
  Bear: () => import("figlet/fonts/Bear"),
  "Big Money-ne": () => import("figlet/fonts/Big Money-ne"),
  Big: () => import("figlet/fonts/Big"),
  Block: () => import("figlet/fonts/Block"),
  Epic: () => import("figlet/fonts/Epic"),
  Ghost: () => import("figlet/fonts/Ghost"),
  Knob: () => import("figlet/fonts/Knob"),
  Linux: () => import("figlet/fonts/Linux"),
  Mini: () => import("figlet/fonts/Mini"),
  Mirror: () => import("figlet/fonts/Mirror"),
  Peaks: () => import("figlet/fonts/Peaks"),
  Slant: () => import("figlet/fonts/Slant"),
  Small: () => import("figlet/fonts/Small"),
  Stellar: () => import("figlet/fonts/Stellar"),
  Thin: () => import("figlet/fonts/Thin"),
  Wow: () => import("figlet/fonts/Wow"),
};
type FigletFont = keyof typeof figletFonts;
const fontOptions = (Object.keys(figletFonts) as FigletFont[]).map((font) => [font, font] as const);

export function AsciiArt() {
  const [text, setText] = useState("Hello");
  const [font, setFont] = useState<FigletFont>("Big");
  const [art, setArt] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function generate() {
    setPending(true);
    setError("");
    try {
      const [{ default: figlet }, { default: definition }] = await Promise.all([
        import("figlet/browser"), figletFonts[font](),
      ]);
      figlet.parseFont(font, definition);
      setArt(figlet.textSync(text, { font }));
    } catch (cause) {
      setArt("");
      setError(cause instanceof Error ? cause.message : "字形生成失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <Panel>
      <TextArea label="请输入内容" value={text} change={setText} readOnly={pending} />
      <div className={styles.row}>
        <SelectField label="风格" options={fontOptions} value={font} change={setFont} />
        <Action variant="primary" disabled={pending} onClick={() => void generate()}>生成</Action>
        <Copy value={art} />
        <Action disabled={pending} onClick={() => { setText(""); setArt(""); setError(""); }}>清除</Action>
      </div>
      <pre aria-label="ASCII 字形" className={styles.pre}>{art}</pre>
      <Failure message={error} />
    </Panel>
  );
}

type Heading = { id: string; label: string; depth: number };
const markdownViews = [["both", "编辑和预览"], ["edit", "编辑"], ["preview", "预览"]] as const;

export function MarkdownEditor() {
  const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [view, setView] = useState<(typeof markdownViews)[number][0]>("both");
  const [showContents, setShowContents] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const format = async () => {
      try {
        const [{ marked }, { default: sanitizer }] = await Promise.all([import("marked"), import("dompurify")]);
        const sanitized = sanitizer.sanitize(await marked.parse(text, { gfm: true }), { USE_PROFILES: { html: true } });
        const doc = new DOMParser().parseFromString(sanitized, "text/html");
        const nextHeadings = [...doc.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((item, index) => {
          const id = "markdown-heading-" + index;
          item.id = id;
          return { id, label: item.textContent ?? "", depth: Number(item.tagName.slice(1)) };
        });
        if (active) {
          setHtml(doc.body.innerHTML);
          setHeadings(nextHeadings);
          setError("");
        }
      } catch (cause) {
        if (active) {
          setHtml("");
          setHeadings([]);
          setError(cause instanceof Error ? cause.message : "Markdown 预览失败");
        }
      }
    };
    void format();
    return () => { active = false; };
  }, [text]);

  return (
    <Panel>
      <div className={styles.row}>
        <SelectField label="视图" options={markdownViews} value={view} change={setView} />
        <Action aria-expanded={showContents} onClick={() => setShowContents(!showContents)}>目录导航</Action>
        <Action disabled={!text} onClick={() => saveText("document.md", text, "text/markdown")}>导出 Markdown</Action>
      </div>
      {showContents && view !== "edit" && headings.length > 0 && (
        <nav className={styles.row} aria-label="Markdown 目录">
          {headings.map(({ id, label, depth }) =>
            <a key={id} href={"#" + id} style={{ paddingInlineStart: (depth - 1) * 5 }}>{label}</a>,
          )}
        </nav>
      )}
      <div className={view === "both" ? styles.columns : undefined}>
        {view !== "preview" && <TextArea label="Markdown" placeholder="请输入内容" value={text} change={setText} mono />}
        {view !== "edit" && <article className={styles.preview} aria-label="Markdown 预览" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
      <Failure message={error} />
    </Panel>
  );
}

const editorCommands = [
  ["bold", "加粗", Bold], ["italic", "斜体", Italic], ["underline", "下划线", Underline],
  ["strikeThrough", "删除线", Strikethrough], ["insertUnorderedList", "无序列表", List],
  ["insertOrderedList", "有序列表", ListOrdered],
] as const;
const blockOptions = [["p", "正文"], ["h1", "一级标题"], ["h2", "二级标题"], ["h3", "三级标题"], ["blockquote", "引用"], ["pre", "代码块"]] as const;

export function RichTextEditor() {
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);
  const [markup, setMarkup] = useState("");
  const [format, setFormat] = useState<(typeof blockOptions)[number][0]>("p");
  const [error, setError] = useState("");

  function saveSelection() {
    const value = window.getSelection();
    if (value?.rangeCount && editor.current?.contains(value.anchorNode)) selection.current = value.getRangeAt(0).cloneRange();
  }

  function command(name: string, arg?: string) {
    const range = selection.current;
    editor.current?.focus();
    const current = window.getSelection();
    if (range && editor.current?.contains(range.commonAncestorContainer)) {
      current?.removeAllRanges();
      current?.addRange(range);
    }
    document.execCommand(name, false, arg);
    updateMarkup();
  }

  function updateMarkup() {
    setMarkup(editor.current?.innerHTML ?? "");
    saveSelection();
  }

  function addLink() {
    const value = window.prompt("链接地址");
    if (!value) return;
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("unsupported link");
      command("createLink", url.href);
      setError("");
    } catch {
      setError("请输入有效的 HTTP 或 HTTPS 链接");
    }
  }

  return (
    <Panel>
      <div className={styles.row} role="group" aria-label="文本格式">
        <SelectField label="段落" options={blockOptions} value={format} change={(value) => {
          setFormat(value);
          command("formatBlock", value);
        }} />
        {editorCommands.map(([name, label, Icon]) => <Action key={name} title={label} aria-label={label}
          onMouseDown={(event) => event.preventDefault()} onClick={() => command(name)}><Icon size={16} /></Action>)}
        <Action title="代码块" aria-label="代码块" onMouseDown={(event) => event.preventDefault()} onClick={() => command("formatBlock", "pre")}><Code2 size={16} /></Action>
        <Action onMouseDown={(event) => event.preventDefault()} onClick={addLink}>插入链接</Action>
        <Action onMouseDown={(event) => event.preventDefault()} onClick={() => command("removeFormat")}>清除格式</Action>
      </div>
      <div
        ref={editor}
        role="textbox"
        aria-label="富文本"
        aria-multiline="true"
        className={styles.preview + " " + styles.edit}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="请输入内容..."
        onInput={updateMarkup}
        onPointerUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={saveSelection}
        onPaste={(event) => {
          event.preventDefault();
          document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          updateMarkup();
        }}
        onDrop={(event) => event.preventDefault()}
      />
      <TextArea label="HTML 预览" value={markup} mono />
      <Copy value={markup} label="复制HTML" />
      <Failure message={error} />
    </Panel>
  );
}
