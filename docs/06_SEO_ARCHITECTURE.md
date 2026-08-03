# 06 — SEO Architecture

> **Keyword-data honesty.** No search volumes are stated in this document, because we
> have not measured any. Priorities below are reasoned from **intent quality and
> competitive structure**, not from invented volume figures. Actual volume and
> difficulty must be checked before the content calendar is finalised — that is a
> Phase 0 task, not an assumption to bury here.

---

## 1. Strategy

**Position:** the Paraguayan-specific answer to Spanish-language commercial AI queries.
Regional and Spanish sites outrank us on generic terms; they cannot outrank us on
Paraguayan context — local labour costs, local channels (WhatsApp), local vendors,
local regulation, local Spanish, and named local processes.

**Three intent layers:**

| Layer | Intent | Job | Depth |
|---|---|---|---|
| **Comercial** | "quiero contratar" | Convert | Deep, few pages |
| **Vertical** | "IA para [mi industria]" | Qualify and convert | Deep, few pages |
| **Educativo** | "qué es / cómo funciona / cuánto cuesta" | Attract and build authority | Broad, many pages |

Plus a **tool layer** that captures utility intent and converts it into the funnel.

**Hard quality rule (locked):** we publish **three excellent vertical pages, not
fifteen thin ones**. A page ships only when it passes the quality checklist in §10.
This rule exists because the thin-page failure mode is both the easiest to fall into
and the most damaging to a credibility-led positioning.

---

## 2. Cluster architecture

### Cluster A — Consultoría (commercial, pillar)
Pillar: `/servicios/auditoria-de-ia`
Supporting: `/servicios`, `/metodo`, `/precios`, `/que-no-hacemos`,
`/blog/cuanto-cuesta-implementar-ia-en-una-empresa-paraguay`,
`/blog/como-elegir-un-consultor-de-ia`,
`/blog/que-esperar-de-una-auditoria-de-ia`

### Cluster B — Automatización de procesos (commercial)
Pillar: `/servicios/implementacion`
Supporting: `/herramientas/calculadora-de-tareas-repetitivas`,
`/blog/automatizar-tareas-repetitivas-empresa`,
`/blog/que-procesos-conviene-automatizar-primero`,
`/blog/automatizacion-vs-inteligencia-artificial-diferencias`

### Cluster C — Atención al cliente e IA (commercial + horizontal wedge)
Pillar: `/soluciones/atencion-al-cliente`
Supporting: `/blog/chatbot-whatsapp-empresa-paraguay`,
`/blog/responder-mas-rapido-consultas-clientes-ia`,
`/blog/chatbot-o-asistente-ia-cual-necesita-tu-empresa`,
`/blog/errores-comunes-al-implementar-un-chatbot`

### Cluster D — Capacitación (commercial)
Pillar: `/servicios/capacitacion`
Supporting: `/recursos/politica-uso-ia-plantilla`,
`/blog/capacitar-al-equipo-en-ia`,
`/blog/politica-de-uso-de-ia-en-la-empresa`,
`/herramientas/prompts`

### Cluster E — Verticales (commercial, high intent)
`/soluciones/inmobiliarias` · `/soluciones/estudios-contables` ·
`/soluciones/estudios-juridicos`
Each with 3–4 supporting articles on **named processes**, e.g.
`/blog/ia-para-seguimiento-de-clientes-inmobiliaria`,
`/blog/clasificar-documentos-contables-con-ia`,
`/blog/revision-de-contratos-con-ia-que-funciona-y-que-no`

### Cluster F — Educativo (top of funnel)
`/blog/que-es-la-inteligencia-artificial-para-empresas`,
`/blog/glosario-de-ia-para-empresas`,
`/blog/riesgos-de-usar-ia-en-la-empresa`,
`/blog/datos-necesarios-para-usar-ia`,
`/blog/inteligencia-artificial-en-paraguay-estado-actual` **(only with cited, real sources)**

### Cluster G — Herramientas (utility intent)
`/herramientas` · the three tool pages · prompt category and detail pages.

**Deferred clusters** (Phase 4+, and only with real depth): clínicas, restaurantes,
colegios, ecommerce, RRHH, ventas, agentes de IA. Listed here so the plan is explicit
about what we are *not* building yet.

---

## 3. Location relevance

Paraguay is one market with one dominant metro. **Do not build city-page doorway
farms** ("IA para empresas en Luque") — thin, duplicative, and the exact pattern
search engines penalise.

Instead:
- Country-level relevance signalled through language, currency (Gs.), examples, regulation references, and `.com.py`
- One genuine local page: `/contacto` with real location and service area
- `Organization` + `LocalBusiness` structured data with a real address
- Google Business Profile with a real address (required for map/local surfaces)
- Location appears naturally in copy ("empresas paraguayas", "Asunción", "Ciudad del Este"), never as a spun template
- **Maximum one** genuinely differentiated city page (`/ciudad-del-este` with real regional content) — and only if there is something real to say

