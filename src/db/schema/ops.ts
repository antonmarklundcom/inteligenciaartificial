import {
  bigint,
  char,
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

export const crmEntityTypeEnum = [
  "lead",
  "contact",
  "organization",
  "consultation",
] as const;
export const crmOperationEnum = ["create", "update"] as const;
export const crmSyncStatusEnum = [
  "pendiente",
  "enviando",
  "exitoso",
  "fallido",
  "descartado",
] as const;

export const crmSyncEvents = mysqlTable(
  "crm_sync_events",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    publicId: char("public_id", { length: 26 }).notNull().unique(),
    entityType: mysqlEnum("entity_type", crmEntityTypeEnum).notNull(),
    entityId: bigint("entity_id", { mode: "number" }).notNull(),
    operation: mysqlEnum("operation", crmOperationEnum).notNull(),
    idempotencyKey: char("idempotency_key", { length: 64 }).notNull().unique(),
    payload: json("payload").notNull(),
    payloadVersion: varchar("payload_version", { length: 16 }).notNull(),
    status: mysqlEnum("status", crmSyncStatusEnum).notNull().default(
      "pendiente",
    ),
    intentos: tinyint("intentos").notNull().default(0),
    nextRetryAt: timestamp("next_retry_at"),
    responseStatus: smallint("response_status"),
    responseBody: text("response_body"),
    errorMensaje: text("error_mensaje"),
    crmRemoteId: varchar("crm_remote_id", { length: 128 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    sentAt: timestamp("sent_at"),
  },
  (table) => [
    index("crm_sync_events_status_next_retry_idx").on(
      table.status,
      table.nextRetryAt,
    ),
    index("crm_sync_events_entity_idx").on(table.entityType, table.entityId),
  ],
);

export const jobTypeEnum = [
  "generate_report",
  "send_email",
  "sync_crm",
  "purge_expired_data",
  "recalculate_lead_scores",
  "warm_sitemap",
] as const;
export const jobStatusEnum = [
  "pendiente",
  "procesando",
  "completado",
  "fallido",
] as const;

export const jobs = mysqlTable(
  "jobs",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    queue: varchar("queue", { length: 64 }).notNull().default("default"),
    type: mysqlEnum("type", jobTypeEnum).notNull(),
    payload: json("payload").notNull(),
    status: mysqlEnum("status", jobStatusEnum).notNull().default("pendiente"),
    intentos: tinyint("intentos").notNull().default(0),
    maxIntentos: tinyint("max_intentos").notNull().default(3),
    availableAt: timestamp("available_at").notNull().defaultNow(),
    lockedAt: timestamp("locked_at"),
    lockedBy: varchar("locked_by", { length: 64 }),
    error: text("error"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("jobs_queue_status_available_idx").on(
      table.queue,
      table.status,
      table.availableAt,
    ),
  ],
);

export const aiGenerationFeatureEnum = [
  "report_narrative",
  "opportunity_rephrase",
] as const;
export const aiGenerationStatusEnum = [
  "ok",
  "rechazado_validacion",
  "error",
  "fallback_usado",
] as const;

export const aiGenerations = mysqlTable(
  "ai_generations",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    feature: mysqlEnum("feature", aiGenerationFeatureEnum).notNull(),
    promptVersion: varchar("prompt_version", { length: 32 }).notNull(),
    modelId: varchar("model_id", { length: 128 }).notNull(),
    provider: varchar("provider", { length: 64 }).notNull(),
    inputTokens: int("input_tokens").notNull(),
    outputTokens: int("output_tokens").notNull(),
    costUsd: decimal("cost_usd", { precision: 8, scale: 5 }).notNull(),
    latencyMs: int("latency_ms").notNull(),
    status: mysqlEnum("status", aiGenerationStatusEnum).notNull(),
    validationErrors: json("validation_errors"),
    relatedType: varchar("related_type", { length: 64 }).notNull(),
    relatedId: bigint("related_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("ai_generations_feature_created_idx").on(
      table.feature,
      table.createdAt,
    ),
    index("ai_generations_status_idx").on(table.status),
  ],
);
