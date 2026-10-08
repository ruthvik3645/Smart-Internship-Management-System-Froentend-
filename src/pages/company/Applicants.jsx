import { useState } from 'react';
import api, { errMsg } from '../../api/client';
import { APP_STATUSES, fmtDate, useLoad } from '../../lib';
import { Async, Empty, Notice, PageHeader, inputCls, td, th } from '../../components/ui';

export default function Applicants() {
  const q = useLoad(() => api.get('/api/v1/applications/company').then((r) => r.data));
  const [text, setText] = useState('');
  const [skill, setSkill] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function change(a, next) {
    setError('');
    try {
      await api.patch(`/api/v1/applications/${a.id}/status`, { status: next });
      q.reload();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <PageHeader title="Applicants" subtitle="Review applications and move each candidate through your hiring steps." />
      <div className="mb-4 flex flex-wrap gap-3">
        <input aria-label="Search by name or role" placeholder="Search name or role" className={`${inputCls} max-w-56`} value={text} onChange={(e) => setText(e.target.value)} />
        <input aria-label="Filter by skill" placeholder="Filter by skill" className={`${inputCls} max-w-56`} value={skill} onChange={(e) => setSkill(e.target.value)} />
        <select aria-label="Filter by status" className={`${inputCls} max-w-56`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {APP_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="mb-4"><Notice>{error}</Notice></div>
      <Async q={q}>
        {(all) => {
          const t = text.trim().toLowerCase();
          const s = skill.trim().toLowerCase();
          const shown = all.filter(
            (a) =>
              (!t || a.internName.toLowerCase().includes(t) || a.listingTitle.toLowerCase().includes(t)) &&
              (!s || (a.internSkills || '').toLowerCase().includes(s)) &&
              (!status || a.status === status),
          );
          if (all.length === 0) return <Empty title="No applicants yet" hint="Applications to your postings will appear here." />;
          if (shown.length === 0) return <Empty title="No applicants match these filters" />;
          return (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr><th className={th}>Candidate</th><th className={th}>Role</th><th className={th}>Skills</th><th className={th}>Applied</th><th className={th}>Status</th></tr>
                </thead>
                <tbody>
                  {shown.map((a) => (
                    <tr key={a.id}>
                      <td className={td}>
                        <p className="font-semibold">{a.internName}</p>
                        <p className="text-ink/70">{a.internEmail}</p>
                        <a href={a.resumeUrl} target="_blank" rel="noreferrer noopener" className="font-medium text-sky underline">Resume</a>
                      </td>
                      <td className={td}>{a.listingTitle}</td>
                      <td className={`${td} max-w-[14rem]`}>{a.internSkills || 'Not listed'}</td>
                      <td className={td}>{fmtDate(a.appliedDate)}</td>
                      <td className={td}>
                        <select aria-label={`Status for ${a.internName}`} className={inputCls} value={a.status} disabled={a.completed} onChange={(e) => change(a, e.target.value)}>
                          {APP_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }}
      </Async>
    </>
  );
}
