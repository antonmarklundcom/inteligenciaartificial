import {
  bigint,
  boolean,
  char,
  date,
  decimal,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  varchar,
} from "drizzle-orm/mysql-core";
import { adminUsers, leads } from "./core";

export const assessmentVersionStatusEnum = [
  "borrador",
  "publicado",
  "archivado",
] as const;

export const assessmentVersions = mysqlTable("assessment_versions", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  publicId: char("public_id", { length: 26 }).notNull().unique(),
  version: varchar("version", { length: 16 }).notNull().unique(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  status: mysqlEnum("status", assessmentVersionStatusEnum)
    .notNull()
    .default("borrador"),
  publishedAt: timestamp("published_at"),
  publishedBy: bigint("published_by", { mode: "number" }).references(
    () => adminUsers.id,
  ),
  snapshot: json("snapshot"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const questionFormatEnum = [
  "single_select",
  "multi_select",
  "scale",
  "number",
  "text",
] as const;

export const dimensionEnum = ["D1", "D2", "D3", "D4", "D5"] as const;

export const assessmentQuestions = mysqlTable(
  "assessment_questions",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    assessmentVersionId: bigint("assessment_version_id", { mode: "number" })
      .notNull()
      .references(() => assessmentVersions.id),
    codigo: varchar("codigo", { length: 16 }).notNull(),
    seccion: tinyint("seccion").notNull(),
    orden: tinyint("orden").notNull(),
    texto: text("texto").notNull(),
    textoAyuda: text("texto_ayuda"),
    formato: mysqlEnum("formato", questionFormatEnum).notNull(),
    dimension: mysqlEnum("dimension", dimensionEnum),
    required: boolean("required").notNull().default(true),
    maxSelections: tinyint("max_selections"),
    feedsLeadScore: boolean("feeds_lead_score").notNull().default(false),
  },
  (table) => [
    index("assessment_questions_version_codigo_uq").on(
      table.assessmentVersionId,
      table.codigo,
    ),
  ],
);

export const assessmentQuestionOptions = mysqlTable(
  "assessment_question_options",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    assessmentQuestionId: bigint("assessment_question_id", { mode: "number" })
      .notNull()
      .references(() => assessmentQuestions.id),
    codigo: varchar("codigo", { length: 16 }).notNull(),
    texto: varchar("texto", { length: 512 }).notNull(),
    orden: tinyint("orden").notNull(),
    score: decimal("score", { precision: 4, scale: 2 }).notNull(),
    leadScorePoints: tinyint("lead_score_points"),
    setsFlag: varchar("sets_flag", { length: 64 }),
  },
);

export const scoringRuleTypeEnum = [
  "dimension_weight",
  "industry_modifier",
  "maturity_band",
  "hard_override",
  "lead_score_weight",
] as const;

export const scoringRules = mysqlTable(
  "scoring_rules",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    assessmentVersionId: bigint("assessment_version_id", { mode: "number" }),
    ruleType: mysqlEnum("rule_type", scoringRuleTypeEnum).notNull(),
    key1: varchar("key_1", { length: 64 }).notNull(),
    key2: varchar("key_2", { length: 64 }),
    valueNum: decimal("value_num", { precision: 6, scale: 2 }),
    valueJson: json("value_json"),
    version: varchar("version", { length: 16 }).notNull(),
    active: boolean("active").notNull().default(true),
    createdBy: bigint("created_by", { mode: "number" }).references(
      () => adminUsers.id,
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("scoring_rules_type_active_idx").on(table.ruleType, table.active)],
);

export const assessmentStatusEnum = [
  "en_progreso",
  "completado",
  "abandonado",
] as const;

export const assessments = mysqlTable(
  "assessments",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    resultToken: char("result_token", { length: 43 }).notNull().unique(),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    assessmentVersionId: bigint("assessment_version_id", { mode: "number" })
      .notNull()
      .references(() => assessmentVersions.id),
    status: mysqlEnum("status", assessmentStatusEnum)
      .notNull()
      .default("en_progreso"),
    currentStep: tinyint("current_step").notNull().default(1),
    industria: varchar("industria", { length: 64 }),
    tamanoBand: varchar("tamano_band", { length: 16 }),
    ciudad: varchar("ciudad", { length: 128 }),
    rol: varchar("rol", { length: 128 }),
    scoreTotal: tinyint("score_total"),
    banda: tinyint("banda"),
    scoresPorDimension: json("scores_por_dimension"),
    scoringRuleVersion: varchar("scoring_rule_version", { length: 16 }),
    opportunities: json("opportunities"),
    flags: json("flags"),
    gated: boolean("gated").notNull().default(false),
    leadId: bigint("lead_id", { mode: "number" }).references(() => leads.id),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    lastActivityAt: timestamp("last_activity_at").notNull().defaultNow(),
    purgeAfter: date("purge_after"),
  },
  (table) => [
    index("assessments_session_id_idx").on(table.sessionId),
    index("assessments_status_last_activity_idx").on(
      table.status,
      table.lastActivityAt,
    ),
    index("assessments_purge_after_idx").on(table.purgeAfter),
  ],
);

