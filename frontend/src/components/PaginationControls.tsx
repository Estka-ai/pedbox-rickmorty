import type { PaginationMeta } from '../api/types';

export function PaginationControls({
  meta,
  itemLabel,
  onPageChange,
}: {
  meta: PaginationMeta;
  itemLabel: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-sm text-neutral-400 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, meta.page - 1))}
        disabled={meta.page <= 1}
        className="whitespace-nowrap rounded-full border border-neutral-700 px-4 py-1.5 font-medium transition hover:border-portal-700 hover:text-portal-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-700 disabled:hover:text-neutral-400"
      >
        ← Anterior
      </button>
      <span className="text-center text-neutral-500">
        Página{' '}
        <span className="font-semibold text-neutral-200">{meta.page}</span>{' '}
        de {meta.totalPages} ({meta.total} {itemLabel})
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(meta.totalPages, meta.page + 1))}
        disabled={meta.page >= meta.totalPages}
        className="whitespace-nowrap rounded-full border border-neutral-700 px-4 py-1.5 font-medium transition hover:border-portal-700 hover:text-portal-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-700 disabled:hover:text-neutral-400"
      >
        Siguiente →
      </button>
    </div>
  );
}
