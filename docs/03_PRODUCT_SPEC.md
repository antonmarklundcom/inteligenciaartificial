# 03 — Product Specification

Scope: the website and application at `inteligenciaartificial.com.py`.
Everything here is MVP (Phases 1–3) unless marked **[POST-MVP]**.

---

## 1. Public site

### 1.1 Route map (MVP)

```
/                                   Home
/servicios                          Services overview
/servicios/auditoria-de-ia          Auditoría (primary offer)
/servicios/implementacion           Sprint de Implementación
/servicios/capacitacion             Talleres
/servicios/soporte-y-optimizacion   Retainer
/metodo                             How we work (credibility asset)
/que-no-hacemos                     Scope boundaries (credibility + filter)
/precios                            Pricing (starting-from, real)
/nosotros                           Named principal
/contacto                           WhatsApp + form + booking

/soluciones/inmobiliarias           Vertical
/soluciones/estudios-contables      Vertical
/soluciones/estudios-juridicos      Vertical
/soluciones/atencion-al-cliente     Horizontal wedge

/herramientas                       Tools hub
/herramientas/diagnostico-de-ia     Assessment  [PRIMARY MVP TOOL]
/herramientas/diagnostico-de-ia/resultado/[token]   Results (unguessable token)
/herramientas/calculadora-de-tareas-repetitivas     Calculator
/herramientas/prompts               Prompt library index
/herramientas/prompts/[categoria]   Prompt category
/herramientas/prompts/[categoria]/[slug]            Individual prompt

/recursos                           Resource library
/recursos/[slug]                    Guide / downloadable
/blog                               Articles index
/blog/[slug]                        Article
/blog/categoria/[categoria]         Category

/legal/privacidad                   Privacy notice
/legal/terminos                     Terms
/legal/cookies                      Cookie notice
/legal/uso-de-ia                    How we use AI in this site's tools

/admin/*                            Admin (noindex, authenticated)
```

Full SEO rationale and expansion plan: `06_SEO_ARCHITECTURE.md`.

### 1.2 Global elements

- **Header:** logo · Servicios · Soluciones · Herramientas · Recursos · Nosotros · CTA `Diagnóstico gratuito`
- **Persistent WhatsApp button** on all pages, with per-page UTM-style context in the pre-filled message
- **Footer:** navigation, legal links, real contact details, real address or "Asunción, Paraguay", no fabricated badges
- **No cookie wall.** Analytics is cookieless by default (see `11`). A cookie notice appears only if a cookie-setting tool is ever added.

### 1.3 Page requirements — service pages
Each: problem statement in the buyer's language · what the service is · what is
included (numbered) · **what is excluded** (numbered) · deliverables · timeline ·
price (starting-from, real) · what we need from you · FAQ (≥6 Q) · CTA to Diagnóstico
+ WhatsApp · `Service` structured data.

### 1.4 Page requirements — vertical pages
Each: the 3–4 processes we actually address in that vertical · current-state
description recognisable to an insider · intended-state description · honest
limitations section · what a Sprint looks like there · vertical FAQ · CTA.
**A vertical page does not ship without all six sections.** No thin vertical pages.

---

## 2. Assessment experience (primary tool)

### 2.1 Flow

```
Landing (/herramientas/diagnostico-de-ia)
  → Start (session created, no PII)
  → Step 1  Perfil de empresa        (4 q)
  → Step 2  Procesos y volumen        (5 q)
  → Step 3  Datos y sistemas          (5 q)
  → Step 4  Equipo y adopción         (4 q)
  → Step 5  Gobernanza y riesgo       (3 q)
  → Step 6  Objetivos y capacidad      (3 q)
  → Cálculo (server-side, deterministic)
  → Resultado en pantalla (FREE, ungated)
  → [Gate] Informe PDF ampliado  → email + empresa + rol + industria
  → Report queued → email delivered → results page unlocks download
  → CTA: agendar llamada / WhatsApp
```

**Locked rules:**
- The assessment is **never** gated. Full on-screen results are free.
- Only the extended PDF requires the email gate.
- Progress is saved per step against an anonymous session id (httpOnly cookie + DB row), so a refresh does not lose work.
- Back navigation permitted; answers editable until submission.
- Scoring happens **server-side only**. Rules and weights are never sent to the client.
- Mobile-first. Assume most sessions are on a phone over mobile data.
- Target completion time: **6 minutes**. Measured; if median exceeds 8 minutes, cut questions.

### 2.2 On-screen result (free)
Maturity level (1–5) with a plain-language description · radar/bar of the 5 dimension
scores · the **top 3 opportunities** for their industry, each with a one-paragraph
explanation · one honest sentence about their weakest dimension · assumption and
limitation note · gate CTA for the full report.

The free result must be genuinely useful on its own. A deliberately crippled free
result damages the credibility strategy that the whole business rests on.

---

## 3. Personalized report

