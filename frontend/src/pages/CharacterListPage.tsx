import { useEffect, useState } from 'react';
import { useCharacters } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CharacterCard } from '../components/CharacterCard';

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ['', 'Alive', 'Dead', 'unknown'] as const;

export function CharacterListPage() {
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handle = setTimeout(() => {
      setName(nameInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [nameInput]);

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  const { data, isLoading, isError, error, refetch } = useCharacters({
    page,
    limit: PAGE_SIZE,
    name: name || undefined,
    status: status || undefined,
  });

  return (
    <AppLayout>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === '' ? 'Todos los estados' : option}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <LoadingState label="Cargando personajes..." />}

      {isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {data && data.data.length === 0 && (
        <p className="py-16 text-center text-sm text-neutral-500">
          No se encontraron personajes con esos filtros.
        </p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.data.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-neutral-400">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-neutral-700 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span>
              Página {data.meta.page} de {data.meta.totalPages} (
              {data.meta.total} personajes)
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(data.meta.totalPages, p + 1))
              }
              disabled={page >= data.meta.totalPages}
              className="rounded-md border border-neutral-700 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </AppLayout>
  );
}
