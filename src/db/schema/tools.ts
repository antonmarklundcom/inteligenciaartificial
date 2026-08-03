import {
  bigint,
  boolean,
  char,
  date,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  smallint,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { adminUsers } from "./core";

export const toolTipoEnum = ["assessment", "calculator", "library"] as const;

export const toolDefinitions = mysqlTable("tool_definitions", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  nombre: varchar("nombre", { length: 128 }).notNull(),
  tipo: mysqlEnum("tipo", toolTipoEnum).notNull(),
  activo: boolean("activo").notNull().default(true),
  config: json("config").notNull(),
  version: varchar("version", { length: 16 }).notNull(),
  updatedBy: bigint("updated_by", { mode: "number" }).references(
    () => adminUsers.id,
  ),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const toolUsageEventEnum = [
  "viewed",
  "started",
  "step_completed",
  "completed",
  "abandoned",
  "gated",
  "shared",
] as const;

export const toolUsageEvents = mysqlTable(
  "tool_usage_events",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    toolId: bigint("tool_id", { mode: "number" })
      .notNull()
      .references(() => toolDefinitions.id),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    leadId: bigint("lead_id", { mode: "number" }),
    event: mysqlEnum("event", toolUsageEventEnum).notNull(),
    step: tinyint("step"),
    durationMs: int("duration_ms"),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("tool_usage_events_tool_event_created_idx").on(
      table.toolId,
      table.event,
      table.createdAt,
    ),
    index("tool_usage_events_session_id_idx").on(table.sessionId),
  ],
);

export const salarioBandEnum = [
  "menos_2m",
  "2m_4m",
  "4m_6m",
  "6m_10m",
  "10m_15m",
  "mas_15m",
] as const;

export const calculatorSessions = mysqlTable("calculator_sessions", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  publicId: char("public_id", { length: 26 }).notNull().unique(),
  resultToken: char("result_token", { length: 43 }).notNull().unique(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  leadId: bigint("lead_id", { mode: "number" }),
  tareaDescripcion: varchar("tarea_descripcion", { length: 160 }).notNull(),
  personas: smallint("personas").notNull(),
  minutosPorOcurrencia: smallint("minutos_por_ocurrencia").notNull(),
  ocurrenciasSemana: smallint("ocurrencias_semana").notNull(),
  salarioBand: mysqlEnum("salario_band", salarioBandEnum).notNull(),
  pctMecanico: tinyint("pct_mecanico").notNull(),
  horasAnuales: decimal("horas_anuales", { precision: 10, scale: 2 }).notNull(),
  costoAnualGs: bigint("costo_anual_gs", { mode: "number" }).notNull(),
  bandaConservadoraGs: bigint("banda_conservadora_gs", {
    mode: "number",
  }).notNull(),
  bandaOptimistaGs: bigint("banda_optimista_gs", { mode: "number" }).notNull(),
  constantsVersion: varchar("constants_version", { length: 16 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  purgeAfter: date("purge_after"),
});

export const promptCategories = mysqlTable("prompt_categories", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  nombre: varchar("nombre", { length: 128 }).notNull(),
  descripcion: text("descripcion"),
  funcionNegocio: varchar("funcion_negocio", { length: 128 }),
  orden: int("orden").notNull().default(0),
  activo: boolean("activo").notNull().default(true),
});

export const promptNivelEnum = ["basico", "intermedio", "avanzado"] as const;

export const prompts = mysqlTable(
  "prompts",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    categoryId: bigint("category_id", { mode: "number" })
      .notNull()
      .references(() => promptCategories.id),
    titulo: varchar("titulo", { length: 255 }).notNull(),
    objetivo: text("objetivo").notNull(),
    cuandoUsar: text("cuando_usar").notNull(),
    cuandoNoUsar: text("cuando_no_usar").notNull(),
    queVerificar: text("que_verificar").notNull(),
    textoPrompt: text("texto_prompt").notNull(),
    industrias: json("industrias"),
    nivel: mysqlEnum("nivel", promptNivelEnum).notNull(),
    probadoPor: bigint("probado_por", { mode: "number" }).references(
      () => adminUsers.id,
    ),
    probadoAt: timestamp("probado_at"),
    publicado: boolean("publicado").notNull().default(false),
    vistas: int("vistas").notNull().default(0),
    copias: int("copias").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("prompts_category_publicado_idx").on(
      table.categoryId,
      table.publicado,
    ),
  ],
);