export const assessmentAnswers = mysqlTable(
  "assessment_answers",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    assessmentId: bigint("assessment_id", { mode: "number" })
      .notNull()
      .references(() => assessments.id),
    assessmentQuestionId: bigint("assessment_question_id", { mode: "number" })
      .notNull()
      .references(() => assessmentQuestions.id),
    codigoPregunta: varchar("codigo_pregunta", { length: 16 }).notNull(),
    valorOpciones: json("valor_opciones"),
    valorNumero: decimal("valor_numero", { precision: 10, scale: 2 }),
    valorTexto: varchar("valor_texto", { length: 120 }),
    scoreCalculado: decimal("score_calculado", { precision: 4, scale: 2 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("assessment_answers_assessment_question_uq").on(
      table.assessmentId,
      table.assessmentQuestionId,
    ),
  ],
);

export const esfuerzoImpactoEnum = ["bajo", "medio", "alto"] as const;

export const opportunityCatalog = mysqlTable("opportunity_catalog", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 32 }).notNull().unique(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descripcion: text("descripcion").notNull(),
  precondiciones: text("precondiciones"),
  esfuerzo: mysqlEnum("esfuerzo", esfuerzoImpactoEnum).notNull(),
  impacto: mysqlEnum("impacto", esfuerzoImpactoEnum).notNull(),
  riesgos: text("riesgos"),
  queSeNecesita: text("que_se_necesita"),
  servicioRelacionado: varchar("servicio_relacionado", { length: 128 }),
  requiereIa: boolean("requiere_ia").notNull().default(true),
  activo: boolean("activo").notNull().default(true),
  createdBy: bigint("created_by", { mode: "number" }).references(
    () => adminUsers.id,
  ),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const opportunityRules = mysqlTable("opportunity_rules", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  opportunityId: bigint("opportunity_id", { mode: "number" })
    .notNull()
    .references(() => opportunityCatalog.id),
  condiciones: json("condiciones").notNull(),
  pesoImpacto: tinyint("peso_impacto").notNull(),
  pesoEsfuerzo: tinyint("peso_esfuerzo").notNull(),
  industrias: json("industrias"),
  activo: boolean("activo").notNull().default(true),
});

export const reportTipoEnum = ["diagnostico_madurez"] as const;
export const reportStatusEnum = [
  "pendiente",
  "generando",
  "completado",
  "fallido",
] as const;

export const generatedDocumentTipoEnum = [
  "report_pdf",
  "recurso",
  "otro",
] as const;
export const generatedDocumentOwnerTypeEnum = [
  "report",
  "lead",
  "admin",
] as const;

export const generatedDocuments = mysqlTable("generated_documents", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  publicId: char("public_id", { length: 26 }).notNull().unique(),
  tipo: mysqlEnum("tipo", generatedDocumentTipoEnum).notNull(),
  storageKey: varchar("storage_key", { length: 512 }).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 128 }).notNull(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
  checksumSha256: char("checksum_sha256", { length: 64 }).notNull(),
  ownerType: mysqlEnum("owner_type", generatedDocumentOwnerTypeEnum).notNull(),
  ownerId: bigint("owner_id", { mode: "number" }).notNull(),
  purgeAfter: date("purge_after"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const reports = mysqlTable(
  "reports",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    assessmentId: bigint("assessment_id", { mode: "number" })
      .notNull()
      .references(() => assessments.id),
    leadId: bigint("lead_id", { mode: "number" }).references(() => leads.id),
    tipo: mysqlEnum("tipo", reportTipoEnum).notNull().default(
      "diagnostico_madurez",
    ),
    status: mysqlEnum("status", reportStatusEnum).notNull().default(
      "pendiente",
    ),
    assessmentVersionId: bigint("assessment_version_id", { mode: "number" })
      .notNull()
      .references(() => assessmentVersions.id),
    scoringRuleVersion: varchar("scoring_rule_version", { length: 16 }).notNull(),
    reportTemplateVersion: varchar("report_template_version", {
      length: 16,
    }).notNull(),
    promptVersion: varchar("prompt_version", { length: 32 }),
    modelId: varchar("model_id", { length: 128 }),
    narrativa: json("narrativa"),
    contenidoDeterministico: json("contenido_deterministico"),
    generatedDocumentId: bigint("generated_document_id", {
      mode: "number",
    }).references(() => generatedDocuments.id),
    intentos: tinyint("intentos").notNull().default(0),
    errorMensaje: text("error_mensaje"),
    emailEnviadoAt: timestamp("email_enviado_at"),
    descargadoCount: tinyint("descargado_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    purgeAfter: date("purge_after"),
  },
  (table) => [
    index("reports_status_idx").on(table.status),
    index("reports_assessment_id_idx").on(table.assessmentId),
    index("reports_purge_after_idx").on(table.purgeAfter),
  ],
);
