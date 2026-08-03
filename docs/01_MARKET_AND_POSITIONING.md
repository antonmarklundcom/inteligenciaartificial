# 01 — Market and Positioning

> **Data honesty note.** This document contains no invented market statistics.
> Where a structural claim about Paraguay is made, it is either (a) a widely
> observable structural fact, or (b) marked **[SUPUESTO]** as an assumption to be
> validated. No figure in this document should be published on the website unless
> it carries a real, citable source.

---

## 1. Paraguay market context (structural, not statistical)

### 1.1 What actually shapes the buying environment

| Factor | Consequence for this business |
|---|---|
| **Small, relationship-driven market.** Gran Asunción concentrates most formal commercial activity. Business is done through referral and personal trust before it is done through websites. | Search generates the *first* touch, but the *close* comes from a human conversation. The site's job is credibility, not conversion-in-one-click. A referral loop is not optional. |
| **WhatsApp is the commercial channel**, not email. Companies publish a WhatsApp number where other countries publish a contact form. | Contact flow must be WhatsApp-first. Email is for report delivery and nurture, not for first contact. |
| **Spanish content market dominated by Spain, Mexico, Argentina, Colombia.** Generic "consultoría de IA" content ranks from abroad. | Differentiation must be *Paraguayan specificity*: local regulation, local tooling, local cost of labour, local vendors, local Spanish. That is the defensible SEO position. |
| **Formal SME sector is the realistic buyer.** Below ~10 employees the budget is not there; above ~150 there is an internal IT function and a procurement process. | The 10–150 band is the target, and it is narrow enough to speak to precisely. |
| **Owner-operator decision-making.** In this size band the owner or a director decides, often without a formal RFP. | Sales cycle is short if trust exists; the whole funnel should target one person, not a committee. |
| **Low tolerance for abstract consulting.** Buyers have seen "digital transformation" pitches that produced slide decks. | Fixed price, fixed scope, and a concrete artefact are the differentiators. Hourly, open-ended consulting will be distrusted. |
| **Data protection is developing, not absent.** Paraguay has advanced personal-data protection legislation in recent years. **[SUPUESTO — requires legal review before publishing any compliance-adjacent claim.]** | We adopt conservative data practices as a *product* decision regardless of the letter of the law, and we make **no compliance or certification claim**. |
| **Currency and pricing.** Guaraní prices, USD-anchored costs (AI APIs, hosting). | Publish in Gs., anchor internal costing in USD, review quarterly (A5 in `00`). |

### 1.2 What buyers in this market are actually experiencing with AI

Not "they don't know what AI is" — that framing is out of date and condescending.
The realistic state:

1. Staff are **already using** consumer chat assistants, unmanaged, often on company data.
2. Owners have seen impressive demos and cannot tell which map to their business.
3. They have been pitched chatbots by web agencies and are sceptical of the category.
4. Nobody has connected AI to a **specific process with a specific cost**.
5. There is real anxiety about confidentiality — especially in legal and accounting.

**This is the real opening:** the buyer does not need to be convinced AI works. They
need someone to tell them *which three of their processes are worth touching, in what
order, and what it costs.* That is exactly what the Auditoría sells and exactly what
the Diagnóstico previews.

---

## 2. Priority customer profiles

### 2.1 Ideal First Customer Profile (ICP)

| Attribute | Value |
|---|---|
| Location | Gran Asunción (Asunción, Luque, San Lorenzo, Fernando de la Mora, Lambaré) or Ciudad del Este |
| Size | 10–150 employees |
| Legal status | Formally registered, RUC active |
| Revenue signal | Can approve a discretionary USD 1,500–3,000 spend without a board |
| Structure | Owner or director is reachable and decides |
| Technology | Already uses *some* business software (contabilidad, CRM, ERP, or at minimum structured spreadsheets) |
| Pain | A named, repetitive, high-volume process that people complain about |
| Data | Their operational data exists in *some* digital form — not exclusively on paper |
| Attitude | Has tried an AI tool and wants to go further, or is losing to a competitor who has |

