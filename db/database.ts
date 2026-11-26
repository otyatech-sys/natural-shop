import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type * as schema from "./schema";

/**
 * Any Drizzle Postgres database with our schema: postgres-js against Supabase
 * in the app, PGlite in tests. Use cases depend on this type, never on a driver.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;
