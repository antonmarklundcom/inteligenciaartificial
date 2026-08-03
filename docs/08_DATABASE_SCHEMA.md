# 08 — Database Schema

**Engine:** MySQL 8 · **ORM:** Drizzle · **Charset:** `utf8mb4_unicode_ci`
**Conventions:** `snake_case`; surrogate `BIGINT UNSIGNED AUTO_INCREMENT` primary keys;
a `public_id CHAR(26)` (ULID) on every externally-referenced table so internal ids are
never exposed; `created_at` / `updated_at` on every table; soft delete
(`deleted_at`) only where retention rules require it; all timestamps stored UTC.

**Legend:** **[MVP]** ships in Phases 1–3 · **[P4]** Phase 4 · **[P5]** Phase 5 ·
**[SI]** build only if justified.

---

## 1. Table inventory

| Table | Phase | Purpose |
|---|---|---|
| `admin_users` | MVP | Staff accounts |
| `audit_logs` | MVP | Admin mutation trail |
| `industries` | MVP | Controlled vocabulary |
| `organizations` | MVP | Companies (leads and clients) |
| `contacts` | MVP | People at organisations |
| `consent_records` | MVP | Consent evidence |
| `leads` | MVP | Commercial opportunity |
| `lead_scores` | MVP | Score history |
| `lead_events` | MVP | Behavioural timeline |
| `consultation_requests` | MVP | Call/contact requests |
| `newsletter_subscribers` | MVP | List membership |
| `assessment_versions` | MVP | Immutable assessment snapshots |
| `assessment_questions` | MVP | Questions per version |
| `assessment_question_options` | MVP | Options and per-option scores |
| `scoring_rules` | MVP | Weights, modifiers, bands, overrides, lead-score weights |
| `assessments` | MVP | A run of the assessment |
| `assessment_answers` | MVP | Answers |
| `opportunity_catalog` | MVP | Human-written opportunities |
| `opportunity_rules` | MVP | Deterministic matching rules |
| `reports` | MVP | Generated reports |
| `generated_documents` | MVP | Stored files |
| `calculator_sessions` | MVP | Calculator runs |
| `tool_definitions` | MVP | Registry of live tools |
| `tool_usage_events` | MVP | Funnel telemetry |
| `prompt_categories` | MVP | Prompt library taxonomy |
| `prompts` | MVP | Prompt library entries |
| `crm_sync_events` | MVP | CRM outbox |
| `jobs` | MVP | Background job queue |
| `ai_generations` | MVP | LLM call log |
| `users` | **P4** | End-user accounts |
| `service_pages` | **P4** | DB-managed service pages |
| `content_pages` | **P4** | DB-managed generic pages |
| `blog_posts` | **P4** | DB-managed articles |
| `subscription_plans` | **[SI] P5** | Only if a paid tier ships |

**Deliberately not in MVP:** `users`, `service_pages`, `content_pages`, `blog_posts`.
Marketing content is MDX in-repo through Phase 3 (`11` §CMS). Creating these tables
before a non-technical editor exists buys a migration and an admin UI to solve a
problem nobody has.

---

## 2. Core tables

### `organizations` [MVP]
```
id · public_id · nombre · nombre_normalizado (dedupe key) · industry_id → industries
tamano_band ENUM('1-4','5-9','10-24','25-49','50-149','150+')
ciudad · sitio_web · es_cliente BOOL DEFAULT false
notas_internas TEXT · created_at · updated_at · deleted_at
INDEX (nombre_normalizado), (industry_id)
```

### `contacts` [MVP] — **contains PII**
```
id · public_id · organization_id → organizations
nombre · email · email_normalizado (UNIQUE) · telefono_whatsapp E.164 · rol
email_verificado_at NULL · unsubscribed_at NULL
anonymized_at NULL          -- set by retention job; clears nombre/email/telefono
created_at · updated_at · deleted_at
UNIQUE (email_normalizado), INDEX (organization_id)
```

