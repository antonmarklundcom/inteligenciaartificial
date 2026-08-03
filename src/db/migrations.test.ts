import { describe, expect, it, beforeAll } from "vitest";
import mysql from "mysql2/promise";
import { appDbConfig, adminDbConfig, freshTestDb, isDbReachable } from "@/test/db";

const reachable = await isDbReachable();

describe.skipIf(!reachable)("migrations", () => {
  it("applies cleanly and creates every MVP table", async () => {
    const { connection } = await freshTestDb();
    try {
      const [rows] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
      );
      const tableNames = rows.map((r) => r.name).sort();
      expect(tableNames).toContain("leads");
      expect(tableNames).toContain("assessments");
      expect(tableNames).toContain("crm_sync_events");
      expect(tableNames).toContain("audit_logs");
      expect(tableNames.length).toBeGreaterThanOrEqual(29);
    } finally {
      await connection.end();
    }
  });

  it("rolls back cleanly (drops every table without error)", async () => {
    const { connection } = await freshTestDb();
    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");
      const [rows] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
      );
      for (const row of rows) {
        await connection.query(`DROP TABLE IF EXISTS \`${row.name}\``);
      }
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");

      const [remaining] = await connection.query<mysql.RowDataPacket[]>(
        "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = DATABASE()",
      );
      expect(remaining).toHaveLength(0);
    } finally {
      await connection.end();
    }
  });
});

describe.skipIf(!reachable)("schema constraints", () => {
  beforeAll(async () => {
    const { connection } = await freshTestDb();
    await connection.end();
  });

  it("rejects publishing a prompt without a tested-by record", async () => {
    const admin = await mysql.createConnection(adminDbConfig());
    try {
      await admin.query(
        "INSERT INTO prompt_categories (slug, nombre, orden, activo) VALUES ('test-cat', 'Test', 0, 1)",
      );
      const [[category]] = (await admin.query(
        "SELECT id FROM prompt_categories WHERE slug = 'test-cat'",
      )) as unknown as [mysql.RowDataPacket[]];

      await expect(
        admin.query(
          `INSERT INTO prompts
            (public_id, slug, category_id, titulo, objetivo, cuando_usar, cuando_no_usar, que_verificar, texto_prompt, nivel, publicado)
           VALUES
            ('01HXXXXXXXXXXXXXXXXXXXXXXX', 'test-prompt-unpublished-ok', ?, 't', 'o', 'u', 'n', 'v', 'p', 'basico', true)`,
          [category.id],
        ),
      ).rejects.toThrow();
    } finally {
      await admin.end();
    }
  });

  it("allows publishing a prompt once probado_por and probado_at are set", async () => {
    const admin = await mysql.createConnection(adminDbConfig());
    try {
      await admin.query(
        "INSERT INTO admin_users (public_id, nombre, email, password_hash, rol) VALUES ('01HADMINXXXXXXXXXXXXXXXXXX', 'Admin', 'admin@example.com', 'x', 'owner')",
      );
      const [[admin_]] = (await admin.query(
        "SELECT id FROM admin_users WHERE email = 'admin@example.com'",
      )) as unknown as [mysql.RowDataPacket[]];

      const [[category]] = (await admin.query(
        "SELECT id FROM prompt_categories WHERE slug = 'test-cat'",
      )) as unknown as [mysql.RowDataPacket[]];

      await expect(
        admin.query(
          `INSERT INTO prompts
            (public_id, slug, category_id, titulo, objetivo, cuando_usar, cuando_no_usar, que_verificar, texto_prompt, nivel, publicado, probado_por, probado_at)
           VALUES
            ('01HXXXXXXXXXXXXXXXXXXXXXXY', 'test-prompt-published-ok', ?, 't', 'o', 'u', 'n', 'v', 'p', 'basico', true, ?, NOW())`,
          [category.id, admin_.id],
        ),
      ).resolves.toBeDefined();
    } finally {
      await admin.end();
    }
  });

  it("does not allow the app's database user to UPDATE or DELETE audit_logs", async () => {
    const admin = await mysql.createConnection(adminDbConfig());
    await admin.query(
      "INSERT INTO audit_logs (action, entity_type, entity_id, ip_address) VALUES ('test', 'lead', 1, UNHEX('00000000000000000000000000000001'))",
    );
    await admin.end();

    const app = await mysql.createConnection(appDbConfig());
    try {
      await expect(
        app.query("UPDATE audit_logs SET action = 'tampered' WHERE entity_type = 'lead'"),
      ).rejects.toThrow();
      await expect(
        app.query("DELETE FROM audit_logs WHERE entity_type = 'lead'"),
      ).rejects.toThrow();
      await expect(
        app.query(
          "INSERT INTO audit_logs (action, entity_type, entity_id, ip_address) VALUES ('test2', 'lead', 2, UNHEX('00000000000000000000000000000001'))",
        ),
      ).resolves.toBeDefined();
    } finally {
      await app.end();
    }
  });
});