**Disqualifying attributes:** pre-revenue startups; sole practitioners; companies
whose stated goal is "reducir personal" as the primary objective (fulfilment and
reputational risk); anyone asking us to build a general-purpose AI product for
resale; anyone whose data lives only on paper.

### 2.2 Vertical profiles

#### A. Inmobiliarias y desarrolladoras

- **Who:** 5–60 people. Broker-owner or comercial director. Often several agents with personal WhatsApp lines.
- **Observable pain:** enquiry volume across WhatsApp/Instagram/portals with no consistent qualification; leads go cold in hours; property information lives in agents' heads and in inconsistent PDFs; no reliable follow-up after the first message.
- **Why they buy:** one recovered sale pays for years of the engagement. The arithmetic is obvious to them without us inventing an ROI number.
- **Entry use case:** WhatsApp enquiry triage + qualification + automatic follow-up sequences; property-brief and listing-copy generation from a structured record.
- **Risk:** they may want a full CRM built. Scope boundary: we integrate with a CRM, we do not build one.

#### B. Estudios contables / administración tributaria

- **Who:** 5–40 people. Socio-titular decides.
- **Observable pain:** document intake from clients is chaotic (photos of receipts on WhatsApp); the same client questions answered dozens of times per month; heavy deadline compression; junior staff time consumed by classification and transcription.
- **Why they buy:** they sell professional hours and can compute the value of recovering them. They also renew: the workload is monthly, which is the natural shape of a retainer.
- **Entry use case:** document intake and classification pipeline; standardised client-communication templates; internal knowledge assistant over the firm's own procedures.
- **Strategic bonus:** each firm sits on a portfolio of 50–300 SMEs. A satisfied contador is the single highest-leverage referral node in this market.
- **Risk:** they will ask us to touch tax filing logic. Hard boundary: we do not build anything that produces a filing or a tax determination.

#### C. Estudios jurídicos

- **Who:** 3–40 people. Socio decides.
- **Observable pain:** drafting from precedent by hand; document review volume; intake triage; institutional knowledge locked in individual lawyers.
- **Why they buy:** highest value per hour of the three; time recovery has an unambiguous price.
- **Entry use case:** assisted drafting from the firm's own precedent library; document summarisation and comparison; intake triage.
- **Risk:** confidentiality is the entire objection. Our answer must be architectural (data residency, no-training guarantees from providers, per-matter isolation, retention policy), not reassurance. **Mandatory human review** framing on every legal output. We never position output as legal advice.

### 2.3 Decision-maker personas

**Persona 1 — "El dueño operativo"** (most common)
Owner, 38–58, runs the business day to day. Reads WhatsApp constantly, email rarely.
Decides fast on trust and slow on abstraction. Has been burned by a software vendor.
- *Wants to hear:* what exactly you will do, by when, for how much, and what happens if it doesn't work.
- *Kills the deal with:* "depende", "aproximadamente", hourly billing, anything requiring a 6-month horizon.
- *Entry point:* WhatsApp, referral, or an industry landing page.

**Persona 2 — "El gerente / socio joven"** (the internal champion)
30–45, second in command or the technically curious partner. Found you through search.
Already experimenting with AI tools. Must sell the idea internally.
- *Wants:* material they can forward upward. This is who the PDF report is written for.
- *Kills the deal with:* being condescended to, or being given content they already know.
- *Entry point:* the Diagnóstico or an educational article.

**Persona 3 — "El administrador/contador interno"** (gatekeeper, sometimes blocker)
Controls budget scrutiny, worries about cost and disruption.
- *Wants:* cost transparency, no surprise recurring fees, no disruption to closing periods.
- *Neutralised by:* a written scope with exclusions and an explicit list of ongoing costs (API, hosting) stated before signature.

---

