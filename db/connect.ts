import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { Database } from "./database";

/**
 * Drizzle over postgres-js for `DATABASE_URL`. Prepared statements are off so
 * the same URL also works through Supabase's transaction pooler (serverless).
 */
export function connect(options: { max?: number } = {}) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false, ...options });
  const db: Database = drizzle(client, { schema });
  return { db, close: () => client.end() };
}
