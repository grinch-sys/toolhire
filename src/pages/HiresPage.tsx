import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import MoneyInput from '../components/MoneyInput';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { formatDateLocal } from '../lib/date';
import { formatMoneyFromPence } from '../lib/money';
import { useDB } from '../state/db';

interface HireFormState {
  toolId: string;
  customerId: string;
  startDate: string;
  dueDate: string;
  dailyRatePenceAtHire: number;
  depositPence: number;
  notes: string;
}

const defaultForm: HireFormState = {
  toolId: '',
  customerId: '',
  startDate: '',
  dueDate: '',
  dailyRatePenceAtHire: 0,
  depositPence: 0,
  notes: ''
};

export default function HiresPage() {
  const { db, createHire, updateHireStatus } = useDB();
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const availableTools = useMemo(
    () => db.tools.filter((tool) => tool.status === 'available'),
    [db.tools]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.toolId || !form.customerId || !form.startDate || !form.dueDate) return;
    createHire({
      toolId: form.toolId,
      customerId: form.customerId,
      startDate: form.startDate,
      dueDate: form.dueDate,
      dailyRatePenceAtHire: form.dailyRatePenceAtHire,
      depositPence: form.depositPence,
      notes: form.notes || undefined
    });
    setForm(defaultForm);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Hires</h2>
          <p className="text-sm text-slate-500">Track active hires and mark returns.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
        >
          Create hire
        </button>
      </div>

      <Table>
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Tool</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Dates</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Daily rate</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Deposit</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Total</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {db.hires.map((hire) => {
            const tool = db.tools.find((item) => item.id === hire.toolId);
            const customer = db.customers.find((item) => item.id === hire.customerId);
            return (
              <tr key={hire.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700">
                  <div className="font-medium text-slate-900">{tool?.name ?? 'Unknown tool'}</div>
                  <div className="text-xs text-slate-500">{tool?.sku ?? '—'}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{customer?.name ?? 'Unknown customer'}</td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {formatDateLocal(hire.startDate)} – {formatDateLocal(hire.dueDate)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  <StatusBadge status={hire.status} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoneyFromPence(hire.dailyRatePenceAtHire)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {formatMoneyFromPence(hire.depositPence)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {hire.totalPricePence ? formatMoneyFromPence(hire.totalPricePence) : '—'}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700">
                  {hire.status !== 'closed' ? (
                    <button
                      type="button"
                      onClick={() => updateHireStatus(hire.id, { status: 'closed', returnDate: hire.returnDate })}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Mark returned
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Closed</span>
                  )}
                </td>
              </tr>
            );
          })}
          {db.hires.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                No hires yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create hire">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Select
            label="Tool"
            name="toolId"
            value={form.toolId}
            onChange={(event) => {
              const value = event.target.value;
              setForm((prev) => ({
                ...prev,
                toolId: value,
                dailyRatePenceAtHire:
                  availableTools.find((tool) => tool.id === value)?.dailyRatePence ?? prev.dailyRatePenceAtHire
              }));
            }}
            required
          >
            <option value="">Select tool</option>
            {availableTools.map((tool) => (
              <option key={tool.id} value={tool.id}>
                {tool.name}
              </option>
            ))}
          </Select>
          <Select
            label="Customer"
            name="customerId"
            value={form.customerId}
            onChange={(event) => setForm((prev) => ({ ...prev, customerId: event.target.value }))}
            required
          >
            <option value="">Select customer</option>
            {db.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
          <Input
            label="Start date"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
            required
          />
          <Input
            label="Due date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
            required
          />
          <MoneyInput
            label="Daily rate"
            id="dailyRateAtHire"
            valuePence={form.dailyRatePenceAtHire}
            onChangePence={(value) => setForm((prev) => ({ ...prev, dailyRatePenceAtHire: value }))}
            required
          />
          <MoneyInput
            label="Deposit"
            id="deposit"
            valuePence={form.depositPence}
            onChangePence={(value) => setForm((prev) => ({ ...prev, depositPence: value }))}
            required
          />
          <Input
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
            >
              Create hire
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
