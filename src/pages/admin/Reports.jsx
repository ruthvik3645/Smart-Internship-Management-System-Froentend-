import { useState } from 'react';
import { Download } from 'lucide-react';
import { download, errMsg } from '../../api/client';
import { Button, Notice, PageHeader } from '../../components/ui';

const REPORTS = [
  ['applications', 'Applications', 'Every application with intern, company, status, rating and completion.'],
  ['logs', 'Daily logs', 'Every daily log with date, tasks, approval status and mentor notes.'],
];

export default function Reports() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  async function run(type, format) {
    setBusy(`${type}-${format}`);
    setError('');
    try {
      await download('/api/v1/admin/reports', { type, format }, `${type}-report.${format}`);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy('');
    }
  }

  return (
    <>
      <PageHeader title="Reports" subtitle="Export system data to share or archive." />
      <div className="mb-4"><Notice>{error}</Notice></div>
      <ul className="max-w-3xl divide-y divide-rule border-y border-rule bg-white">
        {REPORTS.map(([type, title, hint]) => (
          <li key={type} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold">{title}</h2>
              <p className="text-sm text-ink/70">{hint}</p>
            </div>
            <div className="flex gap-2">
              {['csv', 'pdf'].map((f) => (
                <Button key={f} variant="ghost" disabled={!!busy} onClick={() => run(type, f)}>
                  <Download size={16} /> {busy === `${type}-${f}` ? 'Preparing' : f.toUpperCase()}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
