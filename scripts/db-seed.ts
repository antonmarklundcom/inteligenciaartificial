import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { industries, toolDefinitions } from "../src/db/schema";

/**
 * Fixture data only — no production data ever (docs/15 T1-02 acceptance).
 * Safe to run repeatedly: every insert is keyed on a unique slug.
 */
async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "inteligenciaartificial",
  });
  const db = drizzle(connection);

  const industryRows: (typeof industries.$inferInsert)[] = [
    {
      slug: "inmobiliaria",
      nombre: "Inmobiliaria",
      nombrePlural: "Inmobiliarias y desarrolladoras",
      activo: true,
      orden: 1,
      tienePagina: true,
      modificadoresScoring: { peso_industria: 20 },
    },
    {
      slug: "contable",
      nombre: "Estudio contable",
      nombrePlural: "Estudios contables",
      activo: true,
      orden: 2,
      tienePagina: true,
      modificadoresScoring: { peso_industria: 20 },
    },
    {
      slug: "juridico",
      nombre: "Estudio jurídico",
      nombrePlural: "Estudios jurídicos",
      activo: true,
      orden: 3,
      tienePagina: true,
      modificadoresScoring: { peso_industria: 20 },
    },
    {
      slug: "otro",
      nombre: "Otro rubro",
      nombrePlural: "Otros rubros",
      activo: true,
      orden: 99,
      tienePagina: false,
      modificadoresScoring: { peso_industria: 5 },
    },
  ];

  for (const row of industryRows) {
    await db
      .insert(industries)
      .values(row)
      .onDuplicateKeyUpdate({ set: { nombre: row.nombre } });
  }

  const toolRows: (typeof toolDefinitions.$inferInsert)[] = [
    {
      slug: "calculadora-tareas-repetitivas",
      nombre: "Calculadora de Costo de Tareas Repetitivas",
      tipo: "calculator",
      activo: true,
      config: {
        semanas_por_ano: 48,
        horas_por_mes: 160,
      },
      version: "1.0.0",
    },
    {
      slug: "biblioteca-prompts",
      nombre: "Biblioteca de Prompts por Función",
      tipo: "library",
      activo: true,
      config: {},
      version: "1.0.0",
    },
  ];

  for (const row of toolRows) {
    await db
      .insert(toolDefinitions)
      .values(row)
      .onDuplicateKeyUpdate({ set: { nombre: row.nombre } });
  }

  await connection.end();
  console.log(
    `Seeded ${industryRows.length} industries and ${toolRows.length} tool definitions.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