### `leads` [MVP]
```
id · public_id · organization_id · contact_id
source ENUM('organic','referral','direct','whatsapp','linkedin','email','other')
medium · campaign · landing_page · referrer_url
first_touch_at · last_touch_at
origen_herramienta ENUM('diagnostico','calculadora','formulario','whatsapp','otro')
assessment_id NULL → assessments
score TINYINT UNSIGNED · band ENUM('A','B','C','D','X')
stage ENUM('nuevo','calificado','llamada_agendada','llamada_realizada',
           'propuesta_enviada','negociacion','ganado','perdido','descalificado',
           'en_espera_capacidad') DEFAULT 'nuevo'
disqualified_reason ENUM(...DQ codes...) NULL
review_flag VARCHAR(64) NULL · review_cleared_by → admin_users NULL · review_cleared_at NULL
score_override TINYINT NULL · score_override_by → admin_users NULL · score_override_reason TEXT NULL
proceso_declarado VARCHAR(255) NULL      -- Q9 free text
owner_admin_user_id → admin_users NULL
valor_estimado_usd DECIMAL(10,2) NULL · closed_at NULL · notas TEXT
created_at · updated_at · deleted_at
INDEX (band, stage), (created_at), (organization_id), (source)
```

### `lead_scores` [MVP] — append-only history
```
id · lead_id · score · band · scoring_rule_version
breakdown JSON        -- {tamano:20, industria:20, rol:15, ...} — full attribution
trigger ENUM('creacion','evento','recalculo_admin','cambio_reglas')
created_at
INDEX (lead_id, created_at)
```

### `lead_events` [MVP]
```
id · lead_id NULL · session_id · event_type · page_path · metadata JSON · created_at
event_type ∈ page_view, tool_started, tool_completed, gate_submitted,
             whatsapp_click, pricing_view, resource_download, email_open,
             email_click, form_submitted, booking_created, call_completed
INDEX (lead_id, created_at), (session_id), (event_type, created_at)
```
`session_id` is a random opaque id in an httpOnly first-party cookie. Not a
cross-site identifier and never shared with third parties.

### `consent_records` [MVP] — **evidentiary, longest retention**
```
id · public_id · contact_id NULL · email_normalizado · session_id
consent_type ENUM('marketing_email','data_processing','cookies','whatsapp_contact')
granted BOOL · texto_exacto TEXT      -- verbatim text shown at the time
version_politica VARCHAR(32) · ip_address VARBINARY(16) · user_agent VARCHAR(512)
source_page · granted_at · revoked_at NULL
INDEX (email_normalizado, consent_type), (contact_id)
```
Retained 5 years, minimised to the consent fact, and **not** deleted by a data
deletion request — the record of consent is itself the evidence that processing was
lawful. Explained in the privacy notice.

---

## 3. Assessment tables

### `assessment_versions` [MVP]
```
id · public_id · version VARCHAR(16)   -- '1.0.0'
nombre · descripcion · status ENUM('borrador','publicado','archivado')
published_at NULL · published_by → admin_users NULL
snapshot JSON          -- full frozen definition: questions, options, scores,
                       -- weights, modifiers, bands, overrides
created_at · updated_at
UNIQUE (version)
```
Exactly one `publicado` row at a time. **The `snapshot` is the source of truth for
scoring an existing assessment**, so historical reports remain reproducible even if
the normalised rows are later edited.

### `assessment_questions` [MVP]
```
id · assessment_version_id · codigo ('Q1'…) · seccion TINYINT · orden
texto TEXT · texto_ayuda TEXT NULL
formato ENUM('single_select','multi_select','scale','number','text')
dimension ENUM('D1','D2','D3','D4','D5') NULL   -- NULL = profiling only
required BOOL · max_selections TINYINT NULL
feeds_lead_score BOOL DEFAULT false
UNIQUE (assessment_version_id, codigo)
```

### `assessment_question_options` [MVP]
```
id · assessment_question_id · codigo · texto · orden
score DECIMAL(4,2)          -- 0–5
lead_score_points TINYINT NULL
sets_flag VARCHAR(64) NULL  -- e.g. 'objetivo_reduccion_personal'
```

