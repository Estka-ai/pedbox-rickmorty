import { Link, useParams } from 'react-router-dom';
import { useEpisode } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CharacterCard } from '../components/CharacterCard';

export function EpisodeDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError, error, refetch } = useEpisode(id);

  return (
    <AppLayout>
      <Link
        to="/episodes"
        className="mb-4 inline-block text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Volver a episodios
      </Link>

      {!Number.isFinite(id) && (
        <ErrorState message="Id de episodio inválido." />
      )}

      {Number.isFinite(id) && isLoading && (
        <LoadingState label="Cargando episodio..." />
      )}

      {Number.isFinite(id) && isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {data && (
        <div>
          <span className="font-mono text-xs text-portal-500">
            {data.code}
          </span>
          <h1 className="text-xl font-semibold text-neutral-100">
            {data.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {data.airDate ?? 'Fecha desconocida'}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
              Personajes ({data.characters.length})
            </p>
            {data.characters.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No hay personajes registrados en este episodio.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.characters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
