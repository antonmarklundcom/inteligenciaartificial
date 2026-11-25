// Service catalogue. Prices and scope follow docs/02 and docs/10: every figure is a
// starting price with its scope stated, and nothing here promises a result.

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  step: string;
  name: string;
  /** Short name for cards and breadcrumbs. */
  short: string;
  title: string;
  description: string;
  kicker: string;
  h1: string;
  lead: string;
  price: string;
  priceGs: string;
  /** Lowest published price in USD, for structured data. */
  priceFrom: number;
  term: string;
  summary: string;
  note?: string;
  featured?: boolean;
  includes: string[];
  excludes: string[];
  steps: { title: string; body: string }[];
  tiers?: { name: string; scope: string; price: string; priceGs: string; term: string }[];
  fit: string[];
  notFit: string[];
  faq: Faq[];
};

export const SERVICES: Service[] = [
  {
    slug: "auditoria-de-ia",
    step: "01",
    name: "Auditoría de Oportunidades de IA",
    short: "Auditoría de IA",
    title: "Auditoría de Inteligencia Artificial para Empresas en Paraguay",
    description:
      "Auditoría de IA en 3 semanas y a precio cerrado: medimos de 3 a 5 procesos de tu empresa y te entregamos un informe con las oportunidades priorizadas y sus costos.",
    kicker: "Servicio 01 · El primer paso",
    h1: "Auditoría de Oportunidades de IA",
    lead: "En tres semanas sabés qué procesos de tu empresa conviene automatizar o asistir con inteligencia artificial, cuánto costaría hacerlo —incluidos los costos mensuales— y qué recomendamos no tocar. Precio cerrado, entregable por escrito.",
    price: "USD 1.500",
    priceGs: "Gs. 11.000.000",
    priceFrom: 1500,
    term: "3 semanas · precio cerrado",
    summary:
      "Analizamos de 3 a 5 procesos de tu empresa, medimos cómo funcionan hoy y te entregamos un informe escrito con las oportunidades priorizadas, sus costos —incluidos los recurrentes— y lo que recomendamos no hacer.",
    note: "Si al finalizar considerás que el informe no identifica ninguna oportunidad aplicable a tu empresa, te devolvemos el importe.",
    featured: true,
    includes: [
      "Entrevistas con las personas que hacen el trabajo, no solo con la dirección.",
      "Medición de 3 a 5 procesos: volumen, tiempo, errores y costo actual.",
      "Revisión de los sistemas y los datos que cada oportunidad necesitaría.",
      "Informe escrito con las oportunidades priorizadas por impacto, esfuerzo y riesgo.",
      "Costo estimado de cada una, separando la implementación de los costos mensuales (API, licencias, hosting).",
      "Una sección de lo que recomendamos no hacer, y por qué.",
      "Reunión de presentación con quien decide.",
    ],
    excludes: [
      "No incluye implementar ninguna solución: eso es un Sprint, con su propio alcance.",
      "No es una auditoría contable, legal ni de seguridad informática.",
      "No analizamos más de 5 procesos por auditoría; si hay más, se priorizan con vos al inicio.",
    ],
    steps: [
      { title: "Semana 1 · Relevamiento", body: "Reunión de inicio, elección de los procesos y entrevistas con quienes los ejecutan. Pedimos ejemplos reales: mensajes, planillas, documentos." },
      { title: "Semana 2 · Medición", body: "Medimos volumen, tiempos y errores. Cuando algo no se puede medir, lo estimamos con vos y lo marcamos como estimación." },
      { title: "Semana 3 · Informe", body: "Priorizamos, costeamos y escribimos. Presentamos el informe a quien decide y respondemos las preguntas del equipo." },
    ],
    fit: [
      "Empresas de 10 a 150 personas con un dueño o director que decide.",
      "Equipos que ya probaron ChatGPT por su cuenta y no saben por dónde seguir.",
      "Empresas que quieren un número antes de comprometer un presupuesto mayor.",
    ],
    notFit: [
      "Si ya sabés exactamente qué proceso querés automatizar: conviene ir directo a un Sprint.",
      "Si buscás una presentación general sobre IA: para eso está el taller.",
    ],
    faq: [
      { q: "¿Cuánto cuesta una auditoría de IA en Paraguay?", a: "Nuestra auditoría parte de USD 1.500 (Gs. 11.000.000) por un alcance de 3 a 5 procesos en 3 semanas. El precio se confirma por escrito antes de empezar y no cambia durante el trabajo." },
      { q: "¿Qué recibo al final?", a: "Un informe escrito con cada oportunidad descrita, su medición actual, el costo estimado de implementarla, sus costos mensuales, los riesgos y un orden de prioridad. También lo que recomendamos no hacer." },
      { q: "¿Tengo que contratar la implementación con ustedes?", a: "No. El informe es tuyo y está escrito para que cualquier proveedor competente pueda cotizarlo. Si querés implementarlo con nosotros, el siguiente paso es un Sprint." },
      { q: "¿Qué pasa con la información de mi empresa?", a: "Firmamos un acuerdo de confidencialidad antes de empezar. Trabajamos con los datos mínimos necesarios y no usamos información de clientes para entrenar modelos." },
    ],
  },
  {
    slug: "implementacion",
    step: "02",
    name: "Sprint de Implementación",
    short: "Implementación",
    title: "Implementación de Inteligencia Artificial en Empresas | Paraguay",
    description:
      "Implementamos IA en un proceso de tu empresa en 4 a 6 semanas, con alcance y precio cerrados: solución en producción, capacitación, soporte y medición del antes y el después.",
    kicker: "Servicio 02 · Un proceso en producción",
    h1: "Sprint de Implementación de IA",
    lead: "Una solución funcionando en un proceso concreto de tu empresa, en 4 a 6 semanas. El alcance, el precio y lo que queda fuera se firman antes de empezar; los costos mensuales se cotizan aparte y por escrito.",
    price: "USD 3.500 – 7.500",
    priceGs: "Gs. 25.500.000 – 55.000.000",
    priceFrom: 3500,
    term: "4 a 6 semanas · un proceso",
    summary:
      "Una solución funcionando en producción para un proceso, con documentación, capacitación para quienes la usan, 30 días de soporte y la medición del proceso antes y después.",
    includes: [
      "Una solución en producción para un proceso, no un prototipo.",
      "Integración con las herramientas que ya usás, dentro del alcance firmado.",
      "Documentación de uso y de mantenimiento.",
      "Capacitación para las personas que la van a usar.",
      "30 días de soporte después de la entrega.",
      "Medición del proceso antes y después, con los mismos indicadores.",
    ],
    excludes: [
      "Los costos mensuales de terceros (API de modelos, WhatsApp Business, hosting, licencias) los paga el cliente y se cotizan por separado.",
      "Cambios fuera del alcance firmado se cotizan como orden de cambio.",
      "No construimos CRMs, ERPs ni sistemas contables.",
      "No dejamos decisiones tributarias, legales, médicas o financieras sin una persona que las confirme.",
    ],
    steps: [
      { title: "Alcance por escrito", body: "Qué entra, qué no, con qué datos y cómo vamos a medir si funcionó. Sin esto no se empieza." },
      { title: "Construcción con casos reales", body: "Trabajamos con ejemplos de tu operación y te mostramos avances cada semana." },
      { title: "Puesta en producción", body: "Salida gradual, con una persona de tu equipo revisando los resultados al principio." },
      { title: "Medición y traspaso", body: "Comparamos contra la medición inicial, capacitamos y entregamos la documentación." },
    ],
    tiers: [
      { name: "Asistente de documentos y conocimiento interno", scope: "Consultas sobre manuales, contratos, precedentes o procedimientos de la empresa, con cita de la fuente.", price: "USD 3.500", priceGs: "Gs. 25.500.000", term: "4 semanas" },
      { name: "Automatización de un flujo", scope: "Recepción, clasificación y generación de documentos o reportes recurrentes.", price: "USD 5.500", priceGs: "Gs. 40.000.000", term: "4 a 5 semanas" },
      { name: "Asistente de atención por WhatsApp", scope: "Respuesta, calificación de consultas y derivación a una persona, sobre la API oficial de WhatsApp Business.", price: "USD 7.500", priceGs: "Gs. 55.000.000", term: "5 a 6 semanas" },
    ],
    fit: [
      "Empresas con un proceso repetitivo, de volumen y con ejemplos reales disponibles.",
      "Equipos donde alguien puede dedicar unas horas por semana a probar y corregir.",
    ],
    notFit: [
      "Proyectos cuyo objetivo principal sea reducir personal.",
      "Procesos que cambian cada semana o que nadie puede describir de principio a fin.",
      "Quien busca un chatbot genérico por una cuota mensual baja: hay productos estándar que resuelven eso mejor.",
    ],
    faq: [
      { q: "¿Cuánto cuesta implementar inteligencia artificial en una empresa?", a: "Depende del proceso. Nuestros Sprints parten de USD 3.500 para un asistente de documentos y llegan a USD 7.500 para un asistente de atención por WhatsApp con calificación. A eso se suman los costos mensuales de terceros, que cotizamos por separado antes de empezar." },
      { q: "¿Cuánto tiempo lleva?", a: "Entre 4 y 6 semanas por proceso. Trabajamos un proceso a la vez: es la única forma de sostener un precio cerrado." },
      { q: "¿Necesito hacer antes la auditoría?", a: "No siempre. Si el proceso está claro, medido y tiene ejemplos, se puede empezar por el Sprint. Si hay dudas sobre cuál elegir, la auditoría evita invertir en el proceso equivocado." },
      { q: "¿Qué pasa después de los 30 días de soporte?", a: "Podés operarlo con tu equipo usando la documentación, o contratar un retainer de soporte y optimización mensual." },
    ],
  },
  {
    slug: "capacitacion",
    step: "03",
    name: "Taller de IA para equipos",
    short: "Capacitación",
    title: "Capacitación en Inteligencia Artificial para Empresas | Paraguay",
    description:
      "Taller práctico de IA para equipos en Paraguay: medio día o día completo con las tareas reales de tu empresa, guía de prompts por función y borrador de política de uso.",
    kicker: "Servicio 03 · Capacitación",
    h1: "Capacitación en IA para tu equipo",
    lead: "Tu equipo probablemente ya usa ChatGPT. El taller ordena ese uso: práctica con las tareas reales de cada área, criterios para saber cuándo confiar en el resultado y un borrador de política sobre qué información se puede subir y cuál no.",
    price: "USD 900 – 1.600",
    priceGs: "Gs. 6.600.000 – 11.700.000",
    priceFrom: 900,
    term: "Medio día o día completo",
    summary:
      "Práctica con las tareas reales de tu equipo, guía de prompts por función y un borrador de Política de Uso de IA para la empresa.",
    includes: [
      "Relevamiento previo de las tareas reales de quienes asisten.",
      "Práctica guiada sobre esas tareas, no ejemplos genéricos.",
      "Guía de prompts por función para seguir usando después.",
      "Cómo detectar errores y respuestas inventadas antes de que lleguen a un cliente.",
      "Borrador de Política de Uso de IA para la empresa.",
    ],
    excludes: [
      "No es un curso de programación ni una certificación.",
      "No incluye licencias de herramientas.",
      "Más de 15 personas requiere dividir en grupos; cada persona adicional tiene un costo de USD 40.",
    ],
    steps: [
      { title: "Antes", body: "Un formulario corto a cada asistente: qué tareas repite, con qué herramientas y qué probó hasta ahora." },
      { title: "Durante", body: "Práctica por áreas con sus propios documentos y mensajes, y discusión de riesgos concretos." },
      { title: "Después", body: "Entrega de la guía de prompts y del borrador de política, listos para adaptar." },
    ],
    tiers: [
      { name: "Medio día", scope: "Hasta 12 personas. Fundamentos, práctica por función y guía de prompts.", price: "USD 900", priceGs: "Gs. 6.600.000", term: "4 horas" },
      { name: "Día completo", scope: "Hasta 15 personas. Suma el trabajo sobre la política de uso y casos por área.", price: "USD 1.600", priceGs: "Gs. 11.700.000", term: "8 horas" },
    ],
    fit: [
      "Equipos administrativos, comerciales y profesionales que escriben, resumen y responden todos los días.",
      "Direcciones que no saben qué información está subiendo su gente a herramientas de IA.",
    ],
    notFit: ["Equipos que necesitan formación técnica para desarrollar software con IA."],
    faq: [
      { q: "¿El taller es presencial?", a: "Sí, en Gran Asunción y Ciudad del Este. Para otras ciudades se puede dictar en línea o coordinar el traslado." },
      { q: "¿Qué herramientas se usan?", a: "Las que tu equipo ya tiene. El taller no depende de una marca: los criterios sirven para cualquier asistente de IA." },
      { q: "¿Qué es la política de uso de IA?", a: "Un documento corto que define qué herramientas están permitidas, qué información no se puede subir, quién revisa lo que se envía a clientes y cómo se registran los usos. Te entregamos un borrador para que lo adapte tu asesor legal." },
    ],
  },
  {
    slug: "soporte-y-optimizacion",
    step: "04",
    name: "Retainer de Optimización",
    short: "Soporte y optimización",
    title: "Soporte y Optimización de Soluciones de IA | Paraguay",
    description:
      "Soporte mensual para soluciones de IA ya implementadas: monitoreo, horas para cambios, reporte de uso y costos, y revisión trimestral de nuevas oportunidades.",
    kicker: "Servicio 04 · Solo después de un Sprint",
    h1: "Soporte y optimización mensual",
    lead: "Una solución de IA no se instala y se olvida: cambian los modelos, los precios, los procesos y los mensajes de tus clientes. El retainer mantiene lo implementado funcionando y medido. Se contrata únicamente después de un Sprint entregado.",
    price: "USD 800 – 2.500 / mes",
    priceGs: "Gs. 5.800.000 – 18.000.000 / mes",
    priceFrom: 800,
    term: "Mensual · mínimo 3 meses",
    summary:
      "Monitoreo y revisión mensual de lo implementado, una bolsa de horas para cambios, reporte de uso y costos, y revisión trimestral de nuevas oportunidades.",
    includes: [
      "Monitoreo de funcionamiento, calidad de respuestas y costos de API.",
      "Bolsa de horas mensual para cambios y mejoras.",
      "Reporte mensual de uso, costos e incidentes.",
      "Actualización cuando un modelo o un proveedor cambia.",
      "Revisión trimestral de nuevas oportunidades (planes Activo y Socio).",
    ],
    excludes: [
      "No se vende sin un Sprint previo: no damos soporte a soluciones que no conocemos.",
      "Las horas no usadas se acumulan como máximo un mes.",
      "Nuevos procesos se cotizan como un Sprint aparte.",
    ],
    steps: [
      { title: "Cada mes", body: "Revisamos métricas, corregimos lo que se desvió y usamos las horas en las mejoras que priorices." },
      { title: "Cada trimestre", body: "Repasamos el proceso completo y te proponemos, con números, si conviene ampliar o dejarlo como está." },
    ],
    tiers: [
      { name: "Base", scope: "Monitoreo, 4 horas de cambios y reporte mensual.", price: "USD 800", priceGs: "Gs. 5.800.000", term: "por mes" },
      { name: "Activo", scope: "10 horas de cambios, revisión trimestral de oportunidades y soporte prioritario.", price: "USD 1.500", priceGs: "Gs. 11.000.000", term: "por mes" },
      { name: "Socio", scope: "18 horas, hoja de ruta dedicada y visita trimestral.", price: "USD 2.500", priceGs: "Gs. 18.000.000", term: "por mes" },
    ],
    fit: ["Empresas que ya tienen una solución nuestra en producción y dependen de ella todos los días."],
    notFit: ["Quien todavía no implementó nada: el primer paso es la auditoría o un Sprint."],
    faq: [
      { q: "¿Puedo contratar el soporte para una solución hecha por otro proveedor?", a: "No de entrada. Primero hacemos una revisión acotada de esa solución, cotizada como auditoría, para saber qué estaríamos manteniendo." },
      { q: "¿Qué incluye el reporte mensual?", a: "Volumen de uso, costos de terceros, incidentes, cambios realizados y las horas consumidas. Es el entregable principal del servicio." },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** What we do not do. Published as a page and summarised on the home page. */
export const WE_DONT = [
  "No vendemos “transformación digital” ni proyectos sin alcance definido.",
  "No revendemos chatbots ni software genérico de terceros.",
  "No construimos CRMs, ERPs ni sistemas contables.",
  "No automatizamos decisiones tributarias, legales, médicas o financieras sin una persona que las confirme.",
  "No hacemos reconocimiento facial, vigilancia de empleados ni listas de datos personales.",
  "No aceptamos proyectos cuyo objetivo principal sea reducir personal.",
  "No prometemos ahorros garantizados ni mostramos clientes, logos o testimonios que no tenemos.",
];

export const METHOD = [
  { title: "Entendemos el proceso", body: "Entrevistas con quienes hacen el trabajo y observación del proceso tal como funciona hoy, no como figura en el manual." },
  { title: "Medimos antes de proponer", body: "Volumen, tiempo, errores y costo. Cuando algo no se puede medir, lo estimamos y lo marcamos como estimación." },
  { title: "Priorizamos con criterio", body: "Cada oportunidad se clasifica por impacto, esfuerzo y riesgo, y se verifica que los sistemas y los datos lo permitan." },
  { title: "Implementamos de a un proceso", body: "Alcance y precio por escrito antes de empezar. Un proceso, en producción, medido con vos antes y después." },
];

export const HOME_FAQ: Faq[] = [
  { q: "¿Qué hace una consultora de inteligencia artificial?", a: "Identifica en qué procesos de una empresa la IA aporta un resultado medible, calcula cuánto cuesta implementarla y la pone en funcionamiento. En nuestro caso, siempre con alcance y precio definidos antes de empezar y un proceso a la vez." },
  { q: "¿Cuánto cuesta empezar?", a: "La Auditoría de Oportunidades de IA parte de USD 1.500 (Gs. 11.000.000) y dura 3 semanas. Un taller para equipos parte de USD 900. Los Sprints de Implementación van de USD 3.500 a USD 7.500 según el proceso." },
  { q: "¿Para qué tamaño de empresa trabajan?", a: "Empresas paraguayas formalizadas de 10 a 150 personas, sobre todo inmobiliarias, estudios contables y estudios jurídicos, en Gran Asunción y Ciudad del Este." },
  { q: "¿La IA va a reemplazar a mi equipo?", a: "No trabajamos en proyectos cuyo objetivo sea reducir personal. Lo que implementamos saca tareas repetitivas —clasificar, resumir, redactar borradores, responder consultas frecuentes— para que las personas decidan y atiendan lo que requiere criterio." },
  { q: "¿Qué pasa con los datos de mi empresa y de mis clientes?", a: "Usamos los datos mínimos necesarios, con acuerdo de confidencialidad, y no entrenamos modelos con información de clientes. La Ley 7593/2025 de protección de datos personales entra en vigencia el 27 de noviembre de 2027: diseñamos cada solución pensando en esas obligaciones." },
  { q: "¿Garantizan un ahorro?", a: "No. Medimos el proceso antes y después con los mismos indicadores y te mostramos el resultado. Quien promete un porcentaje de ahorro sin haber medido tu operación está adivinando." },
];
