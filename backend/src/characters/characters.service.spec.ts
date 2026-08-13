import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CharactersService', () => {
  let service: CharactersService;
  let prisma: {
    character: {
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      character: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  describe('findAll', () => {
    it('paginates with the requested page/limit and returns pagination meta', async () => {
      prisma.character.findMany.mockResolvedValue([{ id: 1, name: 'Rick' }]);
      prisma.character.count.mockResolvedValue(826);

      const result = await service.findAll({ page: 2, limit: 20 });

      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 20 }),
      );
      expect(result.meta).toEqual({
        page: 2,
        limit: 20,
        total: 826,
        totalPages: 42,
      });
    });

    it('filters by name (contains, case-insensitive) and status', async () => {
      prisma.character.findMany.mockResolvedValue([]);
      prisma.character.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, name: 'rick', status: 'Alive' });

      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: { contains: 'rick', mode: 'insensitive' },
            status: 'Alive',
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the character does not exist', async () => {
      prisma.character.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('flattens the character_episode join into a plain episodes array', async () => {
      prisma.character.findUnique.mockResolvedValue({
        id: 1,
        name: 'Rick Sanchez',
        origin: { id: 1, name: 'Earth (C-137)' },
        location: { id: 3, name: 'Citadel of Ricks' },
        episodes: [
          { episode: { id: 1, name: 'Pilot', code: 'S01E01' } },
          { episode: { id: 2, name: 'Lawnmower Dog', code: 'S01E02' } },
        ],
      });

      const result = await service.findOne(1);

      expect(result.episodes).toEqual([
        { id: 1, name: 'Pilot', code: 'S01E01' },
        { id: 2, name: 'Lawnmower Dog', code: 'S01E02' },
      ]);
    });
  });
});
