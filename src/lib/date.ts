import { differenceInCalendarDays, formatISO, parseISO } from 'date-fns';

export function todayISO(): string {
  return formatISO(new Date(), { representation: 'date' });
}

export function addDaysISO(date: string, days: number): string {
  const parsed = parseISO(date);
  const next = new Date(parsed.getTime());
  next.setDate(parsed.getDate() + days);
  return formatISO(next, { representation: 'date' });
}

export function daysBetweenInclusive(start: string, end: string): number {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  return differenceInCalendarDays(endDate, startDate) + 1;
}

export function formatDateLocal(date: string): string {
  if (!date) return '';
  const parsed = parseISO(date);
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
