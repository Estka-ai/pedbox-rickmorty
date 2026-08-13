import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PortalMark } from './PortalMark';

const NAV_LINKS = [
  { to: '/characters', label: 'Personajes' },
  { to: '/locations', label: 'Ubicaciones' },
  { to: '/episodes', label: 'Episodios' },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <PortalMark className="h-6 w-6" />
            PedBox — Rick and Morty
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-800"
          >
            Cerrar sesión
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                  isActive
                    ? 'bg-portal-500/10 text-portal-400 ring-1 ring-inset ring-portal-500/30'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-4 xl:max-w-7xl 2xl:max-w-[100rem]">
        {children}
      </main>
    </div>
  );
}