### `scoring_rules` [MVP]
```
id · assessment_version_id NULL   -- NULL = global (e.g. lead scoring)
rule_type ENUM('dimension_weight','industry_modifier','maturity_band',
               'hard_override','lead_score_weight')
key_1 · key_2 NULL · value_num DECIMAL(6,2) NULL · value_json JSON NULL
version VARCHAR(16) · active BOOL · created_by → admin_users · created_at
INDEX (rule_type, active)
```

### `assessments` [MVP]
```
id · public_id · result_token CHAR(43) UNIQUE   -- URL-safe random, for /resultado/[token]
session_id · assessment_version_id
status ENUM('en_progreso','completado','abandonado')
current_step TINYINT
industria · tamano_band · ciudad · rol            -- denormalised profiling
score_total TINYINT NULL · banda TINYINT NULL · scores_por_dimension JSON NULL
scoring_rule_version VARCHAR(16) NULL
opportunities JSON NULL          -- matched opportunity codes, ordered
flags JSON NULL
gated BOOL DEFAULT false · lead_id NULL → leads
started_at · completed_at NULL · last_activity_at
purge_after DATE NULL             -- set to +180d for ungated sessions
INDEX (session_id), (status, last_activity_at), (purge_after)
```

### `assessment_answers` [MVP]
```
id · assessment_id · assessment_question_id · codigo_pregunta
valor_opciones JSON NULL   -- selected option codes
valor_numero DECIMAL(10,2) NULL · valor_texto VARCHAR(255) NULL
score_calculado DECIMAL(4,2) NULL
created_at · updated_at
UNIQUE (assessment_id, assessment_question_id)
```
**Free-text answers (Q9) are capped at 120 chars and are business-process
descriptions.** The gate copy warns against entering confidential information.

### `opportunity_catalog` / `opportunity_rules` [MVP]
```
opportunity_catalog:
  id · codigo ('OPP-CS-01') · titulo · descripcion TEXT · precondiciones TEXT
  esfuerzo ENUM('bajo','medio','alto') · impacto ENUM('bajo','medio','alto')
  riesgos TEXT · que_se_necesita TEXT · servicio_relacionado · requiere_ia BOOL
  activo BOOL · created_by · updated_at

opportunity_rules:
  id · opportunity_id · condiciones JSON   -- e.g. {"Q5_includes":["consultas"],
                                           --       "Q14_min":"100-500","D2_min":40}
  peso_impacto TINYINT · peso_esfuerzo TINYINT · industrias JSON NULL · activo BOOL
```

---

## 4. Report and document tables

### `reports` [MVP]
```
id · public_id · assessment_id · lead_id NULL
tipo ENUM('diagnostico_madurez')
status ENUM('pendiente','generando','completado','fallido')
assessment_version_id · scoring_rule_version · report_template_version
prompt_version · model_id
narrativa JSON            -- exact LLM-generated sections, stored verbatim
contenido_deterministico JSON
generated_document_id NULL → generated_documents
intentos TINYINT DEFAULT 0 · error_mensaje TEXT NULL
email_enviado_at NULL · descargado_count INT DEFAULT 0
created_at · completed_at NULL · purge_after DATE
INDEX (status), (assessment_id), (purge_after)
```
Storing `narrativa`, `prompt_version` and `model_id` means any report we ever sent can
be explained and reproduced. This is a requirement, not an optimisation.

### `generated_documents` [MVP]
```
id · public_id · tipo ENUM('report_pdf','recurso','otro')
storage_key         -- private object storage, never publicly served
filename · mime_type · size_bytes · checksum_sha256
owner_type ENUM('report','lead','admin') · owner_id
purge_after DATE · created_at · deleted_at
```
Served only via a short-lived signed URL generated on an authorised request.

---

## 5. Tool tables

### `tool_definitions` [MVP]
```
id · slug · nombre · tipo ENUM('assessment','calculator','library')
activo BOOL · config JSON   -- calculator constants (48 weeks, 160 h/month), caps
version · updated_by · updated_at
```
Calculator constants live here so they are auditable and changeable without a deploy —
and so the displayed assumptions and the computation can never diverge.

### `tool_usage_events` [MVP]
```
id · tool_id · session_id · lead_id NULL
event ENUM('viewed','started','step_completed','completed','abandoned','gated','shared')
step TINYINT NULL · duration_ms INT NULL · metadata JSON · created_at
INDEX (tool_id, event, created_at), (session_id)
```

