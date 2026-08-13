import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchShowcaseCharacters } from '../api/publicCharacters';

function CharacterCollage() {
  const { data } = useQuery({
    queryKey: ['showcase-characters'],
    queryFn: fetchShowcaseCharacters,
    staleTime: Infinity,
    retry: 1,
  });

  return (
    <div className="absolute inset-0">
      {data && (
        <div className="grid h-full grid-cols-4 grid-rows-3">
          {data.map((character) => (
            <img
              key={character.id}
              src={character.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-neutral-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(4,4,4,0.75)_0%,_rgba(4,4,4,0.15)_45%,_rgba(4,4,4,0.6)_100%)]" />
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden border-r border-neutral-900 bg-neutral-950 lg:flex">
        <CharacterCollage />
        <div className="relative z-10 max-w-sm rounded-2xl bg-neutral-950/70 px-10 py-8 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-semibold tracking-tight">PedBox</h2>
          <p className="mt-3 text-neutral-300">
            Explorá personajes, ubicaciones y episodios de todo el multiverso
            de Rick and Morty.
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.16)_0%,_rgba(16,185,129,0.05)_40%,_transparent_70%)]" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
