import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, ClipboardCheck, Download, FileText, LayoutDashboard, LogOut, Menu, NotebookPen, Search, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from './ui';

const NAV = {
  STUDENT: [
    ['/student', 'Overview', LayoutDashboard, true],
    ['/student/internships', 'Find internships', Search],
    ['/student/applications', 'My applications', FileText],
    ['/student/logs', 'Daily logs', NotebookPen],
  ],
  COMPANY: [
    ['/company/postings', 'Postings', Briefcase],
    ['/company/applicants', 'Applicants', Users],
    ['/company/interns', 'Interns and grading', ClipboardCheck],
  ],
  ADMIN: [
    ['/admin', 'Overview', LayoutDashboard, true],
    ['/admin/users', 'Users', Users],
    ['/admin/reports', 'Reports', Download],
  ],
};
const ROLE_LABEL = { STUDENT: 'Student', COMPANY: 'Company', ADMIN: 'Administrator' };

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    logout();
    nav('/login', { replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rule bg-paper px-4 py-3 md:hidden">
        <span className="font-display text-lg font-bold">{BRAND}</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-md p-2 hover:bg-white">
          <Menu size={22} />
        </button>
      </header>

      {open && <div className="fixed inset-0 z-30 bg-ink/50 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink px-4 py-5 text-white transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <span className="font-display text-2xl font-bold">{BRAND}</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-1 hover:bg-white/10 md:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV[user.role].map(([to, label, Icon, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-hl text-ink' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/15 pt-4">
          <p className="truncate px-2 text-sm font-semibold">{user.name}</p>
          <p className="px-2 text-xs text-white/60">{ROLE_LABEL[user.role]}</p>
          <button onClick={signOut} className="mt-3 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <main className="px-4 py-8 md:ml-64 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
