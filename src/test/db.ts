import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as schema from "@/db/schema";

export function appDbConfig() {
  return {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "inteligenciaartificial",
  };
}

/** Privileged connection used for DDL and grants — see scripts/db-grants.ts. */
export function adminDbConfig() {
  return {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.ADMIN_DATABASE_USER ?? process.env.DATABASE_USER ?? "root",
    password:
      process.env.ADMIN_DATABASE_PASSWORD ?? process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "inteligenciaartificial",
  };
}

/** Tests that need a real MySQL 8 skip themselves when one isn't reachable (e.g. local dev without Docker). */
export async function isDbReachable(): Promise<boolean> {
  try {
    const connection = await mysql.createConnection(adminDbConfig());
    await connection.ping();
    await connection.end();
    return true;
  } catch {
    return false;
  }
}

async function dropAllTables(connection: mysql.Connection) {
  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
  );
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const row of rows) {
    await connection.query(`DROP TABLE IF EXISTS \`${row.name}\``);
  }
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  return rows;
}

/** Resets the schema, re-applies every migration, and re-grants table-scoped privileges. */
export async function freshTestDb() {
  const connection = await mysql.createConnection(adminDbConfig());
  await dropAllTables(connection);

  const db = drizzle(connection, { schema, mode: "default" });
  await migrate(db, { migrationsFolder: "./drizzle" });
  await applyGrants(connection);

  return { connection, db };
}

export async function applyGrants(connection: mysql.Connection) {
  const appUser = process.env.DATABASE_USER ?? "root";
  const appHost = process.env.DATABASE_USER_HOST ?? "%";
  const appPassword = process.env.DATABASE_PASSWORD ?? "";
  const dbName = process.env.DATABASE_NAME ?? "inteligenciaartificial";

  await connection.query(
    `CREATE USER IF NOT EXISTS '${appUser}'@'${appHost}' IDENTIFIED BY ?`,
    [appPassword],
  );

  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
  );
  for (const row of rows) {
    const table = row.name as string;
    const privileges =
      table === "audit_logs" ? "SELECT, INSERT" : "SELECT, INSERT, UPDATE, DELETE";
    await connection.query(
      `GRANT ${privileges} ON \`${dbName}\`.\`${table}\` TO '${appUser}'@'${appHost}'`,
    );
  }
  await connection.query("FLUSH PRIVILEGES");
}

export { dropAllTables };
