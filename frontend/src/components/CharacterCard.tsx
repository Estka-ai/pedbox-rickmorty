import { Link } from 'react-router-dom';
import type { Character } from '../api/types';
import { StatusBadge } from './StatusBadge';

export function CharacterCard({ character }: { character: Character }) {
  return (
    <Link
      to={`/characters/${character.id}`}
      title={character.name}
      className="group flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3 transition hover:border-portal-700/60 hover:shadow-[0_0_0_1px_rgba(132,204,22,0.15),0_8px_24px_-8px_rgba(132,204,22,0.25)] sm:flex-col sm:items-stretch sm:gap-0 sm:p-0 sm:overflow-hidden"
    >
      {character.image && (
        <img
          src={character.image}
          alt={character.name}
          className="h-16 w-16 shrink-0 rounded-md object-cover transition sm:h-auto sm:w-full sm:rounded-none sm:aspect-square sm:group-hover:scale-[1.03]"
        />
      )}
      <div className="min-w-0 sm:p-3">
        <p className="truncate text-sm font-medium text-neutral-100">
          {character.name}
        </p>
        <div className="mt-1.5 flex flex-col items-start gap-1 text-xs text-neutral-400 sm:flex-row sm:items-center sm:gap-1.5">
          <StatusBadge status={character.status} />
          <span className="truncate">{character.species ?? 'unknown'}</span>
        </div>
      </div>
    </Link>
  );
}
