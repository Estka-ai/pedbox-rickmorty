import { useEffect, useState } from 'react';
import { useCharacters } from '../api/hooks';
import { getErrorMessage } from '../api/client';
import { AppLayout } from '../components/AppLayout';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { CharacterCard } from '../components/CharacterCard';
import { PaginationControls } from '../components/PaginationControls';
import type { SortableField, SortOrder } from '../api/types';

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ['', 'Alive', 'Dead', 'unknown'] as const;

const SORT_OPTIONS: {
  value: string;
  label: string;
  sortBy: SortableField;
  order: SortOrder;
}[] = [
  { value: 'id-asc', label: 'Orden por defecto', sortBy: 'id', order: 'asc' },
  { value: 'name-asc', label: 'Nombre (A-Z)', sortBy: 'name', order: 'asc' },
  { value: 'name-desc', label: 'Nombre (Z-A)', sortBy: 'name', order: 'desc' },
  { value: 'status-asc', label: 'Estado (A-Z)', sortBy: 'status', order: 'asc' },
  {
    value: 'species-asc',
    label: 'Especie (A-Z)',
    sortBy: 'species',
    order: 'asc',
  },
];

export function CharacterListPage() {
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);
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

  function handleSortChange(value: string) {
    setSortValue(value);
    setPage(1);
  }

  const selectedSort =
    SORT_OPTIONS.find((option) => option.value === sortValue) ??
    SORT_OPTIONS[0];

  const { data, isLoading, isError, error, refetch } = useCharacters({
    page,
    limit: PAGE_SIZE,
    name: name || undefined,
    status: status || undefined,
    sortBy: selectedSort.sortBy,
    order: selectedSort.order,
  });

  return (
    <AppLayout>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
        />
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === '' ? 'Todos los estados' : option}
            </option>
          ))}
        </select>
        <select
          value={sortValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-portal-600"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {data.data.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>

          <PaginationControls
            meta={data.meta}
            itemLabel="personajes"
            onPageChange={setPage}
          />
        </>
      )}
    </AppLayout>
  );
}
