# 04 — Tool Portfolio

**Selection outcome (locked):**

| Slot | Tool | Phase |
|---|---|---|
| **Primary MVP tool** | Diagnóstico de Madurez en IA | 2 |
| **Supporting tool 1** | Calculadora de Costo de Tareas Repetitivas | 3 |
| **Supporting tool 2** | Biblioteca de Prompts por Función | 3 |
| Everything else | Deferred or rejected | — |

**Hard cap: 3 live tools through Phase 4.** A fourth tool requires an ADR and the
retirement of an existing one. Rationale: every tool carries permanent maintenance,
support, content, QA and LLM-cost burden, and each additional entry point dilutes the
single funnel we are trying to make legible.

Classification legend: **MVP** · **LEAD-GEN** (build in a later lead-gen phase) ·
**RETENTION** (Phase 4+) · **PAID** (product, Phase 5) · **REJECT**.

---

## 1. Diagnóstico de Madurez en IA — **MVP (primary)**

| Aspect | Detail |
|---|---|
| **User problem** | "No sé si mi empresa está lista para usar IA, ni por dónde empezar." |
| **Persona** | Owner (P1) and internal champion (P2) |
| **Inputs** | 24 questions across 6 sections: perfil, procesos y volumen, datos y sistemas, equipo y adopción, gobernanza, objetivos. Formats: single-select, multi-select, scale 1–5, number, short text. Full text in `05`. |
| **Output** | Free: maturity level 1–5, 5 dimension scores, top 3 opportunities, weakest-dimension note. Gated: 8–12 page PDF with roadmap, risks, cost considerations, glossary. |
| **Logic** | **Deterministic.** Weighted rubric per dimension → normalised 0–100 → maturity band. Opportunities matched by rule from (industry × process answers × data readiness). Full model in `05`. |
| **Is AI required?** | **No, for scoring — and it must not be used there.** Yes, optionally, for narrative prose in the PDF, constrained to a structured input with scores as immutable facts. |
| **Lead value** | **Highest of any tool.** Captures industry, size, budget band, urgency, decision role, and named processes — the entire qualification set, volunteered. |
| **Return use** | Low per user (annual at best). Acceptable: this is a conversion tool, not a retention tool. |
| **SEO potential** | High. Ranks for "diagnóstico de IA", "evaluación de madurez en IA", "¿está mi empresa lista para la IA?" and vertical variants. Also the natural CTA target for every content page. |
| **Data/privacy** | Assessment answers are business-process data, not personal data, until the gate. Never ask for client names, financials, or anything sensitive. Anonymous sessions purged at 180 days if never gated. |
| **Complexity** | Medium-high: versioned questions, versioned scoring, admin editing, PDF, email, queue. This is what justifies Node.js. |
| **Monetisation** | Indirect — it is the top of the paid funnel. |
| **Priority** | **P0.** |

---

## 2. Calculadora de Costo de Tareas Repetitivas — **MVP (supporting 1)**

| Aspect | Detail |
|---|---|
| **User problem** | "Sé que perdemos tiempo, pero no sé cuánto cuesta." |
| **Persona** | Internal champion building a case; also the owner |
| **Inputs** | Nombre de la tarea · personas involucradas · minutos por ocurrencia · ocurrencias por semana · salario mensual promedio cargado (Gs.) · % estimado de la tarea que es mecánica (user-supplied slider, defaults to 50% and is labelled a user estimate) |
| **Output** | Horas anuales · costo anual en Gs. · a conservative/optimistic **band** for the mechanical portion · the formula in plain language · assumptions panel |
| **Logic** | `horas_anuales = personas × minutos × ocurrencias × 48 / 60`. `costo_hora = salario_mensual_cargado / 160`. `costo_anual = horas_anuales × costo_hora`. Band = mechanical% × [0.5, 0.9] as a **potential addressable portion**, explicitly not a savings promise. All constants (48 working weeks, 160 h/month) are displayed and configurable in admin. |
| **AI required?** | **No.** Pure arithmetic. Using an LLM here would be worse in every dimension. |
| **Lead value** | Medium. Ungated, but the seeded CTA into the Diagnóstico converts well because the user has just quantified their own pain. |
| **Return use** | Medium-high — people run it for several tasks in one session and return with new ones. |
| **SEO potential** | High. Commercial-adjacent informational intent: "calculadora costo tareas repetitivas", "cuánto cuesta una tarea manual", "costo de procesos manuales empresa". Low competition in Paraguayan Spanish. |
| **Data/privacy** | Salary inputs are sensitive-adjacent. Store **only aggregate/bucketed** values, never the raw salary figure tied to an identified lead. No PII collected. |
| **Complexity** | Low. Days, not weeks. |
| **Monetisation** | Indirect. |
| **Priority** | **P1.** |
| **Risk** | Misread as a savings guarantee → mitigated by the mandatory assumptions panel and banned vocabulary list. |