Detailed spec: `05_ASSESSMENT_AND_REPORT_SPEC.md`. Product-level requirements:

- Generated **asynchronously** via the job queue; the user is told "te llega en unos minutos" and the page polls
- Deterministic content (scores, levels, matched opportunities, roadmap) assembled from the versioned rule set
- LLM writes **only** the narrative connective text, from a structured input, with the scores passed as immutable facts
- Every generated report is persisted with: assessment id, `assessment_version_id`, `scoring_rule_version`, `prompt_version`, model id, and the exact generated narrative — so any report can be explained months later
- PDF branded, 8–12 pages, Spanish, accessible on mobile
- Delivered by email **and** downloadable from the tokenised results URL
- Disclaimer appears on the cover, in the body before recommendations, and in the footer of every page
- Regeneration: if generation fails after 3 attempts, the user gets an email saying so plus a direct WhatsApp contact, and the failure is flagged in admin

---

## 4. Calculator tools

**MVP: one calculator** — Calculadora de Costo de Tareas Repetitivas.

Requirements:
- Fully client-usable, but the **calculation runs server-side** so that the formula and any future changes stay under our control and results can be persisted for analytics
- No email required, ever
- **Assumptions panel rendered adjacent to the result**, not behind a disclosure link. Non-negotiable (`00` D-fixed #9)
- Output presented as a *range* with a conservative and an optimistic bound, labelled as estimates derived from the user's inputs
- The formula is displayed in plain language on the page
- Results shareable via a tokenised URL (no PII in the token)
- CTA into the Diagnóstico, seeded with the task the user described
- `calculator_sessions` row written for every completed calculation, anonymous unless a lead is later associated

**Prohibited:** the words "ahorro garantizado", "ROI garantizado", any comparison to
an invented industry benchmark, any implication that the automatable percentage is
known rather than user-supplied.

---

## 5. Resource library

- Downloadable guides and templates (PDF/DOCX): plantilla de política de uso de IA, checklist de datos, guía de selección de herramientas, guía de casos de uso por vertical
- **Ungated in MVP.** Rationale: we already have one gate (the report); a second gate suppresses the top of funnel and the resources' job is credibility. Revisit in Phase 3 with data.
- Each resource has an indexable HTML landing page with real content — never a bare download link
- Prompt library lives here structurally but is routed under `/herramientas/prompts`

---

## 6. Industry landing pages
See §1.4. Managed as MDX in Phase 1–2; migrated to `service_pages`/`content_pages`
tables in Phase 3 **only if** a non-technical editor exists.

---

## 7. Lead capture

Three capture surfaces, in order of expected volume:

1. **WhatsApp** — floating button + inline CTAs. Pre-filled message carries page context. A `lead_event` is recorded on click (we cannot see the conversation, only the intent).
2. **Report gate** — email, empresa, rol, industria. The main structured capture.
3. **Contact / consultation form** — nombre, empresa, WhatsApp, email, industria, tamaño, proceso a resolver (free text), urgencia, presupuesto (band, optional).

**Rules:**
- Consent checkbox is explicit, unticked, with a link to the privacy notice; the exact text and timestamp are stored in `consent_records`
- Honeypot + timing check + server-side rate limit. **No CAPTCHA** in MVP — friction cost exceeds spam cost at this volume
- Every submission is written to `leads` and enqueued to the CRM outbox, never posted to the CRM inline
- Progressive profiling: never ask for a field we already have for that email

---

## 8. Admin functions
Full spec: `09_ADMIN_SPEC.md`. MVP subset: assessment question + scoring rule
management with versioning; lead list, detail, score override, disposition; report
regeneration; CRM outbox view with manual resend; consent and audit log viewers;
newsletter export; basic analytics dashboard.

---

## 9. User journeys

**J1 — Search → report → call (primary).**
Google "cómo aplicar inteligencia artificial en una inmobiliaria" → vertical page →
Diagnóstico → free result → gate → PDF by email → CTA → WhatsApp → discovery call →
Auditoría proposal.

**J2 — Calculator → assessment.**
Search "cuánto cuesta una tarea repetitiva" → calculator → sees the annual cost →
seeded CTA → Diagnóstico → J1 from the gate onward.

**J3 — Referral → direct.**
Contador refers → visits `/servicios/auditoria-de-ia` → checks `/metodo` and
`/nosotros` → WhatsApp. **No tool involved.** The site's job here is purely
credibility — which is why `/metodo`, `/nosotros` and `/precios` must be excellent.

**J4 — Researcher, not a buyer.**
Student/competitor consumes content, maybe takes the assessment. Scores low, is not
offered a call, enters the low-priority nurture list. Costs us nothing. This is a
success, not a failure — provided the scoring correctly routes them.

**J5 — Returning user.**
Comes back for the prompt library. Sees a new resource. This is the retention surface
and the reason the prompt library exists despite generating few direct leads.

**J6 — [POST-MVP] Client portal.** Phase 4.

---

## 10. Functional requirements (MVP)

| ID | Requirement |
|---|---|
| F1 | Public marketing pages render server-side, statically cached where possible |
| F2 | Multi-step assessment persists per-step answers against an anonymous session |
| F3 | Scoring executes server-side against a versioned, admin-editable rule set |
| F4 | On-screen results are shown without any personal data |
| F5 | PDF report generation is queued and processed asynchronously |
| F6 | Report delivered by email and via a tokenised results URL |
| F7 | Calculator computes server-side and persists an anonymous session row |
| F8 | Prompt library is browsable, filterable by function and industry, and copyable |
| F9 | All lead capture writes to `leads` and to the CRM outbox |
| F10 | Lead scoring is computed automatically on lead creation and on qualifying events |
| F11 | Admin can create, edit and version assessment questions and scoring rules without a deploy |
| F12 | Admin can view, filter, score-override and disposition leads |
| F13 | Admin can view the CRM outbox and manually resend failed items |
| F14 | Consent is captured with exact text, timestamp, IP and user agent |
| F15 | All tool usage emits `tool_usage_events` for funnel analysis |
| F16 | All admin mutations write to `audit_logs` |
| F17 | Rate limiting on every public write endpoint and every LLM-invoking endpoint |
| F18 | Sitemap, robots, canonical URLs and structured data generated automatically |
| F19 | Users can request deletion of their data via a documented route; admin can execute it |
| F20 | Every generated report records the assessment, scoring and prompt versions used |

## 11. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| N1 | LCP on mobile 4G, marketing pages | < 2.5 s |
| N2 | Assessment step transition | < 300 ms perceived |
| N3 | PDF generated and emailed | < 3 min p95 |
| N4 | Uptime | 99.5% |
| N5 | Accessibility | WCAG 2.1 AA on all public pages and the assessment |
| N6 | Language | Paraguayan Spanish throughout; no machine-translated copy |
| N7 | Mobile share assumption | ≥ 70% of sessions — mobile is the primary design target |
| N8 | Data in transit | TLS only |
| N9 | Backups | Daily DB backup, 30-day retention, **restore tested quarterly** |
| N10 | LLM cost per report | < USD 0.10; hard monthly cap with alerting |
| N11 | Report copy stored so any report is reproducible/explainable | Indefinitely until deletion request |
| N12 | No third-party script may receive form field contents | Enforced |

---

## 12. MVP scope (in)

Phase 1: home, 4 service pages, 4 vertical pages, `/metodo`, `/que-no-hacemos`,
`/precios`, `/nosotros`, `/contacto`, legal pages, blog with 10 articles, WhatsApp
capture, contact form, CRM outbox with mock adapter, analytics.

Phase 2: assessment, deterministic scoring engine, admin question/rule management,
PDF report, email delivery, email gate, lead scoring, results page.

Phase 3: calculator, prompt library, resource library, 20 more content pages, first
real VenderCRM adapter, nurture email sequence.

## 13. Exclusions (explicitly out of MVP)

End-user accounts · saved dashboards · payments · subscriptions · chatbot demos on the
site · a public tool directory · a proposal generator · multi-language · client portal ·
mobile app · public API · in-app scheduling (use an external booking link) · live chat ·
comments · AI-generated blog content published without human authorship and review.

---

## 14. Acceptance criteria (MVP exit)

1. All Phase 1–3 routes render, are indexable (except `/admin`), and carry correct canonical tags and structured data.
2. A user completes the assessment on a phone in under 8 minutes and sees results without providing any personal data.
3. Scores are reproducible: the same answers against the same rule version always produce the same score. Covered by an automated test suite with ≥20 fixture cases including boundary values.
4. Changing a weight in admin creates a **new rule version**; existing reports remain reproducible under their original version.
5. A gated submission produces a PDF delivered by email within 3 minutes p95, and the report is downloadable from the tokenised URL.
6. The report contains no invented statistic, no guaranteed-savings language, and shows all three required disclaimer placements. Verified by an automated content check plus human review of each template version.
7. Calculator results display the assumptions panel adjacent to the result on mobile without interaction.
8. Every lead appears in admin within 5 s, with a score, a source, and a consent record.
9. A failed CRM sync appears in the outbox with the error, and manual resend succeeds.
10. Rate limits return 429 with a friendly Spanish message and do not lose the user's assessment progress.
11. A deletion request removes personal data from `leads`, `contacts`, `consent_records` (retaining the legally required minimum), `reports` and `generated_documents`, while leaving anonymised analytics intact. Verified by test.
12. Lighthouse mobile: performance ≥ 85, accessibility ≥ 95, SEO 100 on home, one service page, one vertical page and the assessment.
13. No page contains a client logo, testimonial, case study, certification or usage counter that is not backed by a `consent_records` row or a real database query. Enforced by a build-time content lint (see `15` T-QA-01).
