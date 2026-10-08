import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { daysUntil, fmtDate, useLoad } from '../../lib';
import { Async, Empty, PageHeader, Stamp, StatStrip } from '../../components/ui';

const ACTIVE = ['PENDING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED'];

export default function Dashboard() {
  const { user } = useAuth();
  const q = useLoad(async () => {
    const [apps, listings, logs] = await Promise.all([
      api.get('/api/v1/applications/mine'),
      api.get('/api/v1/internships'),
      api.get('/api/v1/logs/mine'),
    ]);
    return { apps: apps.data, listings: listings.data, logs: logs.data };
  });

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Where your applications and internship stand today." />
      <Async q={q}>
        {({ apps, listings, logs }) => {
          const current = apps.find((a) => a.status === 'ACCEPTED' && !a.completed);
          const applied = new Set(apps.map((a) => a.listingId));
          const deadlines = listings
            .filter((l) => l.deadline && !applied.has(l.id) && daysUntil(l.deadline) >= 0 && daysUntil(l.deadline) <= 21)
            .sort((a, b) => a.deadline.localeCompare(b.deadline));
          const withFeedback = apps.filter((a) => a.feedback);

          return (
            <>
              <StatStrip
                items={[
                  ['Active applications', apps.filter((a) => ACTIVE.includes(a.status)).length],
                  ['Current internship', current ? current.listingTitle : 'None yet'],
                  ['Logs awaiting approval', logs.filter((l) => l.status === 'PENDING').length],
                  ['Completed', apps.filter((a) => a.completed).length],
                ]}
              />
              <div className="grid gap-10 md:grid-cols-2">
                <section>
                  <h2 className="mb-3 font-display text-xl font-semibold">Deadlines in the next three weeks</h2>
                  {deadlines.length === 0 ? (
                    <Empty title="Nothing closing soon" hint="Open roles you haven't applied to will show here as their deadlines approach.">
                      <Link to="/student/internships" className="text-sm font-semibold underline">Browse internships</Link>
                    </Empty>
                  ) : (
                    <ul className="divide-y divide-rule border-y border-rule">
                      {deadlines.map((l) => (
                        <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                          <div>
                            <p className="font-semibold">{l.title}</p>
                            <p className="text-sm text-ink/70">{l.companyName}, closes {fmtDate(l.deadline)}</p>
                          </div>
                          <span className="text-sm font-semibold">{daysUntil(l.deadline) === 0 ? 'Today' : `${daysUntil(l.deadline)} days`}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
                <section>
                  <h2 className="mb-3 font-display text-xl font-semibold">Evaluation feedback</h2>
                  {withFeedback.length === 0 ? (
                    <Empty title="No feedback yet" hint="Comments and ratings from your mentor will appear here." />
                  ) : (
                    <ul className="space-y-4">
                      {withFeedback.map((a) => (
                        <li key={a.id} className="border-l-4 border-hl pl-4">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">{a.listingTitle}</p>
                            {a.rating && <span className="text-sm text-ink/70">Rating {a.rating} of 5</span>}
                            {a.completed && <Stamp status="COMPLETED" />}
                          </div>
                          <p className="mt-1 whitespace-pre-line text-sm text-ink/80">{a.feedback}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
