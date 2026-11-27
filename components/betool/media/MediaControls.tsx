"use client";

import { ArrowDown, ArrowUp, Upload, X } from "lucide-react";
import { useId, useState } from "react";
import styles from "./media.module.css";

export function FilePicker({ label, accept, multiple, disabled, onFiles }: {
  label: string;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const choose = (files: FileList | null) => {
    if (files?.length && !disabled) onFiles(Array.from(files).slice(0, multiple ? undefined : 1));
  };

  return (
    <div className={styles.filePicker} data-dragging={dragging}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        choose(event.dataTransfer.files);
      }}
    >
      <input id={id} type="file" accept={accept} multiple={multiple} disabled={disabled}
        onChange={(event) => {
          choose(event.currentTarget.files);
          event.currentTarget.value = "";
        }} />
      <label htmlFor={id}><Upload aria-hidden="true" size={18} />{label}</label>
    </div>
  );
}

export function moveItem<T>(items: T[], index: number, step: number) {
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(index + step, 0, item);
  return next;
}

export function SortButtons({ index, count, label, onMove, onRemove }: {
  index: number;
  count: number;
  label: string;
  onMove: (step: number) => void;
  onRemove?: () => void;
}) {
  return (
    <span className={styles.iconButtons}>
      <button type="button" aria-label={`上移${label}`} title={`上移${label}`} disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp size={16} aria-hidden="true" />
      </button>
      <button type="button" aria-label={`下移${label}`} title={`下移${label}`} disabled={index === count - 1} onClick={() => onMove(1)}>
        <ArrowDown size={16} aria-hidden="true" />
      </button>
      {onRemove && (
        <button type="button" aria-label={`删除${label}`} title={`删除${label}`} onClick={onRemove}>
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

export function FileQueue({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  if (!files.length) return null;
  return (
    <ol className={styles.queue}>
      {files.map((file, index) => (
        <li key={`${file.name}-${file.lastModified}-${index}`}>
          <span className={styles.filename}>{file.name}</span>
          <SortButtons index={index} count={files.length} label={file.name}
            onMove={(step) => onChange(moveItem(files, index, step))}
            onRemove={() => onChange(files.filter((_, other) => index !== other))} />
        </li>
      ))}
    </ol>
  );
}

export function NumberField({ label, value, min, max, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.field}>
      {label}
      <input type="number" min={min} max={max} value={value} required
        onChange={(event) => onChange(event.currentTarget.valueAsNumber || 0)} />
    </label>
  );
}

export function MediaResult({ busy, error, message }: { busy: boolean; error: string; message: string }) {
  return (
    <>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {busy || message ? <p className={styles.status} role="status">{busy ? "正在处理…" : message}</p> : null}
    </>
  );
}
