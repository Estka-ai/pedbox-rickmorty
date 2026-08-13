import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { ErrorState } from '../components/ErrorState';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (data) => {
      login(data.access_token);
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? '/characters';
      navigate(from, { replace: true });
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-neutral-400">
          PedBox — Rick and Morty
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-neutral-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-neutral-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
            />
          </div>

          {mutation.isError && (
            <ErrorState message={getErrorMessage(mutation.error)} />
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-portal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-portal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-portal-500 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