---

## 3. Biblioteca de Prompts por Función — **MVP (supporting 2)**

| Aspect | Detail |
|---|---|
| **User problem** | "Ya usamos ChatGPT pero los resultados son inconsistentes." |
| **Persona** | Internal champion, department managers, and the *end users* who later become adoption allies inside a client |
| **Inputs** | None. Browse and filter by function (ventas, atención al cliente, administración, RRHH, marketing, legal, contable) and by industry. |
| **Output** | Curated, tested prompts in Paraguayan Spanish with: purpose, when to use, when **not** to use, what to check before trusting the output, and a copy button |
| **Logic** | Content, not computation. Stored in `prompts` / `prompt_categories`. |
| **AI required?** | **No runtime AI.** Prompts are human-written and human-tested. A "probar el prompt" runtime is deliberately excluded from MVP — it converts a zero-cost content asset into a metered, abusable LLM endpoint. |
| **Lead value** | **Low directly.** Justified by retention and SEO, not by leads. |
| **Return use** | **Highest of any tool.** The reason it earns a slot. |
| **SEO potential** | **Very high.** Long-tail per prompt: "prompt para responder consultas de clientes", "prompt para resumir contratos", ×funciones ×industrias. Dozens of low-competition pages built from a single content system. |
| **Data/privacy** | None. |
| **Complexity** | Low (content model + listing + detail). The cost is editorial, not technical. |
| **Monetisation** | Path to a paid vertical prompt pack in Phase 5, and a natural upsell into the Taller. |
| **Priority** | **P1.** |
| **Editorial rule** | Every prompt is tested by a human before publication and carries a "verificá antes de usar" note. No auto-generated prompt dumps — that turns the asset into exactly the thin directory we said we would not build. |

---

## 4. Deferred and rejected tools

### Identificador de Oportunidades de Proceso — **REJECT (merge)**
Overlaps ~80% with the Diagnóstico. Two tools asking "what should you automate" splits
the funnel and confuses positioning. **Decision: merge its intent into the Diagnóstico's
opportunity-matching output.** Do not build separately.

### Generador de Casos de Uso por Industria — **LEAD-GEN (Phase 4), conditional**
- *Attraction:* strong SEO surface, feels magical.
- *Problem:* an LLM generating use cases from a two-field input produces plausible generic output — precisely the "AI slop" that undermines a credibility-led positioning. It is also an open-ended LLM endpoint (cost + abuse).
- **Decision:** do **not** build as a generator. Instead publish **curated, human-written use-case pages per vertical** — same SEO benefit, far higher credibility, zero runtime cost. Revisit a generator only if curated pages prove demand and we can constrain it to a vetted library with retrieval rather than free generation.

### Generador de Política de Uso de IA — **LEAD-GEN (Phase 4)**
- Real problem, real demand, natural fit with the Taller.
- Deterministic template assembly from ~8 questions (sector, tool policy, data classification, approval rules, prohibited uses). **No LLM needed.**
- Risk: reads as legal advice. Requires prominent "borrador, requiere revisión legal" framing.
- Good lead value (organisational maturity signal). **Build in Phase 4, ahead of everything else in this section.**

### Generador de Hoja de Ruta de IA — **REJECT (merge)**
Already produced by the Diagnóstico report (90-day sequence). A standalone version
would cannibalise the primary tool. Merge, do not build.

### Directorio de Herramientas de IA — **REJECT**
Permanent maintenance burden (tools and pricing change monthly), commodity content
that LLMs answer directly, weak commercial intent, and sponsored placements would
compromise the advisory positioning that is our main differentiator. Instead: a small
number of **opinionated comparison articles** we actually maintain.

