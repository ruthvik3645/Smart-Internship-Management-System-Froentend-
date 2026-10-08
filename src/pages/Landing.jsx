import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homePath } from '../lib';
import { BRAND, Stamp } from '../components/ui';

const ROLES = [
  ['Students', 'Browse open roles, apply with a resume link, log each working day and download a certificate when the internship ends.'],
  ['Companies', 'Post internships, move applicants from pending to accepted, approve daily logs and grade performance.'],
  ['Administrators', 'Approve company accounts, lock or unlock users and export applications and logs as CSV or PDF.'],
];

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to={homePath(user.role)} replace />;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold">{BRAND}</span>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link to="/login" className="rounded-md px-3 py-2 hover:bg-white">Sign in</Link>
          <Link to="/register" className="rounded-md bg-ink px-3.5 py-2 text-white hover:bg-ink-soft">Create account</Link>
        </nav>
      </header>

      <main className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section>
          <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl">
            Every internship, from first application to signed certificate.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/75">
            Students apply and log their days. Companies review applicants and approve each entry. Administrators see the whole programme finish on time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-md bg-hl px-5 py-3 font-semibold text-ink hover:brightness-95">Find an internship</Link>
            <Link to="/register?role=COMPANY" className="rounded-md border border-ink px-5 py-3 font-semibold hover:bg-white">Post an opening</Link>
          </div>
        </section>

        <section aria-label="Sample logbook page" className="rotate-[0.6deg] rounded-sm border border-ink bg-white shadow-[8px_8px_0_var(--color-ink)]">
          <div className="border-b-2 border-ink px-5 py-3">
            <p className="font-display text-lg font-bold">Backend Engineering Intern</p>
            <p className="text-sm text-ink/60">Week 3 logbook at TechCorp</p>
          </div>
          <ul className="ruled px-5 pb-4">
            {[
              ['Mon', 'Wrote integration tests for the payments client.', 'APPROVED'],
              ['Tue', 'Fixed a pagination bug in the orders endpoint.', 'APPROVED'],
              ['Wed', 'Started the migration script for the user table.', 'PENDING'],
            ].map(([day, text, status]) => (
              <li key={day} className="flex min-h-[56px] items-start justify-between gap-4 pt-0">
                <p><span className="font-semibold">{day}</span> {text}</p>
                <Stamp status={status} />
              </li>
            ))}
          </ul>
          <p className="border-t border-rule px-5 py-3 text-sm">
            <span className="font-semibold">Mentor:</span> <mark className="bg-hl px-1">Good catch on the off-by-one.</mark> Add a regression test.
          </p>
        </section>

        <dl className="divide-y divide-rule border-y border-rule lg:col-span-2">
          {ROLES.map(([who, what]) => (
            <div key={who} className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
              <dt className="font-display text-xl font-semibold">{who}</dt>
              <dd className="max-w-2xl text-ink/75">{what}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
