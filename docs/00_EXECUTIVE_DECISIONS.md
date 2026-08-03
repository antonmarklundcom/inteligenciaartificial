# 00 — Executive Decisions

**Project:** inteligenciaartificial.com.py
**Market:** Paraguay
**Site language:** Paraguayan Spanish (voseo in conversational copy, usted in formal/commercial copy)
**Document language:** English (internal planning). All customer-facing strings, slugs, question text and report copy specified in these documents are written in Spanish and are normative.
**Status:** Decisions locked for MVP. Changes require an ADR (see `14_IMPLEMENTATION_PHASES.md` §ADR process).
**Date:** 2026-08-03

---

## 0.1 What this business is

An **AI consulting and implementation firm for Paraguayan companies**, with a
**software product layer that generates and qualifies its own leads**.

The revenue comes from services. The website exists to (a) make the firm findable
in Spanish for Paraguayan commercial intent, (b) demonstrate competence before any
sales conversation, and (c) filter out buyers we cannot serve profitably.

**One-line positioning (ES, normative):**

> **Consultoría e implementación de inteligencia artificial para empresas
> paraguayas. Alcance cerrado, precio cerrado, resultados medidos por vos.**

**Positioning statement (long form, ES):**

> Ayudamos a empresas paraguayas de 10 a 150 empleados a identificar qué procesos
> internos pueden automatizarse o asistirse con inteligencia artificial, y a
> implementarlos con alcance y precio definidos antes de empezar. No vendemos
> "transformación digital". Trabajamos sobre procesos concretos: documentos,
> respuestas a clientes, seguimiento de oportunidades, reportes y tareas
> administrativas repetitivas.

**What we explicitly are not:**

| Not this | Because |
|---|---|
| An AI news blog | No commercial intent, commoditised by every LLM |
| A "digital transformation" agency | Unfalsifiable scope, unsellable at fixed price |
| A reseller of a chatbot SaaS | Margin belongs to the vendor, not to us |
| A prompt directory | No path to revenue |
| An AI tools novelty site | Traffic without buyers |
| A software product company (yet) | Product only becomes primary revenue in Phase 5, if validated |

---

## 0.2 Locked decisions

| # | Decision area | Decision |
|---|---|---|
| D1 | **Primary segment** | Established, formally registered Paraguayan companies, **10–150 employees**, with an owner or director who signs, located in Gran Asunción or Ciudad del Este. |
| D2 | **Initial verticals (3)** | 1. **Inmobiliarias y desarrolladoras** 2. **Estudios contables / administración tributaria** 3. **Estudios jurídicos** |
| D3 | **Horizontal wedge** | **Atención al cliente por WhatsApp** — cuts across all three verticals and matches how Paraguayan commerce actually works. |
| D4 | **Primary paid offer** | **Auditoría de Oportunidades de IA** — fixed price, fixed 3-week scope, written deliverable. It is the wedge, not a loss leader. |
| D5 | **Second offer** | **Sprint de Implementación** — fixed scope, 4–6 weeks, one process, one deliverable in production. |
| D6 | **Recurring offer** | **Retainer de Optimización** — monthly, capacity-based, only sold after a delivered Sprint. Never sold cold. |
| D7 | **MVP tool (primary)** | **Diagnóstico de Madurez en IA** — 24-question assessment, **deterministic scoring**, email-gated personalised PDF report. |
| D8 | **Supporting tool 1** | **Calculadora de Costo de Tareas Repetitivas** — deterministic, no AI, no gate, strong SEO surface. |
| D9 | **Supporting tool 2** | **Biblioteca de Prompts por Función** — CMS/content-driven, no runtime AI, no gate, return-visit + SEO surface. |
| D10 | **All other candidate tools** | Deferred or rejected. See `04_TOOL_PORTFOLIO.md`. Hard cap: **3 tools live at end of Phase 3.** |
| D11 | **Stack** | **Single Next.js (App Router) application on Node.js**, MySQL + Drizzle ORM, deployed on Hostinger managed Node hosting. Content as MDX in-repo for Phase 1–2; DB-backed content only when a non-technical editor exists. **No separate CMS. No app subdomain.** |
| D12 | **Scoring architecture** | Deterministic, versioned, admin-editable rules. **LLMs never produce a score.** LLMs write only the narrative sections of the report, from a fixed structured input. |
| D13 | **Lead funnel** | Organic search + WhatsApp + referral → tool → email-gated report → qualification fields → lead score → WhatsApp or booked call. **No paid ads in Phase 1.** |
| D14 | **CRM** | VenderCRM, via an **adapter behind our own interface**, with a DB-backed outbox, retries and manual resend. Mock adapter first; no VenderCRM API details are assumed. |
| D15 | **Revenue model** | Services-led: ~85% project + retainer revenue, ~15% productised (workshops, templates) through month 18. Tool subscriptions are **not** a Phase 1–4 revenue line. |
| D16 | **Credibility strategy** | Method transparency + published artefacts + named principal. **Zero fabricated clients, logos, testimonials, case studies, certifications, savings figures, or usage counters.** |
| D17 | **Capacity ceiling** | One principal + fractional implementer. **Maximum 2 concurrent Sprints and 4 active retainers.** Sales stops when the ceiling is hit; we queue, we do not oversell. |
| D18 | **Gating policy** | Calculator and prompt library fully open. Assessment fully playable without email; **only the personalised PDF report is email-gated.** |

