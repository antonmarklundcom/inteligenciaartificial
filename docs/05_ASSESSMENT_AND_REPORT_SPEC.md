# 05 — Assessment and Report Specification

**Tool:** Diagnóstico de Madurez en IA
**Route:** `/herramientas/diagnostico-de-ia`
**Scoring:** deterministic, server-side, versioned. **No LLM in the scoring path.**
**Target duration:** 6 minutes · 24 questions · 6 sections
**Language:** Paraguayan Spanish, usted-neutral (business register)

---

## 1. Design principles

1. **Deterministic.** Same answers + same rule version ⇒ same score, always. Testable, explainable, defensible.
2. **Explainable.** Every score decomposes into named dimensions with published rubrics.
3. **Honest.** The output is a *preliminary business assessment*, stated as such. No invented industry benchmarks: comparisons are made against **our own published rubric**, never against fabricated peer data.
4. **Useful when free.** The free result must stand alone.
5. **Short.** Every question must earn its place by affecting the score, the opportunity match, or the lead score. Questions that do none of these are cut.
6. **Non-sensitive.** No client names, no financial statements, no personal data before the gate.

---

## 2. Dimensions and weights

| Code | Dimension | Weight | What it measures |
|---|---|---|---|
| **D1** | Procesos y oportunidad | **30%** | Are there identifiable, repetitive, high-volume processes worth addressing? |
| **D2** | Datos y sistemas | **25%** | Does usable digital data exist, and can systems be integrated? |
| **D3** | Equipo y adopción | **20%** | Will people actually use it? Existing exposure, internal ownership, change history. |
| **D4** | Gobernanza y riesgo | **10%** | Rules, confidentiality awareness, review practices. |
| **D5** | Capacidad de ejecución | **15%** | Sponsor, budget band, timeline, allocated time. |

Weights are stored in `scoring_rules` and editable in admin. Changing a weight
creates a **new version**; existing reports remain bound to their original version.

**Total score** = Σ (dimension_normalised_0_100 × weight). Rounded to integer.

### Maturity bands

| Band | Score | Name | Meaning | Primary recommendation |
|---|---|---|---|---|
| **1** | 0–24 | **Exploración** | Little digitalisation; processes undefined | Digitalise and document one process before any AI work |
| **2** | 25–44 | **Fundamentos** | Some systems, unmapped processes | Measurement and data readiness first; one contained pilot |
| **3** | 45–64 | **Preparación** | Clear processes and usable data; no governance or ownership | Auditoría → one Sprint on the highest-volume process |
| **4** | 65–84 | **Implementación** | Ready or already piloting | Sprint now; formalise governance in parallel |
| **5** | 85–100 | **Escalamiento** | Multiple solutions live | Optimisation, measurement, portfolio expansion — likely a retainer buyer |

**Honesty rule:** a Band 1–2 result must say plainly that AI is *not* the next step,
and recommend the cheaper, more useful thing. Selling a Sprint to a Band 1 company is
how this business acquires its first failed project.

---

## 3. Questions

Format codes: `SS` single-select · `MS` multi-select · `SC` scale 1–5 · `NU` number ·
`TX` short text (≤120 chars, not scored, used for opportunity matching and sales context).
`LS` = also feeds lead scoring (`07`).

### Sección 1 — Perfil de la empresa (4 q) — profiling, not scored for maturity

| # | Pregunta | Formato | Opciones | Uso |
|---|---|---|---|---|
| Q1 | ¿A qué se dedica su empresa? | SS | Inmobiliaria/desarrolladora · Estudio contable · Estudio jurídico · Clínica/salud · Comercio/ecommerce · Industria/manufactura · Servicios profesionales · Educación · Otro | Industry adjustment + opportunity match + **LS** |
| Q2 | ¿Cuántas personas trabajan en su empresa? | SS | 1–4 · 5–9 · 10–24 · 25–49 · 50–149 · 150+ | **LS** (10–149 = ICP) |
| Q3 | ¿En qué ciudad opera principalmente? | SS | Asunción · Gran Asunción · Ciudad del Este · Encarnación · Otra ciudad del país · Fuera de Paraguay | **LS** |
| Q4 | ¿Cuál es su rol? | SS | Dueño/socio · Director/gerente general · Gerente de área · Responsable de TI · Analista/asistente · Estudiante/investigador | **LS** (student ⇒ hard disqualify) |

### Sección 2 — Procesos y volumen (5 q) → **D1**

