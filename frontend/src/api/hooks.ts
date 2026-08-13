import { useQuery } from '@tanstack/react-query';
import { fetchCharacter, fetchCharacters } from './characters';
import type { FindCharactersParams } from './types';

export function useCharacters(params: FindCharactersParams) {
  return useQuery({
    queryKey: ['characters', params],
    queryFn: () => fetchCharacters(params),
  });
}

export function useCharacter(id: number) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(id),
    enabled: Number.isFinite(id),
  });
}