---

## 0.3 Initial verticals — rationale

| Vertical | Why first | Wedge use case |
|---|---|---|
| **Inmobiliarias / desarrolladoras** | Highest inbound message volume of any Paraguayan SME category; leads arrive on WhatsApp and die there; ticket size makes a single recovered sale pay for the whole engagement; decision-maker is usually the owner. | Qualification and follow-up of WhatsApp enquiries; automatic property-brief generation. |
| **Estudios contables** | Structurally document-heavy and deadline-driven; already buy professional services and understand fees; recurring monthly workload maps naturally to a retainer; they are also a **referral channel into their own client base**. | Document intake and classification; client-communication templating; recurring report drafting. |
| **Estudios jurídicos** | Highest value per professional hour, so time recovery has an obvious price; document drafting and review is the canonical LLM use case; understand confidentiality, so they respect careful vendors. | Drafting assistance from firm precedent; document summarisation and comparison; intake triage. |

**Deferred verticals and why (not "avoid forever"):**

- **Clínicas y consultorios** — health data raises privacy obligations we should not take on before our data handling is mature. Revisit in Phase 3.
- **Colegios** — long budget cycles, committee decisions, low willingness to pay.
- **Restaurantes** — ticket too small for consulting economics.
- **Ecommerce** — the addressable formal Paraguayan ecommerce base is thin; better served by the horizontal WhatsApp wedge than a dedicated vertical.
- **Government / public sector** — procurement cycle incompatible with a firm of this size.

---

## 0.4 The offer ladder (locked)

```
0. Contenido educativo (gratis, sin registro)
1. Calculadora de tareas repetitivas (gratis, sin registro)
2. Diagnóstico de Madurez en IA (gratis, sin registro)
3. Informe personalizado en PDF (gratis, con email)  ← el gate
4. Llamada de diagnóstico 30 min (gratis, calificada)
─────────── línea comercial ───────────
5. Auditoría de Oportunidades de IA (pago, alcance fijo)   ← OFERTA PRINCIPAL
6. Taller para equipos / dirección (pago, alcance fijo)
7. Sprint de Implementación (pago, alcance fijo)
8. Retainer de Optimización (mensual, solo post-Sprint)
9. Plantillas y cursos (productos digitales — Fase 5)
```

Rungs 6 and 9 are optional side-entries, not required steps. The spine is
**2 → 3 → 4 → 5 → 7 → 8**.

Full economics for each rung: `02_AGENCY_STRATEGY.md` and `10_MONETIZATION.md`.

---

## 0.5 Recommended stack (summary — full analysis in `11`)

**Chosen: one Next.js app, one database, one deploy.**

- Next.js (App Router) on Node.js — Hostinger managed Node hosting
- MySQL + Drizzle ORM
- Marketing content: MDX in-repo (Phase 1–2) → DB-backed content model (Phase 3+, only if a non-technical editor exists)
- Auth: none for public tools; email+password with session cookies for `/admin` only. No end-user accounts before Phase 4.
- Background work: DB-backed job table drained by an authenticated cron-invoked route. **No Redis, no queue service.**
- PDF: server-side HTML→PDF in the job worker
- Email: transactional provider via a single adapter interface
- AI: provider-agnostic adapter, structured outputs, narrative-only

**Why Node.js is justified:** the MVP needs versioned multi-step assessment state,
deterministic server-side scoring that must not be inspectable by the client, PDF
generation, background jobs, lead scoring, admin-managed question and scoring rules,
rate limiting, and CRM synchronisation with retries. That is an application, not a
brochure. A static site cannot hold it, and splitting it across a static marketing
site plus a separate API doubles the deployment surface for a two-person operation.