---

## 4. Route map (first 30 pages)

| # | Route | Type | Primary intent (ES) | Priority |
|---|---|---|---|---|
| 1 | `/` | Home | consultoría de inteligencia artificial paraguay | P0 |
| 2 | `/servicios` | Hub | servicios de inteligencia artificial para empresas | P0 |
| 3 | `/servicios/auditoria-de-ia` | Pillar | auditoría de inteligencia artificial empresa | P0 |
| 4 | `/servicios/implementacion` | Pillar | implementar ia en una empresa | P0 |
| 5 | `/servicios/capacitacion` | Pillar | capacitación en ia para empresas | P0 |
| 6 | `/servicios/soporte-y-optimizacion` | Service | soporte y mantenimiento de soluciones de ia | P1 |
| 7 | `/soluciones/inmobiliarias` | Vertical | ia para inmobiliarias | P0 |
| 8 | `/soluciones/estudios-contables` | Vertical | ia para estudios contables | P0 |
| 9 | `/soluciones/estudios-juridicos` | Vertical | ia para estudios jurídicos | P0 |
| 10 | `/soluciones/atencion-al-cliente` | Horizontal | ia para atención al cliente | P0 |
| 11 | `/metodo` | Trust | cómo trabajamos | P0 |
| 12 | `/que-no-hacemos` | Trust | — (differentiator, low volume, high conversion) | P0 |
| 13 | `/precios` | Commercial | cuánto cuesta consultoría de ia | P0 |
| 14 | `/nosotros` | Trust | — | P0 |
| 15 | `/contacto` | Conversion | — | P0 |
| 16 | `/herramientas` | Hub | herramientas de ia gratis para empresas | P1 |
| 17 | `/herramientas/diagnostico-de-ia` | Tool | diagnóstico de madurez en ia | P0 |
| 18 | `/herramientas/calculadora-de-tareas-repetitivas` | Tool | calculadora costo tareas repetitivas | P1 |
| 19 | `/herramientas/prompts` | Tool hub | biblioteca de prompts para empresas | P1 |
| 20 | `/recursos` | Hub | recursos y guías de ia | P1 |
| 21 | `/recursos/politica-uso-ia-plantilla` | Resource | plantilla política de uso de ia | P1 |
| 22 | `/recursos/checklist-datos` | Resource | checklist preparación de datos ia | P2 |
| 23 | `/recursos/informe-de-ejemplo` | Trust | ejemplo de auditoría de ia | P1 |
| 24 | `/blog` | Hub | — | P1 |
| 25–28 | 4 launch articles (see §5, T1–T4) | Article | — | P0 |
| 29 | `/legal/privacidad` | Legal | — | P0 |
| 30 | `/legal/uso-de-ia` | Trust/legal | cómo usamos la ia en este sitio | P1 |

---

## 5. First 30 content topics

Ordered by build priority. Every one must contain something a generic regional article
cannot: a Paraguayan cost, channel, process, vendor, or regulatory reference.

**Commercial (T1–T8)**
1. Cuánto cuesta implementar inteligencia artificial en una empresa en Paraguay
2. Qué esperar de una auditoría de IA: proceso, entregables y plazos
3. Automatización vs. inteligencia artificial: cuál necesita tu empresa
4. Cómo elegir un proveedor de IA (y qué preguntas hacerle)
5. Qué procesos conviene automatizar primero en una empresa mediana
6. Errores comunes al implementar un chatbot (y cómo evitarlos)
7. Chatbot o asistente de IA: cuál corresponde a tu caso
8. Cuánto tiempo lleva implementar una solución de IA

**Verticales (T9–T18)**
9. IA para inmobiliarias: 5 procesos donde realmente sirve
10. Cómo no perder consultas de WhatsApp en una inmobiliaria
11. Generar descripciones de propiedades con IA: qué revisar siempre
12. IA para estudios contables: dónde empieza y dónde termina
13. Clasificar documentos de clientes automáticamente
14. Responder consultas recurrentes de clientes contables sin perder calidad
15. IA para estudios jurídicos: qué funciona, qué no, y qué es riesgoso
16. Revisión y comparación de documentos con IA
17. Confidencialidad y IA en un estudio jurídico: cómo evaluar un proveedor
18. Atención al cliente por WhatsApp con IA: arquitectura realista

**Educativo (T19–T26)**
19. Qué es la inteligencia artificial aplicada a empresas (sin marketing)
20. Glosario de IA para empresas paraguayas
21. Qué datos necesita tu empresa antes de usar IA
22. Riesgos de usar IA en la empresa y cómo mitigarlos
23. Qué es una alucinación de IA y por qué importa en tu negocio
24. Política de uso de IA en la empresa: qué debe incluir
25. Cómo capacitar a tu equipo en IA sin frenar la operación
26. Cuándo **no** conviene usar IA

