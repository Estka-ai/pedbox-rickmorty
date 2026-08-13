import { apiFetch } from './client';
import type {
  CharacterDetail,
  FindCharactersParams,
  PaginatedResponse,
  Character,
} from './types';

export function fetchCharacters(params: FindCharactersParams) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.name) query.set('name', params.name);
  if (params.status) query.set('status', params.status);

  const qs = query.toString();
  return apiFetch<PaginatedResponse<Character>>(
    `/characters${qs ? `?${qs}` : ''}`,
  );
}

export function fetchCharacter(id: number) {
  return apiFetch<CharacterDetail>(`/characters/${id}`);
}
