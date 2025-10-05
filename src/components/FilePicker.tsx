import type { ChangeEvent } from 'react';

interface FilePickerProps {
  label: string;
  accept?: string;
  onFile: (file: File) => void;
}

export default function FilePicker({ label, accept = '.json,.csv', onFile }: FilePickerProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
      event.target.value = '';
    }
  };

  return (
    <label className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 shadow-sm hover:border-brand-400">
      <span className="font-medium text-slate-800">{label}</span>
      <span>Drop a file here or click to browse. Supported: JSON, CSV.</span>
      <input type="file" className="sr-only" accept={accept} onChange={handleChange} />
    </label>
  );
}
