import { useCallback, useEffect, useState } from 'react';
import { errMsg } from './api/client';

export const homePath = (role) => ({ STUDENT: '/student', COMPANY: '/company/postings', ADMIN: '/admin' }[role] || '/login');

export const APP_STATUSES = [
  ['PENDING', 'Pending'],
  ['SHORTLISTED', 'Shortlisted'],
  ['INTERVIEW_SCHEDULED', 'Interview scheduled'],
  ['ACCEPTED', 'Accepted'],
  ['REJECTED', 'Rejected'],
];

const localISO = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const today = () => localISO(new Date());

export const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

export const fmtMoney = (n) => (n ? `₹${Number(n).toLocaleString('en-IN')} a month` : 'Unpaid');

export const daysUntil = (d) => Math.round((new Date(`${d}T00:00:00`) - new Date(`${today()}T00:00:00`)) / 86400000);

/** Loads data on mount and exposes reload(). `fn` must only depend on `deps`. */
export function useLoad(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      setState({ data: await fn(), loading: false, error: '' });
    } catch (e) {
      setState({ data: null, loading: false, error: errMsg(e) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    reload();
  }, [reload]);
  return { ...state, reload };
}
