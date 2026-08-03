# 02 — Agency Strategy

> **Pricing note.** Every price below is a **pricing hypothesis derived from internal
> cost and capacity**, not from market research. It is computed as
> `person-days × target day rate + third-party costs + risk margin`, with a floor.
> Target day rate assumption: **USD 500/day for principal time, USD 250/day for
> implementer time [SUPUESTO A4]**. Guaraní figures use **Gs. 7,300/USD [SUPUESTO A5]**
> and are rounded to a saleable number. Validate against the first five signed
> proposals and revise; do not treat these as market rates.

---

## 1. The offer ladder

### Rung 0 — Contenido educativo
Free, no registration. Articles, guides, industry pages.
**Purpose:** organic acquisition + credibility. **Not** a lead magnet by itself.
**Success metric:** assisted conversions into Rung 2, not pageviews.

---

### Rung 1 — Calculadora de Costo de Tareas Repetitivas
Free, ungated, no email.

| Field | Value |
|---|---|
| **Target buyer** | Any operational decision-maker; also strong for the internal champion building a case |
| **Problem solved** | The cost of doing nothing is invisible |
| **Inputs** | Task name, people involved, minutes per occurrence, occurrences per week, average loaded monthly salary of the people involved, estimated % of the task that is mechanical |
| **Output** | Estimated annual hours and Guaraní cost of the task, plus a stated-assumption band showing a conservative/optimistic range for the automatable portion. **Never** a savings promise. |
| **Fulfilment effort** | Zero after build |
| **Margin** | N/A — acquisition asset |
| **Risk** | Being read as a savings guarantee. Mitigation: assumptions panel rendered adjacent to the result; wording is "costo estimado actual", never "ahorro garantizado" |
| **Upsell path** | → Diagnóstico (Rung 2), contextual CTA seeded with the task name |
| **Evidence needed** | None; every number is derived from the user's own inputs and the formula is shown |

---

### Rung 2 — Diagnóstico de Madurez en IA
Free, ungated, ~6 minutes, 24 questions. **The primary MVP tool.**

| Field | Value |
|---|---|
| **Target buyer** | Owner or internal champion in the three verticals |
| **Problem solved** | "No sé por dónde empezar ni si estamos listos" |
| **Inputs** | Industry, size, current tooling, data state, process descriptions, team readiness, budget band, timeline — see `05` |
| **Deliverables** | On-screen: maturity level, dimension scores, top 3 opportunities |
| **Indicative scope** | Self-serve |
| **Pricing logic** | Free. It is the qualification instrument. |
| **Fulfilment effort** | Zero marginal (narrative LLM cost ≈ USD 0.02–0.05 per report) |
| **Margin** | N/A |
| **Risk** | Being taken as definitive advice → disclaimer in-body; being gamed → rate limiting |
| **Upsell path** | → gated report (Rung 3) |
| **Evidence needed** | Methodology page must exist before launch |

---

### Rung 3 — Informe Personalizado (PDF) — **the gate**
Free, requires email + company name + industry + role.

| Field | Value |
|---|---|
| **Target buyer** | Same, now identified |
| **Problem solved** | Something to circulate internally and act on |
| **Inputs** | The completed assessment + the gate fields |
| **Deliverables** | 8–12 page PDF: current state, scores by dimension, benchmark against *our own* rubric (not invented industry data), 3 prioritised opportunities with effort/impact classification, 90-day suggested sequence, risks, glossary, disclaimers |
| **Fulfilment effort** | Zero marginal |
| **Margin** | N/A — this is the lead |
| **Risk** | Report quality is the firm's public work product. A weak report costs more than no report. Templates must be reviewed by the principal before each version ships. |
| **Upsell path** | → Llamada de diagnóstico (Rung 4). CTA in the PDF *and* in the delivery email *and* on the on-screen confirmation. |
| **Evidence needed** | Every benchmark statement must be traceable to our published rubric or removed |

---

### Rung 4 — Llamada de Diagnóstico (30 min)
Free, but **only offered to leads scoring ≥ 60** (see `07`). Others get the nurture sequence.

| Field | Value |
|---|---|
| **Problem solved** | Buyer needs to talk to a person before spending money |
| **Inputs** | Report + a 4-field pre-call form (proceso concreto, urgencia, presupuesto, quién decide) |
| **Deliverables** | Verbal opinion + a one-page written follow-up + a proposal for the Auditoría if it fits |
| **Fulfilment effort** | 30 min call + 30 min prep/follow-up |
| **Risk** | Becoming free consulting. **Hard stop at 30 minutes.** If they want the answer, they buy the Auditoría. |

