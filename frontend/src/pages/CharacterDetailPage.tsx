import { Link, useParams } from 'react-router-dom';
import { useCharacter } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { StatusBadge } from '../components/StatusBadge';

export function CharacterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError, error, refetch } = useCharacter(id);

  return (
    <AppLayout>
      <Link
        to="/characters"
        className="mb-4 inline-block text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Volver a la lista
      </Link>

      {!Number.isFinite(id) && (
        <ErrorState message="Id de personaje inválido." />
      )}

      {Number.isFinite(id) && isLoading && (
        <LoadingState label="Cargando personaje..." />
      )}

      {Number.isFinite(id) && isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {data && (
        <div className="flex flex-col gap-4 sm:flex-row">
          {data.image && (
            <img
              src={data.image}
              alt={data.name}
              className="h-48 w-48 self-center rounded-lg object-cover sm:self-start"
            />
          )}

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-neutral-100">
              {data.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
              <StatusBadge status={data.status} />
              <span>
                {data.species ?? 'unknown'} · {data.gender ?? 'unknown'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Origen
                </p>
                <p className="mt-1 text-sm text-neutral-200">
                  {data.origin?.name ?? 'Desconocido'}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Ubicación actual
                </p>
                <p className="mt-1 text-sm text-neutral-200">
                  {data.location?.name ?? 'Desconocida'}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                Episodios ({data.episodes.length})
              </p>
              <ul className="flex flex-col gap-1.5">
                {data.episodes.map((episode) => (
                  <li
                    key={episode.id}
                    className="flex items-baseline gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm"
                  >
                    <span className="font-mono text-xs text-portal-500">
                      {episode.code}
                    </span>
                    <span className="truncate text-neutral-300">
                      {episode.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
