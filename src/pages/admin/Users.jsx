import { useState } from 'react';
import api, { errMsg } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLoad } from '../../lib';
import { Async, Button, Notice, PageHeader, Stamp, inputCls, td, th } from '../../components/ui';

export default function Users() {
  const { user: me } = useAuth();
  const q = useLoad(() => api.get('/api/v1/users').then((r) => r.data));
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  async function act(request) {
    setError('');
    try {
      await request();
      q.reload();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <PageHeader title="Users" subtitle="Approve company accounts, change roles and lock or unlock access." />
      <div className="mb-4 flex flex-wrap gap-3">
        <input aria-label="Search users" placeholder="Search name or email" className={`${inputCls} max-w-64`} value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Filter by role" className={`${inputCls} max-w-48`} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="STUDENT">Students</option>
          <option value="COMPANY">Companies</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>
      <div className="mb-4"><Notice>{error}</Notice></div>
      <Async q={q}>
        {(all) => {
          const t = search.trim().toLowerCase();
          const shown = all.filter((u) => (!role || u.role === role) && (!t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)));
          return (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr><th className={th}>User</th><th className={th}>Role</th><th className={th}>Status</th><th className={th}><span className="sr-only">Actions</span></th></tr>
                </thead>
                <tbody>
                  {shown.map((u) => {
                    const self = u.id === me.id;
                    return (
                      <tr key={u.id}>
                        <td className={td}><p className="font-semibold">{u.name}</p><p className="text-ink/70">{u.email}</p></td>
                        <td className={td}>
                          <select aria-label={`Role for ${u.name}`} className={inputCls} value={u.role} disabled={self}
                            onChange={(e) => act(() => api.patch(`/api/v1/users/${u.id}/role`, { role: e.target.value }))}>
                            <option value="STUDENT">Student</option>
                            <option value="COMPANY">Company</option>
                            <option value="ADMIN">Administrator</option>
                          </select>
                        </td>
                        <td className={td}><Stamp status={u.status} /></td>
                        <td className={td}>
                          <div className="flex gap-2">
                            {u.status === 'PENDING' && <Button variant="accent" onClick={() => act(() => api.patch(`/api/v1/users/${u.id}/approve`))}>Approve</Button>}
                            {u.status === 'ACTIVE' && <Button variant="ghost" disabled={self} onClick={() => act(() => api.patch(`/api/v1/users/${u.id}/status`, { status: 'LOCKED' }))}>Lock</Button>}
                            {u.status === 'LOCKED' && <Button variant="ghost" onClick={() => act(() => api.patch(`/api/v1/users/${u.id}/status`, { status: 'ACTIVE' }))}>Unlock</Button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }}
      </Async>
    </>
  );
}
