import { useEffect, useState } from 'react';
import { useLocations } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { LocationCard } from '../components/LocationCard';
import { PaginationControls } from '../components/PaginationControls';

const PAGE_SIZE = 20;

export function LocationsListPage() {
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handle = setTimeout(() => {
      setName(nameInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [nameInput]);

  const { data, isLoading, isError, error, refetch } = useLocations({
    page,
    limit: PAGE_SIZE,
    name: name || undefined,
  });

  return (
    <AppLayout>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
      />

      {isLoading && <LoadingState label="Cargando ubicaciones..." />}

      {isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {data && data.data.length === 0 && (
        <p className="py-16 text-center text-sm text-neutral-500">
          No se encontraron ubicaciones con ese nombre.
        </p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.data.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
          <PaginationControls
            meta={data.meta}
            itemLabel="ubicaciones"
            onPageChange={setPage}
          />
        </>
      )}
    </AppLayout>
  );
}
