# 09 — Admin Specification

**Route:** `/admin` · `noindex, nofollow` · authenticated, rate-limited, MFA required
for `owner` and `admin` roles.
**Design principle:** the admin exists so that **strategy changes do not require a
deploy**. Question wording, weights, opportunity text, prompt library entries and lead
routing must be editable by the principal. Everything else stays in code.

---

## 1. Modules — MVP vs later

| Module | Phase |
|---|---|
| Auth, roles, session management | 1 |
| Lead list, detail, disposition, score override | 1 |
| Consultation requests | 1 |
| CRM outbox viewer + manual resend | 1 |
| Consent log viewer | 1 |
| Audit log viewer | 1 |
| Newsletter export | 1 |
| Analytics dashboard | 1 (basic) → 3 (full) |
| Assessment version / question / option management | 2 |
| Scoring rule management + preview diff | 2 |
| Opportunity catalogue + matching rules | 2 |
| Report template + disclaimer management | 2 |
| Report list, regeneration, failure queue | 2 |
| AI generation log + cost dashboard | 2 |
| Tool registry + calculator constants | 3 |
| Prompt library management | 3 |
| Data deletion request execution | 2 |
| Content management (service/blog pages) | **4** — only when a non-technical editor exists |

---

## 2. Content management

**Phase 1–3:** marketing content is MDX in the repository. Editing is a pull request.
This is deliberate: the people writing the content are the people who deploy the site,
and a CMS would add a system without removing a step.

**Phase 4** (only if a non-technical editor joins): a content module over
`service_pages`, `content_pages`, `blog_posts` with — list/filter by status and
cluster · MDX editor with live preview · frontmatter fields (meta title, description,
OG image, cluster, industry) · draft/publish/archive · scheduled publishing ·
**publish-blocking SEO checklist** mirroring `06` §10 · automatic sitemap refresh ·
revision history via `audit_logs`.

**Publish gate (enforced, not advisory):** a page cannot be published with a missing
meta description, a duplicate title, no `H1`, no internal links, or no named author.

---

## 3. Industry page management
Manage `industries`: slug, names, active, ordering, whether a landing page exists, and
the per-industry scoring modifiers (with a **±8 hard bound** enforced in the UI, per
`05` §4). Changing a modifier requires a reason, which is written to `audit_logs`, and
creates a new `scoring_rules` version.

---

## 4. Assessment question management

- Versions list with status (`borrador` / `publicado` / `archivado`) and publish date
- **"Duplicate to new draft"** is the only way to create a new version — never edit a published one
- Per-version editing: sections, question order, text, help text, format, dimension mapping, required, max selections, `feeds_lead_score`
- Per-option editing: text, score (0–5), lead-score points, flags set
- Inline validation: every scored question maps to a dimension; every dimension has ≥2 questions; option scores within 0–5; codes unique
- **Live preview** of the assessment as the user will see it, on a mobile viewport
- **Publish** requires: validation pass, a fixture-set diff review (see §5), and a confirmation dialog stating how many in-progress assessments will continue on the old version

---

## 5. Scoring rule management

- Edit dimension weights (must sum to 100 — enforced), industry modifiers, maturity band thresholds (contiguous, no gaps — enforced), hard overrides, lead-score weights
- **Fixture diff (required feature):** a stored set of ≥20 representative answer sets, including boundary cases. Before publishing, admin sees a table of *old score → new score → band change* for every fixture. Publishing is blocked until the diff has been explicitly acknowledged.
- Every publish creates a new `scoring_rules` version and archives the previous one
- Existing `reports` remain bound to their original version and are never retroactively rescored
- A "recalculate lead scores under the new rules" action exists, is explicit, is queued, and writes a new `lead_scores` row per lead (never overwriting history)

---

## 6. Report template management
Edit section order, fixed section text, band descriptions, the three disclaimer blocks,
the glossary, cover branding, and the prompt version bound to the narrative sections.
Templates are versioned. **A content check runs on save and blocks any template
containing prohibited vocabulary** (garantizamos, ahorro asegurado, ROI garantizado,
certificado, and the rest of the list in `12` §Prohibited claims). Preview renders a
full PDF against a fixture assessment.

---

## 7. Lead review

**List:** filter by band, stage, industry, source, score range, date, owner, flag.
Sort by score or recency. Bulk actions: assign owner, change stage, export CSV
(export is audit-logged).

**Detail view — everything about one lead on one screen:**
- Organisation and contact, with edit
- Score, band, and the **full breakdown from `lead_scores.breakdown`** — every point attributed to its attribute, plus the score history
- Assessment summary: dimension scores, band, matched opportunities, and the free-text `proceso_declarado`
- Behavioural timeline from `lead_events`
- Consent records with the exact text shown at the time
- CRM sync status with a resend button
- Reports generated, with download and regenerate
- Stage control, notes, next action, estimated value
- Flags requiring review, with a **"clear review" action that requires a reason** and unblocks the nurture sequence