| # | Pregunta | Formato | Scoring |
|---|---|---|---|
| Q5 | ¿Qué tareas repetitivas consumen más tiempo en su empresa hoy? (elija hasta 3) | MS: Responder consultas de clientes · Redactar o completar documentos · Clasificar y archivar documentos · Cargar datos en sistemas · Elaborar reportes · Buscar información interna · Seguimiento a clientes potenciales · Ninguna en particular | 0–5: 0 selections or "ninguna" = 0; 1 = 3; 2 = 4; 3 = 5. **Drives opportunity matching.** |
| Q6 | ¿Con qué frecuencia se repite la tarea más pesada de las anteriores? | SS: Varias veces por día · Diariamente · Semanalmente · Mensualmente · Esporádicamente | 5 · 4 · 3 · 1 · 0 |
| Q7 | ¿Cuántas personas participan en esa tarea? | SS: 1 · 2–3 · 4–10 · Más de 10 | 2 · 3 · 5 · 5 |
| Q8 | ¿Los pasos de esa tarea están documentados o escritos en algún lado? | SS: Sí, documentados y actualizados · Parcialmente · No, están en la cabeza de las personas | 5 · 3 · 1 |
| Q9 | Describa en una frase el proceso que más le gustaría mejorar | TX | Not scored. Used for opportunity matching keywords, report personalisation and sales context. |

### Sección 3 — Datos y sistemas (5 q) → **D2**

| # | Pregunta | Formato | Scoring |
|---|---|---|---|
| Q10 | ¿Dónde vive hoy la información operativa de su empresa? | MS: Sistema de gestión/ERP · CRM · Planillas de cálculo · Documentos en la nube · Correo y WhatsApp · Papel | Highest-value selection: ERP/CRM = 5 · nube/planillas = 3 · correo/WhatsApp = 2 · sólo papel = 0 |
| Q11 | ¿Puede exportar esa información (Excel, CSV, API)? | SS: Sí, sin problema · Parcialmente · No sé · No | 5 · 3 · 1 · 0 |
| Q12 | ¿Qué tan confiable y actualizada está esa información? | SC 1–5 | (value − 1) × 1.25 |
| Q13 | ¿Sus sistemas principales permiten integración con otras herramientas (API)? | SS: Sí · Algunos · No · No sé | 5 · 3 · 1 · 1 |
| Q14 | ¿Qué volumen de mensajes de clientes recibe por semana (WhatsApp, correo, redes)? | SS: Menos de 20 · 20–100 · 100–500 · Más de 500 · No lo sé | 1 · 3 · 5 · 5 · 2. Also **LS** — high volume is a strong Sprint signal. |

### Sección 4 — Equipo y adopción (4 q) → **D3**

| # | Pregunta | Formato | Scoring |
|---|---|---|---|
| Q15 | ¿Alguien de su equipo ya usa herramientas de IA en el trabajo? | SS: Sí, varias personas y de forma habitual · Algunos, por su cuenta · Casi nadie · No lo sé | 5 · 4 · 1 · 1 |
| Q16 | ¿Hay alguien que podría hacerse cargo internamente de un proyecto de este tipo? | SS: Sí, con tiempo asignado · Sí, pero sin tiempo disponible · No | 5 · 2 · 0. Also **LS** — the strongest single delivery-success predictor. |
| Q17 | ¿Cómo describiría la actitud del equipo frente a cambios en la forma de trabajar? | SC 1–5 (1 = resistente, 5 = abierta) | (value − 1) × 1.25 |
| Q18 | ¿Han implementado alguna herramienta nueva en los últimos 12 meses? | SS: Sí, y se usa · Sí, pero no se adoptó · No | 5 · 2 · 2 |

### Sección 5 — Gobernanza y riesgo (3 q) → **D4**

| # | Pregunta | Formato | Scoring |
|---|---|---|---|
| Q19 | ¿Tienen reglas escritas sobre qué información se puede cargar en herramientas externas? | SS: Sí, escritas y comunicadas · Reglas informales · No | 5 · 2 · 0 |
| Q20 | ¿Manejan información confidencial de clientes o datos personales sensibles? | SS: Sí, de forma habitual · Ocasionalmente · No | Not a maturity penalty. Scored 3 · 4 · 5 for D4 *readiness*, but **flags a mandatory data-handling section in the report** and raises the estimated project complexity. |
| Q21 | ¿Alguien revisa los resultados antes de que se usen o se envíen al cliente? | SS: Sí, siempre · A veces · No aplica todavía | 5 · 3 · 2 |

### Sección 6 — Objetivos y capacidad (3 q) → **D5**

