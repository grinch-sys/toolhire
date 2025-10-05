import clsx from 'clsx';

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-800',
  hired: 'bg-blue-100 text-blue-800',
  repair: 'bg-amber-100 text-amber-800',
  lost: 'bg-rose-100 text-rose-800',
  open: 'bg-blue-100 text-blue-800',
  overdue: 'bg-rose-100 text-rose-800',
  closed: 'bg-slate-200 text-slate-800'
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
        statusColors[normalized] ?? 'bg-slate-200 text-slate-800'
      )}
    >
      {status}
    </span>
  );
}
