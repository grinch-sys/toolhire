import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, className, id, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700" htmlFor={inputId}>
      <span className="font-medium">{label}</span>
      <textarea
        ref={ref}
        id={inputId}
        className={clsx(
          'min-h-[120px] rounded-md border border-slate-300 px-3 py-2 text-base text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
});

export default TextArea;
