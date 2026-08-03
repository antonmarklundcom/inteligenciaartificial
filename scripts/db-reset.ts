import "dotenv/config";
import mysql from "mysql2/promise";

/**
 * Drops every table in the configured database. Used to prove migrations
 * roll back cleanly (docs/15 T1-02 acceptance) and to reset test databases.
 * Never point this at anything but a local/CI/staging database.
 */
async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "inteligenciaartificial",
  });

  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
  );

  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  for (const row of rows) {
    await connection.query(`DROP TABLE IF EXISTS \`${row.name}\``);
  }
  await connection.query("SET FOREIGN_KEY_CHECKS = 1");

  await connection.end();
  console.log(`Dropped ${rows.length} tables.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
