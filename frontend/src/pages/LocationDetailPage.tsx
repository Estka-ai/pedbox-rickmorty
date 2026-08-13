import { Link, useParams } from 'react-router-dom';
import { useLocation } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CharacterCard } from '../components/CharacterCard';

export function LocationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, isLoading, isError, error, refetch } = useLocation(id);

  return (
    <AppLayout>
      <Link
        to="/locations"
        className="mb-4 inline-block text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Volver a ubicaciones
      </Link>

      {!Number.isFinite(id) && (
        <ErrorState message="Id de ubicación inválido." />
      )}

      {Number.isFinite(id) && isLoading && (
        <LoadingState label="Cargando ubicación..." />
      )}

      {Number.isFinite(id) && isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {data && (
        <div>
          <h1 className="text-xl font-semibold text-neutral-100">
            {data.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            {data.type || 'unknown'} · {data.dimension || 'unknown'}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
              Residentes ({data.residents.length})
            </p>
            {data.residents.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No hay personajes registrados en esta ubicación.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {data.residents.map((character) => (
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