| # | Pregunta | Formato | Scoring |
|---|---|---|---|
| Q22 | ¿Qué busca principalmente lograr? | SS: Atender mejor y más rápido a los clientes · Liberar tiempo del equipo · Reducir errores · Aumentar ventas · Reducir costos de personal · Todavía estoy explorando | 5 · 5 · 5 · 5 · **3 + flag** · 1. *"Reducir costos de personal" sets a review flag: if it is the sole objective, this is a decline candidate per `02` §11.* |
| Q23 | ¿En qué plazo le gustaría ver resultados? | SS: En los próximos 3 meses · 3–6 meses · 6–12 meses · Sin plazo definido | 5 · 4 · 2 · 1. **LS** |
| Q24 | ¿Tienen presupuesto asignado o previsto para este tipo de iniciativa? | SS: Sí, definido · Sí, aproximado · Todavía no, pero podríamos definirlo · No | 5 · 4 · 2 · 0. **LS**, heavily weighted |

---

## 4. Scoring model

```
Per dimension:
  raw_d      = Σ(question_score)                 # each 0–5
  max_d      = 5 × question_count(d)
  norm_d     = round(raw_d / max_d × 100)

Industry adjustment:
  adj_d      = clamp(0, 100, norm_d + industry_modifier[industry][d])

Total:
  total      = round( Σ(adj_d × weight_d) )
  band       = lookup(total)
```

### Industry modifiers (`scoring_rules`, admin-editable)

Purpose: prevent structurally document-heavy or message-heavy sectors from being
mis-scored by a generic rubric. Modifiers are small and **must never exceed ±8**.

| Industry | D1 | D2 | D3 | D4 | Rationale |
|---|---|---|---|---|---|
| Inmobiliaria | +5 | 0 | 0 | 0 | Message-volume opportunity is structurally high |
| Estudio contable | +5 | +3 | 0 | 0 | Document volume + data already digital |
| Estudio jurídico | +5 | 0 | 0 | −3 | Document volume high; confidentiality bar is higher |
| Clínica/salud | +3 | 0 | 0 | −5 | Sensitive data raises the governance bar |
| Comercio/ecommerce | +3 | +3 | 0 | 0 | Transactional data usually structured |
| Industria/manufactura | 0 | −3 | 0 | 0 | Operational data often not in accessible systems |
| Educación | 0 | 0 | 0 | 0 | — |
| Servicios profesionales | +3 | 0 | 0 | 0 | — |
| Otro | 0 | 0 | 0 | 0 | — |

### Hard overrides (evaluated after scoring)

| Condition | Effect |
|---|---|
| Q10 = only "Papel" | Total capped at 30; band ≤ 2; report leads with digitalisation, not AI |
| Q11 = "No" **and** Q13 = "No" | D2 capped at 30 |
| Q16 = "No" | Report includes a mandatory section: without an internal owner, projects fail |
| Q22 = "Reducir costos de personal" (sole) | `review_flag = objetivo_reduccion_personal`; no call CTA in the report; internal review before any outreach |
| Q4 = "Estudiante/investigador" | `lead_disqualified = true`; report still delivered in full (goodwill, zero cost); no sales sequence |

---

## 5. Opportunity matching (deterministic)

A rule table maps `(Q5 selection × Q1 industry × D2 band)` to an opportunity from a
**closed, human-written catalogue** of ~20 opportunities. Top 3 are returned, ordered
by `(impact_weight × frequency_score) − effort_weight`.

Each catalogue entry (authored by a human, stored in DB, admin-editable):
`code · título · descripción · precondiciones · esfuerzo (bajo/medio/alto) ·
impacto (bajo/medio/alto) · riesgos · qué se necesita para empezar · servicio relacionado`

Examples (abbreviated):
- `OPP-CS-01` Triage y calificación de consultas entrantes — requires Q14 ≥ 100/week
- `OPP-DOC-02` Generación asistida de documentos desde plantillas propias — requires Q5 includes "Redactar documentos" and Q8 ≠ "en la cabeza"
- `OPP-KB-03` Asistente interno de conocimiento — requires Q5 includes "Buscar información interna" and Q10 includes nube/ERP
- `OPP-DATA-00` Digitalización y estructuración previa — returned when D2 < 40; **explicitly a non-AI recommendation**

**No LLM generates opportunities.** The LLM may only rephrase a matched entry's
description for the client's context, within the constraints of `12_AI_SYSTEM_DESIGN.md`.

---

## 6. Report structure (gated PDF, 8–12 pp)

