import type { PropsWithChildren } from 'react';

interface TableProps {
  caption?: string;
}

export default function Table({ caption, children }: PropsWithChildren<TableProps>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        {caption ? <caption className="p-4 text-left text-sm text-slate-500">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}