## 3. Business pain points we sell against (ranked by sellability)

| # | Pain (as the buyer says it) | Our offer | Sellability |
|---|---|---|---|
| 1 | "Se nos pierden los mensajes de clientes en WhatsApp." | Sprint: triage + qualification + follow-up | ★★★★★ |
| 2 | "Mi gente pasa horas haciendo lo mismo todos los días." | Auditoría → Sprint: process automation | ★★★★★ |
| 3 | "Redactamos los mismos documentos una y otra vez." | Sprint: assisted drafting from own precedent | ★★★★☆ |
| 4 | "Nadie encuentra la información interna; todo está en la cabeza de dos personas." | Sprint: internal knowledge assistant | ★★★★☆ |
| 5 | "Mi equipo ya usa ChatGPT y no sé qué están subiendo." | Taller + Política de IA | ★★★★☆ |
| 6 | "Nos llegan documentos de clientes en cualquier formato." | Sprint: intake + classification | ★★★★☆ |
| 7 | "No sé por dónde empezar con IA." | Diagnóstico → Auditoría | ★★★☆☆ (real, but low urgency alone) |
| 8 | "Quiero un chatbot." | Discovery first — this is usually pain #1 or #4 in disguise | ★★☆☆☆ as stated |

Pain #8 is the most common *stated* request and the most dangerous to accept at face
value. Discovery exists to translate it into #1 or #4.

---

## 4. Competitor categories

| Category | What they do | Where they win | Where they lose | Our stance |
|---|---|---|---|---|
| **Local web/marketing agencies adding "IA"** | Chatbot bolted onto a website build | Price, existing relationships | No process analysis; the bot answers FAQs and nothing changes | We do process work, not website widgets. We can *partner* with them for delivery. |
| **Regional (AR/CL/ES) consultancies** | Real capability, remote delivery | Depth, brand | Time zone, no local presence, priced in USD for a larger market, no local context | Local presence, local context, on-site workshops, local pricing. |
| **Big-4 / large IT integrators** | Enterprise transformation programmes | Enterprise trust | Priced far above SME; not interested in a 25-person firm | We are the tier below. Explicitly say so. |
| **SaaS vendors selling direct** | Point tools, self-serve | Cost, speed | Nobody configures them; they die unadopted | We implement and adopt. We are honest when a SaaS tool is the right answer. |
| **Freelancers / "prompt experts"** | Cheap, fast, variable | Price | No accountability, no continuity, no documentation | Written scope, documented handover, continuity via retainer. |
| **Internal IT** | Free-ish | Owns the systems | No AI experience, no spare capacity | Position as their augmentation, never their replacement. Make IT an ally in discovery. |
| **Doing nothing** | The real default | Free | Cost accumulates invisibly | The calculator makes the cost of doing nothing visible. This is the single most important competitive frame. |

---

## 5. Differentiation

Five claims, each defensible without inventing anything:

1. **Alcance y precio cerrados antes de empezar.** Written scope, written exclusions, fixed price. Almost nobody in this segment does this.
2. **Trabajamos sobre procesos, no sobre herramientas.** We name the process, measure it, then choose the technology — including recommending *no* AI when that's the answer.
3. **Método publicado.** The audit methodology, the scoring model, and a redacted sample deliverable are public. Buyers can evaluate us before contacting us.
4. **Contexto paraguayo.** Local labour cost, local vendors, local channels (WhatsApp), local Spanish, local regulatory caution.
5. **Honestidad sobre límites.** We publish what AI cannot reliably do and which projects we decline. This is a differentiator precisely because the category is full of overpromising.

**Anti-differentiators — never claim:** "los expertos #1 en IA del Paraguay",
"garantizamos X% de ahorro", "certificados en IA", "más de N empresas confían en
nosotros", partner badges we do not hold, client logos we do not have.

---

## 6. Trust strategy and credibility without fabricated proof

