import type { ChangeEvent, ReactNode } from "react";

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
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.valueAsNumber;
    onChange(Number.isFinite(nextValue) ? nextValue : 0);
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
          value={value}
          onChange={handleChange}
        />
        {suffix ? <span className="number-field__affix">{suffix}</span> : null}
      </span>
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
