const formatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatMoneyFromPence(value: number, withSymbol = true): string {
  if (Number.isNaN(value)) return '';
  const amount = value / 100;
  if (!withSymbol) {
    return amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return formatter.format(amount);
}

export function parseMoneyToPence(input: string): number | null {
  const cleaned = input.replace(/[^0-9.,-]/g, '').replace(',', '.');
  if (cleaned.trim() === '') return 0;
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

export function sumMoney(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0);
}

export function averageMoney(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(sumMoney(values) / values.length);
}
