"use client";

import { useState, type ComponentType } from "react";
import { CodeTransformer, HashCalculator, JwtDecoder, RegexTester, StructuredFormatter, codeTools } from "./code-tools";
import { Action, Panel, TextField } from "./controls";
import { AsciiArt, MarkdownEditor, RichTextEditor } from "./editor-tools";
import { httpStatusRows } from "./http-status";
import { BaseConverter, PasswordGenerator, StorageConverter, TimestampConverter } from "./number-tools";
import { TextDeduplication, TextDiff, TextReplacement, TextWorkflow, WordCount, WordFrequency } from "./text-tools";
import styles from "./dev-text.module.css";

function HttpStatusCodes() {
  const [query, setQuery] = useState("");
  const match = query.trim().toLowerCase();
  const rows = httpStatusRows.filter((row) => row.join(" ").toLowerCase().includes(match));
  return (
    <Panel>
      <div className={styles.row}>
        <TextField label="搜索状态码或含义" type="search" value={query} change={setQuery} />
        {query && <Action onClick={() => setQuery("")}>清空搜索</Action>}
      </div>
      {rows.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th scope="col">状态码</th><th scope="col">含义</th></tr></thead>
            <tbody>{rows.map(([status, meaning]) => <tr key={status}><th scope="row">{status}</th><td>{meaning}</td></tr>)}</tbody>
          </table>
        </div>
      ) : <p role="status">没有匹配的状态码</p>}
    </Panel>
  );
}

const views: Record<string, ComponentType> = {
  randompassword: PasswordGenerator,
  timetran: TimestampConverter,
  MD5: () => <HashCalculator md5Only />,
  reg: RegexTester,
  HttpStatusCode: HttpStatusCodes,
  jwt: JwtDecoder,
  baseconverter: BaseConverter,
  storageconverter: StorageConverter,
  hashcalculator: HashCalculator,
  xmlformat: () => <StructuredFormatter slug="xmlformat" />,
  sqlformat: () => <StructuredFormatter slug="sqlformat" />,
  diff: TextDiff,
  markdown: MarkdownEditor,
  wordCount: WordCount,
  textRemoveDuplicate: TextDeduplication,
  asciiWordPic: AsciiArt,
  textEdit: RichTextEditor,
  textreplace: TextReplacement,
  textworkflow: TextWorkflow,
  wordfrequency: WordFrequency,
};

export function DevTextTool({ slug }: { slug: string }) {
  const View = Object.hasOwn(views, slug) ? views[slug] : undefined;
  if (View) return <View />;
  return Object.hasOwn(codeTools, slug) ? <CodeTransformer slug={slug} /> : null;
}