**Herramientas / soporte (T27–T30)**
27. Cómo interpretar tu diagnóstico de madurez en IA
28. Cómo calcular el costo real de una tarea repetitiva
29. 15 prompts para atención al cliente en español paraguayo
30. Cómo medir si una implementación de IA funcionó

**Cadence:** 4 articles at launch, then **4/month** — a rate a two-person firm can
actually sustain at this depth. Sustainable depth beats unsustainable volume.

---

## 6. Internal linking

- **Hub → spoke → hub.** Every article links up to its cluster pillar; every pillar lists its articles.
- **Every content page** carries at least one contextual link to a tool and one to a service page. Contextual, in-body, descriptive anchors — never a generic footer block.
- **Vertical pages** are the hubs of their own mini-clusters and link to the assessment with an industry pre-selected.
- **Tool pages** link to the relevant service and to 2–3 explanatory articles.
- Anchors describe the destination ("cómo funciona nuestra auditoría de IA"), never "hacé clic acá".
- Maximum ~8 in-body internal links per article.
- **Orphan check in CI:** no published page may have zero inbound internal links.

---

## 7. Structured data

| Page type | Schema |
|---|---|
| All | `Organization` (real name, real logo, real `sameAs`) |
| Home, `/contacto` | `LocalBusiness` with real address |
| Service pages | `Service` + `Offer` with a real `priceRange` |
| Articles | `Article` with real `author` (a named person), `datePublished`, `dateModified` |
| FAQ blocks | `FAQPage` — only where the Q&A is genuinely on the page |
| Tools | `WebApplication` |
| Breadcrumbs | `BreadcrumbList` sitewide |
| Guides | `HowTo` only where genuinely step-by-step |

**Prohibited:** `AggregateRating` or `Review` markup without real, consented reviews.
`Person` author must be a real person. No fake `Rating`. Ever.

---

## 8. Metadata patterns

```
Home        Consultoría en Inteligencia Artificial para Empresas | Paraguay
Service     {Servicio} para Empresas en Paraguay | Alcance y Precio Cerrados
Vertical    Inteligencia Artificial para {Industria} en Paraguay | Casos Reales de Uso
Tool        {Herramienta} Gratis para Empresas Paraguayas
Article     {Título} | Guía para Empresas Paraguayas
```

Rules: title ≤ 60 chars where possible, unique, front-loaded, no keyword stuffing;
meta description 140–160 chars, written as a sentence to a human, containing the
primary term naturally and a reason to click; one `H1` per page; `og:` and
`twitter:` tags with a real per-page image; canonical on every page.

---

## 9. Indexation rules

| Indexed | Not indexed |
|---|---|
| All marketing, vertical, tool, resource and blog pages | `/admin/*` (`noindex, nofollow` + auth) |
| Prompt category and detail pages | `/herramientas/*/resultado/*` (tokenised, `noindex`) |
| `/herramientas` hub | Thank-you and confirmation pages |
| | Paginated blog beyond page 1 (`noindex, follow`) |
| | Filter/sort URL parameters (canonical to the clean URL) |
| | Any draft or unpublished content |

`robots.txt` allows everything except `/admin` and `/api`. XML sitemap generated from
published content only, with real `lastmod`, submitted to Search Console and Bing.
**No page enters the sitemap until it passes §10.**

---

## 10. Content quality standards (blocking checklist)

A page does not publish unless **all** are true:

1. It answers the query in the first 150 words.
2. It contains at least one thing that could only be written by someone who has done this work — a real constraint, a real cost driver, a real failure mode.
3. It contains Paraguayan specificity (currency, channel, regulation, vendor, market structure).
4. It names what does **not** work, or where the approach fails.
5. Length is determined by the topic, not a word target. A 700-word complete answer beats 2,000 padded words.
6. There is a real human author with a byline.
7. Every claim is either self-evident, sourced with a real link, or explicitly marked as our opinion/experience.
8. **No invented statistics.** If we do not have a source, we do not state a number.
9. There is a natural next step (tool, service, or related article).
10. It is not substantially duplicative of an existing page. If it is, we improve the existing page instead.

**AI-assisted writing policy:** LLMs may be used for outlining, drafting and editing.
Every published page is substantively edited and fact-checked by a named human who
takes authorship. We do not publish unreviewed generated content — both because it
ranks badly and because it would contradict everything we tell clients.

---

## 11. Measurement

Tracked monthly: impressions and clicks per cluster; rankings for ~40 tracked terms;
organic sessions → tool starts; tool starts → completions; completions → gated leads;
gated leads → qualified; qualified → won. **Revenue attributed to cluster.**

Review cadence: monthly rankings, quarterly cluster-level strategy. A cluster with no
qualified lead after 6 months of published content is de-prioritised, not doubled down
on.

**Honest expectation [SUPUESTO]:** meaningful organic traffic in this market and
language typically takes 4–8 months to build. Phase 1 KPIs must not be written as if
month-2 organic leads are expected — and the referral channel (`02` §10) exists
precisely because organic cannot be the only channel in year one.
