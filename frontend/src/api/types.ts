export interface Character {
  id: number;
  name: string;
  status: string;
  species: string | null;
  gender: string | null;
  image: string | null;
  originId: number | null;
  locationId: number | null;
}

export interface LocationSummary {
  id: number;
  name: string;
  type: string | null;
  dimension: string | null;
}

export interface EpisodeSummary {
  id: number;
  name: string;
  airDate: string | null;
  code: string;
}

export interface CharacterDetail extends Character {
  origin: LocationSummary | null;
  location: LocationSummary | null;
  episodes: EpisodeSummary[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type SortableField = 'id' | 'name' | 'status' | 'species';
export type SortOrder = 'asc' | 'desc';

export interface FindCharactersParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  sortBy?: SortableField;
  order?: SortOrder;
}