### `calculator_sessions` [MVP]
```
id · public_id · result_token CHAR(43) UNIQUE · session_id · lead_id NULL
tarea_descripcion VARCHAR(160)
personas SMALLINT · minutos_por_ocurrencia SMALLINT · ocurrencias_semana SMALLINT
salario_band ENUM(...)      -- BUCKETED, never the raw figure
pct_mecanico TINYINT
horas_anuales DECIMAL(10,2) · costo_anual_gs BIGINT
banda_conservadora_gs BIGINT · banda_optimista_gs BIGINT
constants_version · created_at · purge_after DATE
```
**Salary is stored bucketed, not raw** (`04` §2), and is never joined to an identified
contact in analytics.

---

## 6. Content tables

### `industries` [MVP]
```
id · slug · nombre · nombre_plural · activo · orden
tiene_pagina BOOL · modificadores_scoring JSON
```

### `prompt_categories` / `prompts` [MVP]
```
prompt_categories: id · slug · nombre · descripcion · funcion_negocio · orden · activo

prompts:
  id · public_id · slug · category_id · titulo · objetivo TEXT
  cuando_usar TEXT · cuando_no_usar TEXT · que_verificar TEXT
  texto_prompt TEXT · industrias JSON NULL · nivel ENUM('basico','intermedio','avanzado')
  probado_por → admin_users · probado_at        -- editorial rule (04 §3) enforced in data
  publicado BOOL · vistas INT · copias INT · created_at · updated_at
  UNIQUE (slug), INDEX (category_id, publicado)
```
`probado_por` / `probado_at` are **NOT NULL when `publicado = true`** — the "every
prompt is human-tested" rule is a database constraint, not a guideline.

### `service_pages` · `content_pages` · `blog_posts` [P4]
Shape when built:
```
id · public_id · slug · tipo · titulo · meta_title · meta_description
h1 · contenido MDX/JSON · autor_admin_user_id · industria_id NULL · cluster
og_image_url · schema_json JSON
status ENUM('borrador','publicado','archivado') · published_at · updated_at
UNIQUE (slug)
```
Until Phase 4 this content lives in `content/**/*.mdx` with frontmatter matching these
fields, so the later migration is mechanical.

---

## 7. Operational tables

### `consultation_requests` [MVP]
```
id · public_id · lead_id NULL · nombre · empresa · email · whatsapp
industria · tamano_band · proceso_a_resolver TEXT · urgencia ENUM · presupuesto_band ENUM NULL
origen_pagina · booking_external_id NULL
status ENUM('nuevo','contactado','agendado','realizado','no_show','descartado')
created_at · updated_at
```

### `newsletter_subscribers` [MVP]
```
id · public_id · email_normalizado UNIQUE · nombre NULL · contact_id NULL
consent_record_id → consent_records
status ENUM('activo','baja','rebotado') · source · unsubscribe_token CHAR(43) UNIQUE
subscribed_at · unsubscribed_at NULL
```

### `crm_sync_events` [MVP] — the outbox
```
id · public_id · entity_type ENUM('lead','contact','organization','consultation')
entity_id · operation ENUM('create','update')
idempotency_key CHAR(64) UNIQUE
payload JSON · payload_version VARCHAR(16)
status ENUM('pendiente','enviando','exitoso','fallido','descartado')
intentos TINYINT DEFAULT 0 · next_retry_at NULL
response_status SMALLINT NULL · response_body TEXT NULL · error_mensaje TEXT NULL
crm_remote_id VARCHAR(128) NULL
created_at · updated_at · sent_at NULL
INDEX (status, next_retry_at), (entity_type, entity_id)
```

### `jobs` [MVP]
```
id · queue · type · payload JSON
status ENUM('pendiente','procesando','completado','fallido')
intentos TINYINT · max_intentos TINYINT DEFAULT 3
available_at · locked_at NULL · locked_by VARCHAR(64) NULL
error TEXT NULL · created_at · completed_at NULL
INDEX (queue, status, available_at)
```
Types: `generate_report`, `send_email`, `sync_crm`, `purge_expired_data`,
`recalculate_lead_scores`, `warm_sitemap`.

