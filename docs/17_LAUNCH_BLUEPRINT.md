# 17 — Recommended Launch Blueprint (one page)

**inteligenciaartificial.com.py** — the whole plan on one page.

---

### The business
An **AI consulting and implementation firm for Paraguayan companies**, with a software
product layer that generates and qualifies its own leads. Revenue comes from services.
The website exists to be found, to prove competence before a sales conversation, and to
filter out buyers we cannot serve profitably.

> **Consultoría e implementación de inteligencia artificial para empresas paraguayas.
> Alcance cerrado, precio cerrado, resultados medidos por vos.**

### Who we sell to
Formally registered companies, **10–150 employees**, Gran Asunción or Ciudad del Este,
where the owner or a director decides. Three verticals: **inmobiliarias ·
estudios contables · estudios jurídicos**, plus the horizontal wedge **atención al
cliente por WhatsApp**.

### What we sell
`Auditoría de Oportunidades de IA` **USD 1,500** (3 weeks, fixed scope, refund if no
applicable opportunity is found) → `Sprint de Implementación` **USD 3,500–7,500**
(4–6 weeks, one process, in production) → `Retainer` **USD 800–2,500/mes** (post-Sprint
only). Side entry: `Taller` **USD 900–1,600** — highest margin, best door-opener.
**Fixed price always. Never below the floor. Payment before work.**

### What we build
**One** Next.js app on Node, MySQL + Drizzle, MDX content, deployed on Hostinger.
No CMS, no subdomain split, no queue service, no user accounts before Phase 4.
Operating cost **USD 20–110/month**, ops burden 2–4 h/month.

**Three tools, hard cap:**
1. **Diagnóstico de Madurez en IA** — 24 questions, **deterministic scoring**, free on-screen results, PDF report as the single email gate.
2. **Calculadora de Costo de Tareas Repetitivas** — no AI, no gate, assumptions shown next to the result.
3. **Biblioteca de Prompts** — no runtime AI, retention and SEO surface.

Everything else on the candidate list is deferred or rejected, on the record.

### How AI is used
**Deterministic scoring. LLM narrative only.** The model never produces a number,
selects an opportunity, scores a lead, or disqualifies anyone. Any digit in generated
text that is absent from the input is rejected. Prohibited-claims lint runs on
generated *and* human-written copy at build time. Every report is reproducible from its
stored version, prompt and model id.

### How we earn trust with no clients
Named principal · published method · a sample report on **clearly labelled fictional
data** · the **scoring model published in plain language** · a public list of what we
refuse to do · technical depth · a real refund guarantee. **Zero fabricated clients,
logos, testimonials, statistics, certifications or counters — ever.**

### Sequence
| Phase | Weeks | Outcome |
|---|---|---|
| **0 — Validation** | 6–8 | **No code.** 20 conversations, 3 audits **sold and delivered**, 1 Sprint. |
| **1 — Authority site** | 5–7 | 15 pages, WhatsApp capture, leads → admin → outbox (mock CRM). |
| **2 — Diagnóstico** | 7–9 | Assessment, deterministic engine, PDF report, email gate, lead scoring, admin rules. |
| **3 — Tools + content** | 6–8 | Calculator, prompt library, 30 content pages, live VenderCRM adapter. |
| **4 — Accounts** | 8–10 | Conditional on ≥4 retainers **and** clients asking. |
| **5 — Paid products** | 6–8 | Conditional. **Hiring is often the better use of this time.** |

**Phase 0 is not optional and not parallelisable.** If three audits cannot be sold in
eight weeks, the offer is wrong — and that is far cheaper to learn before the build
than after it.

### The numbers that matter
1. **Qualified leads per month that we can actually serve** — not traffic, not signups.
2. **Actual delivery days vs quoted days** — the early-warning system for the two risks that kill firms like this.
3. **Audit → Sprint attach rate** (target 50%) and **Sprint → Retainer** (target 60%).
4. **Standardised delivery hours ≥65% by month 12** — below this, the business cannot be hired into.

Capacity ceiling: **2 concurrent Sprints, 4 retainers, ≈USD 14–18k/month.** When it is
reached, we queue at full price. We do not discount, compress, or subcontract into a
first-time client.

### The three things that would kill this
**Underpricing · selling past capacity · key-person dependency.** All internal, all
operational, none about technology. The website can be rebuilt; a reputation for missed
deadlines in a market this size cannot.

### First move
Do not open an editor. Book the first ten conversations, and sell an audit.

---

*Assumptions are marked **[SUPUESTO]** throughout these documents. No market
statistics, search volumes, or competitor figures have been invented. Every price is a
cost-derived hypothesis to be validated against the first five signed proposals.*
