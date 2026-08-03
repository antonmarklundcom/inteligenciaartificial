import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { getEnv } from "@/lib/env";
import * as schema from "./schema";

type Database = MySql2Database<typeof schema>;

let pool: mysql.Pool | null = null;
let instance: Database | null = null;

/**
 * Lazy singleton: the pool must not be created at module-evaluation time,
 * because this module is imported by route handlers that Next.js can
 * statically analyse during `next build`, before env vars are available.
 */
export function getDb(): Database {
  if (instance) return instance;
  const env = getEnv();
  pool = mysql.createPool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    connectionLimit: 10,
  });
  instance = drizzle(pool, { schema, mode: "default" });
  return instance;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    instance = null;
  }
}
