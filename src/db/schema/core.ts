import {
  bigint,
  boolean,
  char,
  decimal,
  foreignKey,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varbinary,
  varchar,
} from "drizzle-orm/mysql-core";

export const industries = mysqlTable("industries", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  nombre: varchar("nombre", { length: 128 }).notNull(),
  nombrePlural: varchar("nombre_plural", { length: 128 }).notNull(),
  activo: boolean("activo").notNull().default(true),
  orden: int("orden").notNull().default(0),
  tienePagina: boolean("tiene_pagina").notNull().default(false),
  modificadoresScoring: json("modificadores_scoring"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const tamanoBandEnum = [
  "1-4",
  "5-9",
  "10-24",
  "25-49",
  "50-149",
  "150+",
] as const;

export const organizations = mysqlTable(
  "organizations",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    nombre: varchar("nombre", { length: 255 }).notNull(),
    nombreNormalizado: varchar("nombre_normalizado", { length: 255 }).notNull(),
    industryId: bigint("industry_id", { mode: "number" }).references(
      () => industries.id,
    ),
    tamanoBand: mysqlEnum("tamano_band", tamanoBandEnum),
    ciudad: varchar("ciudad", { length: 128 }),
    sitioWeb: varchar("sitio_web", { length: 255 }),
    esCliente: boolean("es_cliente").notNull().default(false),
    notasInternas: text("notas_internas"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("organizations_nombre_normalizado_idx").on(table.nombreNormalizado),
    index("organizations_industry_id_idx").on(table.industryId),
  ],
);

export const contacts = mysqlTable(
  "contacts",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    organizationId: bigint("organization_id", { mode: "number" })
      .notNull()
      .references(() => organizations.id),
    nombre: varchar("nombre", { length: 255 }),
    email: varchar("email", { length: 255 }),
    emailNormalizado: varchar("email_normalizado", { length: 255 }).notNull(),
    telefonoWhatsapp: varchar("telefono_whatsapp", { length: 20 }),
    rol: varchar("rol", { length: 128 }),
    emailVerificadoAt: timestamp("email_verificado_at"),
    unsubscribedAt: timestamp("unsubscribed_at"),
    anonymizedAt: timestamp("anonymized_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("contacts_email_normalizado_uq").on(table.emailNormalizado),
    index("contacts_organization_id_idx").on(table.organizationId),
  ],
);

export const consentTypeEnum = [
  "marketing_email",
  "data_processing",
  "cookies",
  "whatsapp_contact",
] as const;

export const consentRecords = mysqlTable(
  "consent_records",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    contactId: bigint("contact_id", { mode: "number" }).references(
      () => contacts.id,
    ),
    emailNormalizado: varchar("email_normalizado", { length: 255 }).notNull(),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    consentType: mysqlEnum("consent_type", consentTypeEnum).notNull(),
    granted: boolean("granted").notNull(),
    textoExacto: text("texto_exacto").notNull(),
    versionPolitica: varchar("version_politica", { length: 32 }).notNull(),
    ipAddress: varbinary("ip_address", { length: 16 }),
    userAgent: varchar("user_agent", { length: 512 }),
    sourcePage: varchar("source_page", { length: 255 }).notNull(),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
  },
  (table) => [
    index("consent_records_email_type_idx").on(
      table.emailNormalizado,
      table.consentType,
    ),
    index("consent_records_contact_id_idx").on(table.contactId),
  ],
);

export const leadSourceEnum = [
  "organic",
  "referral",
  "direct",
  "whatsapp",
  "linkedin",
  "email",
  "other",
] as const;

export const leadOrigenHerramientaEnum = [
  "diagnostico",
  "calculadora",
  "formulario",
  "whatsapp",
  "otro",
] as const;

export const leadBandEnum = ["A", "B", "C", "D", "X"] as const;

export const leadStageEnum = [
  "nuevo",
  "calificado",
  "llamada_agendada",
  "llamada_realizada",
  "propuesta_enviada",
  "negociacion",
  "ganado",
  "perdido",
  "descalificado",
  "en_espera_capacidad",
] as const;

export const disqualifiedReasonEnum = [
  "DQ_STUDENT",
  "DQ_SIZE",
  "DQ_GEO",
  "DQ_NO_BUDGET",
  "DQ_SPAM",
  "DQ_COMPETITOR",
  "DQ_SCOPE",
  "DQ_HEADCOUNT",
  "DQ_CAPACITY_DECLINED",
] as const;

export const leads = mysqlTable(
  "leads",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    organizationId: bigint("organization_id", { mode: "number" })
      .notNull()
      .references(() => organizations.id),
    contactId: bigint("contact_id", { mode: "number" })
      .notNull()
      .references(() => contacts.id),
    source: mysqlEnum("source", leadSourceEnum).notNull(),
    medium: varchar("medium", { length: 128 }),
    campaign: varchar("campaign", { length: 128 }),
    landingPage: varchar("landing_page", { length: 512 }),
    referrerUrl: varchar("referrer_url", { length: 512 }),
    firstTouchAt: timestamp("first_touch_at").notNull().defaultNow(),
    lastTouchAt: timestamp("last_touch_at").notNull().defaultNow(),
    origenHerramienta: mysqlEnum(
      "origen_herramienta",
      leadOrigenHerramientaEnum,
    ).notNull(),
    assessmentId: bigint("assessment_id", { mode: "number" }),
    score: tinyint("score", { unsigned: true }),
    band: mysqlEnum("band", leadBandEnum),
    stage: mysqlEnum("stage", leadStageEnum).notNull().default("nuevo"),
    disqualifiedReason: mysqlEnum(
      "disqualified_reason",
      disqualifiedReasonEnum,
    ),
    reviewFlag: varchar("review_flag", { length: 64 }),
    reviewClearedBy: bigint("review_cleared_by", { mode: "number" }),
    reviewClearedAt: timestamp("review_cleared_at"),
    scoreOverride: tinyint("score_override"),
    scoreOverrideBy: bigint("score_override_by", { mode: "number" }),
    scoreOverrideReason: text("score_override_reason"),
    procesoDeclarado: varchar("proceso_declarado", { length: 255 }),
    ownerAdminUserId: bigint("owner_admin_user_id", { mode: "number" }),
    valorEstimadoUsd: decimal("valor_estimado_usd", {
      precision: 10,
      scale: 2,
    }),
    closedAt: timestamp("closed_at"),
    notas: text("notas"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("leads_band_stage_idx").on(table.band, table.stage),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_organization_id_idx").on(table.organizationId),
    index("leads_source_idx").on(table.source),
  ],
);

export const leadScoreTriggerEnum = [
  "creacion",
  "evento",
  "recalculo_admin",
  "cambio_reglas",
] as const;

export const leadScores = mysqlTable(
  "lead_scores",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    leadId: bigint("lead_id", { mode: "number" })
      .notNull()
      .references(() => leads.id),
    score: tinyint("score", { unsigned: true }).notNull(),
    band: mysqlEnum("band", leadBandEnum).notNull(),
    scoringRuleVersion: varchar("scoring_rule_version", {
      length: 16,
    }).notNull(),
    breakdown: json("breakdown").notNull(),
    trigger: mysqlEnum("trigger", leadScoreTriggerEnum).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("lead_scores_lead_id_created_at_idx").on(
      table.leadId,
      table.createdAt,
    ),
  ],
);

