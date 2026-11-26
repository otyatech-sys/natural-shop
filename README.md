# Natural Shop

Tienda online de alimentos envasados naturales con entrega en Chiclayo. Next.js 16 (App Router, Cache Components), Supabase (Postgres, Auth, Storage), Drizzle y shadcn/ui.

- Vocabulario del dominio: [`GLOSSARY.md`](GLOSSARY.md)
- Decisiones de arquitectura: [`docs/adr/`](docs/adr)

## Puesta en marcha

1. Instala dependencias: `npm install`
2. Copia `.env.example` a `.env.local` y completa `DATABASE_URL` con la cadena del proyecto Supabase de **desarrollo** (Connect → Session pooler).
3. Aplica las migraciones: `npm run db:migrate`
4. Carga los datos de prueba: `npm run db:seed`
5. Arranca: `npm run dev` y abre <http://localhost:3000/productos/granola-de-quinua-y-kiwicha>

## Scripts

| Script                 | Qué hace                                                            |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                              |
| `npm run build`        | Build de producción                                                 |
| `npm run typecheck`    | Genera los tipos de rutas de Next y ejecuta `tsc`                   |
| `npm run lint`         | ESLint                                                              |
| `npm test`             | Pruebas (Vitest), una vez                                           |
| `npm run test:watch`   | Pruebas en modo observación                                         |
| `npm run format`       | Formatea con Prettier (con el plugin de Tailwind)                   |
| `npm run format:check` | Comprueba el formato sin escribir                                   |
| `npm run db:generate`  | Genera una migración en `drizzle/` a partir de `db/schema.ts`       |
| `npm run db:migrate`   | Aplica las migraciones pendientes a la base de `DATABASE_URL`       |
| `npm run db:seed`      | Inserta los datos de prueba (idempotente: no duplica si ya existen) |

## Base de datos

- El esquema vive en `db/schema.ts`; las migraciones generadas, en `drizzle/`. Desarrollo y producción usan las mismas migraciones.
- Todas las tablas de la aplicación tienen RLS activado **sin políticas** (denegar todo): el navegador nunca consulta tablas con el cliente de Supabase; los datos se leen y escriben en el servidor con Drizzle (ADR 0001).
- Importes siempre en céntimos enteros de PEN, con IGV incluido.

## Pruebas

Las reglas de negocio viven en los casos de uso (`application/`), que reciben la base de datos como dependencia. Las pruebas los invocan contra un Postgres en memoria ([PGlite](https://pglite.dev)) al que se aplican las mismas migraciones de `drizzle/`, sin Docker ni Supabase. Cada prueba usa una base nueva con `createTestDb()` de `test/db.ts`.

## Interfaz

Los componentes de shadcn/ui (base Radix) se añaden **solo** con su CLI: `npx shadcn@latest add <componente>`. No se escriben a mano.
