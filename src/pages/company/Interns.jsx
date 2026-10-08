import { useState } from 'react';
import { Check, X } from 'lucide-react';
import api, { errMsg } from '../../api/client';
import { fmtDate, useLoad } from '../../lib';
import { Async, Button, Empty, Field, Notice, PageHeader, Stamp, inputCls } from '../../components/ui';

export default function Interns() {
  const interns = useLoad(() => api.get('/api/v1/applications/company').then((r) => r.data.filter((a) => a.status === 'ACCEPTED')));
  const logs = useLoad(() => api.get('/api/v1/logs/review').then((r) => r.data));
  const [selected, setSelected] = useState(null);

  const refresh = () => { interns.reload(); logs.reload(); };

  return (
    <>
      <PageHeader title="Interns and grading" subtitle="Approve daily logs, record feedback and ratings, and mark internships complete." />
      <Async q={interns}>
        {(list) => {
          if (list.length === 0) return <Empty title="No accepted interns" hint="Accept an applicant and they will show up here." />;
          const current = list.find((a) => a.id === selected) || list[0];
          const myLogs = (logs.data || []).filter((l) => l.applicationId === current.id);
          const pendingFor = (id) => (logs.data || []).filter((l) => l.applicationId === id && l.status === 'PENDING').length;
          return (
            <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
              <ul className="divide-y divide-rule self-start border-y border-rule bg-white" aria-label="Interns">
                {list.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelected(a.id)}
                      aria-current={a.id === current.id}
                      className={`w-full px-4 py-3 text-left hover:bg-paper ${a.id === current.id ? 'border-l-4 border-hl bg-paper' : 'border-l-4 border-transparent'}`}
                    >
                      <p className="font-semibold">{a.internName}</p>
                      <p className="text-sm text-ink/70">{a.listingTitle}</p>
                      <p className="mt-1 text-xs text-ink/70">
                        {a.completed ? 'Completed' : `${pendingFor(a.id)} log${pendingFor(a.id) === 1 ? '' : 's'} to review`}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
              <InternPanel key={current.id} app={current} logs={myLogs} onChange={refresh} />
            </div>
          );
        }}
      </Async>
    </>
  );
}

function InternPanel({ app, logs, onChange }) {
  const [notes, setNotes] = useState({});
  const [eval_, setEval] = useState({ rating: app.rating || 0, feedback: '', completed: false });
  const [msg, setMsg] = useState({ kind: 'error', text: '' });
  const [busy, setBusy] = useState(false);

  async function review(log, status) {
    setMsg({ kind: 'error', text: '' });
    try {
      await api.patch(`/api/v1/logs/${log.id}/review`, { status, mentorNotes: notes[log.id] || '' });
      onChange();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    }
  }

  async function saveEvaluation(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: 'error', text: '' });
    try {
      await api.patch(`/api/v1/applications/${app.id}/evaluation`, {
        rating: eval_.rating || null, feedback: eval_.feedback, completed: eval_.completed,
      });
      setMsg({ kind: 'success', text: eval_.completed ? 'Internship marked complete. The student can now download a certificate.' : 'Evaluation saved.' });
      setEval((x) => ({ ...x, feedback: '', completed: false }));
      onChange();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-10">
      <Notice kind={msg.kind}>{msg.text}</Notice>
      <div>
        <h2 className="mb-3 font-display text-xl font-semibold">Daily logs from {app.internName}</h2>
        {logs.length === 0 ? (
          <Empty title="No logs submitted" />
        ) : (
          <ul className="divide-y divide-rule border-y border-rule bg-white">
            {logs.map((l) => (
              <li key={l.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{fmtDate(l.date)}</p>
                  <Stamp status={l.status} />
                </div>
                <p className="mt-1 whitespace-pre-line">{l.tasksCompleted}</p>
                {l.status === 'PENDING' ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <input aria-label="Mentor notes" placeholder="Notes for the intern (optional)" className={`${inputCls} max-w-sm`} value={notes[l.id] || ''} onChange={(e) => setNotes((n) => ({ ...n, [l.id]: e.target.value }))} />
                    <Button onClick={() => review(l, 'APPROVED')}><Check size={16} /> Approve</Button>
                    <Button variant="ghost" onClick={() => review(l, 'REJECTED')}><X size={16} /> Return</Button>
                  </div>
                ) : (
                  l.mentorNotes && <p className="mt-1 text-sm"><span className="font-semibold">Your notes:</span> {l.mentorNotes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-xl font-semibold">Performance</h2>
        {app.feedback && <p className="mb-4 whitespace-pre-line border-l-4 border-hl pl-4 text-sm">{app.feedback}</p>}
        {app.completed ? (
          <p className="font-medium text-pine">Completed with a rating of {app.rating} out of 5.</p>
        ) : (
          <form onSubmit={saveEvaluation} className="max-w-xl space-y-4 rounded-sm border border-ink bg-white p-5">
            <fieldset>
              <legend className="mb-1 text-sm font-medium">Rating</legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky ${eval_.rating === n ? 'border-ink bg-hl' : 'border-rule bg-white hover:bg-paper'}`}>
                    <input type="radio" name="rating" className="sr-only" checked={eval_.rating === n} onChange={() => setEval((x) => ({ ...x, rating: n }))} />
                    {n}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Weekly or monthly feedback">
              <textarea rows={3} className={inputCls} value={eval_.feedback} onChange={(e) => setEval((x) => ({ ...x, feedback: e.target.value }))} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={eval_.completed} onChange={(e) => setEval((x) => ({ ...x, completed: e.target.checked }))} />
              Mark this internship complete and issue a certificate
            </label>
            <Button type="submit" disabled={busy}>{busy ? 'Saving' : 'Save evaluation'}</Button>
          </form>
        )}
      </div>
    </section>
  );
}