---

## 8. Lead score override
Set a manual score with a **mandatory reason**. Writes `score_override`,
`score_override_by`, `score_override_reason`, a `lead_scores` row with
`trigger = 'recalculo_admin'`, and an `audit_logs` entry. The override is displayed
alongside the computed score, never replacing it silently. Overrides are reported
monthly — a high override rate means the scoring model is wrong and should be fixed at
the rules level rather than patched lead by lead.

---

## 9. CRM synchronisation

- Outbox list: entity, operation, status, attempts, next retry, last error, remote id
- Filter by status; **failed items surfaced by default**
- Detail: full payload JSON, response body, error, idempotency key
- Actions: retry now · retry all failed · edit payload and retry (audit-logged) · discard with reason
- **Mapping configuration screen:** our field → CRM field, editable without a deploy, versioned (`13` §Mapping configuration)
- Connection test button against the configured endpoint
- Adapter mode indicator: `mock` / `live`, prominently displayed so nobody mistakes a mock environment for production

---

## 10. Tool management
Registry of `tool_definitions`: enable/disable a tool sitewide, edit calculator
constants (working weeks per year, hours per month, band multipliers), set per-tool
rate limits and monthly cost caps. **Disabling a tool renders a friendly Spanish
maintenance state on its page, not a 404** — the URL keeps its SEO value.

---

## 11. Prompt library management
CRUD over `prompts` and `prompt_categories`. Publishing requires `probado_por` and
`probado_at` to be set — enforced by the schema (`08` §6), surfaced in the UI as a
"marcar como probado" action taken by a named admin. Fields for `cuando_no_usar` and
`que_verificar` are **required**, because they are the difference between our prompt
library and a scraped dump. Metrics per prompt: views, copies. Bulk reorder.

---

## 12. Newsletter
Subscriber list with status and source · export active subscribers to CSV (audit-logged) ·
manual unsubscribe · bounce marking · consent record link per subscriber. **No sending
from admin in MVP** — campaigns are sent from the email provider; this module owns the
list of record and the consent evidence.

---

## 13. Analytics dashboard

**Funnel (the primary view):**
`sesiones → herramienta iniciada → completada → gate → lead → calificado (A/B) →
llamada → propuesta → ganado`, with conversion rate at each step and a period
comparison.

**Panels:** leads by band and source · assessment completion rate and median duration ·
drop-off by assessment step (drives question cuts) · top entry pages by leads
generated (not by pageviews) · calculator completions → assessment starts ·
disqualification reason codes · **AI cost month-to-date against the cap** ·
report generation success rate and p95 latency · CRM sync failure count ·
**capacity view: active sprints, active retainers, pipeline value in
`en_espera_capacidad`.**

The capacity panel is on the same screen as the pipeline deliberately: selling past
capacity is risk R2, and the dashboard should make it impossible to do accidentally.

---

## 14. Consent logs
Searchable by email or session. Shows consent type, granted/revoked, the **exact text
displayed**, policy version, timestamp, IP, source page. Read-only — consent records
are never editable, only appended to. Export for a data subject request.

## 15. Audit logs
Filter by admin user, entity type, action, date. Before/after JSON diff view.
Read-only, append-only. Retained 3 years.

---

## 16. Roles and permissions

| Capability | owner | admin | editor | sales | readonly |
|---|---|---|---|---|---|
| View leads | ✓ | ✓ | — | ✓ | ✓ |
| Edit leads / stage / notes | ✓ | ✓ | — | ✓ | — |
| Override lead score | ✓ | ✓ | — | ✓ | — |
| Clear review flags | ✓ | ✓ | — | — | — |
| Export leads / newsletter | ✓ | ✓ | — | — | — |
| Edit assessment questions | ✓ | ✓ | — | — | — |
| **Publish scoring rules** | ✓ | — | — | — | — |
| Edit report templates | ✓ | ✓ | — | — | — |
| Manage prompts / content | ✓ | ✓ | ✓ | — | — |
| Manage tools / constants | ✓ | ✓ | — | — | — |
| CRM config and resend | ✓ | ✓ | — | — | — |
| Execute data deletion | ✓ | — | — | — | — |
| Manage admin users | ✓ | — | — | — | — |
| View audit logs | ✓ | ✓ | — | — | ✓ |
| View AI cost dashboard | ✓ | ✓ | — | — | ✓ |

**Owner-only actions** are those that change the scoring model or destroy data — the
two categories where a mistake is either invisible or irreversible.

---

## 17. Admin security requirements
Argon2id password hashing · MFA (TOTP) required for `owner` and `admin` · session
cookies `httpOnly`, `Secure`, `SameSite=Lax`, 8-hour idle timeout · rate-limited login
with progressive delay and lockout · CSRF tokens on all mutations · every mutation
audit-logged · `noindex` and blocked in `robots.txt` · optional IP allow-list for the
`owner` role · **no production data in any non-production environment** — seed and
fixture data only.
