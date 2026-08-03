import "dotenv/config";
import mysql from "mysql2/promise";

/**
 * Grants the application's runtime DB user exactly the privileges it needs,
 * table by table — never a blanket UPDATE/DELETE on `audit_logs` (docs/08
 * §7, docs/11 §5). Table-level REVOKE cannot undo a broader db-level GRANT
 * in MySQL, so the only correct way to make `audit_logs` append-only is to
 * never grant UPDATE/DELETE on it in the first place.
 *
 * Must run with a privileged (admin) connection — set ADMIN_DATABASE_USER /
 * ADMIN_DATABASE_PASSWORD, or this falls back to DATABASE_USER for local/CI
 * setups where the same user has GRANT OPTION.
 *
 * On Hostinger managed MySQL, the panel-provisioned user typically has no
 * GRANT OPTION on itself; in that environment `audit_logs` append-only-ness
 * is enforced at the application/repository layer only (no update/delete
 * function is ever written against that table), and this script is a no-op
 * you can skip. It exists for self-hosted/CI setups where a real privileged
 * user is available.
 */
async function main() {
  const adminConnection = await mysql.createConnection({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.ADMIN_DATABASE_USER ?? process.env.DATABASE_USER ?? "root",
    password:
      process.env.ADMIN_DATABASE_PASSWORD ?? process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "inteligenciaartificial",
    multipleStatements: true,
  });

  const appUser = process.env.DATABASE_USER ?? "root";
  const appHost = process.env.DATABASE_USER_HOST ?? "%";
  const appPassword = process.env.DATABASE_PASSWORD ?? "";
  const dbName = process.env.DATABASE_NAME ?? "inteligenciaartificial";

  await adminConnection.query(
    `CREATE USER IF NOT EXISTS '${appUser}'@'${appHost}' IDENTIFIED BY ?`,
    [appPassword],
  );

  const [rows] = await adminConnection.query<mysql.RowDataPacket[]>(
    "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
  );

  for (const row of rows) {
    const table = row.name as string;
    const privileges =
      table === "audit_logs" ? "SELECT, INSERT" : "SELECT, INSERT, UPDATE, DELETE";
    await adminConnection.query(
      `GRANT ${privileges} ON \`${dbName}\`.\`${table}\` TO '${appUser}'@'${appHost}'`,
    );
  }
  await adminConnection.query("FLUSH PRIVILEGES");
  await adminConnection.end();

  console.log(
    `Granted table-scoped privileges to '${appUser}'@'${appHost}' on ${rows.length} tables (audit_logs is SELECT, INSERT only).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