The hardest problem at launch: a services business with no public clients.
Seven substitutes for social proof, in build order:

| # | Mechanism | What it is | Phase |
|---|---|---|---|
| 1 | **Named principal** | Real name, real photo, real background, real LinkedIn on `/nosotros`. Anonymous agencies do not get trusted here. | 1 |
| 2 | **Método publicado** | `/metodo` — the actual audit process, the artefacts produced, the timeline, what we need from the client. | 1 |
| 3 | **Entregable de muestra** | A complete sample audit report, built on a **clearly labelled fictional company**, downloadable. Watermark: *"Ejemplo con datos ficticios — no representa a un cliente real."* | 1 |
| 4 | **Modelo de puntuación abierto** | The Diagnóstico's scoring rules published in plain language. Nobody does this; it converts scepticism into confidence. | 2 |
| 5 | **Límites publicados** | `/que-no-hacemos` — projects we decline and why. Reads as expertise, filters bad leads, and is a genuinely useful page. | 1 |
| 6 | **Contenido técnico específico** | Articles that could only be written by someone who has done the work. Depth is the proof. | 1–3 |
| 7 | **Proof, as it becomes real** | Anonymised results *only* with written client consent and a real measurement. Format: "Estudio contable, 18 personas, Asunción — reducción medida de X a Y en el proceso Z, verificado durante 60 días. Publicado con autorización del cliente." | 3+ |

**Rules:**
- No testimonial without a real named person or a written consent record stored in `consent_records`.
- No metric without a stated measurement method and period.
- No counter ("+120 diagnósticos realizados") until the number is real and queryable from the database. Then it may be shown, live.
- The sample report watermark is a build-time requirement, not a copy suggestion.

**Guarantee (real, and a strong trust device):**
> *Si al finalizar la Auditoría considerás que el informe no identifica ninguna
> oportunidad aplicable a tu empresa, te devolvemos el importe.*

This is honest, fundable at our volume, and forces us to only sell audits we can
make useful — which is exactly the discipline the business needs.

---

## 7. Recommended initial verticals — final

**Build for (Phase 1):** Inmobiliarias · Contadores · Estudios jurídicos
**Horizontal cluster (Phase 1):** Atención al cliente por WhatsApp
**Add in Phase 3, only if the first three are working:** one of Clínicas (privacy work required first) or Ecommerce/retail.

**Avoid initially:** colegios, restaurantes, gobierno, agro-industria (long cycles,
capital-intensive, different buyer), ONGs (grant-dependent budgets), startups.

A vertical page ships **only** when it has: a named process, a described current-state
workflow, a described intended-state workflow, an honest limitations section, and a
vertical-specific FAQ. Three deep pages beat fifteen thin ones — this is a hard rule,
see `06_SEO_ARCHITECTURE.md` §Content quality standards.

---

## 8. Message architecture (normative Spanish)

**Home H1:**
> Inteligencia artificial aplicada a procesos reales de tu empresa

**Home subhead:**
> Identificamos qué tareas de tu empresa pueden automatizarse o asistirse con IA,
> y las implementamos con alcance y precio cerrados. Empezá con un diagnóstico
> gratuito de 6 minutos.

**Primary CTA:** `Hacer el diagnóstico gratuito`
**Secondary CTA:** `Hablar por WhatsApp`

**Proof line (launch-safe, true):**
> Método publicado. Alcance por escrito. Precio cerrado antes de empezar.

**Objection-handling copy blocks (required on home):**
1. *"¿Esto sirve para una empresa de mi tamaño?"* — size band stated explicitly.
2. *"¿Van a reemplazar a mi personal?"* — our position: we automate tasks, not people; if headcount reduction is the sole objective, we are not the right vendor.
3. *"¿Qué pasa con la información confidencial de mi empresa?"* — data handling, retention, and provider-training posture, in plain language.
4. *"¿Cuánto cuesta?"* — a real starting-from number, on the page.