| # | Section | Source |
|---|---|---|
| 1 | Portada — empresa, fecha, versión del diagnóstico, **disclaimer** | Deterministic |
| 2 | Resumen ejecutivo (½ p) | LLM narrative from structured input |
| 3 | Su nivel de madurez — band, score, what it means | Deterministic + fixed band text |
| 4 | Puntajes por dimensión — chart + per-dimension rubric explanation | Deterministic |
| 5 | Qué significa cada puntaje en su caso | LLM narrative, scores passed as immutable facts |
| 6 | 3 oportunidades prioritarias — from the catalogue, each with effort/impact/preconditions | Deterministic + LLM contextual rephrasing |
| 7 | Lo que **no** recomendamos hacer todavía | Deterministic rules (e.g. D2 < 40 ⇒ no integration project) |
| 8 | Secuencia sugerida de 90 días | Deterministic template per band |
| 9 | Riesgos a considerar — incl. mandatory data-handling section if Q20 ≠ "No" | Deterministic |
| 10 | Costos a tener en cuenta — categories and drivers, **no price promises** | Fixed content |
| 11 | Cómo seguimos — CTA (suppressed if `review_flag` or disqualified) | Fixed |
| 12 | Método y supuestos — how the score is computed, what we did not evaluate | Fixed |
| 13 | Glosario | Fixed |

### Disclaimers (mandatory placements — 3)

**Cover:**
> Este documento es una **evaluación preliminar de negocio** generada a partir de las
> respuestas proporcionadas. No constituye asesoramiento profesional, legal, contable
> ni técnico, y no reemplaza un análisis detallado de sus procesos.

**Before §6 (recommendations):**
> Las oportunidades listadas se basan únicamente en la información que usted ingresó y
> en un modelo de evaluación propio. No se verificaron datos de su empresa. Antes de
> tomar decisiones de inversión, recomendamos una revisión con acceso a sus procesos
> y sistemas reales.

**Footer, every page:**
> Evaluación preliminar · inteligenciaartificial.com.py · Diagnóstico v{version} · {date}

**Prohibited in every report:** guaranteed savings, ROI percentages, invented industry
benchmarks or peer averages, implementation prices, compliance/certification claims,
named third-party products presented as endorsements. Enforced by an automated
content check on generated narrative (`12` §Output review).

---

## 7. Lead-scoring attributes exported from the assessment

`industria` (Q1) · `tamaño` (Q2) · `ubicación` (Q3) · `rol` (Q4) ·
`volumen_mensajes` (Q14) · `dueño_interno` (Q16) · `plazo` (Q23) · `presupuesto` (Q24) ·
`madurez_total` · `banda` · `proceso_declarado` (Q9 free text) · `review_flag` ·
`disqualified`. Weighting in `07_LEAD_FUNNEL.md` §5.

---

## 8. Admin-managed rules
Sections, questions, options, per-option scores, dimension weights, industry modifiers,
band thresholds, hard overrides, opportunity catalogue and matching rules, band and
disclaimer text, report template, prompt version binding. See `09_ADMIN_SPEC.md`.

## 9. Versioning
- `assessment_versions` holds an immutable snapshot: questions, options, scores, weights, modifiers, bands, overrides.
- Publishing a change creates a new version and **archives** the previous one. Nothing is edited in place.
- In-progress assessments continue on the version they started with.
- Every `assessments` row stores `assessment_version_id`; every `reports` row additionally stores `scoring_rule_version`, `prompt_version`, `model_id`, `report_template_version`.
- Admin can preview a draft version against saved fixture answer sets and see a score diff against the current version **before** publishing. This is a required admin feature, not a nice-to-have.

## 10. PDF generation
Server-side HTML→PDF in the background worker · A4 · embedded fonts · charts rendered
as inline SVG (no external requests) · file stored in private object storage, served
only through an authorised, expiring link · filename
`diagnostico-ia-{empresa-slug}-{yyyymmdd}.pdf` · target < 2 MB · p95 < 3 min ·
3 retries with backoff, then a failure email plus an admin flag.

## 11. Email delivery
Transactional, Spanish, from a verified sending domain (SPF/DKIM/DMARC).
Sequence: (1) immediate "estamos generando tu informe"; (2) on completion, the report
with the download link and a single CTA; (3) +3 days, one contextual follow-up tied to
their weakest dimension; (4) +10 days, one relevant resource. Then the monthly list,
if they opted in. **One-click unsubscribe in every message.** Nurture is suppressed
entirely for disqualified or flagged leads.

## 12. Data retention
| Data | Retention |
|---|---|
| Anonymous, never-gated assessment sessions | 180 days, then deleted |
| Gated assessments + reports | 24 months from last interaction, then anonymised (answers retained without identifiers for rule improvement) |
| Generated PDFs | 24 months |
| Email address | Until unsubscribe + 30 days, or until deletion request |
| Consent records | 5 years (evidentiary) — retained even after deletion of other data, minimised to the consent fact |
| Aggregated/anonymous analytics | Indefinite |

Deletion request route published in `/legal/privacidad` with a stated response target
of 10 business days. Executed via an admin action that is itself audit-logged.
