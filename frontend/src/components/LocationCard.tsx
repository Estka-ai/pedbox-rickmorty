import { Link } from 'react-router-dom';
import type { LocationSummary } from '../api/types';

export function LocationCard({ location }: { location: LocationSummary }) {
  return (
    <Link
      to={`/locations/${location.id}`}
      title={location.name}
      className="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-portal-700/60 hover:shadow-[0_0_0_1px_rgba(132,204,22,0.15),0_8px_24px_-8px_rgba(132,204,22,0.25)]"
    >
      <p className="truncate text-sm font-medium text-neutral-100">
        {location.name}
      </p>
      <p className="text-xs text-neutral-400">
        {location.type || 'unknown'} · {location.dimension || 'unknown'}
      </p>
    </Link>
  );
}
