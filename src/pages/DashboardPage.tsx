import KPI from '../components/KPI';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import { formatDateLocal } from '../lib/date';
import { formatMoneyFromPence } from '../lib/money';
import { useDB, useDashboardMetrics } from '../state/db';

export default function DashboardPage() {
  const { db } = useDB();
  const metrics = useDashboardMetrics();
  const recentHires = [...db.hires]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPI label="Total tools" value={String(metrics.totalTools)} />
          <KPI label="Available" value={String(metrics.availableTools)} />
          <KPI label="Active hires" value={String(metrics.activeHires)} />
          <KPI label="Revenue" value={metrics.revenueFormatted} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Recent hires</h2>
        <Table>
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Hire
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Tool
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                Daily rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {recentHires.map((hire) => {
              const tool = db.tools.find((item) => item.id === hire.toolId);
              const customer = db.customers.find((item) => item.id === hire.customerId);
              return (
                <tr key={hire.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {formatDateLocal(hire.startDate)} – {formatDateLocal(hire.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{tool?.name ?? 'Unknown tool'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{customer?.name ?? 'Unknown customer'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <StatusBadge status={hire.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-700">
                    {formatMoneyFromPence(hire.dailyRatePenceAtHire)}
                  </td>
                </tr>
              );
            })}
            {recentHires.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hires yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