---

### Rung 5 — **Auditoría de Oportunidades de IA** ← PRIMARY PAID OFFER

| Field | Value |
|---|---|
| **Target buyer** | Owner/director, 10–150 employees, in one of the three verticals |
| **Problem solved** | "¿Qué tres cosas hago primero, cuánto cuestan, y en qué orden?" |
| **Inputs required from client** | 3–5 stakeholder interviews (45 min each), access to observe 2–3 processes, sample documents/message logs (anonymised where sensitive), current tool inventory, headcount and loaded cost by role |
| **Deliverables** | 1. Written report (25–40 pp): process map of 3–5 candidate processes, current-state measurement, opportunity classification, prioritised roadmap, cost estimates including recurring API/licence costs, risk and data-handling assessment, explicit list of what we recommend *not* doing. 2. A 90-minute presentation to the client team. 3. A fixed-price Sprint proposal for opportunity #1. |
| **Indicative scope** | 3 calendar weeks · 5–6 person-days |
| **Pricing logic** | 5.5 days × USD 500 + margin → **USD 1,500 · Gs. 11.000.000** (starting from; +USD 500 for a second site or a fourth+ process). **Floor: USD 1,200.** |
| **Fulfilment effort** | Medium. Highly standardisable — interview guide, measurement template, report skeleton are all reusable. |
| **Gross margin** | ~70–80% once the template is mature (mostly principal time) |
| **Risks** | Scope creep in interviews; client expects implementation included; findings reveal a data problem that blocks everything (this is a *good* finding, but must be sellable as such — hence the Diagnóstico de Datos add-on) |
| **Upsell path** | → Sprint (attach rate target: **50%**, tracked) |
| **Evidence needed** | Publish the methodology and a fictional-data sample report before selling the first one |
| **Guarantee** | Full refund if no applicable opportunity is identified |

---

### Rung 6 — Taller para Equipos / Dirección

| Field | Value |
|---|---|
| **Target buyer** | Director wanting the team capable and governed; also HR |
| **Problem solved** | Staff already using AI tools unmanaged; nobody knows what is safe |
| **Inputs** | Attendee roles, 3 real work tasks per attendee gathered beforehand, industry |
| **Deliverables** | Half-day (4h) or full-day (8h) workshop, hands-on with the attendees' real tasks; prompt playbook for their functions; **draft Política de Uso de IA** for the company; 30-day practice plan; recording optional |
| **Pricing logic** | Half-day: 2 days effort (1 prep + 0.5 delivery + 0.5 follow-up) → **USD 900 · Gs. 6.600.000** up to 12 people. Full day: **USD 1,600 · Gs. 11.700.000** up to 15. +USD 40/person beyond. |
| **Fulfilment effort** | Low after the first two runs; content is 80% reusable |
| **Gross margin** | ~85% |
| **Risks** | Perceived as generic training. Mitigation: the pre-workshop task collection makes it demonstrably specific. |
| **Upsell path** | Workshop reveals processes → Auditoría or direct Sprint. Also the best *entry* offer for a sceptical buyer. |
| **Evidence needed** | None beyond honest agenda; do not claim certification of any kind |

---

### Rung 7 — Sprint de Implementación

| Field | Value |
|---|---|
| **Target buyer** | Post-audit client, or post-workshop client with an obvious single process |
| **Problem solved** | "Ya sé qué hacer; necesito que funcione" |
| **Inputs** | One named process; a named process owner on the client side with allocated time; system access; test data; a defined acceptance test agreed before start |
| **Deliverables** | One working solution in production for one process; configuration documentation; a 2-hour training session for the users; 30 days of post-launch support; a measurement of the process before and after |
| **Indicative scope** | 4–6 weeks · 8–15 person-days depending on tier |
| **Pricing logic** | **Tier A — Asistente de conocimiento interno / documentos:** 8–10 days → **USD 3,500 · Gs. 25.500.000**. **Tier B — Automatización de flujo (intake, clasificación, generación de documentos):** 10–14 days → **USD 5,500 · Gs. 40.000.000**. **Tier C — Asistente de atención por WhatsApp con calificación y derivación:** 12–16 days → **USD 7,500 · Gs. 55.000.000**. All *plus* client-paid recurring costs (API, hosting, licences), quoted separately and explicitly. **Floor: USD 3,000.** |
| **Fulfilment effort** | High. This is the capacity constraint of the whole business. |
| **Gross margin** | 50–65%, degrading fast if scope drifts. **Track per-project actual days against quoted days; this is the single most important internal metric.** |
| **Risks** | Underestimation; client-side data quality; integration with systems that have no API (very common in this market — check *before* quoting); the 30-day support window becoming indefinite |
| **Upsell path** | → Retainer (attach rate target: **60%**) |
| **Evidence needed** | Do not publish outcomes without client consent and a real before/after measurement |
| **Hard rule** | No Sprint starts without: signed scope with exclusions, a named client-side process owner, and a written acceptance test. |

