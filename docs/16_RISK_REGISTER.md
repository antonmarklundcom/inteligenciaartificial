# 16 — Risk Register

Scoring: **P** probability 1–5 · **I** impact 1–5 · **E** = P × I.
Review: monthly for E ≥ 15, quarterly otherwise. Owner: the principal, for all of them.

---

| ID | Risk | P | I | E |
|---|---|---|---|---|
| R1 | Underpriced consulting | 4 | 5 | **20** |
| R2 | Selling before delivery capacity exists | 4 | 5 | **20** |
| R3 | Excessive customization | 4 | 4 | **16** |
| R4 | Vague positioning drift | 3 | 5 | **15** |
| R5 | Weak credibility at launch | 4 | 4 | **16** |
| R6 | Dependence on organic search | 4 | 4 | **16** |
| R7 | Low-quality leads | 4 | 3 | 12 |
| R8 | Tool sprawl | 3 | 4 | 12 |
| R9 | AI hallucinations in client-facing output | 2 | 5 | 10 |
| R10 | Content commoditization | 4 | 3 | 12 |
| R11 | Data privacy incident | 2 | 5 | 10 |
| R12 | High API costs | 2 | 3 | 6 |
| R13 | Key-person dependency | 4 | 5 | **20** |
| R14 | Client data-quality blocks delivery | 4 | 3 | 12 |
| R15 | FX / macro instability | 3 | 3 | 9 |
| R16 | VenderCRM integration blocked or changed | 3 | 2 | 6 |

---

### R1 — Underpriced consulting · E20
Custom AI work absorbs unbounded hours. One mispriced Sprint consumes a quarter of the
firm's total capacity and the opportunity cost is invisible on the P&L.
**Signals:** actual days exceeding quoted days two projects running; unbilled "quick
favours"; a client treating the 30-day support window as indefinite.
**Mitigation:** fixed scope with a written exclusions list as long as the inclusions
list · change orders priced at day rate, approved in writing before work · price
floors (`10` §4) · **actual-vs-quoted days tracked on every project** — the single
most important internal metric · re-price a tier after two overruns.
**Trigger for action:** any tier averaging >115% of quoted days.

### R2 — Selling before capacity exists · E20
Two concurrent Sprints is the real ceiling. Selling a third fails all three, and the
reputational damage in a market this small is not recoverable.
**Mitigation:** capacity is a checked field in the sales process (`02` §8) · the
`en_espera_capacidad` stage is legitimate and tracked · the capacity panel sits next to
the pipeline on the admin dashboard (`09` §13) · **queue at full price, never discount
to hold a deal** · never subcontract an unknown implementer onto a first-time client.
**Trigger:** 2 active Sprints ⇒ stop selling Sprints, sell audits and workshops.

### R13 — Key-person dependency · E20
Everything routes through one principal: sales, audits, architecture, QA, content. This
is the risk the business plan structurally creates, and it deserves the same weight as
the commercial risks.
**Mitigation:** standardise relentlessly — templates, interview guides, report
skeletons, handover docs (`02` §9 target ≥65%) · document delivery playbooks as they
are executed, not afterwards · build the fractional implementer relationship *before*
it is urgent · the retainer base load (`10` §1.5) funds a hire · the admin's
version-controlled rules mean the scoring model is not in anyone's head.
**Trigger:** if standardised delivery hours are below 60% at month 12, hiring is
blocked until it is fixed — adding people to an unstandardised business multiplies the
problem.

### R3 — Excessive customization · E16
Every client wants "just one more thing". Margins collapse and the business becomes
unsellable and unhireable-into.
**Mitigation:** tiered Sprints with defined scopes · standardised/custom ratio reviewed
quarterly · decline integrations with systems that have no API **at quoting time** ·
change orders, always priced.
**Trigger:** custom hours >40% of delivery in any quarter ⇒ stop accepting custom work
until the ratio recovers.

### R4 — Vague positioning drift · E15
Every enquiry will try to widen us into general IT. Drift is gradual and each
individual "yes" is defensible.
**Mitigation:** `/que-no-hacemos` published · three verticals only · rejection criteria
with reason codes (`07` §12) · **monthly review of `DQ_SCOPE` codes** — if the market
persistently asks for something we refuse, that is a strategy decision to make
deliberately, not to drift into.

### R5 — Weak credibility at launch · E16
No clients, no logos, and we have committed to not inventing any.
**Mitigation:** the seven-mechanism trust strategy in `01` §6 — named principal,
published method, fictional-data sample report, open scoring model, published limits,
technical depth, and real proof only as it becomes real · the refund guarantee is a
genuine, fundable trust device · Phase 0 delivers three real clients **before** the
website launches, so Phase 1 content can be written from experience.
**Watch:** the temptation to add "+50 empresas" or a stock-photo testimonial. That is
the failure mode, and it is permanent in a small market.

