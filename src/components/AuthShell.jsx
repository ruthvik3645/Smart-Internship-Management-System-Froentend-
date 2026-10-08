import { Link } from 'react-router-dom';
import { BRAND } from './ui';

export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="hidden flex-col justify-between bg-ink p-10 text-white lg:flex">
        <Link to="/" className="font-display text-2xl font-bold">{BRAND}</Link>
        <p className="max-w-sm font-display text-3xl font-semibold leading-snug">
          Log the day. Get it approved. Finish with a certificate.
        </p>
        <p className="text-sm text-white/60">Smart Internship Management System</p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 block font-display text-xl font-bold lg:hidden">{BRAND}</Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-ink/70">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-sm text-ink/70">{footer}</p>
        </div>
      </main>
    </div>
  );
}
