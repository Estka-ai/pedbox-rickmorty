export function ErrorState({
  message = 'Ocurrió un error inesperado.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-10 text-center">
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-red-800 px-4 py-1.5 text-sm text-red-200 transition hover:bg-red-900/40"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
