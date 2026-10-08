import { useState } from 'react';
import api, { errMsg } from '../../api/client';
import { fmtDate, today, useLoad } from '../../lib';
import { Async, Button, Empty, Field, Notice, PageHeader, Stamp, inputCls } from '../../components/ui';

export default function Logs() {
  const apps = useLoad(() => api.get('/api/v1/applications/mine').then((r) => r.data));
  const logs = useLoad(() => api.get('/api/v1/logs/mine').then((r) => r.data));
  const [form, setForm] = useState({ applicationId: '', date: today(), tasksCompleted: '' });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState({ kind: 'error', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const active = (apps.data || []).filter((a) => a.status === 'ACCEPTED' && !a.completed);
  const applicationId = form.applicationId || active[0]?.id || '';

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: 'error', text: '' });
    try {
      const body = { applicationId: Number(applicationId), date: form.date, tasksCompleted: form.tasksCompleted };
      if (editing) await api.put(`/api/v1/logs/${editing}`, body);
      else await api.post('/api/v1/logs', body);
      setMsg({ kind: 'success', text: editing ? 'Log resubmitted for approval.' : 'Log submitted for approval.' });
      setForm((f) => ({ ...f, tasksCompleted: '', date: today() }));
      setEditing(null);
      logs.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  }

  function edit(l) {
    setEditing(l.id);
    setForm({ applicationId: l.applicationId, date: l.date, tasksCompleted: l.tasksCompleted });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <PageHeader title="Daily logs" subtitle="Record what you worked on. Your mentor approves or returns each entry." />
      <Async q={apps}>
        {() =>
          active.length === 0 ? (
            <Empty title="No active internship" hint="You can log days once a company accepts your application." />
          ) : (
            <form onSubmit={submit} className="mb-10 max-w-2xl space-y-4 rounded-sm border border-ink bg-white p-5">
              <h2 className="font-display text-xl font-semibold">{editing ? 'Edit and resubmit' : 'New log entry'}</h2>
              <Notice kind={msg.kind}>{msg.text}</Notice>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Internship">
                  <select className={inputCls} value={applicationId} onChange={set('applicationId')} disabled={!!editing}>
                    {active.map((a) => <option key={a.id} value={a.id}>{a.listingTitle}, {a.companyName}</option>)}
                  </select>
                </Field>
                <Field label="Date">
                  <input type="date" required max={today()} className={inputCls} value={form.date} onChange={set('date')} disabled={!!editing} />
                </Field>
              </div>
              <Field label="Tasks completed">
                <textarea required rows={4} className={inputCls} value={form.tasksCompleted} onChange={set('tasksCompleted')} placeholder="What did you build, fix or learn today?" />
              </Field>
              <div className="flex gap-3">
                <Button type="submit" disabled={busy}>{busy ? 'Sending' : editing ? 'Resubmit for approval' : 'Submit for approval'}</Button>
                {editing && <Button type="button" variant="ghost" onClick={() => { setEditing(null); setForm((f) => ({ ...f, tasksCompleted: '', date: today() })); }}>Cancel edit</Button>}
              </div>
            </form>
          )
        }
      </Async>

      <h2 className="mb-3 font-display text-xl font-semibold">Your entries</h2>
      <Async q={logs}>
        {(list) =>
          list.length === 0 ? (
            <Empty title="No entries yet" hint="Entries you submit will appear here with your mentor's notes." />
          ) : (
            <ul className="max-w-3xl border border-rule bg-white px-5 pb-2">
              {list.map((l) => (
                <li key={l.id} className="border-b border-rule py-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{fmtDate(l.date)} <span className="font-normal text-ink/60">{l.listingTitle}</span></p>
                    <Stamp status={l.status} />
                  </div>
                  <p className="mt-1 whitespace-pre-line">{l.tasksCompleted}</p>
                  {l.mentorNotes && <p className="mt-1 text-sm"><span className="font-semibold">Mentor:</span> <mark className="bg-hl px-1">{l.mentorNotes}</mark></p>}
                  {l.status === 'REJECTED' && <button onClick={() => edit(l)} className="mt-1 text-sm font-semibold underline">Edit and resubmit</button>}
                </li>
              ))}
            </ul>
          )
        }
      </Async>
    </>
  );
}
