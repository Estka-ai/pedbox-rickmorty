import { Link } from 'react-router-dom';
import type { Character } from '../api/types';

const STATUS_DOT: Record<string, string> = {
  Alive: 'bg-emerald-500',
  Dead: 'bg-red-500',
  unknown: 'bg-neutral-500',
};

export function CharacterCard({ character }: { character: Character }) {
  return (
    <Link
      to={`/characters/${character.id}`}
      title={character.name}
      className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3 transition hover:border-neutral-700 hover:bg-neutral-800 sm:flex-col sm:items-stretch sm:gap-0 sm:p-0 sm:overflow-hidden"
    >
      {character.image && (
        <img
          src={character.image}
          alt={character.name}
          className="h-16 w-16 shrink-0 rounded-md object-cover sm:h-auto sm:w-full sm:rounded-none sm:aspect-square"
        />
      )}
      <div className="min-w-0 sm:p-3">
        <p className="truncate text-sm font-medium text-neutral-100">
          {character.name}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <span
            className={`h-2 w-2 rounded-full ${STATUS_DOT[character.status] ?? 'bg-neutral-500'}`}
          />
          {character.status} · {character.species ?? 'unknown'}
        </div>
      </div>
    </Link>
  );
}