### R6 — Dependence on organic search · E16
Single channel, algorithmically fragile, and increasingly intermediated by LLM answers
that do not produce clicks.
**Mitigation:** two non-search channels built from Phase 1 — the **referral loop
through contadores** (highest-quality source in this market) and an **owned email
list** · gremio talks and workshops · the principal's LinkedIn presence · Google
Business Profile · **paid ads deliberately withheld until Phase 3** so we do not mask a
broken funnel with bought traffic.
**Trigger:** organic >60% of qualified leads for two consecutive quarters ⇒ invest in
referral formalisation, not in more content.

### R7 — Low-quality leads · E12
A funnel producing 40 leads/month for a business that can serve two clients is a
failure of strategy, not a marketing success.
**Mitigation:** the assessment qualifies before it captures · lead scoring with hard
disqualification · only bands A/B are offered calls · disqualified leads still get
their report and are treated well · **the correct response to too many bad leads is to
raise the bar and the price, not to scale traffic.**

### R8 — Tool sprawl · E12
Each tool adds permanent maintenance, support and cost, and dilutes the funnel.
**Mitigation:** hard cap of 3 tools · a fourth requires an ADR **and** retiring one ·
quarterly review with an explicit retirement threshold (<2 qualified leads/quarter and
<100 sessions/month) · the `04` §4 rejection list is a decision record, not a backlog.

### R9 — AI hallucinations in client-facing output · E10
Probability is low because of the architecture; impact is severe because a firm selling
AI judgement cannot survive publishing a fabricated number.
**Mitigation:** deterministic scoring, LLM confined to narrative · the
**numeric-invention check** rejecting any digit absent from the input · closed
opportunity catalogue · prohibited-content lint on generated *and* human copy ·
deterministic fallback text · E1–E10 eval suite in CI · human sign-off on every prompt
version · every report reproducible from stored versions.
**In delivery:** mandatory human review before any AI output reaches a client's
customer, contractually.

### R10 — Content commoditization · E12
Generic Spanish AI content is infinite and free.
**Mitigation:** the `06` §10 blocking checklist — Paraguayan specificity, a named
failure mode, a real author, no invented statistics · depth over volume at 4
articles/month · **de-prioritise a cluster with no qualified lead after 6 months**
rather than doubling down.

### R11 — Data privacy incident · E10
**Mitigation:** minimisation as a schema decision (`08` §9) — we have no column for the
data we most fear losing · no document uploads in MVP · PII concentrated in two tables ·
salary bucketed at write · retention jobs that actually run · consent records with
verbatim text · private storage with signed URLs · **no production data in staging** ·
no compliance or certification claims anywhere.
**If it happens:** notify affected parties promptly and in plain Spanish; do not
minimise. A firm advising on AI governance is judged on how it handles its own
incident.

### R12 — High API costs · E6
**Mitigation:** <USD 0.10/report target · monthly cap that **degrades to template
narrative rather than failing** · per-IP and per-session caps · cost dashboard with an
80% alert · short bounded outputs · model choice is configuration.

### R14 — Client data quality blocks delivery · E12
Extremely common in this market and usually discovered mid-Sprint.
**Mitigation:** D2 (datos y sistemas) is 25% of the assessment for exactly this reason ·
the audit includes an explicit feasibility check per opportunity (API exists? data
exists?) · `OPP-DATA-00` is a legitimate, sellable finding ("digitalise first") ·
technical discovery days 1–2 of every Sprint with a **written acceptance test before
construction begins** · if data quality kills feasibility, the Sprint is re-scoped
before the build phase, not after.

### R15 — FX / macro instability · E9
**Mitigation:** publish in Gs., cost internally in USD · quarterly FX review · pricing
stated as "desde" so adjustment does not break published commitments · contracts fix
the price in Gs. for the project duration.

### R16 — VenderCRM integration blocked or changed · E6
**Mitigation:** the adapter pattern means the CRM is the *last* dependency, not the
first · mock adapter carries all of Phase 1–2 · our admin is the system of record
through Phase 3 · outbox with manual resend survives outages · a CRM change costs one
adapter, not a rewrite.

---

## Review discipline

**Monthly** (E ≥ 15): R1, R2, R3, R4, R5, R6, R13 — reviewed against their named
trigger metrics, not against sentiment.
**Quarterly:** everything else, plus the standardised/custom ratio, the tool portfolio
review, and the disqualification reason codes.

**The three that actually kill this business** are R1, R2 and R13 — all internal, all
operational, none of them about technology. The website can be rebuilt; a reputation
for missed deadlines in Asunción cannot.
