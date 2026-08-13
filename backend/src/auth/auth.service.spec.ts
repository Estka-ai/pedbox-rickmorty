import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Prisma } from '../../generated/prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock; create: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn(), create: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('hashes the password before storing the user (never plain text)', async () => {
      usersService.create.mockResolvedValue({
        id: 1,
        email: 'user@pedbox.dev',
        createdAt: new Date('2026-01-01'),
      });

      await service.register({ email: 'user@pedbox.dev', password: 'SuperSecret123' });

      const [, storedPasswordHash] = usersService.create.mock.calls[0];
      expect(storedPasswordHash).not.toBe('SuperSecret123');
      expect(await bcrypt.compare('SuperSecret123', storedPasswordHash)).toBe(
        true,
      );
    });

    it('throws ConflictException on duplicate email instead of a raw DB error', async () => {
      usersService.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          clientVersion: '7.9.1',
        }),
      );

      await expect(
        service.register({ email: 'dup@pedbox.dev', password: 'SuperSecret123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('rejects with a generic message when the password is wrong', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword123', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'user@pedbox.dev',
        passwordHash,
      });

      await expect(
        service.login({ email: 'user@pedbox.dev', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejects with the same generic message when the email does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'ghost@pedbox.dev', password: 'Whatever123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns an access_token on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword123', 10);
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'user@pedbox.dev',
        passwordHash,
      });

      const result = await service.login({
        email: 'user@pedbox.dev',
        password: 'CorrectPassword123',
      });

      expect(result).toEqual({ access_token: 'signed.jwt.token' });
    });
  });
});
