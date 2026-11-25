// Vertical and horizontal solution pages (docs/00 D2–D3, docs/06 cluster C and E).
import type { Faq } from "./services";

export type Solution = {
  slug: string;
  short: string;
  title: string;
  description: string;
  kicker: string;
  h1: string;
  lead: string;
  summary: string;
  /** How the work looks today, in the client's own terms. */
  today: string[];
  useCases: { title: string; body: string; check: string }[];
  /** Where it fails or is risky — stated on the page, not hidden. */
  limits: string[];
  firstStep: string;
  faq: Faq[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "atencion-al-cliente",
    short: "Atención por WhatsApp",
    title: "IA para Atención al Cliente por WhatsApp en Paraguay",
    description:
      "Asistentes de IA para atención al cliente por WhatsApp en Paraguay: respuesta, calificación y derivación a una persona, sobre la API oficial y con alcance cerrado.",
    kicker: "Solución · Atención al cliente",
    h1: "IA para atención al cliente por WhatsApp",
    lead: "En Paraguay se vende y se atiende por WhatsApp. Implementamos asistentes que responden las consultas frecuentes, califican a quien escribe y pasan la conversación a una persona con el contexto completo, sobre la API oficial de WhatsApp Business.",
    summary:
      "Respuesta, calificación y seguimiento de las consultas que hoy llegan por WhatsApp y se pierden en el chat.",
    today: [
      "Las consultas llegan a los teléfonos personales de los vendedores y nadie sabe cuántas quedaron sin responder.",
      "Fuera de horario no contesta nadie, y a la mañana siguiente el interesado ya habló con otro.",
      "Las mismas diez preguntas se responden a mano, con respuestas distintas según quién atienda.",
    ],
    useCases: [
      { title: "Respuesta a consultas frecuentes", body: "Horarios, precios publicados, requisitos, estado de un trámite: respondidos al instante con la información de tu empresa.", check: "Las respuestas salen solo de contenido aprobado por vos. Lo que no está, se deriva." },
      { title: "Calificación de consultas", body: "El asistente pregunta lo que tu equipo pregunta siempre —qué busca, para cuándo, con qué presupuesto— y lo deja registrado.", check: "Las preguntas y el criterio de calificación los definís vos y son reglas fijas." },
      { title: "Derivación con contexto", body: "Cuando la conversación necesita a una persona, la recibe con un resumen y sin hacerle repetir nada al cliente.", check: "Siempre hay una salida a una persona y el cliente sabe que habla con un asistente." },
      { title: "Seguimiento", body: "Recordatorios y reactivación de consultas que quedaron sin respuesta, con mensajes aprobados.", check: "Solo plantillas aprobadas por WhatsApp y solo a quien dio su consentimiento." },
    ],
    limits: [
      "Un asistente no arregla un proceso comercial desordenado: si nadie responde las derivaciones, el problema sigue.",
      "No sirve para reclamos sensibles o negociaciones: ahí tiene que entrar una persona desde el inicio.",
      "WhatsApp no permite usar su API para chatbots de uso general: el asistente tiene que estar al servicio de la atención de tu negocio.",
      "Tiene costos mensuales (conversaciones de WhatsApp, API del modelo, hosting) que cotizamos antes de empezar.",
    ],
    firstStep: "El Sprint de asistente de atención por WhatsApp parte de USD 7.500 y lleva de 5 a 6 semanas. Si no está claro qué consultas conviene automatizar, la auditoría lo define primero.",
    faq: [
      { q: "¿Funciona con mi número actual de WhatsApp Business?", a: "El asistente trabaja sobre la API oficial de WhatsApp Business (Cloud API). Tu número se puede migrar a la API; lo evaluamos antes de empezar porque cambia la forma en que tu equipo usa ese número." },
      { q: "¿El cliente sabe que habla con una IA?", a: "Sí. El asistente se presenta como tal y siempre ofrece hablar con una persona. Es una regla nuestra y además es lo que exigen las buenas prácticas y varias normativas." },
      { q: "¿Puede inventar respuestas?", a: "Los modelos de lenguaje pueden equivocarse. Por eso limitamos las respuestas al contenido aprobado, derivamos lo que queda fuera y revisamos conversaciones reales durante las primeras semanas." },
    ],
  },
  {
    slug: "inmobiliarias",
    short: "Inmobiliarias",
    title: "Inteligencia Artificial para Inmobiliarias en Paraguay",
    description:
      "IA para inmobiliarias y desarrolladoras en Paraguay: calificación de interesados por WhatsApp, seguimiento de oportunidades y fichas de propiedades generadas con revisión humana.",
    kicker: "Solución · Inmobiliarias y desarrolladoras",
    h1: "IA para inmobiliarias",
    lead: "Una inmobiliaria recibe más mensajes de los que puede responder bien. Trabajamos en los puntos donde una consulta se pierde: la primera respuesta, la calificación del interesado, el seguimiento y la carga de propiedades.",
    summary:
      "Calificación de interesados, seguimiento de oportunidades y fichas de propiedades generadas automáticamente.",
    today: [
      "Cada publicación genera decenas de “¿sigue disponible?” que alguien responde a mano.",
      "Los interesados serios y los curiosos reciben el mismo tiempo de atención.",
      "El seguimiento depende de la memoria de cada asesor.",
      "Cargar una propiedad nueva en todos los portales lleva horas.",
    ],
    useCases: [
      { title: "Primera respuesta y calificación", body: "Respuesta inmediata con los datos de la propiedad y las preguntas que definen si el interesado califica: zona, presupuesto, forma de pago, plazo.", check: "Los datos salen de tu ficha; el asistente no inventa precios ni disponibilidad." },
      { title: "Seguimiento de oportunidades", body: "Recordatorios al asesor y mensajes de seguimiento al interesado según la etapa.", check: "Se integra con lo que ya usás para registrar oportunidades; no construimos un CRM." },
      { title: "Fichas y descripciones de propiedades", body: "A partir de los datos y las fotos, un borrador de descripción para cada portal.", check: "Una persona revisa siempre superficie, precio y situación legal antes de publicar." },
      { title: "Resumen de visitas y llamadas", body: "Notas de voz del asesor convertidas en un registro ordenado de cada visita.", check: "Con consentimiento de quienes participan y sin datos innecesarios." },
    ],
    limits: [
      "La IA no reemplaza la visita ni la negociación.",
      "Si las fichas de las propiedades están desactualizadas, el asistente va a responder con datos desactualizados.",
      "Las descripciones generadas pueden exagerar: por eso la revisión humana es obligatoria.",
    ],
    firstStep: "Lo habitual es empezar por la primera respuesta y la calificación por WhatsApp. Si tenés varios frentes abiertos, la auditoría ordena cuál rinde más.",
    faq: [
      { q: "¿Sirve para una inmobiliaria chica?", a: "Trabajamos con empresas de 10 personas en adelante. Para equipos más chicos suele alcanzar con herramientas estándar bien configuradas, y un taller es mejor inversión que un desarrollo a medida." },
      { q: "¿Se conecta con los portales donde publico?", a: "Depende de cada portal y de si ofrece una forma de integración. Se verifica en el alcance, antes de cotizar." },
    ],
  },
  {
    slug: "estudios-contables",
    short: "Estudios contables",
    title: "Inteligencia Artificial para Estudios Contables en Paraguay",
    description:
      "IA para estudios contables en Paraguay: recepción y clasificación de documentos de clientes, comunicaciones recurrentes y borradores de reportes, siempre con revisión profesional.",
    kicker: "Solución · Estudios contables",
    h1: "IA para estudios contables",
    lead: "El trabajo de un estudio contable es recurrente, documental y con vencimientos. Ahí la IA ayuda en lo mecánico —recibir, clasificar, recordar, redactar borradores— y deja el criterio profesional donde tiene que estar.",
    summary:
      "Recepción y clasificación de documentos, comunicaciones a clientes y borradores de reportes recurrentes.",
    today: [
      "Los clientes mandan facturas y comprobantes por WhatsApp, mail y en papel, a último momento.",
      "Alguien renombra, ordena y carga cada documento a mano.",
      "Las mismas consultas sobre vencimientos y requisitos se responden todos los meses.",
      "Los reportes mensuales se arman desde cero para cada cliente.",
    ],
    useCases: [
      { title: "Recepción y clasificación de documentos", body: "Los documentos que llegan se identifican, se clasifican por cliente y período, y se avisa qué falta.", check: "Los casos dudosos van a una persona; nada se carga a un sistema tributario sin revisión." },
      { title: "Recordatorios y pedidos de documentación", body: "Mensajes a cada cliente con lo que tiene pendiente antes de cada vencimiento.", check: "El calendario y los textos los define el estudio." },
      { title: "Respuestas a consultas recurrentes", body: "Borradores de respuesta a partir de las respuestas que el estudio ya dio antes.", check: "El profesional aprueba antes de enviar todo lo que implique un criterio." },
      { title: "Borradores de reportes", body: "El informe mensual de cada cliente pre-armado con sus datos, para revisar y completar.", check: "Los números salen de tus sistemas, no del modelo de lenguaje." },
    ],
    limits: [
      "No automatizamos decisiones tributarias: la IA no decide cómo se liquida un impuesto.",
      "La lectura de documentos escaneados o fotos de mala calidad falla más; se mide antes de prometer nada.",
      "Los datos de tus clientes son información personal y comercial: definimos por escrito dónde se procesan.",
    ],
    firstStep: "El punto de entrada más frecuente es la recepción y clasificación de documentos (Sprint de automatización de un flujo, desde USD 5.500).",
    faq: [
      { q: "¿Se integra con el sistema contable que uso?", a: "No reemplazamos tu sistema contable. Preparamos y ordenamos la información para que la carga sea más rápida; si el sistema permite importar datos, lo aprovechamos." },
      { q: "¿Es seguro subir documentos de clientes a una IA?", a: "Depende de cómo se haga. Usamos servicios con condiciones empresariales que no entrenan modelos con tus datos, limitamos qué se envía y lo dejamos documentado. Subir documentos a una cuenta personal gratuita no es equivalente." },
    ],
  },
  {
    slug: "estudios-juridicos",
    short: "Estudios jurídicos",
    title: "Inteligencia Artificial para Estudios Jurídicos en Paraguay",
    description:
      "IA para estudios jurídicos en Paraguay: borradores a partir de los precedentes del estudio, resúmenes y comparación de documentos, con confidencialidad y revisión del abogado.",
    kicker: "Solución · Estudios jurídicos",
    h1: "IA para estudios jurídicos",
    lead: "Redactar, resumir y comparar documentos es donde los modelos de lenguaje mejor funcionan, y también donde un error cuesta más. Trabajamos sobre los documentos del propio estudio, con cita de la fuente y con el abogado como responsable final.",
    summary:
      "Borradores a partir de los precedentes del estudio, resúmenes y comparación de documentos.",
    today: [
      "Cada contrato nuevo empieza buscando “uno parecido” en carpetas compartidas.",
      "Leer un expediente largo para encontrar tres datos lleva una tarde.",
      "Comparar dos versiones de un documento se hace a ojo.",
    ],
    useCases: [
      { title: "Borradores desde los precedentes del estudio", body: "Un primer borrador armado con las cláusulas y modelos que el estudio ya usa.", check: "El asistente indica de qué documento salió cada parte." },
      { title: "Resumen de documentos y expedientes", body: "Resúmenes estructurados con partes, fechas, montos y obligaciones.", check: "Cada dato del resumen enlaza al pasaje original para verificarlo." },
      { title: "Comparación de versiones", body: "Qué cambió entre dos versiones y qué implican los cambios, en lenguaje claro.", check: "La comparación literal es determinística; la IA solo explica." },
      { title: "Clasificación de consultas entrantes", body: "Las consultas nuevas llegan ordenadas por área y urgencia, con los datos básicos.", check: "No se da asesoramiento legal automático a quien consulta." },
    ],
    limits: [
      "Un modelo de lenguaje puede citar normas o fallos que no existen. Por eso no lo usamos para investigación jurídica abierta sin verificación.",
      "No reemplaza la revisión del abogado: la responsabilidad profesional no se delega.",
      "La confidencialidad se resuelve antes que la tecnología: qué documentos entran, dónde se procesan y quién accede.",
    ],
    firstStep: "Lo habitual es un asistente de documentos sobre los precedentes del estudio (Sprint desde USD 3.500), empezando por un área de práctica.",
    faq: [
      { q: "¿Los documentos del estudio se usan para entrenar modelos?", a: "No. Trabajamos con servicios cuyas condiciones empresariales excluyen el entrenamiento con datos del cliente, y lo dejamos por escrito en el alcance." },
      { q: "¿Puede el asistente investigar jurisprudencia?", a: "No lo recomendamos como fuente única. Los modelos pueden producir citas inexistentes; el asistente que implementamos trabaja sobre los documentos del estudio y siempre muestra la fuente." },
    ],
  },
];

export const getSolution = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
