"use client";

import Decimal from "decimal.js";
import { useState } from "react";
import styles from "./other.module.css";

const columns = ["C", "<", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];
const operators = new Set(["+", "-", "×", "÷", "%"]);

function evaluateExpression(expression: string) {
  const tokens = expression.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|[+\-×÷%]/gi) ?? [];
  if (!tokens.length || tokens.join("") !== expression) throw new Error("表达式无效");
  if (tokens[0] === "-") tokens.splice(0, 2, "-" + (tokens[1] ?? ""));
  let current = new Decimal(tokens[0]!);
  let total = new Decimal(0);
  let sign = 1;
  for (let index = 1; index < tokens.length; index += 2) {
    const operator = tokens[index];
    const next = new Decimal(tokens[index + 1]);
    if (operator === "×") current = current.mul(next);
    else if (operator === "÷") current = current.div(next);
    else if (operator === "%") current = current.mod(next);
    else {
      total = total.plus(current.mul(sign));
      sign = operator === "+" ? 1 : -1;
      current = next;
    }
  }
  const result = total.plus(current.mul(sign));
  if (!result.isFinite()) throw new Error("除数不能为零");
  return result.toString();
}

export function Calculator() {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState("");
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);

  function press(key: string) {
    setError("");
    if (key === "C") {
      setValue("");
      setHistory("");
      setSolved(false);
      return;
    }
    if (key === "<") {
      setValue(value.slice(0, -1));
      setSolved(false);
      return;
    }
    if (key === "=") {
      if (!value) return;
      try {
        const result = evaluateExpression(value);
        setHistory(value + " =");
        setValue(result);
        setSolved(true);
      } catch (cause) {
        setError((cause as Error).message);
      }
      return;
    }
    if (operators.has(key)) {
      if (!value && key !== "-") return;
      const prefix = operators.has(value.at(-1) ?? "") ? value.slice(0, -1) : value;
      setValue(prefix + key);
    } else {
      const previous = solved ? "" : value;
      const operand = previous.split(/[+\-×÷%]/).at(-1) ?? "";
      if (key === "." && operand.includes(".")) return;
      setValue(previous + (key === "." && !operand ? "0." : key));
    }
    setSolved(false);
  }

  return (
    <section className={styles.calculator} aria-label="计算器"
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;
        const aliases: Record<string, string> = { Enter: "=", Escape: "C", Backspace: "<", "*": "×", "/": "÷" };
        const key = aliases[event.key] || event.key;
        if (columns.includes(key)) { event.preventDefault(); press(key); }
      }}>
      <div className={styles.calculatorDisplay}>
        <div aria-label="历史">{history}</div>
        <output aria-label="计算结果">{value || "0"}</output>
        {error && <p role="alert">{error}</p>}
      </div>
      <div className={styles.keypad}>
        {columns.map((key) => <button key={key} type="button" onClick={() => press(key)}
          data-wide={key === "0"}>{key}</button>)}
      </div>
    </section>
  );
}
