# PedBox — Rick and Morty

Prueba técnica full stack: ingesta y normalización de la [Rick and Morty API](https://rickandmortyapi.com/api) en PostgreSQL, API REST propia (NestJS + Prisma) protegida con JWT, y frontend React mobile-first (Vite + TanStack Query + Tailwind).

## Stack

**Backend**
- NestJS + TypeScript
- Prisma ORM + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- `@nestjs/jwt` + `passport-jwt` + `bcrypt` (autenticación)
- `class-validator` + `class-transformer` (DTOs)
- Swagger (`@nestjs/swagger`) en `/api/docs`
- Logs estructurados con Pino (`nestjs-pino`)

**Frontend**
- React + TypeScript + Vite
- React Router
- TanStack Query (loading/error states + caché)
- Tailwind CSS (mobile-first)

**Infra**
- Docker Compose (Postgres + backend + frontend, un solo comando)
- Jest (backend) + Vitest/React Testing Library (frontend)

## Estructura

```
pedbox-rickmorty/
├── docker-compose.yml
├── backend/     # NestJS API
└── frontend/    # React SPA
```

Dentro de `backend/src/`: `prisma/` (PrismaService global), `ingest/` (sincronización con la API externa), `characters/`, `auth/`, `users/`, `common/` (filtro de excepciones global).

Dentro de `frontend/src/`: `api/` (cliente HTTP + hooks de TanStack Query), `auth/` (contexto de sesión, guard de rutas), `pages/`, `components/`.

---

## Instalación y ejecución

### Opción A — Docker Compose (recomendado, un solo comando)

Requiere Docker y Docker Compose. Desde la raíz del repo:

```bash
docker compose up -d --build
```

Esto levanta:
- **Postgres** en `localhost:5432`
- **Backend** (NestJS) en `http://localhost:3000` — corre las migraciones de Prisma automáticamente al arrancar
- **Frontend** (React) en `http://localhost:5173`

No hace falta crear ningún `.env`: las variables para este modo están definidas directamente en `docker-compose.yml` (son valores de desarrollo, no secretos reales).

Para poblar la base de datos con la data de la Rick and Morty API (ver sección "Poblar la base de datos" más abajo):

```bash
docker compose exec backend node dist/src/ingest/run-ingest.js
```

Para bajar todo:

```bash
docker compose down        # conserva los datos (volumen de Postgres)
docker compose down -v     # borra también los datos
```

### Opción B — Desarrollo local (sin Docker para backend/frontend)

Requiere Node.js 22+ y Docker (solo para Postgres).

**1. Levantar Postgres:**

```bash
docker compose up -d postgres
```

**2. Backend:**

```bash
cd backend
cp .env.example .env      # completar si hace falta (los defaults ya apuntan a Postgres local)
npm install
npx prisma migrate dev    # crea las tablas (solo la primera vez / tras cambios de schema)
npm run start:dev         # http://localhost:3000
```

**3. Poblar la base de datos:**

```bash
npm run ingest
```

**4. Frontend** (en otra terminal):

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

---

## Variables de entorno

Ver `backend/.env.example` y `frontend/.env.example`. El `.env` real nunca se commitea (está en `.gitignore`).

**`backend/.env`**

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL |
| `JWT_SECRET` | Secreto para firmar los JWT (nunca hardcodeado en el código) |
| `JWT_EXPIRES_IN` | Expiración del token (ej. `1h`) |
| `PORT` | Puerto del backend |

**`frontend/.env`**

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend que consume el frontend |

---

## Poblar la base de datos (ingesta)

El comando de ingesta consume la Rick and Morty API completa (siguiendo la paginación real), normaliza los datos y hace `upsert` por `id` (es **idempotente**: correrlo más de una vez no duplica filas).

Orden de ingesta: `locations → episodes → characters → character_episode`.

- **Con Docker:** `docker compose exec backend node dist/src/ingest/run-ingest.js`
- **Local:** `npm run ingest` (desde `backend/`)

Al terminar deja pobladas ~826 characters, ~126 locations, ~51 episodes y las filas de relación en `character_episode`.

---

## Documentación de la API (Swagger)

Con el backend corriendo: **http://localhost:3000/api/docs**

Incluye los endpoints de `auth` y `characters`, con el botón "Authorize" para probar las rutas protegidas pegando el `access_token` obtenido en `/auth/login`.

---

## Tests

**Backend** (Jest — tests unitarios de `AuthService` y `CharactersService` con Prisma mockeado):

```bash
cd backend
npm test
```

**Frontend** (Vitest + React Testing Library — tests de `ErrorState` y `CharacterCard`):

```bash
cd frontend
npm test
```

---

## Notas de arquitectura

- La ingesta usa el **id de la API externa como PK** de `Location`, `Episode` y `Character`, lo que hace el `upsert` natural e idempotente.
- Todas las rutas de `characters` están protegidas con `JwtAuthGuard`; `auth/register` y `auth/login` son públicas.
- El filtro de excepciones global (`common/filters/all-exceptions.filter.ts`) asegura que todos los errores (validación, 404, 401, 500) salgan con una forma consistente, sin stack traces crudos.
- Los logs de Pino redactan `Authorization` y `password` — nunca se loguean credenciales ni tokens.
- El frontend adjunta el JWT automáticamente a cada request y, ante un `401` del backend (token vencido o inválido), limpia la sesión y redirige a `/login` sin dejar la pantalla colgada.

## Deploy

No desplegado (fuera del alcance de esta entrega). El proyecto corre completo en local con `docker compose up`.
