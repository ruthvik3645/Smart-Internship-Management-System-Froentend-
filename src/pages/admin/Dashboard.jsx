import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useLoad } from '../../lib';
import { Async, PageHeader, StatStrip } from '../../components/ui';

export default function Dashboard() {
  const q = useLoad(() => api.get('/api/v1/admin/stats').then((r) => r.data));
  return (
    <>
      <PageHeader title="Overview" subtitle="How the internship programme is doing across the system." />
      <Async q={q}>
        {(s) => (
          <>
            <StatStrip
              items={[
                ['Interns', s.totalInterns],
                ['Companies', s.totalCompanies],
                ['Active listings', s.activeListings],
                ['Applications', s.totalApplications],
              ]}
            />
            {s.pendingCompanies > 0 && (
              <p className="mb-8 rounded-md border border-wait bg-wait/10 px-4 py-3 text-sm">
                {s.pendingCompanies} company {s.pendingCompanies === 1 ? 'account is' : 'accounts are'} waiting for approval.{' '}
                <Link to="/admin/users" className="font-semibold underline">Review accounts</Link>
              </p>
            )}
            <section className="max-w-xl">
              <h2 className="font-display text-xl font-semibold">Completion rate</h2>
              <p className="mt-1 text-sm text-ink/70">
                {s.completedInterns} of {s.acceptedInterns} accepted interns have completed their internship.
              </p>
              <div className="mt-3 h-4 overflow-hidden rounded-sm border border-ink bg-white" role="img" aria-label={`Completion rate ${s.completionRate} percent`}>
                <div className="h-full bg-pine" style={{ width: `${s.completionRate}%` }} />
              </div>
              <p className="mt-2 font-display text-3xl font-bold">{s.completionRate}%</p>
            </section>
          </>
        )}
      </Async>
    </>
  );
}