### `ai_generations` [MVP]
```
id · feature ENUM('report_narrative','opportunity_rephrase')
prompt_version · model_id · provider
input_tokens · output_tokens · cost_usd DECIMAL(8,5) · latency_ms
status ENUM('ok','rechazado_validacion','error','fallback_usado')
validation_errors JSON NULL
related_type · related_id · created_at
INDEX (feature, created_at), (status)
```
Drives the cost cap and the monthly AI cost report (`12`).

### `admin_users` / `audit_logs` [MVP]
```
admin_users: id · public_id · nombre · email UNIQUE · password_hash (argon2id)
  rol ENUM('owner','admin','editor','sales','readonly') · activo
  mfa_secret NULL · last_login_at · created_at

audit_logs: id · admin_user_id NULL · action · entity_type · entity_id
  before JSON NULL · after JSON NULL · ip_address VARBINARY(16)
  user_agent VARCHAR(512) · created_at
  INDEX (entity_type, entity_id), (admin_user_id, created_at)
```
`audit_logs` is append-only: no UPDATE or DELETE grant on it for the application user.

### `users` [P4]
```
id · public_id · email UNIQUE · password_hash · nombre · organization_id
email_verified_at · last_login_at · status · created_at
```
**Not built before Phase 4.** Accounts add auth surface, password reset flows,
session management and support load, for zero MVP benefit — the tokenised result URL
covers every access need the MVP has.

### `subscription_plans` [SI, P5]
Build **only** if a paid recurring tier is actually validated (`10` §Tool subscriptions).
Would require `subscriptions`, `invoices`, a payment-provider integration and tax
handling. Not justified on current evidence.

---

## 8. Retention rules (implemented as `purge_expired_data`, nightly)

| Data | Rule | Mechanism |
|---|---|---|
| Ungated assessment sessions | Delete at 180 days | `assessments.purge_after`, cascades to answers |
| Gated assessments + reports | Anonymise at 24 months from last interaction | Null the contact link, retain answers without identifiers |
| Generated PDFs | Delete at 24 months | `generated_documents.purge_after` + storage delete |
| Calculator sessions | Delete at 12 months | `purge_after` |
| `lead_events` | Aggregate at 12 months, delete raw at 18 | Roll into a monthly summary table |
| `tool_usage_events` | Same | Same |
| Contacts | Anonymise 24 months after unsubscribe or last interaction | `contacts.anonymized_at` |
| `consent_records` | **Retain 5 years**, minimised | Exempt from deletion requests |
| `audit_logs` | Retain 3 years | — |
| `ai_generations` | Retain 12 months (no user content stored) | — |
| `crm_sync_events` | Payload redacted at 90 days; row retained for audit | — |

**Deletion request:** an admin action that anonymises `contacts`, deletes the
associated `reports`, `generated_documents` and `consultation_requests`, nulls
identifiers on `leads` and `assessments`, marks `newsletter_subscribers` as `baja`,
retains the minimised `consent_records`, and writes an `audit_logs` entry. Target:
10 business days, stated in the privacy notice.

---

## 9. Sensitive-data considerations

1. **Data minimisation is a schema decision.** We do not have columns for client
   financials, employee names, tax IDs, or document contents — because we never ask
   for them.
2. **Salary is bucketed at write time** (`calculator_sessions.salario_band`). The raw
   figure never reaches the database.
3. **PII is concentrated in `contacts` and `consent_records`**, so anonymisation has a
   small, well-defined surface.
4. **IP addresses** stored as `VARBINARY(16)` only where evidentiary (consent, audit);
   never in analytics.
5. **No document uploads in MVP.** If Phase 4 adds them, it requires an ADR covering
   encryption at rest, per-tenant isolation, and a separate retention policy.
6. **Free-text fields are length-capped** and the UI warns against entering
   confidential information.
7. **Backups inherit retention.** Purged data disappears from backups within the
   30-day backup window; this is stated in the privacy notice rather than claiming
   instant erasure everywhere.
8. **No third-party analytics or ad script** ever receives form-field contents (`03` N12).
