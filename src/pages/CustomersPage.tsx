import { useState } from 'react';
import type { FormEvent } from 'react';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { formatDateLocal } from '../lib/date';
import { useDB } from '../state/db';

const defaultForm = {
  name: '',
  phone: '',
  email: '',
  company: '',
  address: '',
  notes: ''
};

export default function CustomersPage() {
  const { db, createCustomer, deleteCustomer } = useDB();
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCustomer({
      name: form.name,
      phone: form.phone || undefined,
      email: form.email || undefined,
      company: form.company || undefined,
      address: form.address || undefined,
      notes: form.notes || undefined
    });
    setForm(defaultForm);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
          <p className="text-sm text-slate-500">Keep track of customers and contact details.</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
        >
          Add customer
        </button>
      </div>

      <Table>
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Company</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Created</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {db.customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-700">
                <div className="font-medium text-slate-900">{customer.name}</div>
                <div className="text-xs text-slate-500">{customer.notes ?? 'No notes'}</div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">
                <div>{customer.phone ?? '—'}</div>
                <div>{customer.email ?? '—'}</div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{customer.company ?? '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-700">
                {formatDateLocal(customer.createdAt)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-slate-700">
                <button
                  type="button"
                  onClick={() => deleteCustomer(customer.id)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {db.customers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                No customers yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add customer">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Input
            label="Company"
            name="company"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
          />
          <TextArea
            label="Address"
            name="address"
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
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
              Save customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
