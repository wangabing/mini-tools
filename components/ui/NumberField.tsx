import { useState, type ChangeEvent, type FocusEvent, type ReactNode } from "react";

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: ReactNode;
  suffix?: ReactNode;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  testId?: string;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
  min = 0,
  max = 99999999,
  step = 0.01,
  testId,
}: NumberFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
    const nextValue = event.target.valueAsNumber;
    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.valueAsNumber;
    onChange(Number.isFinite(nextValue) ? nextValue : 0);
    setDraft(null);
  }

  return (
    <label className="number-field" htmlFor={id}>
      <span className="number-field__label">{label}</span>
      <span className="number-field__control">
        {prefix ? <span className="number-field__affix">{prefix}</span> : null}
        <input
          id={id}
          aria-label={label}
          data-testid={testId}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {suffix ? <span className="number-field__affix">{suffix}</span> : null}
      </span>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
