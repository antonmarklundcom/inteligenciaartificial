# 07 — Lead Funnel

---

## 1. Visitor sources

| Source | Phase | Expected share (month 12) **[SUPUESTO]** | Lead quality |
|---|---|---|---|
| Organic search | 1+ | 45% | Medium-high |
| Referral (contadores, agencias, clients) | 1+ | 25% | **Highest** |
| Direct / word of mouth | 1+ | 12% | High |
| WhatsApp forwards | 1+ | 8% | Medium |
| LinkedIn (principal's own posting) | 1+ | 6% | Medium-high |
| Email list | 2+ | 4% | High |
| Paid ads | **Not before Phase 3** | 0% | — |

**Paid ads are deliberately excluded from Phase 1–2.** Until we know the conversion
rate of the organic funnel and the true cost of delivery, paid traffic buys noise.

---

## 2. Entry pages and their job

| Entry | Visitor state | Next step |
|---|---|---|
| Home | Mixed | Diagnóstico or WhatsApp |
| Vertical page | High intent, industry-aware | Diagnóstico (industry pre-selected) |
| Service page | Evaluating vendors | `/precios` → WhatsApp or call |
| Article | Researching | Contextual tool CTA |
| Calculator | Quantifying a pain | Diagnóstico, seeded with their task |
| Prompt library | Practitioner, low buying intent | Newsletter; low-pressure |
| `/precios` | Late-stage | WhatsApp — **highest-converting page on the site** |
| `/metodo`, `/nosotros` | Referral, verifying | WhatsApp |

---

## 3. Tool engagement and gating

```
Tool started ─────────────────────────► tool_usage_events: started
   │
   ├─ abandoned mid-way ───────────────► session retained 180d, no contact possible
   │
   └─ completed ───────────────────────► tool_usage_events: completed
        │
        ├─ free result shown (NO gate)
        │
        └─ gate: "Recibí el informe completo en PDF"
             ├─ declines ──────────────► anonymous; retargetable only by returning
             └─ submits ───────────────► LEAD CREATED + scored + CRM outbox
```

**Gating policy (locked, `00` D18):**
- Calculator: **never gated**
- Prompt library: **never gated**
- Assessment: **never gated**; only the extended PDF is gated
- Resources (Phase 3): ungated; revisit with data

**Why:** we have exactly one gate, placed at the moment of highest perceived value —
after the user has seen real output and wants more of it. Multiple gates would raise
form-fill counts and lower qualified-lead counts, which is the wrong trade for a
business that can only serve ~2 clients at a time.

---

## 4. Progressive lead capture

Never ask twice. Fields are collected across the journey and merged on the email key.

| Stage | Fields | Required |
|---|---|---|
| **Assessment (pre-gate)** | industria, tamaño, ciudad, rol, volumen, plazo, presupuesto, proceso declarado | All (as questions — they don't feel like a form) |
| **Gate** | email, nombre, empresa | Yes |
| **Gate (optional)** | WhatsApp | **Optional** — but labelled "para responderte más rápido", which in this market drives high voluntary completion |
| **Consent** | explicit checkbox, unticked | Yes |
| **Pre-call form** | proceso concreto, urgencia, quién decide, presupuesto confirmado | Yes, before a call is confirmed |
| **Post-call (internal)** | sistemas, datos, competencia, objeciones | Sales-entered |

**Field discipline:** adding a field to any public form requires an ADR (`00`
D-fixed #11). Every added field costs conversion and creates a data obligation.

---

## 5. Lead scoring (deterministic, 0–100)

| Attribute | Source | Points |
|---|---|---|
| **Tamaño** | Q2 | 10–24: **20** · 25–49: **20** · 50–149: **18** · 5–9: 8 · 1–4: 0 · 150+: 10 |
| **Industria** | Q1 | Inmobiliaria/contable/jurídico: **20** · clínica/comercio/servicios: 12 · industria/educación: 8 · otro: 5 |
| **Rol** | Q4 | Dueño/socio: **15** · director/gerente general: 14 · gerente de área: 9 · TI: 7 · analista: 3 · estudiante: **−100** |
| **Presupuesto** | Q24 | Definido: **20** · aproximado: 15 · podríamos definirlo: 7 · no: 0 |
| **Plazo** | Q23 | ≤3 meses: **12** · 3–6: 9 · 6–12: 4 · sin plazo: 0 |
| **Dueño interno** | Q16 | Sí con tiempo: **8** · sí sin tiempo: 4 · no: 0 |
| **Volumen de mensajes** | Q14 | >500: **5** · 100–500: 5 · 20–100: 3 · <20: 0 |
| **Ubicación** | Q3 | Asunción/GA/CDE: **5** · otra ciudad: 3 · exterior: 0 |
| **Comportamiento** | events | WhatsApp click: +5 · `/precios` visit: +5 · returned within 7 days: +3 · calculator completed: +3 · resource downloaded: +2 (cap **+15**) |

Score is clamped to 0–100.

| Band | Score | Routing |
|---|---|---|
| **A — Caliente** | ≥ 75 | Personal WhatsApp within **2 business hours**; call offered immediately |
| **B — Calificado** | 60–74 | Call offered in the report email; WhatsApp within 1 business day |
| **C — Nutrir** | 35–59 | Email sequence only; no outbound. Re-scored on any new event. |
| **D — Bajo** | < 35 | Newsletter only |
| **X — Descalificado** | flag | No sales contact; report still delivered |

Weights live in `scoring_rules` and are admin-editable, versioned like assessment
rules. Lead score is recomputed on every qualifying event, and every recomputation
writes a `lead_scores` row — so score history is auditable, not overwritten.

---

## 6. Booking flow

External scheduling link (Cal.com or equivalent) — **not** built in MVP.
`/agendar` → pre-call form (4 fields) → slot selection → confirmation email + WhatsApp
message + calendar invite → 24h and 2h reminders (WhatsApp preferred) → post-call:
one-page written follow-up within 24h, then proposal within 48h if it fits.

Only bands A and B are shown a booking link. Everyone else gets the nurture sequence.
No-show handling: one reschedule offer, then the lead returns to nurture.

---

## 7. WhatsApp flow

The dominant channel in this market. Treat it as primary, not as a fallback.

- **Pre-filled messages, per page context.** Example on a vertical page: `Hola, vi la página de IA para inmobiliarias y quiero consultar sobre [ ]`
- Click → `lead_events` row (`whatsapp_click`, with page and any known lead id). We record intent; we never see the conversation contents.
- **Business hours reply target: under 2 hours.** Outside hours: automated acknowledgement with a stated response time — honest, not a fake "estamos en línea".
- Manual qualification in-chat using the four discovery questions; the salesperson creates or enriches the lead record in admin.
- **Never** an automated bot pretending to be a person on our own number. If we ever automate our own WhatsApp, it announces itself as an assistant. We sell honesty about AI; our own channel is the first place it must be true.

---

## 8. Email follow-up

**Sequence R (report recipients):**
| # | Timing | Content | CTA |
|---|---|---|---|
| R0 | immediate | "Estamos generando tu informe" | — |
| R1 | on completion | Report + download link | Agendar (A/B only) |
| R2 | +3 days | One insight tied to their weakest dimension | Responder este correo |
| R3 | +10 days | Relevant guide or article for their industry | Diagnóstico → llamada |
| R4 | +21 days | "¿Avanzaron con algo?" — plain text, from the principal, genuinely asking | Reply |
| → | +30 days | Monthly list, if opted in | — |

**Sequence C (calculator, no email)** — none; the calculator's CTA is on-page.
**Monthly list:** one email, one genuinely useful piece, no "newsletter" filler.

All email is Spanish, plain, signed by a real person, with one-click unsubscribe.
Sequences are suppressed for `X — Descalificado` and for any `review_flag` lead until
a human clears it.

---

## 9. CRM payload
Full contract in `13_VENDERCRM_INTEGRATION.md`. Summary: organisation, contact,
source attribution, tool-result summary, lead score and band, consent record, and a
link back to the admin lead detail. Written to an outbox table and delivered by the
background worker — **never** posted inline from a request handler.

---

## 10. Sales stages

`Nuevo` → `Calificado` → `Llamada agendada` → `Llamada realizada` →
`Propuesta enviada` → `Negociación` → `Ganado` | `Perdido` | `Descalificado` |
`En espera de capacidad`

`En espera de capacidad` exists because of the capacity ceiling (`02` §8). A deal
parked for capacity is a legitimate, tracked state — not a lost deal, and not a reason
to discount.

---

## 11. Lead-routing rules

1. Band A → principal, WhatsApp, ≤ 2 business hours.
2. Band B → principal, WhatsApp, ≤ 1 business day.
3. Bands C/D → automated sequence, no human.
4. `review_flag` set → **human review before any contact**, regardless of score.
5. Referral source → always routed to the principal regardless of score, and the referrer is notified that we followed up.
6. Existing client → routed as an upsell, not a new lead.
7. Capacity full → still contact, still qualify, offer a dated start. Never go silent.

---

## 12. Disqualification rules

Automatic, with a stored reason code:

| Code | Condition |
|---|---|
| `DQ_STUDENT` | Role = estudiante/investigador |
| `DQ_SIZE` | ≤ 4 employees |
| `DQ_GEO` | Outside Paraguay with no Paraguayan operation |
| `DQ_NO_BUDGET` | Q24 = "No" **and** Q2 ≤ 9 |
| `DQ_SPAM` | Failed honeypot/timing, disposable email domain, or nonsense company field |
| `DQ_COMPETITOR` | Known competitor domain |
| `DQ_SCOPE` | Requested work on the `/que-no-hacemos` list |
| `DQ_HEADCOUNT` | Sole stated objective is staff reduction (`review_flag`, manual confirm) |
| `DQ_CAPACITY_DECLINED` | Offered a dated slot, declined to wait |

Disqualified leads **still receive their report** — it costs nothing and it is the
right way to treat people. They receive no sales contact. Reason codes are reported
monthly: they tell us what the market wants that we have decided not to sell, which is
strategic information, not noise.

---

## 13. Attribution

First-touch and last-touch stored per lead: `source`, `medium`, `campaign`,
`landing_page`, `referrer`, plus the internal path (tools used, pages viewed).
UTM parameters captured on entry and persisted in the session.
Cookieless, self-hosted-friendly analytics (see `11`); no cross-site tracking, no ad
pixels in Phase 1–2. **Every closed deal is manually tagged with the true origin story**
in the CRM, because in a referral-heavy market the digital attribution will
systematically undercount referrals.

---

## 14. KPIs

| Stage | Metric | Phase 1 target **[SUPUESTO]** | Phase 3 target |
|---|---|---|---|
| Traffic | Monthly organic sessions | 300 | 2,500 |
| Engagement | Assessment start rate (of relevant sessions) | 8% | 12% |
| Completion | Assessment completion rate | 55% | 70% |
| Gate | Report gate conversion | 40% | 50% |
| Quality | % of leads in bands A+B | 25% | 35% |
| Sales | Leads → discovery calls | 20% of A+B | 30% of A+B |
| Sales | Calls → audit proposals | 50% | 60% |
| Sales | Proposals → won | 30% | 40% |
| Delivery | Audit → Sprint attach rate | 40% | 50% |
| Delivery | Sprint → retainer attach rate | 50% | 60% |
| Health | Actual vs quoted delivery days | ≤ 110% | ≤ 105% |
| Cost | LLM cost per gated lead | < USD 0.10 | < USD 0.10 |

**Single most important metric:** *qualified leads per month that we can actually
serve.* Everything above it is diagnostic. A funnel producing 40 leads a month for a
business that can serve two clients is a failure of strategy, not a success of
marketing — and the response is to raise the qualification bar and the price, not to
scale traffic.
