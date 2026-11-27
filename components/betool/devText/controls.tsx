import { useId, useState, type ComponentProps } from "react";
import common from "../betool-tools.module.css";
import styles from "./dev-text.module.css";

export function Action({
  children,
  onClick,
  variant,
  ...props
}: ComponentProps<"button"> & { variant?: "primary" | "danger" }) {
  return <button type="button" data-variant={variant} onClick={onClick} {...props}>{children}</button>;
}

export function TextArea({
  label,
  change,
  mono = false,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange"> & {
  label: string;
  change?: (value: string) => void;
  mono?: boolean;
}) {
  return (
    <label className={mono ? styles.field + " " + styles.mono : styles.field}>
      <span>{label}</span>
      <textarea spellCheck={false} readOnly={!change} onChange={(event) => change?.(event.target.value)} {...props} />
    </label>
  );
}

export function TextField({
  label,
  change,
  ...props
}: Omit<ComponentProps<"input">, "onChange"> & { label: string; change?: (value: string) => void }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input onChange={(event) => change?.(event.target.value)} readOnly={!change} {...props} />
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  options,
  value,
  change,
}: {
  label: string;
  options: readonly (readonly [T, string])[];
  value: T;
  change: (value: T) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select value={value} onChange={(event) => {
        const option = options.find(([key]) => key === event.target.value);
        if (option) change(option[0]);
      }}>
        {options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}
      </select>
    </label>
  );
}

export function Toggle({
  label, checked, change,
}: { label: string; checked: boolean; change: (value: boolean) => void }) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={(event) => change(event.target.checked)} />
      {label}
    </label>
  );
}

export function Copy({ value, label = "复制结果" }: { value: string; label?: string }) {
  const [status, setStatus] = useState("");
  const id = useId();
  return (
    <>
      <Action disabled={!value} aria-describedby={id} onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setStatus("已复制");
        } catch {
          setStatus("复制失败，请选择文本后手动复制");
        }
      }}>{label}</Action>
      <span id={id} role="status">{status}</span>
    </>
  );
}

export function Failure({ message }: { message: string }) {
  return message && <p className={common.error} role="alert">{message}</p>;
}

export function Panel({ children }: ComponentProps<"section">) {
  return <section className={common.panel + " " + styles.stack}>{children}</section>;
}

export function saveText(name: string, content: string, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type: mime + ";charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