### Demos de Chatbot por Industria — **LEAD-GEN (Phase 4), with strict conditions**
- *Attraction:* the single most persuasive artefact for a sceptical Paraguayan buyer.
- *Problems:* open LLM endpoint (cost, prompt injection, abuse); a demo behaving badly is worse than no demo; support burden; blurs demo/production.
- **Decision:** defer to Phase 4. When built, mandatory: a visible `DEMO` banner and a statement that it is not connected to any real client system; hard token and turn caps; per-IP rate limits; strict system prompt with refusal behaviour; full conversation logging with retention limits; a monthly cost cap that disables the demo rather than overspending; no collection of personal data in-conversation.
- Until then, the sales equivalent is a **recorded video walkthrough** of a real (consented) or synthetic-data build — most of the persuasion, none of the risk.

### Generador de Propuestas / Documentos — **REJECT for public use; internal tool**
High hallucination exposure on a document a business might actually send. Wrong
audience (our buyers do not need proposals; agencies do). **Build it internally** to
speed our own proposal production — that is a genuine margin improvement — but do not
publish it.

### Calculadora de Costo de Reuniones — **REJECT**
Novelty. Already commoditised, no commercial intent, and it competes for attention with
the calculator that actually matters. Fold the concept into one blog article if wanted.

### Checklist de Riesgo de IA — **RETENTION (Phase 4)**
Real value, but overlaps the Diagnóstico's governance dimension. Better as a
**downloadable resource** in Phase 3 (zero build cost) and only as an interactive tool
in Phase 4 if the download proves demand.

### Checklist de Preparación de Datos — **RETENTION (Phase 4) / resource in Phase 3**
Same reasoning. High practical value in *delivery* — make it a client-facing artefact
in the Auditoría first, publish it as a resource second, tool-ify last.

### Quiz de Capacitación de Empleados en IA — **PAID (Phase 5)**
Wrong buyer at MVP (individual employees, not decision-makers) and no lead value on its
own. Becomes valuable as a **pre/post assessment attached to the Taller** — a real
product feature we can charge for, and a genuine differentiator for the training offer.
Build it when the Taller has been delivered enough times to know what to measure.

---

## 5. Summary decision table

| Tool | Class | Phase | AI at runtime? | Lead value | Return use | SEO | Complexity |
|---|---|---|---|---|---|---|---|
| Diagnóstico de Madurez | **MVP-primary** | 2 | Narrative only | ★★★★★ | ★☆ | ★★★★☆ | High |
| Calculadora tareas repetitivas | **MVP-support** | 3 | No | ★★★☆ | ★★★☆ | ★★★★☆ | Low |
| Biblioteca de prompts | **MVP-support** | 3 | No | ★★☆ | ★★★★★ | ★★★★★ | Low |
| Generador de política de IA | LEAD-GEN | 4 | No | ★★★★☆ | ★★ | ★★★☆ | Medium |
| Demos de chatbot | LEAD-GEN | 4 | Yes (capped) | ★★★★☆ | ★★★ | ★★☆ | High |
| Checklist de riesgo | RETENTION | 3 (resource) → 4 | No | ★★☆ | ★★★ | ★★★☆ | Low |
| Checklist de datos | RETENTION | 3 (resource) → 4 | No | ★★☆ | ★★★ | ★★★☆ | Low |
| Casos de uso por industria | Curated pages, not a tool | 3 | No | ★★★☆ | ★★ | ★★★★★ | Low |
| Quiz de capacitación | PAID | 5 | No | ★☆ | ★★★ | ★★ | Medium |
| Identificador de procesos | **REJECT** (merge) | — | — | — | — | — | — |
| Generador de hoja de ruta | **REJECT** (merge) | — | — | — | — | — | — |
| Directorio de herramientas | **REJECT** | — | — | — | — | — | — |
| Generador de propuestas | **REJECT** (internal only) | — | — | — | — | — | — |
| Calculadora de reuniones | **REJECT** | — | — | — | — | — | — |

---

## 6. Governance rules for the portfolio

1. A tool ships only with: a landing page with real content, an SEO target, a defined lead action, an analytics event set, and a named owner.
2. Every tool is reviewed quarterly against: sessions, completion rate, leads generated, leads converted, LLM cost, support incidents.
3. **Retirement rule:** a tool producing fewer than 2 qualified leads per quarter and under 100 sessions per month is retired or merged. Retirement is a success of the review process, not a failure.
4. No tool may become an open-ended LLM endpoint without a hard monthly cost cap that disables the tool rather than overspending.
5. No tool asks for personal data it does not need for its own function.
