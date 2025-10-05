import { forwardRef, useMemo } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { formatMoneyFromPence, parseMoneyToPence } from '../lib/money';

interface MoneyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  valuePence: number;
  onChangePence: (value: number) => void;
  hint?: string;
  error?: string;
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { label, valuePence, onChangePence, hint, error, className, id, ...props },
  ref
) {
  const displayValue = useMemo(() => (valuePence !== undefined ? formatMoneyFromPence(valuePence, false) : ''), [
    valuePence
  ]);

  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700" htmlFor={id}>
      <span className="font-medium">{label}</span>
      <input
        ref={ref}
        id={id}
        inputMode="decimal"
        className={clsx(
          'rounded-md border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
          className
        )}
        value={displayValue}
        onChange={(event) => {
          const next = parseMoneyToPence(event.target.value);
          if (next !== null) {
            onChangePence(next);
          }
        }}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

export default MoneyInput;
