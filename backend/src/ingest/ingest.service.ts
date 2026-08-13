import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApiCharacter,
  ApiEpisode,
  ApiListResponse,
  ApiLocation,
} from './types';

const API_BASE_URL = 'https://rickandmortyapi.com/api';

export interface IngestResult {
  locations: number;
  episodes: number;
  characters: number;
  characterEpisodeLinks: number;
}

@Injectable()
export class IngestService {
  private readonly logger = new Logger(IngestService.name);

  constructor(private readonly prisma: PrismaService) {}

  async run(): Promise<IngestResult> {
    this.logger.log('Fetching and ingesting locations...');
    const locations = await this.fetchAllPages<ApiLocation>(
      `${API_BASE_URL}/location`,
    );
    await this.ingestLocations(locations);

    this.logger.log('Fetching and ingesting episodes...');
    const episodes = await this.fetchAllPages<ApiEpisode>(
      `${API_BASE_URL}/episode`,
    );
    await this.ingestEpisodes(episodes);

    this.logger.log('Fetching and ingesting characters...');
    const characters = await this.fetchAllPages<ApiCharacter>(
      `${API_BASE_URL}/character`,
    );
    await this.ingestCharacters(characters);

    this.logger.log('Linking characters to episodes...');
    const characterEpisodeLinks =
      await this.linkCharacterEpisodes(characters);

    const result: IngestResult = {
      locations: locations.length,
      episodes: episodes.length,
      characters: characters.length,
      characterEpisodeLinks,
    };
    this.logger.log(`Ingest finished: ${JSON.stringify(result)}`);
    return result;
  }

  private async fetchAllPages<T>(url: string): Promise<T[]> {
    const results: T[] = [];
    let next: string | null = url;
    while (next) {
      const data = await this.fetchWithRetry<ApiListResponse<T>>(next);
      results.push(...data.results);
      next = data.info.next;
    }
    return results;
  }

  private async fetchWithRetry<T>(url: string, attempt = 1): Promise<T> {
    const response = await fetch(url);
    if (response.status === 429 && attempt <= 5) {
      const retryAfterSeconds = Number(response.headers.get('retry-after'));
      const delayMs = retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : attempt * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return this.fetchWithRetry<T>(url, attempt + 1);
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  private extractIdFromUrl(url: string | null | undefined): number | null {
    if (!url) return null;
    const match = url.match(/\/(\d+)\/?$/);
    return match ? Number(match[1]) : null;
  }

  private async ingestLocations(locations: ApiLocation[]): Promise<void> {
    for (const location of locations) {
      await this.prisma.location.upsert({
        where: { id: location.id },
        update: {
          name: location.name,
          type: location.type || null,
          dimension: location.dimension || null,
        },
        create: {
          id: location.id,
          name: location.name,
          type: location.type || null,
          dimension: location.dimension || null,
        },
      });
    }
  }

  private async ingestEpisodes(episodes: ApiEpisode[]): Promise<void> {
    for (const episode of episodes) {
      await this.prisma.episode.upsert({
        where: { id: episode.id },
        update: {
          name: episode.name,
          airDate: episode.air_date || null,
          code: episode.episode,
        },
        create: {
          id: episode.id,
          name: episode.name,
          airDate: episode.air_date || null,
          code: episode.episode,
        },
      });
    }
  }

  private async ingestCharacters(characters: ApiCharacter[]): Promise<void> {
    for (const character of characters) {
      const originId = this.extractIdFromUrl(character.origin?.url);
      const locationId = this.extractIdFromUrl(character.location?.url);
      await this.prisma.character.upsert({
        where: { id: character.id },
        update: {
          name: character.name,
          status: character.status || null,
          species: character.species || null,
          gender: character.gender || null,
          image: character.image || null,
          originId,
          locationId,
        },
        create: {
          id: character.id,
          name: character.name,
          status: character.status || null,
          species: character.species || null,
          gender: character.gender || null,
          image: character.image || null,
          originId,
          locationId,
        },
      });
    }
  }

  private async linkCharacterEpisodes(
    characters: ApiCharacter[],
  ): Promise<number> {
    let count = 0;
    for (const character of characters) {
      for (const episodeUrl of character.episode) {
        const episodeId = this.extractIdFromUrl(episodeUrl);
        if (!episodeId) continue;
        await this.prisma.characterEpisode.upsert({
          where: {
            characterId_episodeId: {
              characterId: character.id,
              episodeId,
            },
          },
          update: {},
          create: {
            characterId: character.id,
            episodeId,
          },
        });
        count++;
      }
    }
    return count;
  }
}
