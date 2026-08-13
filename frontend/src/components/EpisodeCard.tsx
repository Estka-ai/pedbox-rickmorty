import { Link } from 'react-router-dom';
import type { EpisodeSummary } from '../api/types';

export function EpisodeCard({ episode }: { episode: EpisodeSummary }) {
  return (
    <Link
      to={`/episodes/${episode.id}`}
      title={episode.name}
      className="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-portal-700/60 hover:shadow-[0_0_0_1px_rgba(132,204,22,0.15),0_8px_24px_-8px_rgba(132,204,22,0.25)]"
    >
      <span className="font-mono text-xs text-portal-500">
        {episode.code}
      </span>
      <p className="truncate text-sm font-medium text-neutral-100">
        {episode.name}
      </p>
      <p className="text-xs text-neutral-400">{episode.airDate ?? 'unknown'}</p>
    </Link>
  );
}
