import { useState } from 'react';
import FilePicker from '../components/FilePicker';
import { parseCSV } from '../lib/csv';
import { formatMoneyFromPence } from '../lib/money';
import { importSchema } from '../lib/validators';
import { useDB } from '../state/db';

export default function SettingsPage() {
  const { db, adapter, importData, reset } = useDB();
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hireflow-export.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Exported data as JSON.');
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    let data;
    try {
      if (file.name.endsWith('.csv')) {
        const rows = parseCSV(text);
        const [headers, ...records] = rows;
        const objects = records.map((row) => {
          const record: Record<string, string> = {};
          headers.forEach((header, index) => {
            record[header] = row[index];
          });
          return record;
        });
        data = { tools: objects };
      } else {
        data = JSON.parse(text);
      }
    } catch (error) {
      setMessage('Failed to parse file.');
      console.error(error);
      return;
    }

    const result = importSchema.safeParse(data);
    if (!result.success) {
      setMessage('Import failed validation. Check console for details.');
      console.error(result.error);
      return;
    }

    importData(result.data);
    setMessage('Imported data successfully.');
  };

  const totalInventoryValue = db.tools.reduce((acc, tool) => acc + tool.dailyRatePence, 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Storage</h2>
        <p className="mt-2 text-sm text-slate-600">
          Current adapter: <strong>{adapter.constructor.name}</strong>. Data is stored locally in this
          browser.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Data management</h2>
        <p className="mt-2 text-sm text-slate-600">
          Export your data for backup or import records from JSON/CSV.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
          >
            Export JSON
          </button>
          <FilePicker label="Import JSON or CSV" onFile={handleFile} />
        </div>
        {message ? <p className="mt-4 text-sm text-slate-500">{message}</p> : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Inventory health</h2>
        <p className="mt-2 text-sm text-slate-600">
          Total daily rate across tools: {formatMoneyFromPence(totalInventoryValue)}
        </p>
      </section>

      <section className="rounded-lg border border-rose-200 bg-rose-50 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-800">Danger zone</h2>
        <p className="mt-2 text-sm text-rose-700">
          Resetting will clear current data and restore the demo dataset.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
        >
          Reset to demo data
        </button>
      </section>
    </div>
  );
}
