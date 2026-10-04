// Static content below the scroll-driven hero. Copy follows docs/00, 02 and 17:
// real starting prices, published scope boundaries, no fabricated proof.

const OFFERS = [
  {
    step: "01",
    name: "Auditoría de Oportunidades de IA",
    price: "USD 1.500",
    term: "3 semanas · precio cerrado",
    body: "Analizamos de 3 a 5 procesos de tu empresa, medimos cómo funcionan hoy y te entregamos un informe escrito con las oportunidades priorizadas, sus costos —incluidos los recurrentes— y lo que recomendamos no hacer.",
    note: "Si al finalizar considerás que el informe no identifica ninguna oportunidad aplicable a tu empresa, te devolvemos el importe.",
    featured: true,
  },
  {
    step: "02",
    name: "Sprint de Implementación",
    price: "USD 3.500 – 7.500",
    term: "4 a 6 semanas · un proceso",
    body: "Una solución funcionando en producción para un proceso, con documentación, capacitación para quienes la usan, 30 días de soporte y la medición del proceso antes y después.",
  },
  {
    step: "03",
    name: "Retainer de Optimización",
    price: "USD 800 – 2.500 / mes",
    term: "Solo después de un Sprint",
    body: "Monitoreo y revisión mensual de lo implementado, una bolsa de horas para cambios, reporte de uso y costos, y revisión trimestral de nuevas oportunidades.",
  },
  {
    step: "—",
    name: "Taller para equipos",
    price: "USD 900 – 1.600",
    term: "Medio día o día completo",
    body: "Práctica con las tareas reales de tu equipo, guía de prompts por función y un borrador de Política de Uso de IA para la empresa.",
  },
];

const METHOD = [
  {
    title: "Entendemos el proceso",
    body: "Entrevistas con quienes hacen el trabajo y observación del proceso tal como funciona hoy, no como figura en el manual.",
  },
  {
    title: "Medimos antes de proponer",
    body: "Volumen, tiempo, errores y costo. Cuando algo no se puede medir, lo estimamos y lo marcamos como estimación.",
  },
  {
    title: "Priorizamos con criterio",
    body: "Cada oportunidad se clasifica por impacto, esfuerzo y riesgo, y se verifica que los sistemas y los datos lo permitan.",
  },
  {
    title: "Implementamos de a un proceso",
    body: "Alcance y precio por escrito antes de empezar. Un proceso, en producción, medido con vos antes y después.",
  },
];

const WE_DONT = [
  "No vendemos “transformación digital” ni proyectos sin alcance definido.",
  "No revendemos chatbots ni software genérico de terceros.",
  "No construimos CRMs, ERPs ni sistemas contables.",
  "No automatizamos decisiones tributarias, legales, médicas o financieras sin una persona que las confirme.",
  "No hacemos reconocimiento facial, vigilancia de empleados ni listas de datos personales.",
  "No aceptamos proyectos cuyo objetivo principal sea reducir personal.",
  "No prometemos ahorros garantizados ni mostramos clientes, logos o testimonios que no tenemos.",
];

type Props = {
  contactHref: string;
  contactLabel: string;
  email?: string;
};

export function HomeSections({ contactHref, contactLabel, email }: Props) {
  const external = contactHref.startsWith("http");
  const hasDirectContact = external || !!email;

  return (
    <div className="content">
      <section className="content-section" id="servicios" aria-labelledby="servicios-title">
        <header className="section-head">
          <span className="kicker">
            <i />
            Servicios y precios
          </span>
          <h2 id="servicios-title" className="section-title">
            Precio cerrado, antes de empezar
          </h2>
          <p className="section-lead">
            Empezamos con una auditoría acotada y, si tiene sentido, implementamos un proceso a la vez. Sin
            contratos abiertos ni sorpresas en la factura.
          </p>
        </header>
        <div className="offer-grid">
          {OFFERS.map((offer) => (
            <article key={offer.name} className={`glass-card offer${offer.featured ? " is-featured" : ""}`}>
              <div className="offer-top">
                <span className="offer-step">{offer.step}</span>
                <span className="offer-term">{offer.term}</span>
              </div>
              <h3>{offer.name}</h3>
              <p className="offer-price">
                <small>desde</small> {offer.price}
              </p>
              <p>{offer.body}</p>
              {offer.note ? <p className="offer-note">{offer.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="metodo" aria-labelledby="metodo-title">
        <header className="section-head">
          <span className="kicker">
            <i />
            Método
          </span>
          <h2 id="metodo-title" className="section-title">
            Así trabajamos
          </h2>
          <p className="section-lead">
            La inteligencia artificial redacta, resume y clasifica. Los números, las prioridades y las decisiones salen
            de una medición, no de un modelo de lenguaje.
          </p>
        </header>
        <ol className="method-list">
          {METHOD.map((m, i) => (
            <li key={m.title} className="glass-card">
              <span className="method-index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section" id="que-no-hacemos" aria-labelledby="no-title">
        <div className="split">
          <header className="section-head">
            <span className="kicker">
              <i />
              Límites
            </span>
            <h2 id="no-title" className="section-title">
              Lo que no hacemos
            </h2>
            <p className="section-lead">
              Decir que no a tiempo también es parte del trabajo. Si tu proyecto está en esta lista, te lo decimos en
              la primera conversación.
            </p>
          </header>
          <ul className="no-list">
            {WE_DONT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-section cta-section" id="contacto" aria-labelledby="contacto-title">
        <div className="glass-card cta-card">
          <picture className="cta-backdrop">
            <source
              type="image/avif"
              srcSet="/img/ondas-de-luz-agua-petalos-lapacho-640.avif 640w, /img/ondas-de-luz-agua-petalos-lapacho-1280.avif 1280w, /img/ondas-de-luz-agua-petalos-lapacho-1920.avif 1920w"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <source
              type="image/webp"
              srcSet="/img/ondas-de-luz-agua-petalos-lapacho-640.webp 640w, /img/ondas-de-luz-agua-petalos-lapacho-1280.webp 1280w, /img/ondas-de-luz-agua-petalos-lapacho-1920.webp 1920w"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <img
              src="/img/ondas-de-luz-agua-petalos-lapacho-1280.webp"
              alt=""
              width={1920}
              height={823}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="kicker">
            <i />
            Contacto
          </span>
          <h2 id="contacto-title" className="section-title">
            Contanos qué proceso te quita más tiempo
          </h2>
          <p className="section-lead">
            Escribinos con el proceso concreto, el plazo y quién decide en tu empresa. Te respondemos si podemos
            ayudarte y cuál sería el primer paso. Si no es para nosotros, también te lo decimos.
          </p>
          {hasDirectContact ? (
            <div className="actions">
              {external ? (
                <a className="pill primary" href={contactHref} target="_blank" rel="noopener noreferrer">
                  {contactLabel}
                </a>
              ) : null}
              {email ? (
                <a className="pill light" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : null}
            </div>
          ) : (
            <p className="cta-pending">Los datos de contacto se publican en los próximos días.</p>
          )}
          <p className="cta-soon">
            Próximamente: <strong>Diagnóstico de Madurez en IA</strong>, 24 preguntas para saber por dónde empezar, con
            resultado en pantalla y gratuito.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <p>
          <strong>inteligenciaartificial.com.py</strong> · Consultoría e implementación de inteligencia artificial ·
          Asunción, Paraguay
        </p>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
