# inteligenciaartificial.com.py

**AI consulting and implementation firm for Paraguayan companies**, with a software
product layer that generates and qualifies its own leads.

**Status:** Phase 1 (MVP marketing site + tools + admin) in active build. Decisions
are locked; deviations require an ADR (`docs/14_IMPLEMENTATION_PHASES.md` §ADR process).

**Start here:** [`docs/17_LAUNCH_BLUEPRINT.md`](docs/17_LAUNCH_BLUEPRINT.md) — the whole
plan on one page.

---

## Stack

Next.js (App Router, TypeScript) · MySQL 8 + Drizzle ORM · MDX content in-repo ·
Tailwind CSS. Full rationale in `docs/11_STACK_AND_ARCHITECTURE.md`.

## Development

```bash
npm install
cp .env.example .env       # fill in local DB credentials
npm run db:migrate         # apply migrations
npm run dev
```

## Documents

| # | Document | What it decides |
|---|---|---|
| 00 | [Executive Decisions](docs/00_EXECUTIVE_DECISIONS.md) | Positioning, verticals, offers, stack, MVP tool, locked decisions |
| 01 | [Market and Positioning](docs/01_MARKET_AND_POSITIONING.md) | Paraguay context, ICP, personas, competitors, trust without fabricated proof |
| 02 | [Agency Strategy](docs/02_AGENCY_STRATEGY.md) | Offer ladder economics, sales, discovery, audit, delivery, capacity, qualification |
| 03 | [Product Spec](docs/03_PRODUCT_SPEC.md) | Routes, assessment UX, requirements, MVP scope, acceptance criteria |
| 04 | [Tool Portfolio](docs/04_TOOL_PORTFOLIO.md) | Every candidate tool, classified. One primary + two supporting. |
| 05 | [Assessment and Report Spec](docs/05_ASSESSMENT_AND_REPORT_SPEC.md) | 24 questions, deterministic scoring, report structure, disclaimers, retention |
| 06 | [SEO Architecture](docs/06_SEO_ARCHITECTURE.md) | Clusters, first 30 pages, first 30 topics, quality standards |
| 07 | [Lead Funnel](docs/07_LEAD_FUNNEL.md) | Gating, progressive capture, lead scoring, routing, disqualification, KPIs |
| 08 | [Database Schema](docs/08_DATABASE_SCHEMA.md) | Tables, retention rules, sensitive-data handling |
| 09 | [Admin Spec](docs/09_ADMIN_SPEC.md) | Rule management, lead review, CRM outbox, roles and permissions |
| 10 | [Monetization](docs/10_MONETIZATION.md) | Every revenue line, validation gates, pricing rules |
| 11 | [Stack and Architecture](docs/11_STACK_AND_ARCHITECTURE.md) | Stack comparison, final choice, diagrams, hosting, security, backups |
| 12 | [AI System Design](docs/12_AI_SYSTEM_DESIGN.md) | Deterministic vs LLM, hallucination controls, evals, red-team, prohibited claims |
| 13 | [VenderCRM Integration](docs/13_VENDERCRM_INTEGRATION.md) | Adapter, outbox, payload, idempotency, retries, mock-first build order |
| 14 | [Implementation Phases](docs/14_IMPLEMENTATION_PHASES.md) | Phase 0–5 scope, dependencies, KPIs, exit criteria, ADR process |
| 15 | [Implementation Tasks](docs/15_CLAUDE_TASKS.md) | Buildable tasks with acceptance criteria, tests, model and review requirements |
| 16 | [Risk Register](docs/16_RISK_REGISTER.md) | Scored risks with triggers and mitigations |
| 17 | [Launch Blueprint](docs/17_LAUNCH_BLUEPRINT.md) | One-page summary |

---

## Ground rules

- **No fabricated proof.** No invented clients, logos, testimonials, case studies, certifications, savings figures, benchmarks or usage counters — anywhere, ever. Enforced by a build-time content lint.
- **Deterministic scoring.** LLMs write prose about numbers they did not produce.
- **No guaranteed savings or ROI claims.** Calculators disclose their assumptions adjacent to the result.
- **Reports are preliminary business assessments**, not professional advice, stated in three places in every document.
- **Assumptions are marked `[SUPUESTO]`.** No market statistics have been invented; every price is a cost-derived hypothesis pending validation.
- **Revenue before software.** Phase 0 sells three audits before any application code is written.

## Documentation language
Planning documents are in English. All customer-facing strings — page copy, slugs,
question text, report sections, email content — are specified in Paraguayan Spanish and
are normative.
