import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "@/db/schema";

/**
 * A fresh in-memory Postgres with the same Drizzle migrations as Supabase.
 * Use cases under test receive it as their `Database`.
 */
export async function createTestDb() {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "drizzle" });
  return db;
}

export type TestDb = Awaited<ReturnType<typeof createTestDb>>;
