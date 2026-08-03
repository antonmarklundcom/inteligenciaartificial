# 15 — Implementation Tasks

Tasks are sized for a single focused session. Each is independently reviewable.
**Model column:** `Sonnet` = standard implementation · `Sonnet+` = needs care, review
closely · `Opus` = architecture or judgement, Opus must author or review.

**Universal requirements for every task** (not repeated per task):
- TypeScript strict; Zod validation at every trust boundary
- No secrets in code; no `console.log` of personal data
- Spanish user-facing copy, Paraguayan register
- Conventional commits; one task per PR
- No fabricated proof of any kind in any copy (`00` D16)

---

## Phase 1

### T1-01 — Project scaffold
**Goal:** Next.js App Router + TypeScript + Tailwind + Drizzle + MySQL, running locally and on Hostinger staging.
**Inputs:** `11`. **Output:** repo scaffold, `drizzle.config.ts`, health check route, CI running lint + typecheck + test.
**Acceptance:** `npm run build` clean; staging deploy reachable; DB connects; migrations run.
**Tests:** CI green on an empty suite. **Security:** env vars from the platform, `.env` gitignored, no secrets committed.
**Deps:** none. **Model:** Sonnet. **Opus review:** no.

### T1-02 — Core schema migration (MVP tables)
**Goal:** Drizzle schema + migration for all **[MVP]** tables in `08`.
**Inputs:** `08` §1–7. **Output:** schema files, migration, seed script with fixture data (**no production data ever**).
**Acceptance:** migration applies and rolls back cleanly; all indexes and unique constraints present; `audit_logs` has no UPDATE/DELETE grant for the app user; `prompts.probado_por` NOT NULL when `publicado = true`.
**Tests:** migration up/down in CI; constraint tests for the two rules above.
**Privacy:** `calculator_sessions` stores `salario_band`, never a raw figure — enforced by column type.
**Deps:** T1-01. **Model:** Sonnet+. **Opus review:** **yes** — the data model is a locked decision.

### T1-03 — Design system and layout
**Goal:** Header, footer, typography, colour, buttons, cards, forms, persistent WhatsApp CTA.
**Inputs:** `01` §8, `03` §1.2, conversion-design direction.
**Acceptance:** mobile-first; WCAG AA contrast; Lighthouse accessibility ≥95 on a sample page; WhatsApp button carries per-page context.
**SEO:** semantic landmarks, one `H1` per page. **Deps:** T1-01. **Model:** Sonnet.

### T1-04 — Marketing pages (MDX pipeline + 15 routes)
**Goal:** MDX content pipeline with frontmatter matching the future `content_pages` shape, plus routes 1–15 from `06` §4.
**Acceptance:** all routes render; frontmatter validated by Zod at build; a missing meta description **fails the build**; canonical, OG and structured data emitted per `06` §7–8.
**SEO:** sitemap and robots generated; `Organization`, `Service`, `BreadcrumbList` valid in Rich Results test.
**Deps:** T1-03. **Model:** Sonnet.

