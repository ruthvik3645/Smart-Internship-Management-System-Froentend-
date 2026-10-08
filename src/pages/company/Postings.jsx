import { useState } from 'react';
import { Plus } from 'lucide-react';
import api, { errMsg } from '../../api/client';
import { fmtDate, fmtMoney, useLoad } from '../../lib';
import { Async, Button, Empty, Field, Notice, PageHeader, Stamp, inputCls } from '../../components/ui';

const blank = { title: '', description: '', requirements: '', stipend: '', duration: '', deadline: '' };

export default function Postings() {
  const q = useLoad(() => api.get('/api/v1/internships/mine').then((r) => r.data));
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const close = () => { setForm(null); setEditId(null); setError(''); };

  function edit(l) {
    setEditId(l.id);
    setForm({
      title: l.title, description: l.description ?? '', requirements: l.requirements ?? '',
      stipend: l.stipend ?? '', duration: l.duration ?? '', deadline: l.deadline ?? '',
    });
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const body = {
      title: form.title, description: form.description, requirements: form.requirements,
      stipend: form.stipend === '' ? null : Number(form.stipend), duration: form.duration, deadline: form.deadline || null,
    };
    try {
      if (editId) await api.put(`/api/v1/internships/${editId}`, body);
      else await api.post('/api/v1/internships', body);
      close();
      q.reload();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  async function archive(l) {
    if (!window.confirm(`Archive "${l.title}"? Students will no longer see it.`)) return;
    try {
      await api.patch(`/api/v1/internships/${l.id}/archive`);
      q.reload();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <PageHeader
        title="Postings"
        subtitle="Internships your company has published."
        action={!form && <Button variant="accent" onClick={() => setForm(blank)}><Plus size={16} /> New posting</Button>}
      />

      {form && (
        <form onSubmit={save} className="mb-10 max-w-2xl space-y-4 rounded-sm border border-ink bg-white p-5">
          <h2 className="font-display text-xl font-semibold">{editId ? 'Edit posting' : 'New posting'}</h2>
          <Notice>{error}</Notice>
          <Field label="Title"><input required className={inputCls} value={form.title} onChange={set('title')} /></Field>
          <Field label="Description"><textarea rows={3} className={inputCls} value={form.description} onChange={set('description')} /></Field>
          <Field label="Requirements" hint="Skills and background you are looking for."><textarea rows={2} className={inputCls} value={form.requirements} onChange={set('requirements')} /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Stipend (₹ a month)"><input type="number" min="0" className={inputCls} value={form.stipend} onChange={set('stipend')} /></Field>
            <Field label="Duration"><input className={inputCls} placeholder="12 weeks" value={form.duration} onChange={set('duration')} /></Field>
            <Field label="Apply by"><input type="date" className={inputCls} value={form.deadline} onChange={set('deadline')} /></Field>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={busy}>{busy ? 'Saving' : editId ? 'Save changes' : 'Publish posting'}</Button>
            <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          </div>
        </form>
      )}

      {!form && <div className="mb-4"><Notice>{error}</Notice></div>}
      <Async q={q}>
        {(list) =>
          list.length === 0 ? (
            <Empty title="No postings yet" hint="Publish your first internship and students can start applying." />
          ) : (
            <ul className="divide-y divide-rule border-y border-rule bg-white">
              {list.map((l) => (
                <li key={l.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-lg font-semibold">{l.title}</h2>
                      <Stamp status={l.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink/70">{fmtMoney(l.stipend)}, {l.duration || 'duration not set'}, apply by {fmtDate(l.deadline)}</p>
                    {l.requirements && <p className="mt-1 text-sm">{l.requirements}</p>}
                  </div>
                  {l.status === 'OPEN' && (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => edit(l)}>Edit</Button>
                      <Button variant="ghost" onClick={() => archive(l)}>Archive</Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        }
      </Async>
    </>
  );
}
