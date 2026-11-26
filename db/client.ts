import "server-only";
import { connect } from "./connect";
import type { Database } from "./database";

let instance: Database | undefined;

/** Server-side database connection, created on first use. */
export function getDb(): Database {
  instance ??= connect().db;
  return instance;
}
