export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-neutral-400">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-portal-500"
        role="status"
        aria-label={label}
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