### T1-05 — Content lint (anti-fabrication + prohibited claims)
**Goal:** Build-time check over all MDX and report templates for the prohibited vocabulary in `12` §8, plus a check that no `<img>` is tagged as a client logo and no testimonial block exists without a `consent_ref`.
**Acceptance:** build fails on a violation with the file, line and matched term; a documented, reviewed allow-list exists for legitimate uses (e.g. an article *about* why we don't guarantee savings).
**Tests:** fixture files for each rule, positive and negative.
**Deps:** T1-04. **Model:** Sonnet+. **Opus review:** **yes** — this lint enforces `00` D16.
*(Referenced elsewhere as T-QA-01.)*

### T1-06 — Contact form → leads → outbox
**Goal:** Validated form writing `organizations`, `contacts`, `leads`, `consent_records`, and enqueuing `crm_sync_events`.
**Acceptance:** honeypot + timing check; rate limit 5/h per IP; consent stored with exact text, version, IP, UA; lead visible in admin <5s; outbox row created; **no inline CRM call**.
**Tests:** unit (validation, dedupe on `email_normalizado`), integration (submit → 4 rows + outbox), rate limit returns 429 in Spanish.
**Privacy:** only the fields in `07` §4. **Deps:** T1-02. **Model:** Sonnet+.

### T1-07 — Deterministic lead scoring engine
**Goal:** Pure scoring module per `07` §5, rules read from `scoring_rules`, writing a `lead_scores` row with a full `breakdown` on every computation.
**Acceptance:** pure function, no I/O in the core; same inputs + same rule version ⇒ same score; `breakdown` sums to the score; band boundaries correct; history never overwritten.
**Tests:** ≥15 fixtures incl. every band boundary and the `-100` student case; property test that score is always 0–100.
**Deps:** T1-02. **Model:** Sonnet+. **Opus review:** **yes** — scoring architecture is locked.

### T1-08 — Jobs table + cron worker
**Goal:** `jobs` queue, claim-with-lock, retry with backoff, an authenticated worker route invoked by cron.
**Acceptance:** two concurrent workers never process the same job; failures retry to `max_intentos` then mark `fallido`; worker route rejects unauthenticated calls.
**Tests:** concurrency test; backoff timing test; poison-job test.
**Security:** worker route protected by a shared secret; not in the sitemap.
**Deps:** T1-02. **Model:** Sonnet+.

### T1-09 — CRM outbox worker + mock adapter
**Goal:** `CrmAdapter` interface, `MockAdapter`, worker job type `sync_crm` with the retry schedule and retryable/permanent classification from `13` §2, §6.
**Acceptance:** duplicate enqueue is a no-op (unique key); 500 retries, 422 does not; exhausted retries mark `fallido` and alert on band A/B; adapter mode visible.
**Tests:** all integration cases in `13` §11 except the contract test. **No test calls a live CRM.**
**Deps:** T1-06, T1-08. **Model:** Sonnet+. **Opus review:** **yes** — CRM boundary is locked.

### T1-10 — Admin: auth, roles, lead management
**Goal:** `/admin` with Argon2id + TOTP, the role matrix in `09` §16, lead list/detail, stage control, score override with mandatory reason, consent and audit log viewers, outbox viewer with resend.
**Acceptance:** every mutation writes `audit_logs`; `noindex` + robots-blocked; session 8h idle timeout; login rate-limited with lockout; override requires a reason and writes a `lead_scores` row.
**Tests:** authz test per role × capability; audit log written for every mutation; CSRF rejection test.
**Security:** all of `09` §17. **Deps:** T1-07, T1-09. **Model:** Sonnet+. **Opus review:** **yes** — permission matrix.

### T1-11 — Analytics and lead_events
**Goal:** Cookieless analytics + first-party `lead_events` for the events in `08` §2.
**Acceptance:** no third-party script receives form contents; session id is httpOnly, SameSite=Lax; events recorded for page view, WhatsApp click, pricing view, form submit.
**Privacy:** no IP in analytics rows; no cross-site identifiers. **Deps:** T1-06. **Model:** Sonnet.

---

## Phase 2

### T2-01 — Assessment versioning and schema
**Goal:** `assessment_versions` with immutable `snapshot`, questions, options; publish workflow; exactly one published version.
**Acceptance:** publishing archives the previous version; the `snapshot` alone is sufficient to score an assessment; in-progress assessments stay on their original version.
**Tests:** publish/archive invariants; scoring from a snapshot with the normalised rows deleted.
**Deps:** T1-02. **Model:** Sonnet+. **Opus review:** **yes**.

### T2-02 — Seed assessment v1.0.0
**Goal:** Load all 24 questions, options, scores, weights, modifiers, bands and overrides from `05` §3–4.
**Acceptance:** weights sum to 100; every scored question maps to a dimension; every dimension has ≥2 questions; bands contiguous; modifiers within ±8.
**Tests:** validation suite over the seeded version. **Deps:** T2-01. **Model:** Sonnet.

### T2-03 — Deterministic scoring engine (assessment)
**Goal:** Pure engine implementing `05` §4 including industry modifiers and all hard overrides.
**Acceptance:** reproducible; snapshot-tested; hard overrides applied after scoring in the specified order; results identical across runs and processes.
**Tests:** **E1** — ≥20 fixtures incl. every band boundary, the paper-only cap, the D2 cap, the student disqualification, and the headcount flag.
**AI:** none — an LLM in this path is a locked prohibition.
**Deps:** T2-02. **Model:** Sonnet+. **Opus review:** **yes**.

### T2-04 — Opportunity catalogue and matching
**Goal:** ~20 human-written catalogue entries + deterministic matching rules; top-3 ordering.
**Acceptance:** matching is pure and reproducible; `OPP-DATA-00` returned when D2 < 40; no opportunity can be produced outside the catalogue.
**Tests:** fixture-based matching tests; a test asserting the returned codes are always a subset of the catalogue.
**Deps:** T2-03. **Model:** Opus (catalogue content) + Sonnet (engine). **Opus review:** **yes**.

### T2-05 — Assessment UI (6 steps, mobile-first)
**Goal:** Multi-step form with per-step persistence, back navigation, progress indicator, resume after refresh.
**Acceptance:** median completion ≤8 min in testing; progress survives refresh and network loss; **weights and scores never appear in any client payload** (verified by a test asserting the API response shape); WCAG AA; 429 never loses progress.
**Tests:** E2E happy path on a mobile viewport; resume test; response-shape test.
**SEO:** landing page indexable; `/resultado/[token]` `noindex`.
**Deps:** T2-03. **Model:** Sonnet+.

### T2-06 — Free results page
**Goal:** On-screen results per `03` §2.2 at a tokenised URL.
**Acceptance:** no personal data required; token is 256-bit random; genuinely useful standalone; assumptions and limitations shown.
**Deps:** T2-05. **Model:** Sonnet.

### T2-07 — AI adapter, prompt registry, validation gates
**Goal:** `AIProvider` interface, Anthropic implementation, `MockProvider`, versioned prompt files, structured outputs, and all five validation gates in `12` §4 including the numeric-invention check.
**Acceptance:** no model id in calling code; every call logged to `ai_generations`; validation failure retries once then falls back to deterministic text; monthly cap degrades to fallback rather than failing.
**Tests:** **E2–E5, E7, E8, E9**; `MockProvider` used in all other tests and in CI.
**AI eval:** E1–E10 wired into CI; prompt promotion blocked on failure.
**Deps:** T1-08. **Model:** Sonnet+. **Opus review:** **yes** — AI boundaries are locked.

### T2-08 — Report generation and PDF
**Goal:** `generate_report` job: assemble deterministic content, generate narrative, validate, render HTML→PDF, store privately, record versions.
**Acceptance:** p95 <3 min; PDF <2 MB; all three disclaimer placements present (asserted by test); `reports` stores narrative, prompt version, model id, template version; charts inline SVG with no external requests; 3 retries then a failure email plus an admin flag.
**Tests:** golden-file test of a fixture report; disclaimer presence test; content-lint over the rendered text.
**Deps:** T2-04, T2-07. **Model:** Sonnet+. **Opus review:** **yes**.

### T2-09 — Email gate, delivery and nurture
**Goal:** Gate form → lead + consent + scoring + report job; transactional email R0–R4 with suppression for disqualified and flagged leads; signed download links.
**Acceptance:** signed URLs expire; one-click unsubscribe in every message; sequences suppressed correctly; SPF/DKIM/DMARC verified on the sending domain.
**Tests:** integration for gate → 5 rows + 2 jobs; suppression test per band; expired-link test.
**Privacy:** consent text stored verbatim. **Deps:** T2-08. **Model:** Sonnet+.

### T2-10 — Admin: assessment, rules, reports, AI cost
**Goal:** Question/option editing, scoring rule editing with the **fixture diff gate**, opportunity catalogue CRUD, report template editing with the prohibited-content check, report queue with regeneration, AI cost dashboard vs cap.
**Acceptance:** publishing is blocked until the fixture diff is acknowledged; weights must sum to 100; bands must be contiguous; modifiers bounded ±8; template save blocked on prohibited vocabulary.
**Tests:** each validation rule; a publish-blocked-until-acknowledged test.
**Deps:** T2-03, T2-08. **Model:** Sonnet+. **Opus review:** **yes** — this is where the scoring model can be broken.

---

## Phase 3

### T3-01 — Calculator
**Goal:** Server-side computation, constants from `tool_definitions`, adjacent assumptions panel, conservative/optimistic band, tokenised shareable result, seeded CTA.
**Acceptance:** assumptions visible without interaction on a 360px viewport; salary stored bucketed; formula displayed in plain language; the words "ahorro garantizado"/"ROI" never rendered (asserted by test).
**Deps:** T1-02. **Model:** Sonnet.

### T3-02 — Prompt library
**Goal:** Categories, detail pages, filtering, copy tracking, editorial workflow enforcing `probado_por`.
**Acceptance:** cannot publish without `cuando_no_usar`, `que_verificar` and a tested-by record; each prompt page is independently indexable with real content.
**SEO:** unique titles/descriptions; `BreadcrumbList`. **Deps:** T1-04. **Model:** Sonnet.

### T3-03 — Live VenderCRM adapter
**Goal:** Fill the placeholders in `13` §8 from real API documentation; implement `VenderCrmAdapter`; mapping configuration UI; `unmapped_fields_strategy = send_as_note`.
**Acceptance:** connection test passes against staging credentials; mapping editable without deploy and audit-logged; contract test added to CI against a recorded response; mode indicator correct.
**Blocked on:** real VenderCRM API documentation. **Do not invent endpoints.**
**Deps:** T1-09. **Model:** Sonnet+. **Opus review:** **yes**.

### T3-04 — Analytics dashboard incl. capacity panel
**Goal:** Funnel view, panels per `09` §13, with the capacity panel adjacent to the pipeline.
**Acceptance:** funnel numbers reconcile with raw event counts; capacity panel shows active sprints, retainers and `en_espera_capacidad` value.
**Deps:** T1-11, T2-09. **Model:** Sonnet.

### T3-05 — Retention jobs and deletion tooling
**Goal:** `purge_expired_data` implementing every rule in `08` §8; admin-executed deletion request action.
**Acceptance:** ungated assessments purge at 180 days; consent records survive a deletion request; deletion is audit-logged; a dry-run mode reports what would be deleted.
**Tests:** one test per retention rule with time travel; a deletion-request test asserting exactly which rows remain.
**Deps:** T1-08. **Model:** Sonnet+. **Opus review:** **yes** — privacy commitments.

---

## Cross-cutting

### T-QA-01 — Content lint
See T1-05. Runs on every build thereafter.

### T-QA-02 — Accessibility and performance budget in CI
Lighthouse CI on home, one service page, one vertical page and the assessment.
**Fails the build** below 85 performance / 95 accessibility / 100 SEO on mobile.
**Model:** Sonnet.

### T-QA-03 — AI eval suite in CI
E1–E10 from `12` §11. Blocks prompt or model promotion. E10 (human sign-off) is a
documented manual gate recorded in the PR. **Model:** Sonnet+. **Opus review:** yes.

### T-SEC-01 — Pre-launch security review
Headers and CSP · rate limits on every public write · authz matrix verified · token
entropy · signed URL expiry · secret handling · dependency audit · **verified absence
of production data in staging**. **Model:** Opus.

---

## Task ordering

```
T1-01 → T1-02 → {T1-03 → T1-04 → T1-05, T1-06 → T1-07, T1-08 → T1-09}
      → T1-10 → T1-11 → [FASE 1 LIVE]
T2-01 → T2-02 → T2-03 → T2-04 → T2-05 → T2-06
T2-07 → T2-08 → T2-09 → T2-10 → [FASE 2 LIVE]
T3-01, T3-02, T3-04, T3-05 (paralelizables) · T3-03 bloqueada por documentación real
T-QA-* continuos · T-SEC-01 antes de cada lanzamiento de fase
```

## Opus review summary
Required on: **T1-02, T1-05, T1-07, T1-09, T1-10, T2-01, T2-03, T2-04, T2-07, T2-08,
T2-10, T3-03, T3-05, T-QA-03, T-SEC-01.**
These are the tasks that touch the data model, the scoring architecture, the AI
boundary, the CRM contract, the permission matrix, or a privacy commitment — the six
areas where a plausible-looking implementation can silently violate a locked decision.