---

### Rung 8 — Retainer de Optimización y Soporte

| Field | Value |
|---|---|
| **Target buyer** | Post-Sprint clients only |
| **Problem solved** | Solutions decay; prompts drift; volumes change; staff turns over; new opportunities appear |
| **Deliverables** | Monitoring and monthly quality review of deployed solutions; a defined bank of change hours; monthly usage/cost report; quarterly opportunity review; support SLA (business-hours response, next-business-day for non-critical) |
| **Tiers** | **Base — USD 800/mo · Gs. 5.800.000:** monitoring, 4h changes, monthly report. **Activo — USD 1,500/mo · Gs. 11.000.000:** 10h changes, quarterly opportunity review, priority support. **Socio — USD 2,500/mo · Gs. 18.000.000:** 18h, dedicated roadmap, on-site quarterly. |
| **Fulfilment effort** | Predictable if hours are capped and tracked; catastrophic if uncapped |
| **Gross margin** | 60–75% |
| **Risks** | Unlimited-support expectations; clients paying for a service they no longer perceive → the monthly report is the *product*, not an extra |
| **Hard rules** | Hours do not roll over more than one month. Never sold cold. Minimum 3-month term, then monthly. |

---

### Rung 9 — Productos digitales (Phase 5 only)
Templates, playbooks, a self-paced course. See `10_MONETIZATION.md`. Not before
Phase 5, and only from material already proven in delivery.

---

## 2. Scope boundaries

**We do:**
- Process analysis and prioritisation
- LLM-assisted document workflows (generation, summarisation, comparison, classification)
- Internal knowledge assistants over client-owned documents
- Conversational assistants for customer enquiry triage, qualification and routing
- Workflow automation connecting existing systems that expose an API
- Team training and AI-use policy drafting
- Vendor/tool selection advice
- Monitoring, iteration and support of what we built

**We do not:**
- Build or resell general-purpose SaaS
- Build CRMs, ERPs or accounting systems
- Anything that autonomously issues a tax filing, a legal determination, a medical opinion or a financial recommendation to a third party
- Fully autonomous agents that take irreversible action without human confirmation
- Data-entry outsourcing or BPO
- Model training or fine-tuning from scratch
- Website design, general IT support, network administration
- Scraping personal data or building marketing lists
- Facial recognition, biometric identification, emotion inference, or productivity surveillance of employees
- Projects whose stated primary purpose is headcount reduction
- Integrations with systems that have no API and no export path (we say so at quoting time, not at delivery time)

**We say no publicly.** `/que-no-hacemos` publishes this list. It filters leads,
demonstrates judgement, and is a genuinely useful page.

---

## 3. Sales process

```
Lead (tool / WhatsApp / referral / search)
  → automatic lead score
  → [score ≥ 60] Llamada de diagnóstico (30 min)
  → [fit] Propuesta de Auditoría (48h)
  → Auditoría (3 semanas)
  → Presentación + propuesta de Sprint
  → Sprint (4–6 semanas)
  → Retainer
```

**Stages** (mirrored in CRM, see `07` §Sales stages):
`Nuevo → Calificado → Llamada agendada → Llamada realizada → Propuesta enviada → Negociación → Ganado / Perdido / Descalificado / En espera de capacidad`

**Rules:**
- Response target: **under 2 business hours** for a scored lead. In a WhatsApp market this is the differentiator.
- Proposal within 48h of the call. Proposals expire in **14 days** — stated on the document.
- Maximum **two** follow-ups after a proposal, then the lead moves to the nurture list. No pursuit.
- Never discount below the floor. If the buyer cannot reach the floor, offer a *smaller scope* at the floor, or decline.

