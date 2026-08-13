import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { FindEpisodesQueryDto } from './dto/find-episodes-query.dto';

@Injectable()
export class EpisodesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindEpisodesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.EpisodeWhereInput = {};
    if (query.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.episode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.episode.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { characters: { include: { character: true } } },
    });
    if (!episode) {
      throw new NotFoundException(`Episode with id ${id} not found`);
    }
    const { characters, ...rest } = episode;
    return { ...rest, characters: characters.map((c) => c.character) };
  }
}
