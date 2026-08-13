# PedBox — Rick and Morty

Full stack technical assessment: ingesting and normalizing the [Rick and Morty API](https://rickandmortyapi.com/api) into PostgreSQL, a custom REST API (NestJS + Prisma) protected with JWT, and a mobile-first React frontend (Vite + TanStack Query + Tailwind).

## Stack

**Backend**
- NestJS + TypeScript
- Prisma ORM + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- `@nestjs/jwt` + `passport-jwt` + `bcrypt` (authentication)
- `class-validator` + `class-transformer` (DTOs)
- Swagger (`@nestjs/swagger`) at `/api/docs`
- Structured logging with Pino (`nestjs-pino`)

**Frontend**
- React + TypeScript + Vite
- React Router
- TanStack Query (loading/error states + caching)
- Tailwind CSS (mobile-first)

**Infra**
- Docker Compose (Postgres + backend + frontend, single command)
- Jest (backend) + Vitest/React Testing Library (frontend)

## Structure

```
pedbox-rickmorty/
├── docker-compose.yml
├── backend/     # NestJS API
└── frontend/    # React SPA
```

Inside `backend/src/`: `prisma/` (global PrismaService), `ingest/` (sync with the external API), `characters/`, `auth/`, `users/`, `common/` (global exception filter).

Inside `frontend/src/`: `api/` (HTTP client + TanStack Query hooks), `auth/` (session context, route guard), `pages/`, `components/`.

---

## Installation and running

### Option A — Docker Compose (recommended, single command)

Requires Docker and Docker Compose. From the repo root:

```bash
docker compose up -d --build
```

This starts:
- **Postgres** on `localhost:5432`
- **Backend** (NestJS) on `http://localhost:3000` — runs Prisma migrations automatically on startup
- **Frontend** (React) on `http://localhost:5173`

No `.env` file is needed for this mode: the variables are defined directly in `docker-compose.yml` (development values, not real secrets).

To seed the database with data from the Rick and Morty API (see "Seeding the database" below):

```bash
docker compose exec backend node dist/src/ingest/run-ingest.js
```

To stop everything:

```bash
docker compose down        # keeps the data (Postgres volume)
docker compose down -v     # also deletes the data
```

### Option B — Local development (no Docker for backend/frontend)

Requires Node.js 22+ and Docker (for Postgres only).

**1. Start Postgres:**

```bash
docker compose up -d postgres
```

**2. Backend:**

```bash
cd backend
cp .env.example .env      # fill in if needed (defaults already point to local Postgres)
npm install
npx prisma migrate dev    # creates the tables (first run / after schema changes)
npm run start:dev         # http://localhost:3000
```

**3. Seed the database:**

```bash
npm run ingest
```

**4. Frontend** (in another terminal):

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

---

## Environment variables

See `backend/.env.example` and `frontend/.env.example`. The real `.env` is never committed (it's in `.gitignore`).

**`backend/.env`**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWTs (never hardcoded in the code) |
| `JWT_EXPIRES_IN` | Token expiration (e.g. `1h`) |
| `PORT` | Backend port |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend consumed by the frontend |

---

## Seeding the database (ingest)

The ingest command consumes the full Rick and Morty API (following the real pagination), normalizes the data and `upsert`s by `id` (it is **idempotent**: running it more than once does not duplicate rows).

Ingest order: `locations → episodes → characters → character_episode`.

- **With Docker:** `docker compose exec backend node dist/src/ingest/run-ingest.js`
- **Local:** `npm run ingest` (from `backend/`)

Once finished, it leaves ~826 characters, ~126 locations, ~51 episodes, and the relation rows in `character_episode`.

---

## API documentation (Swagger)

With the backend running: **http://localhost:3000/api/docs**

Includes the `auth` and `characters` endpoints, with an "Authorize" button to test protected routes by pasting the `access_token` obtained from `/auth/login`.

---

## Tests

**Backend** (Jest — unit tests for `AuthService` and `CharactersService` with Prisma mocked):

```bash
cd backend
npm test
```

**Frontend** (Vitest + React Testing Library — tests for `ErrorState` and `CharacterCard`):

```bash
cd frontend
npm test
```

---

## Architecture notes

- The ingest uses the **external API's id as the PK** of `Location`, `Episode` and `Character`, which makes the `upsert` natural and idempotent.
- All `characters` routes are protected with `JwtAuthGuard`; `auth/register` and `auth/login` are public.
- The global exception filter (`common/filters/all-exceptions.filter.ts`) ensures every error (validation, 404, 401, 500) comes back in a consistent shape, without raw stack traces.
- Pino logs redact `Authorization` and `password` — credentials and tokens are never logged.
- The frontend automatically attaches the JWT to every request and, on a `401` from the backend (expired or invalid token), clears the session and redirects to `/login` instead of leaving the screen stuck.

## Deploy

Not deployed (out of scope for this submission). The project runs fully locally with `docker compose up`.
