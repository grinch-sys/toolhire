import { useState } from 'react';
import type { FormEvent } from 'react';
import Input from '../components/Input';
import Select from '../components/Select';
import TextArea from '../components/TextArea';
import MoneyInput from '../components/MoneyInput';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { formatDateLocal } from '../lib/date';
import { formatMoneyFromPence } from '../lib/money';
import { useDB } from '../state/db';

const defaultForm = {
  name: '',
  sku: '',
  category: '',
  dailyRatePence: 0,
  condition: 'Good' as const,
  status: 'available' as const,
  lastServicedDate: '',
  notes: ''
};

export default function ToolsPage() {
  const { db, createTool, deleteTool } = useDB();
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTool({
      name: form.name,
      sku: form.sku || undefined,
      category: form.category || undefined,
      dailyRatePence: form.dailyRatePence,
      condition: form.condition,
      status: form.status,
      lastServicedDate: form.lastServicedDate || undefined,
      notes: form.notes || undefined
    });
    setForm(defaultForm);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Tools</h2>
          <p className="text-sm text-slate-500">Manage your tool catalogue and availability.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
        >
          Add tool
        </button>
      </div>

      <Table>
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Daily rate</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Last serviced</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {db.tools.map((tool) => (
            <tr key={tool.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{tool.name}</div>
                <div className="text-xs text-slate-500">{tool.category ?? 'Uncategorised'}</div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                <StatusBadge status={tool.status} />
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatMoneyFromPence(tool.dailyRatePence)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {tool.lastServicedDate ? formatDateLocal(tool.lastServicedDate) : '—'}
              </td>
              <td className="px-4 py-3 text-right text-sm text-slate-700">
                <button
                  type="button"
                  onClick={() => deleteTool(tool.id)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {db.tools.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                No tools yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add tool">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
          />
          <Input
            label="Category"
            name="category"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          />
          <MoneyInput
            label="Daily rate"
            id="dailyRate"
            valuePence={form.dailyRatePence}
            onChangePence={(value) => setForm((prev) => ({ ...prev, dailyRatePence: value }))}
            required
          />
          <Select
            label="Condition"
            name="condition"
            value={form.condition}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, condition: event.target.value as typeof prev.condition }))
            }
          >
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Needs service">Needs service</option>
          </Select>
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as typeof prev.status }))
            }
          >
            <option value="available">Available</option>
            <option value="hired">Hired</option>
            <option value="repair">Repair</option>
            <option value="lost">Lost</option>
          </Select>
          <Input
            label="Last serviced"
            type="date"
            name="lastServicedDate"
            value={form.lastServicedDate}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lastServicedDate: event.target.value }))
            }
          />
          <TextArea
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
              Save tool
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