---

## 4. Discovery process (the 30-minute call)

Fixed agenda. The call is a qualification instrument, not a consultation.

1. **(5 min) Contexto.** What the company does, size, structure. Confirm the report's inputs.
2. **(10 min) El proceso.** "Contame paso a paso cómo hacen X hoy." Who touches it, how often, how long, what breaks, what it costs when it breaks. Listen for volume and repetition.
3. **(5 min) Restricciones.** What systems, what data, who would own this internally, what has been tried.
4. **(5 min) Decisión.** Who signs. What budget band. What timeline. What happens if they do nothing this year.
5. **(5 min) Próximo paso.** Either: propose the Auditoría with a price stated verbally on the call, or say clearly that we are not the right fit and why.

**Qualification output — recorded in CRM:**
`Proceso identificado (S/N)` · `Volumen suficiente (S/N)` · `Datos accesibles (S/N)` ·
`Decisor presente (S/N)` · `Banda de presupuesto` · `Urgencia (0–3)` · `Encaje vertical (0–3)`

**Never on this call:** propose a technical solution, name specific tools, estimate a
Sprint price. Those are the paid work product of the Auditoría. Giving them away
free is the fastest way to destroy this business model.

---

## 5. Audit process (3 weeks, standardised)

| Week | Activity | Artefact |
|---|---|---|
| **0** | Kick-off (60 min): confirm scope, name the client-side coordinator, request access and data | Acta de inicio, lista de accesos |
| **1** | 3–5 stakeholder interviews using the fixed guide; process observation; collect samples | Notas estructuradas, mapa de proceso v1 |
| **1–2** | Measurement: volume, time, error rate, cost. Where measurement is impossible, record an estimate **and label it as an estimate in the report** | Hoja de medición |
| **2** | Opportunity identification and classification: impact (1–5) × effort (1–5) × risk (1–5); feasibility check on each (does the system have an API? does the data exist?) | Matriz de oportunidades |
| **2–3** | Report writing; internal quality review against the checklist; cost modelling including recurring costs | Informe de Auditoría |
| **3** | 90-minute presentation; delivery of the report; Sprint proposal | Informe + propuesta |

**Report skeleton (fixed, reusable):**
1. Resumen ejecutivo (1 p, written last, written for the owner)
2. Alcance y método — including what we did **not** examine
3. Estado actual por proceso
4. Mediciones y supuestos — every estimate labelled
5. Oportunidades priorizadas
6. Lo que recomendamos **no** hacer
7. Riesgos: datos, dependencia de proveedor, adopción, costos recurrentes
8. Hoja de ruta 90 días
9. Costos estimados, incluyendo recurrentes
10. Anexos

**Internal quality gate before delivery:** every number traceable to a measurement or
labelled as an estimate; every recommendation has a named owner and a feasibility
note; the "no hacer" section is non-empty; no guaranteed-savings language anywhere.

---

## 6. Proposal process