**Why not a headless CMS:** ~30 pages at launch, edited by the same people who write
the code. A CMS adds a vendor, a sync path, a preview problem and a monthly bill to
solve an editing problem we do not yet have.

---

## 0.6 Revenue model

| Line | Share of revenue, month 18 (target) | Nature |
|---|---|---|
| Sprints de Implementación | ~40% | Project, fixed scope |
| Retainers de Optimización | ~25% | Recurring |
| Auditorías | ~20% | Project, fixed scope, top of commercial funnel |
| Talleres / capacitación | ~10% | Project, high margin, low fulfilment depth |
| Productos digitales | ~5% | Recurring-ish, Phase 5 |

These are **targets, not forecasts**, and are marked as an assumption. They exist to
force sequencing decisions, not to be reported to anyone as projections.

---

## 0.7 Biggest strategic risks (top 6, full register in `16`)

| Risk | Why it is the real threat | Mitigation now |
|---|---|---|
| **R1 — Underpriced consulting** | Custom AI work absorbs unbounded hours; a mispriced first Sprint destroys a quarter of capacity. | Fixed scope, written exclusions, change-order clause, minimum price floor, no discounting below floor. |
| **R2 — Selling ahead of delivery capacity** | Two concurrent Sprints is the true ceiling. Selling a third fails all three. | Hard capacity gate in the sales process (D17); queue with a start date instead of discounting. |
| **R3 — Vague positioning drift** | Every incoming enquiry will try to widen us into "general IT". | Published scope boundaries; explicit rejection criteria; three verticals only. |
| **R4 — Credibility gap at launch** | No clients, no logos, and we refuse to invent them. | Method transparency: publish the audit methodology, the scoring model, sample deliverables built on synthetic data clearly labelled as such, and the principal's name and face. |
| **R5 — Tool sprawl** | Each tool has permanent maintenance cost and dilutes the funnel. | Hard cap of 3 tools; new tool requires retiring one or an ADR. |
| **R6 — Organic-search dependence** | Single channel; algorithmically fragile; also increasingly answered by LLM surfaces rather than clicks. | Deliberately build two non-search channels from Phase 1: referral loop through contadores, and a monthly email list that we own. |

---

## 0.8 Decisions that must remain fixed during MVP implementation

Implementation agents (Sonnet/Codex) may **not** change these without an ADR and Opus review:

1. Scoring is deterministic and server-side. No LLM in the scoring path. (D12)
2. Exactly one primary tool and two supporting tools ship in Phase 1–3. (D10)
3. One application, one database, one deploy. No CMS, no microservices, no app subdomain. (D11)
4. Only the PDF report is gated. The assessment itself is never gated. (D18)
5. No fabricated proof of any kind, in any copy, ever. (D16)
6. No end-user accounts before Phase 4.
7. CRM integration goes through our adapter interface with an outbox table. No direct calls from request handlers. (D14)
8. No claim of guaranteed savings, ROI, or compliance certification anywhere in the product or the marketing site.
9. Calculator outputs display their assumptions on the same screen as the result, not behind a link.
10. Reports carry the preliminary-assessment disclaimer in the document body, not only the footer.
11. Personal data collected is limited to the qualification fields defined in `07_LEAD_FUNNEL.md` §4. Adding a field requires an ADR.
12. Pricing published on the site is a **starting-from** figure with stated scope, or a range. No "consultá por precio" on the primary offer.

---

## 0.9 Explicit assumptions

Marked because they are assumptions, not researched market facts. Each should be
validated in Phase 0.

- **A1** — Paraguayan SMEs in the three chosen verticals will pay for a fixed-price diagnostic engagement rather than expecting free pre-sales work. *Validation: 10 discovery conversations, 3 paid audits sold before Phase 2 build.*
- **A2** — WhatsApp is the dominant commercial channel and a phone-number-first contact flow will outperform an email-first one. *Validation: channel split measured from month 1.*
- **A3** — Spanish-language commercial AI queries in Paraguay are currently under-served relative to Argentina/Spain content. *Validation: rank tracking on the first 30 pages by month 6.*
- **A4** — A principal-led firm can bill at the day rate assumed in `10_MONETIZATION.md`. *Validation: first three signed proposals.*
- **A5** — The FX rate used for published Guaraní prices (~Gs. 7,300/USD) will stay within a band that does not require re-pricing more than twice a year. *Validation: quarterly review; publish in Gs. with USD reference.*
