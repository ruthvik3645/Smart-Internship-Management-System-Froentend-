import { useState } from 'react';
import api, { errMsg } from '../../api/client';
import { fmtDate, fmtMoney, useLoad, daysUntil } from '../../lib';
import { Async, Button, Empty, Field, Notice, PageHeader, inputCls } from '../../components/ui';

export default function Browse() {
  const listings = useLoad(() => api.get('/api/v1/internships').then((r) => r.data));
  const apps = useLoad(() => api.get('/api/v1/applications/mine').then((r) => r.data));
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [resume, setResume] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ kind: 'error', text: '' });

  async function apply(e, listing) {
    e.preventDefault();
    setBusy(true);
    setMsg({ kind: 'error', text: '' });
    try {
      await api.post('/api/v1/applications', { listingId: listing.id, resumeUrl: resume });
      setMsg({ kind: 'success', text: `Application sent to ${listing.companyName} for ${listing.title}.` });
      setOpenId(null);
      setResume('');
      apps.reload();
    } catch (err) {
      setMsg({ kind: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Find internships" subtitle="Open roles from approved companies." />
      <div className="mb-4 space-y-3">
        <Notice kind={msg.kind}>{msg.text}</Notice>
        <input
          type="search"
          aria-label="Search internships"
          placeholder="Search by title, company or requirement"
          className={`${inputCls} max-w-md`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Async q={listings}>
        {(all) => {
          const applied = new Set((apps.data || []).map((a) => a.listingId));
          const term = search.trim().toLowerCase();
          const shown = all.filter((l) =>
            [l.title, l.companyName, l.requirements, l.description].some((v) => (v || '').toLowerCase().includes(term)),
          );
          if (shown.length === 0) return <Empty title="No internships match" hint="Try a different search, or check back when companies post new roles." />;
          return (
            <ul className="divide-y divide-rule border-y border-rule bg-white">
              {shown.map((l) => {
                const closed = l.deadline && daysUntil(l.deadline) < 0;
                return (
                  <li key={l.id} className="px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-xl font-semibold">{l.title}</h2>
                        <p className="text-sm text-ink/70">{l.companyName}</p>
                      </div>
                      {applied.has(l.id) ? (
                        <span className="text-sm font-semibold text-pine">Applied</span>
                      ) : closed ? (
                        <span className="text-sm font-semibold text-brick">Closed</span>
                      ) : (
                        <Button variant="accent" onClick={() => { setOpenId(openId === l.id ? null : l.id); setResume(''); setMsg({ kind: 'error', text: '' }); }}>
                          Apply
                        </Button>
                      )}
                    </div>
                    {l.description && <p className="mt-3 max-w-3xl">{l.description}</p>}
                    <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                      <div><dt className="inline text-ink/60">Stipend </dt><dd className="inline font-medium">{fmtMoney(l.stipend)}</dd></div>
                      <div><dt className="inline text-ink/60">Duration </dt><dd className="inline font-medium">{l.duration || 'Not set'}</dd></div>
                      <div><dt className="inline text-ink/60">Apply by </dt><dd className="inline font-medium">{fmtDate(l.deadline)}</dd></div>
                    </dl>
                    {l.requirements && <p className="mt-2 text-sm text-ink/80"><span className="font-medium">Requirements:</span> {l.requirements}</p>}
                    {openId === l.id && (
                      <form onSubmit={(e) => apply(e, l)} className="mt-4 flex max-w-xl flex-wrap items-end gap-3 border-t border-rule pt-4">
                        <div className="min-w-[16rem] flex-1">
                          <Field label="Resume link" hint="Share a link to your resume (Drive, Dropbox or a portfolio page).">
                            <input required type="url" placeholder="https://" className={inputCls} value={resume} onChange={(e) => setResume(e.target.value)} />
                          </Field>
                        </div>
                        <Button type="submit" disabled={busy}>{busy ? 'Sending' : 'Send application'}</Button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          );
        }}
      </Async>
    </>
  );
}
