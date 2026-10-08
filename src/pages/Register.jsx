import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { Button, Field, Notice, inputCls } from '../components/ui';
import { errMsg } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { homePath } from '../lib';

const ROLES = [
  ['STUDENT', 'Student', 'Apply to internships and log your work'],
  ['COMPANY', 'Company', 'Post roles and review interns'],
];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    role: params.get('role') === 'COMPANY' ? 'COMPANY' : 'STUDENT',
    name: '', email: '', password: '', skills: '',
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isCompany = form.role === 'COMPANY';

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await register(form);
      if (data.token) nav(homePath(data.user.role), { replace: true });
      else setDone(data.message);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthShell title="Check back soon" footer={<Link to="/login" className="font-semibold underline">Back to sign in</Link>}>
        <Notice kind="success">{done}</Notice>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      footer={<>Already registered? <Link to="/login" className="font-semibold underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Notice>{error}</Notice>
        <fieldset>
          <legend className="mb-1 text-sm font-medium">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(([value, label, hint]) => (
              <label key={value} className="cursor-pointer rounded-md border border-rule bg-white p-3 has-[:checked]:border-ink has-[:checked]:bg-hl/30 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sky">
                <input type="radio" name="role" value={value} checked={form.role === value} onChange={set('role')} className="sr-only" />
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-ink/70">{hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field label={isCompany ? 'Company name' : 'Full name'}>
          <input required className={inputCls} value={form.name} onChange={set('name')} />
        </Field>
        <Field label="Email">
          <input type="email" required autoComplete="email" className={inputCls} value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Password" hint="At least 6 characters.">
          <input type="password" required minLength={6} autoComplete="new-password" className={inputCls} value={form.password} onChange={set('password')} />
        </Field>
        {!isCompany && (
          <Field label="Skills" hint="Separate with commas. Companies filter applicants by these.">
            <input className={inputCls} placeholder="Java, React, SQL" value={form.skills} onChange={set('skills')} />
          </Field>
        )}
        {isCompany && <p className="text-sm text-ink/70">Company accounts are reviewed by an administrator before you can sign in.</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Creating account' : 'Create account'}</Button>
      </form>
    </AuthShell>
  );
}
