import { useMemo } from 'react';
import Table from '../components/Table';
import { formatDateLocal } from '../lib/date';
import { formatMoneyFromPence, sumMoney } from '../lib/money';
import { useDB } from '../state/db';

export default function ReportsPage() {
  const { db } = useDB();

  const totals = useMemo(() => {
    const deposits = sumMoney(db.hires.map((hire) => hire.depositPence));
    const projected = sumMoney(db.hires.filter((hire) => hire.status !== 'closed').map((hire) => hire.dailyRatePenceAtHire));
    const closedRevenue = sumMoney(
      db.hires.filter((hire) => hire.totalPricePence).map((hire) => hire.totalPricePence ?? 0)
    );
    return {
      deposits: formatMoneyFromPence(deposits),
      projected: formatMoneyFromPence(projected),
      closedRevenue: formatMoneyFromPence(closedRevenue)
    };
  }, [db.hires]);

  const overdue = db.hires.filter((hire) => hire.status === 'overdue');

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Financial summary</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Deposits held</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{totals.deposits}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Projected daily revenue</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{totals.projected}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Closed hire revenue</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{totals.closedRevenue}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Overdue hires</h2>
        <Table>
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Hire</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Tool</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Customer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {overdue.map((hire) => {
              const tool = db.tools.find((item) => item.id === hire.toolId);
              const customer = db.customers.find((item) => item.id === hire.customerId);
              return (
                <tr key={hire.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    Due {formatDateLocal(hire.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{tool?.name ?? 'Unknown tool'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{customer?.name ?? 'Unknown customer'}</td>
                </tr>
              );
            })}
            {overdue.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                  No overdue hires.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
