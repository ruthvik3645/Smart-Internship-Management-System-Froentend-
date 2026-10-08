import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { Button, Field, Notice, inputCls } from '../components/ui';
import { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { homePath } from '../lib';

const DEMOS = [
  ['Student', 'student@univ.edu', 'student123'],
  ['Company', 'hr@techcorp.com', 'company123'],
  ['Admin', 'admin@system.com', 'admin123'],
];

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      nav(homePath(user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use the email you registered with."
      footer={<>New here? <Link to="/register" className="font-semibold underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Notice>{error}</Notice>
        <Field label="Email">
          <input type="email" required autoComplete="email" className={inputCls} value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Password">
          <input type="password" required autoComplete="current-password" className={inputCls} value={form.password} onChange={set('password')} />
        </Field>
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Signing in' : 'Sign in'}</Button>
      </form>

      <div className="mt-8 border-t border-rule pt-4">
        <p className="mb-2 text-sm font-medium">Fill in a demo account</p>
        <div className="flex flex-wrap gap-2">
          {DEMOS.map(([label, email, password]) => (
            <Button key={label} type="button" variant="ghost" onClick={() => setForm({ email, password })}>{label}</Button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}