export const leadEventTypeEnum = [
  "page_view",
  "tool_started",
  "tool_completed",
  "gate_submitted",
  "whatsapp_click",
  "pricing_view",
  "resource_download",
  "email_open",
  "email_click",
  "form_submitted",
  "booking_created",
  "call_completed",
] as const;

export const leadEvents = mysqlTable(
  "lead_events",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    leadId: bigint("lead_id", { mode: "number" }),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    eventType: mysqlEnum("event_type", leadEventTypeEnum).notNull(),
    pagePath: varchar("page_path", { length: 512 }),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("lead_events_lead_id_created_at_idx").on(
      table.leadId,
      table.createdAt,
    ),
    index("lead_events_session_id_idx").on(table.sessionId),
    index("lead_events_event_type_created_at_idx").on(
      table.eventType,
      table.createdAt,
    ),
  ],
);

export const urgenciaEnum = ["baja", "media", "alta"] as const;
export const presupuestoBandEnum = [
  "definido",
  "aproximado",
  "podriamos_definirlo",
  "no",
] as const;

export const consultationRequestStatusEnum = [
  "nuevo",
  "contactado",
  "agendado",
  "realizado",
  "no_show",
  "descartado",
] as const;

export const consultationRequests = mysqlTable("consultation_requests", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  publicId: char("public_id", { length: 26 }).notNull().unique(),
  leadId: bigint("lead_id", { mode: "number" }),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  industria: varchar("industria", { length: 64 }),
  tamanoBand: mysqlEnum("tamano_band", tamanoBandEnum),
  procesoAResolver: text("proceso_a_resolver").notNull(),
  urgencia: mysqlEnum("urgencia", urgenciaEnum).notNull(),
  presupuestoBand: mysqlEnum("presupuesto_band", presupuestoBandEnum),
  origenPagina: varchar("origen_pagina", { length: 255 }).notNull(),
  bookingExternalId: varchar("booking_external_id", { length: 128 }),
  status: mysqlEnum("status", consultationRequestStatusEnum)
    .notNull()
    .default("nuevo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const newsletterStatusEnum = ["activo", "baja", "rebotado"] as const;

export const newsletterSubscribers = mysqlTable(
  "newsletter_subscribers",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    emailNormalizado: varchar("email_normalizado", { length: 255 })
      .notNull()
      .unique(),
    nombre: varchar("nombre", { length: 255 }),
    contactId: bigint("contact_id", { mode: "number" }),
    consentRecordId: bigint("consent_record_id", { mode: "number" }).notNull(),
    status: mysqlEnum("status", newsletterStatusEnum)
      .notNull()
      .default("activo"),
    source: varchar("source", { length: 128 }).notNull(),
    unsubscribeToken: char("unsubscribe_token", { length: 43 })
      .notNull()
      .unique(),
    subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
    unsubscribedAt: timestamp("unsubscribed_at"),
  },
  (table) => [
    foreignKey({
      columns: [table.consentRecordId],
      foreignColumns: [consentRecords.id],
      name: "newsletter_consent_fk",
    }),
  ],
);

export const adminRoleEnum = [
  "owner",
  "admin",
  "editor",
  "sales",
  "readonly",
] as const;

export const adminUsers = mysqlTable("admin_users", {
  id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
  publicId: char("public_id", { length: 26 }).notNull().unique(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  rol: mysqlEnum("rol", adminRoleEnum).notNull(),
  activo: boolean("activo").notNull().default(true),
  mfaSecret: varchar("mfa_secret", { length: 255 }),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    adminUserId: bigint("admin_user_id", { mode: "number" }),
    action: varchar("action", { length: 128 }).notNull(),
    entityType: varchar("entity_type", { length: 64 }).notNull(),
    entityId: bigint("entity_id", { mode: "number" }).notNull(),
    before: json("before"),
    after: json("after"),
    ipAddress: varbinary("ip_address", { length: 16 }).notNull(),
    userAgent: varchar("user_agent", { length: 512 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_admin_user_created_at_idx").on(
      table.adminUserId,
      table.createdAt,
    ),
  ],
);
