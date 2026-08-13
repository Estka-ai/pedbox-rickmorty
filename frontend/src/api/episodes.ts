import { apiFetch } from './client';
import type {
  EpisodeDetail,
  EpisodeSummary,
  FindListParams,
  PaginatedResponse,
} from './types';

export function fetchEpisodes(params: FindListParams) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.name) query.set('name', params.name);

  const qs = query.toString();
  return apiFetch<PaginatedResponse<EpisodeSummary>>(
    `/episodes${qs ? `?${qs}` : ''}`,
  );
}

export function fetchEpisode(id: number) {
  return apiFetch<EpisodeDetail>(`/episodes/${id}`);
}
