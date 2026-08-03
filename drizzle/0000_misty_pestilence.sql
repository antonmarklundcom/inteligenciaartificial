CREATE TABLE `admin_users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`rol` enum('owner','admin','editor','sales','readonly') NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	`mfa_secret` varchar(255),
	`last_login_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`admin_user_id` bigint,
	`action` varchar(128) NOT NULL,
	`entity_type` varchar(64) NOT NULL,
	`entity_id` bigint NOT NULL,
	`before` json,
	`after` json,
	`ip_address` varbinary(16) NOT NULL,
	`user_agent` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consent_records` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`contact_id` bigint,
	`email_normalizado` varchar(255) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`consent_type` enum('marketing_email','data_processing','cookies','whatsapp_contact') NOT NULL,
	`granted` boolean NOT NULL,
	`texto_exacto` text NOT NULL,
	`version_politica` varchar(32) NOT NULL,
	`ip_address` varbinary(16),
	`user_agent` varchar(512),
	`source_page` varchar(255) NOT NULL,
	`granted_at` timestamp NOT NULL DEFAULT (now()),
	`revoked_at` timestamp,
	CONSTRAINT `consent_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `consent_records_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `consultation_requests` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`lead_id` bigint,
	`nombre` varchar(255) NOT NULL,
	`empresa` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`whatsapp` varchar(20),
	`industria` varchar(64),
	`tamano_band` enum('1-4','5-9','10-24','25-49','50-149','150+'),
	`proceso_a_resolver` text NOT NULL,
	`urgencia` enum('baja','media','alta') NOT NULL,
	`presupuesto_band` enum('definido','aproximado','podriamos_definirlo','no'),
	`origen_pagina` varchar(255) NOT NULL,
	`booking_external_id` varchar(128),
	`status` enum('nuevo','contactado','agendado','realizado','no_show','descartado') NOT NULL DEFAULT 'nuevo',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultation_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `consultation_requests_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`organization_id` bigint NOT NULL,
	`nombre` varchar(255),
	`email` varchar(255),
	`email_normalizado` varchar(255) NOT NULL,
	`telefono_whatsapp` varchar(20),
	`rol` varchar(128),
	`email_verificado_at` timestamp,
	`unsubscribed_at` timestamp,
	`anonymized_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `contacts_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `contacts_email_normalizado_uq` UNIQUE(`email_normalizado`)
);
--> statement-breakpoint
CREATE TABLE `industries` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`nombre` varchar(128) NOT NULL,
	`nombre_plural` varchar(128) NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	`orden` int NOT NULL DEFAULT 0,
	`tiene_pagina` boolean NOT NULL DEFAULT false,
	`modificadores_scoring` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `industries_id` PRIMARY KEY(`id`),
	CONSTRAINT `industries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `lead_events` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`lead_id` bigint,
	`session_id` varchar(64) NOT NULL,
	`event_type` enum('page_view','tool_started','tool_completed','gate_submitted','whatsapp_click','pricing_view','resource_download','email_open','email_click','form_submitted','booking_created','call_completed') NOT NULL,
	`page_path` varchar(512),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_scores` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`lead_id` bigint NOT NULL,
	`score` tinyint unsigned NOT NULL,
	`band` enum('A','B','C','D','X') NOT NULL,
	`scoring_rule_version` varchar(16) NOT NULL,
	`breakdown` json NOT NULL,
	`trigger` enum('creacion','evento','recalculo_admin','cambio_reglas') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lead_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`organization_id` bigint NOT NULL,
	`contact_id` bigint NOT NULL,
	`source` enum('organic','referral','direct','whatsapp','linkedin','email','other') NOT NULL,
	`medium` varchar(128),
	`campaign` varchar(128),
	`landing_page` varchar(512),
	`referrer_url` varchar(512),
	`first_touch_at` timestamp NOT NULL DEFAULT (now()),
	`last_touch_at` timestamp NOT NULL DEFAULT (now()),
	`origen_herramienta` enum('diagnostico','calculadora','formulario','whatsapp','otro') NOT NULL,
	`assessment_id` bigint,
	`score` tinyint unsigned,
	`band` enum('A','B','C','D','X'),
	`stage` enum('nuevo','calificado','llamada_agendada','llamada_realizada','propuesta_enviada','negociacion','ganado','perdido','descalificado','en_espera_capacidad') NOT NULL DEFAULT 'nuevo',
	`disqualified_reason` enum('DQ_STUDENT','DQ_SIZE','DQ_GEO','DQ_NO_BUDGET','DQ_SPAM','DQ_COMPETITOR','DQ_SCOPE','DQ_HEADCOUNT','DQ_CAPACITY_DECLINED'),
	`review_flag` varchar(64),
	`review_cleared_by` bigint,
	`review_cleared_at` timestamp,
	`score_override` tinyint,
	`score_override_by` bigint,
	`score_override_reason` text,
	`proceso_declarado` varchar(255),
	`owner_admin_user_id` bigint,
	`valor_estimado_usd` decimal(10,2),
	`closed_at` timestamp,
	`notas` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`email_normalizado` varchar(255) NOT NULL,
	`nombre` varchar(255),
	`contact_id` bigint,
	`consent_record_id` bigint NOT NULL,
	`status` enum('activo','baja','rebotado') NOT NULL DEFAULT 'activo',
	`source` varchar(128) NOT NULL,
	`unsubscribe_token` char(43) NOT NULL,
	`subscribed_at` timestamp NOT NULL DEFAULT (now()),
	`unsubscribed_at` timestamp,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `newsletter_subscribers_email_normalizado_unique` UNIQUE(`email_normalizado`),
	CONSTRAINT `newsletter_subscribers_unsubscribe_token_unique` UNIQUE(`unsubscribe_token`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`nombre_normalizado` varchar(255) NOT NULL,
	`industry_id` bigint,
	`tamano_band` enum('1-4','5-9','10-24','25-49','50-149','150+'),
	`ciudad` varchar(128),
	`sitio_web` varchar(255),
	`es_cliente` boolean NOT NULL DEFAULT false,
	`notas_internas` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_answers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`assessment_id` bigint NOT NULL,
	`assessment_question_id` bigint NOT NULL,
	`codigo_pregunta` varchar(16) NOT NULL,
	`valor_opciones` json,
	`valor_numero` decimal(10,2),
	`valor_texto` varchar(120),
	`score_calculado` decimal(4,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_question_options` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`assessment_question_id` bigint NOT NULL,
	`codigo` varchar(16) NOT NULL,
	`texto` varchar(512) NOT NULL,
	`orden` tinyint NOT NULL,
	`score` decimal(4,2) NOT NULL,
	`lead_score_points` tinyint,
	`sets_flag` varchar(64),
	CONSTRAINT `assessment_question_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_questions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`assessment_version_id` bigint NOT NULL,
	`codigo` varchar(16) NOT NULL,
	`seccion` tinyint NOT NULL,
	`orden` tinyint NOT NULL,
	`texto` text NOT NULL,
	`texto_ayuda` text,
	`formato` enum('single_select','multi_select','scale','number','text') NOT NULL,
	`dimension` enum('D1','D2','D3','D4','D5'),
	`required` boolean NOT NULL DEFAULT true,
	`max_selections` tinyint,
	`feeds_lead_score` boolean NOT NULL DEFAULT false,
	CONSTRAINT `assessment_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_versions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`version` varchar(16) NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`descripcion` text,
	`status` enum('borrador','publicado','archivado') NOT NULL DEFAULT 'borrador',
	`published_at` timestamp,
	`published_by` bigint,
	`snapshot` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessment_versions_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `assessment_versions_version_unique` UNIQUE(`version`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`result_token` char(43) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`assessment_version_id` bigint NOT NULL,
	`status` enum('en_progreso','completado','abandonado') NOT NULL DEFAULT 'en_progreso',
	`current_step` tinyint NOT NULL DEFAULT 1,
	`industria` varchar(64),
	`tamano_band` varchar(16),
	`ciudad` varchar(128),
	`rol` varchar(128),
	`score_total` tinyint,
	`banda` tinyint,
	`scores_por_dimension` json,
	`scoring_rule_version` varchar(16),
	`opportunities` json,
	`flags` json,
	`gated` boolean NOT NULL DEFAULT false,
	`lead_id` bigint,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`last_activity_at` timestamp NOT NULL DEFAULT (now()),
	`purge_after` date,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessments_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `assessments_result_token_unique` UNIQUE(`result_token`)
);
--> statement-breakpoint
CREATE TABLE `generated_documents` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`tipo` enum('report_pdf','recurso','otro') NOT NULL,
	`storage_key` varchar(512) NOT NULL,
	`filename` varchar(255) NOT NULL,
	`mime_type` varchar(128) NOT NULL,
	`size_bytes` bigint NOT NULL,
	`checksum_sha256` char(64) NOT NULL,
	`owner_type` enum('report','lead','admin') NOT NULL,
	`owner_id` bigint NOT NULL,
	`purge_after` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `generated_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `generated_documents_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `opportunity_catalog` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`codigo` varchar(32) NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descripcion` text NOT NULL,
	`precondiciones` text,
	`esfuerzo` enum('bajo','medio','alto') NOT NULL,
	`impacto` enum('bajo','medio','alto') NOT NULL,
	`riesgos` text,
	`que_se_necesita` text,
	`servicio_relacionado` varchar(128),
	`requiere_ia` boolean NOT NULL DEFAULT true,
	`activo` boolean NOT NULL DEFAULT true,
	`created_by` bigint,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunity_catalog_id` PRIMARY KEY(`id`),
	CONSTRAINT `opportunity_catalog_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `opportunity_rules` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`opportunity_id` bigint NOT NULL,
	`condiciones` json NOT NULL,
	`peso_impacto` tinyint NOT NULL,
	`peso_esfuerzo` tinyint NOT NULL,
	`industrias` json,
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `opportunity_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`assessment_id` bigint NOT NULL,
	`lead_id` bigint,
	`tipo` enum('diagnostico_madurez') NOT NULL DEFAULT 'diagnostico_madurez',
	`status` enum('pendiente','generando','completado','fallido') NOT NULL DEFAULT 'pendiente',
	`assessment_version_id` bigint NOT NULL,
	`scoring_rule_version` varchar(16) NOT NULL,
	`report_template_version` varchar(16) NOT NULL,
	`prompt_version` varchar(32),
	`model_id` varchar(128),
	`narrativa` json,
	`contenido_deterministico` json,
	`generated_document_id` bigint,
	`intentos` tinyint NOT NULL DEFAULT 0,
	`error_mensaje` text,
	`email_enviado_at` timestamp,
	`descargado_count` tinyint NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`purge_after` date,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `reports_public_id_unique` UNIQUE(`public_id`)
);
--> statement-breakpoint
CREATE TABLE `scoring_rules` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`assessment_version_id` bigint,
	`rule_type` enum('dimension_weight','industry_modifier','maturity_band','hard_override','lead_score_weight') NOT NULL,
	`key_1` varchar(64) NOT NULL,
	`key_2` varchar(64),
	`value_num` decimal(6,2),
	`value_json` json,
	`version` varchar(16) NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`created_by` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scoring_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `calculator_sessions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`result_token` char(43) NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`lead_id` bigint,
	`tarea_descripcion` varchar(160) NOT NULL,
	`personas` smallint NOT NULL,
	`minutos_por_ocurrencia` smallint NOT NULL,
	`ocurrencias_semana` smallint NOT NULL,
	`salario_band` enum('menos_2m','2m_4m','4m_6m','6m_10m','10m_15m','mas_15m') NOT NULL,
	`pct_mecanico` tinyint NOT NULL,
	`horas_anuales` decimal(10,2) NOT NULL,
	`costo_anual_gs` bigint NOT NULL,
	`banda_conservadora_gs` bigint NOT NULL,
	`banda_optimista_gs` bigint NOT NULL,
	`constants_version` varchar(16) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`purge_after` date,
	CONSTRAINT `calculator_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `calculator_sessions_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `calculator_sessions_result_token_unique` UNIQUE(`result_token`)
);
--> statement-breakpoint
CREATE TABLE `prompt_categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`nombre` varchar(128) NOT NULL,
	`descripcion` text,
	`funcion_negocio` varchar(128),
	`orden` int NOT NULL DEFAULT 0,
	`activo` boolean NOT NULL DEFAULT true,
	CONSTRAINT `prompt_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompt_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`category_id` bigint NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`objetivo` text NOT NULL,
	`cuando_usar` text NOT NULL,
	`cuando_no_usar` text NOT NULL,
	`que_verificar` text NOT NULL,
	`texto_prompt` text NOT NULL,
	`industrias` json,
	`nivel` enum('basico','intermedio','avanzado') NOT NULL,
	`probado_por` bigint,
	`probado_at` timestamp,
	`publicado` boolean NOT NULL DEFAULT false,
	`vistas` int NOT NULL DEFAULT 0,
	`copias` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompts_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `prompts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tool_definitions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`nombre` varchar(128) NOT NULL,
	`tipo` enum('assessment','calculator','library') NOT NULL,
	`activo` boolean NOT NULL DEFAULT true,
	`config` json NOT NULL,
	`version` varchar(16) NOT NULL,
	`updated_by` bigint,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tool_definitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `tool_definitions_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tool_usage_events` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tool_id` bigint NOT NULL,
	`session_id` varchar(64) NOT NULL,
	`lead_id` bigint,
	`event` enum('viewed','started','step_completed','completed','abandoned','gated','shared') NOT NULL,
	`step` tinyint,
	`duration_ms` int,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tool_usage_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_generations` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`feature` enum('report_narrative','opportunity_rephrase') NOT NULL,
	`prompt_version` varchar(32) NOT NULL,
	`model_id` varchar(128) NOT NULL,
	`provider` varchar(64) NOT NULL,
	`input_tokens` int NOT NULL,
	`output_tokens` int NOT NULL,
	`cost_usd` decimal(8,5) NOT NULL,
	`latency_ms` int NOT NULL,
	`status` enum('ok','rechazado_validacion','error','fallback_usado') NOT NULL,
	`validation_errors` json,
	`related_type` varchar(64) NOT NULL,
	`related_id` bigint NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_sync_events` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`public_id` char(26) NOT NULL,
	`entity_type` enum('lead','contact','organization','consultation') NOT NULL,
	`entity_id` bigint NOT NULL,
	`operation` enum('create','update') NOT NULL,
	`idempotency_key` char(64) NOT NULL,
	`payload` json NOT NULL,
	`payload_version` varchar(16) NOT NULL,
	`status` enum('pendiente','enviando','exitoso','fallido','descartado') NOT NULL DEFAULT 'pendiente',
	`intentos` tinyint NOT NULL DEFAULT 0,
	`next_retry_at` timestamp,
	`response_status` smallint,
	`response_body` text,
	`error_mensaje` text,
	`crm_remote_id` varchar(128),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`sent_at` timestamp,
	CONSTRAINT `crm_sync_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_sync_events_public_id_unique` UNIQUE(`public_id`),
	CONSTRAINT `crm_sync_events_idempotency_key_unique` UNIQUE(`idempotency_key`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`queue` varchar(64) NOT NULL DEFAULT 'default',
	`type` enum('generate_report','send_email','sync_crm','purge_expired_data','recalculate_lead_scores','warm_sitemap') NOT NULL,
	`payload` json NOT NULL,
	`status` enum('pendiente','procesando','completado','fallido') NOT NULL DEFAULT 'pendiente',
	`intentos` tinyint NOT NULL DEFAULT 0,
	`max_intentos` tinyint NOT NULL DEFAULT 3,
	`available_at` timestamp NOT NULL DEFAULT (now()),
	`locked_at` timestamp,
	`locked_by` varchar(64),
	`error` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `consent_records` ADD CONSTRAINT `consent_records_contact_id_contacts_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lead_scores` ADD CONSTRAINT `lead_scores_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_contact_id_contacts_id_fk` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD CONSTRAINT `newsletter_consent_fk` FOREIGN KEY (`consent_record_id`) REFERENCES `consent_records`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_industry_id_industries_id_fk` FOREIGN KEY (`industry_id`) REFERENCES `industries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_answers` ADD CONSTRAINT `assessment_answers_assessment_id_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_answers` ADD CONSTRAINT `aa_question_fk` FOREIGN KEY (`assessment_question_id`) REFERENCES `assessment_questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_question_options` ADD CONSTRAINT `aqo_question_fk` FOREIGN KEY (`assessment_question_id`) REFERENCES `assessment_questions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_questions` ADD CONSTRAINT `aq_version_fk` FOREIGN KEY (`assessment_version_id`) REFERENCES `assessment_versions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_versions` ADD CONSTRAINT `assessment_versions_published_by_admin_users_id_fk` FOREIGN KEY (`published_by`) REFERENCES `admin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_assessment_version_id_assessment_versions_id_fk` FOREIGN KEY (`assessment_version_id`) REFERENCES `assessment_versions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opportunity_catalog` ADD CONSTRAINT `opportunity_catalog_created_by_admin_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `opportunity_rules` ADD CONSTRAINT `opportunity_rules_opportunity_id_opportunity_catalog_id_fk` FOREIGN KEY (`opportunity_id`) REFERENCES `opportunity_catalog`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_assessment_id_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_assessment_version_id_assessment_versions_id_fk` FOREIGN KEY (`assessment_version_id`) REFERENCES `assessment_versions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_generated_document_id_generated_documents_id_fk` FOREIGN KEY (`generated_document_id`) REFERENCES `generated_documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scoring_rules` ADD CONSTRAINT `scoring_rules_created_by_admin_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts` ADD CONSTRAINT `prompts_category_id_prompt_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `prompt_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prompts` ADD CONSTRAINT `prompts_probado_por_admin_users_id_fk` FOREIGN KEY (`probado_por`) REFERENCES `admin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tool_definitions` ADD CONSTRAINT `tool_definitions_updated_by_admin_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `admin_users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tool_usage_events` ADD CONSTRAINT `tool_usage_events_tool_id_tool_definitions_id_fk` FOREIGN KEY (`tool_id`) REFERENCES `tool_definitions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_logs_entity_idx` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `audit_logs_admin_user_created_at_idx` ON `audit_logs` (`admin_user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `consent_records_email_type_idx` ON `consent_records` (`email_normalizado`,`consent_type`);--> statement-breakpoint
CREATE INDEX `consent_records_contact_id_idx` ON `consent_records` (`contact_id`);--> statement-breakpoint
CREATE INDEX `contacts_organization_id_idx` ON `contacts` (`organization_id`);--> statement-breakpoint
CREATE INDEX `lead_events_lead_id_created_at_idx` ON `lead_events` (`lead_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `lead_events_session_id_idx` ON `lead_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `lead_events_event_type_created_at_idx` ON `lead_events` (`event_type`,`created_at`);--> statement-breakpoint
CREATE INDEX `lead_scores_lead_id_created_at_idx` ON `lead_scores` (`lead_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `leads_band_stage_idx` ON `leads` (`band`,`stage`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_organization_id_idx` ON `leads` (`organization_id`);--> statement-breakpoint
CREATE INDEX `leads_source_idx` ON `leads` (`source`);--> statement-breakpoint
CREATE INDEX `organizations_nombre_normalizado_idx` ON `organizations` (`nombre_normalizado`);--> statement-breakpoint
CREATE INDEX `organizations_industry_id_idx` ON `organizations` (`industry_id`);--> statement-breakpoint
CREATE INDEX `assessment_answers_assessment_question_uq` ON `assessment_answers` (`assessment_id`,`assessment_question_id`);--> statement-breakpoint
CREATE INDEX `assessment_questions_version_codigo_uq` ON `assessment_questions` (`assessment_version_id`,`codigo`);--> statement-breakpoint
CREATE INDEX `assessments_session_id_idx` ON `assessments` (`session_id`);--> statement-breakpoint
CREATE INDEX `assessments_status_last_activity_idx` ON `assessments` (`status`,`last_activity_at`);--> statement-breakpoint
CREATE INDEX `assessments_purge_after_idx` ON `assessments` (`purge_after`);--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `reports_assessment_id_idx` ON `reports` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `reports_purge_after_idx` ON `reports` (`purge_after`);--> statement-breakpoint
CREATE INDEX `scoring_rules_type_active_idx` ON `scoring_rules` (`rule_type`,`active`);--> statement-breakpoint
CREATE INDEX `prompts_category_publicado_idx` ON `prompts` (`category_id`,`publicado`);--> statement-breakpoint
CREATE INDEX `tool_usage_events_tool_event_created_idx` ON `tool_usage_events` (`tool_id`,`event`,`created_at`);--> statement-breakpoint
CREATE INDEX `tool_usage_events_session_id_idx` ON `tool_usage_events` (`session_id`);--> statement-breakpoint
CREATE INDEX `ai_generations_feature_created_idx` ON `ai_generations` (`feature`,`created_at`);--> statement-breakpoint
CREATE INDEX `ai_generations_status_idx` ON `ai_generations` (`status`);--> statement-breakpoint
CREATE INDEX `crm_sync_events_status_next_retry_idx` ON `crm_sync_events` (`status`,`next_retry_at`);--> statement-breakpoint
CREATE INDEX `crm_sync_events_entity_idx` ON `crm_sync_events` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `jobs_queue_status_available_idx` ON `jobs` (`queue`,`status`,`available_at`);