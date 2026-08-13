import { useQuery } from '@tanstack/react-query';
import { fetchCharacter, fetchCharacters } from './characters';
import { fetchLocation, fetchLocations } from './locations';
import { fetchEpisode, fetchEpisodes } from './episodes';
import type { FindCharactersParams, FindListParams } from './types';

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

export function useLocations(params: FindListParams) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => fetchLocations(params),
  });
}

export function useLocation(id: number) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => fetchLocation(id),
    enabled: Number.isFinite(id),
  });
}

export function useEpisodes(params: FindListParams) {
  return useQuery({
    queryKey: ['episodes', params],
    queryFn: () => fetchEpisodes(params),
  });
}

export function useEpisode(id: number) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisode(id),
    enabled: Number.isFinite(id),
  });
}
