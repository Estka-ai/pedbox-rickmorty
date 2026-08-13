import { apiFetch } from './client';
import type {
  FindListParams,
  LocationDetail,
  LocationSummary,
  PaginatedResponse,
} from './types';

export function fetchLocations(params: FindListParams) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.name) query.set('name', params.name);

  const qs = query.toString();
  return apiFetch<PaginatedResponse<LocationSummary>>(
    `/locations${qs ? `?${qs}` : ''}`,
  );
}

export function fetchLocation(id: number) {
  return apiFetch<LocationDetail>(`/locations/${id}`);
}
