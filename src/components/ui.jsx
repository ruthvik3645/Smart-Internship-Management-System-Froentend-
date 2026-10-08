import { Loader2 } from 'lucide-react';

export const BRAND = 'Internlog';

const STAMPS = {
  PENDING: ['Pending', 'text-wait border-wait bg-wait/10'],
  SHORTLISTED: ['Shortlisted', 'text-sky border-sky bg-sky/10'],
  INTERVIEW_SCHEDULED: ['Interview scheduled', 'text-sky border-sky bg-sky/10'],
  ACCEPTED: ['Accepted', 'text-pine border-pine bg-pine/10'],
  REJECTED: ['Rejected', 'text-brick border-brick bg-brick/10'],
  APPROVED: ['Approved', 'text-pine border-pine bg-pine/10'],
  OPEN: ['Open', 'text-pine border-pine bg-pine/10'],
  ARCHIVED: ['Archived', 'text-ink/60 border-ink/40 bg-ink/5'],
  ACTIVE: ['Active', 'text-pine border-pine bg-pine/10'],
  LOCKED: ['Locked', 'text-brick border-brick bg-brick/10'],
  COMPLETED: ['Completed', 'text-pine border-pine bg-pine/10'],
};

/** Status shown as a rubber stamp, the one recurring motif of the interface. */
export function Stamp({ status }) {
  const [label, cls] = STAMPS[status] || [status, STAMPS.ARCHIVED[1]];
  return (
    <span className={`inline-block -rotate-2 whitespace-nowrap rounded-sm border-[1.5px] px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

const variants = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  accent: 'bg-hl text-ink hover:brightness-95',
  ghost: 'border border-rule bg-white text-ink hover:bg-paper',
  danger: 'bg-brick text-white hover:brightness-110',
};

export function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    />
  );
}

export const inputCls = 'w-full rounded-md border border-rule bg-white px-3 py-2 text-sm placeholder:text-ink/40';
export const th = 'border-b-2 border-ink px-3 py-2 text-sm font-semibold';
export const td = 'border-b border-rule px-3 py-3 align-top text-sm';

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/60">{hint}</span>}
    </label>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-ink/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ kind = 'error', children }) {
  if (!children) return null;
  const tone = kind === 'error' ? 'border-brick text-brick bg-brick/5' : 'border-pine text-pine bg-pine/5';
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-md border px-3 py-2 text-sm ${tone}`}>
      {children}
    </p>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center gap-2 py-10 text-ink/60" role="status">
      <Loader2 className="animate-spin" size={18} /> Loading
    </div>
  );
}

export function Empty({ title, hint, children }) {
  return (
    <div className="rounded-md border border-dashed border-ink/30 px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">{hint}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/** Renders a useLoad() result: spinner, error, then children(data). */
export function Async({ q, children }) {
  if (q.loading && !q.data) return <Spinner />;
  if (q.error) return <Notice>{q.error}</Notice>;
  return children(q.data);
}

export function StatStrip({ items }) {
  return (
    <dl className="mb-8 flex flex-wrap border-y border-rule bg-white">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-[9rem] flex-1 border-l border-rule px-5 py-4 first:border-l-0">
          <dd className="font-display text-2xl font-bold leading-tight">{value}</dd>
          <dt className="mt-0.5 text-sm text-ink/70">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
