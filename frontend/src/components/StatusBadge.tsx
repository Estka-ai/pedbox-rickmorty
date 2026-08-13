const STATUS_STYLES: Record<string, string> = {
  Alive: 'bg-portal-500/10 text-portal-400 ring-1 ring-inset ring-portal-500/30',
  Dead: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30',
  unknown:
    'bg-neutral-500/10 text-neutral-400 ring-1 ring-inset ring-neutral-500/30',
};

const STATUS_DOT: Record<string, string> = {
  Alive: 'bg-portal-400',
  Dead: 'bg-red-400',
  unknown: 'bg-neutral-400',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.unknown}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.unknown}`}
      />
      {status}
    </span>
  );
}