**Fixed template.** Sections:
Problema (in the client's own words from the call) · Objetivo · Alcance incluido
(numbered) · **Alcance excluido** (numbered — as long as the included list) ·
Entregables · Cronograma con hitos · Precio y forma de pago · **Costos recurrentes de
terceros** (API, hosting, licencias — estimated monthly range, paid by the client) ·
Qué necesitamos del cliente (named people and time commitment) · Criterios de
aceptación · Cambios de alcance (written change order, priced at day rate) ·
Validez 14 días · Firma.

**Payment terms:** Auditoría 100% up front. Taller 50/50. Sprint 40% start / 40% at
functional milestone / 20% at acceptance. Retainer monthly in advance.
**No work begins before the first payment clears.**

---

## 7. Delivery process (Sprint)

| Phase | Days | Content |
|---|---|---|
| **Descubrimiento técnico** | 1–2 | System access, data sample review, integration feasibility confirmed, acceptance test written and signed |
| **Construcción** | 4–8 | Iterative; weekly 30-min demo with the process owner |
| **Prueba con datos reales** | 2–3 | Client-side testing against the acceptance test; measured error rate; adjustments |
| **Capacitación** | 1 | 2h session with the actual users; written quick-guide |
| **Puesta en producción** | 1 | Go-live, monitoring switched on, handover documentation delivered |
| **Soporte post-lanzamiento** | 30 días | Bug fixes included; changes are change orders |

**Non-negotiables:** weekly demo (kills the end-of-project surprise); written
acceptance test before construction starts; handover documentation is a deliverable,
not a courtesy; the process is measured before and after.

---

## 8. Capacity constraints

**Team assumption for the first 18 months:** 1 principal (sales + audits + architecture
+ QA) and 1 fractional implementer (build). **[SUPUESTO — if the team is larger,
revise every ceiling below.]**

| Constraint | Ceiling |
|---|---|
| Concurrent Sprints | **2** |
| Concurrent Audits | 2 (they overlap Sprints comfortably) |
| Active retainers | **4** at Base/Activo, or 2 at Socio |
| Workshops | 2/month |
| Discovery calls | 6/week |
| Monthly revenue ceiling at full capacity | ≈ USD 14–18k **[derived from the above, not a forecast]** |

**When the ceiling is reached:** stop selling Sprints. Offer a start date, at full
price, or offer an Auditoría now and a Sprint later. Do **not** discount to hold a
deal, do not subcontract an unknown implementer into a first-time client, and do not
compress a Sprint to fit. The failure mode that kills small consultancies is selling
past capacity and delivering three bad projects instead of two good ones.

**Capacity is a field in the sales process**, checked before every proposal.

---

## 9. Standardised vs custom

| Fully standardised (templates, no per-client design) | Configured per client (standard core, client data) | Genuinely custom |
|---|---|---|
| Diagnóstico + report | Knowledge assistant over client documents | Multi-system integrations |
| Audit interview guide, measurement sheet, report skeleton | WhatsApp triage flows | Anything touching a legacy system with no API |
| Proposal, contract, change order | Document generation from client templates | Novel process design |
| Workshop curriculum | Intake classification | Volume/latency-constrained architectures |
| Policy and governance templates | Monthly retainer report | |
| Handover documentation format | | |

**Target mix by month 12:** ~65% of delivery hours on standardised or configured
work. Above ~40% genuinely custom, margins collapse and the business stops being
sellable. This ratio is reviewed quarterly and is a leading indicator of trouble.

---

## 10. Partner opportunities

| Partner | Structure | Value | Risk |
|---|---|---|---|
| **Estudios contables** | Referral, 10% of first project | Direct access to a portfolio of qualified SMEs. Highest-leverage channel in this market. | Must deliver flawlessly; the contador's reputation is on the line |
| **Local web/marketing agencies** | We subcontract as the AI layer, white-label optional | Deal flow with no acquisition cost | Margin compression; ensure we still control quality and get a case reference |
| **Software vendors (ERP, CRM incl. VenderCRM)** | Mutual referral; we are the implementation partner | Warm, pre-qualified leads | Do not become an unpaid support channel for their product |
| **Independent implementers** | Subcontract overflow at ~USD 200–250/day | Capacity elasticity | Quality control; NDAs; never on a first-time client |
| **Chambers / gremios** | Free talks and workshops | Credibility and a room full of the ICP | Time cost; require an attendee list |

---

## 11. Qualification and rejection criteria

**Auto-qualify (score ≥ 60, see `07`):** 10–150 employees · one of the three verticals
or a clear WhatsApp-volume pain · a named process · budget band ≥ USD 1,500 ·
decision-maker engaged · timeline within 6 months.

**Reject or redirect — and say so plainly:**
- Under 10 employees, or a sole practitioner → send them the free tools and a self-serve guide. Genuinely helpful, costs us nothing.
- Wants a fixed price without any discovery on a complex integration → decline; the risk is unmanageable.
- Primary objective stated as staff reduction → decline. This is a values *and* a delivery-risk decision.
- Wants us to build a product they will resell → out of scope.
- No named internal owner with allocated time → decline; it will fail regardless of our work.
- Data exists only on paper → offer the Diagnóstico de Datos; do not sell a Sprint.
- Expects results guaranteed in writing → explain what we will and will not commit to; if they insist on guaranteed savings, decline.
- Budget below the floor → offer a smaller scope at the floor, or decline. Never discount below floor.
- Requests speculative work (a free pilot, a free POC, a free strategy deck) → decline, with a one-line explanation.
- Capacity is full → offer a dated slot at full price.

**Rejection is a written, courteous, one-paragraph message with an alternative** —
a self-serve resource, another vendor, or a later date. Rejected leads refer people.
Every rejection is recorded with a reason code (`07` §Disqualification rules) so we
can see what the market is asking for that we have decided not to sell.
