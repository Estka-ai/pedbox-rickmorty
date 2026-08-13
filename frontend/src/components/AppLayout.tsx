import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AppLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-4 py-3 backdrop-blur">
        <span className="text-sm font-semibold tracking-tight">
          PedBox — Rick and Morty
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-800"
        >
          Cerrar sesión
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>
    </div>
  );
}
