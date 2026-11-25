import type { Metadata } from "next";
import Link from "next/link";
import { BrainCanvas } from "@/components/home/BrainCanvas";
import { CtaLink } from "@/components/site/CtaLink";
import { JsonLd } from "@/components/site/JsonLd";
import { PostCard } from "@/components/site/PostCard";
import { HOME_FAQ, METHOD, SERVICES, WE_DONT } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { getPosts } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { getContact } from "@/lib/site";
import "./home.css";

export const metadata: Metadata = pageMeta(
  "/",
  "Consultoría en Inteligencia Artificial para Empresas | Paraguay",
  "Consultoría e implementación de inteligencia artificial para empresas paraguayas: auditoría desde USD 1.500, un proceso a la vez, con alcance y precio cerrados.",
);

export default function Home() {
  const contact = getContact("el inicio");
  const news = getPosts("noticias").slice(0, 3);
  const guides = getPosts("guias").slice(0, 3);

  return (
    <div className="home">
      <BrainCanvas />
      <main className="home-main" id="contenido">
        <section className="hero" data-scene>
          <h1>
            Inteligencia
            <br />
            artificial
            <br />
            aplicada.
          </h1>
          <p className="kick">Consultoría e implementación para empresas paraguayas</p>
          <p className="lead">
            Identificamos qué procesos de tu empresa pueden automatizarse o asistirse con inteligencia artificial, y los
            implementamos con alcance y precio definidos antes de empezar.
          </p>
          <div className="actions">
            <CtaLink contact={contact} />
            <Link className="pill ghost" href="/precios">
              Ver precios
            </Link>
          </div>
        </section>

        <section className="second" data-scene>
          <div>
            <h2>
              Un proceso a la vez,
              <br />
              con precio cerrado
            </h2>
            <p>
              No vendemos “transformación digital”. Medimos cómo funciona hoy un proceso concreto —documentos,
              respuestas a clientes, seguimiento, reportes—, lo implementamos y lo volvemos a medir con vos.
            </p>
            <Link className="more" href="/metodo">
              Cómo trabajamos →
            </Link>
          </div>
        </section>

        <section className="third" data-scene aria-label="El problema">
          <p className="gap">
            Así se trabaja hoy. Consultas que entran por WhatsApp a cualquier hora y se pierden en el chat de alguien.
          </p>
          <p>Documentos que se reciben, se renombran y se cargan a mano, uno por uno, todos los meses.</p>
          <p className="gap">El mismo reporte armado desde cero cada semana, con datos copiados de tres planillas.</p>
          <p>Y las personas que más saben, ocupadas en tareas que no necesitan lo que saben.</p>
        </section>

        <section className="band" id="soluciones" aria-labelledby="soluciones-title">
          <div className="band-head">
            <div>
              <p className="kick">Soluciones</p>
              <h2 className="h2" id="soluciones-title">
                Dónde la IA sí resuelve algo
              </h2>
            </div>
            <p className="sub">Tres rubros y un canal: los que conocemos y donde el resultado se puede medir.</p>
          </div>
          <div className="grid four">
            {SOLUTIONS.map((s) => (
              <article className="card" key={s.slug}>
                <h3>
                  <Link href={`/soluciones/${s.slug}`}>{s.short}</Link>
                </h3>
                <p>{s.summary}</p>
                <span className="more">Ver casos de uso →</span>
              </article>
            ))}
          </div>
        </section>

        <section className="band" id="servicios" aria-labelledby="servicios-title">
          <div className="band-head">
            <div>
              <p className="kick">Servicios y precios</p>
              <h2 className="h2" id="servicios-title">
                Precio cerrado, antes de empezar
              </h2>
            </div>
            <p className="sub">
              Empezamos con una auditoría acotada y, si tiene sentido, implementamos un proceso a la vez. Sin contratos
              abiertos ni sorpresas en la factura.
            </p>
          </div>
          <div className="grid four">
            {SERVICES.map((s) => (
              <article className={`card${s.featured ? " featured" : ""}`} key={s.slug}>
                <p className="meta">
                  <b>{s.step}</b> {s.term}
                </p>
                <h3>
                  <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
                </h3>
                <p className="price">
                  {s.price}
                  <small>desde · {s.priceGs}</small>
                </p>
                <p>{s.summary}</p>
                {s.note ? <p className="note">{s.note}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="band" id="herramientas" aria-labelledby="herramientas-title">
          <div className="band-head">
            <div>
              <p className="kick">Herramienta gratuita</p>
              <h2 className="h2" id="herramientas-title">
                ¿Cuánto te cuesta esa tarea que se repite?
              </h2>
            </div>
          </div>
          <div className="grid two">
            <article className="card featured">
              <h3>
                <Link href="/herramientas/calculadora-de-tareas-repetitivas">Calculadora de tareas repetitivas</Link>
              </h3>
              <p>
                Cargá cuántas personas hacen la tarea, cuánto tardan y cada cuánto. Te mostramos las horas y el costo
                anual en guaraníes, con la fórmula y los supuestos a la vista. Sin registro.
              </p>
              <span className="more">Calcular ahora →</span>
            </article>
            <article className="card">
              <p className="meta">
                <b>Próximamente</b>
              </p>
              <h3>Diagnóstico de Madurez en IA</h3>
              <p>24 preguntas para saber por dónde empezar, con resultado en pantalla y gratuito.</p>
            </article>
          </div>
        </section>

        <section className="band" aria-labelledby="metodo-title">
          <div className="band-head">
            <div>
              <p className="kick">Método</p>
              <h2 className="h2" id="metodo-title">
                Así trabajamos
              </h2>
            </div>
            <p className="sub">
              La inteligencia artificial redacta, resume y clasifica. Los números, las prioridades y las decisiones
              salen de una medición, no de un modelo de lenguaje.
            </p>
          </div>
          <ol className="grid four steps">
            {METHOD.map((m) => (
              <li className="card" key={m.title}>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="band" aria-labelledby="novedades-title">
          <div className="band-head">
            <div>
              <p className="kick">Noticias y guías</p>
              <h2 className="h2" id="novedades-title">
                Lo que cambia en IA, leído desde Paraguay
              </h2>
            </div>
            <div className="actions">
              <Link className="pill ghost" href="/noticias">
                Todas las noticias
              </Link>
              <Link className="pill ghost" href="/blog">
                Todas las guías
              </Link>
            </div>
          </div>
          <div className="grid three">
            {[...news, ...guides].map((post) => (
              <PostCard key={post.url} post={post} />
            ))}
          </div>
        </section>

        <section className="band" aria-labelledby="no-title">
          <div className="split">
            <div>
              <p className="kick">Límites</p>
              <h2 className="h2" id="no-title" style={{ marginTop: 12 }}>
                Lo que no hacemos
              </h2>
              <p className="sub">
                Decir que no a tiempo también es parte del trabajo. Si tu proyecto está en esta lista, te lo decimos en
                la primera conversación.
              </p>
            </div>
            <ul className="crosses card">
              {WE_DONT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band" aria-labelledby="faq-title">
          <p className="kick">Preguntas frecuentes</p>
          <h2 className="h2" id="faq-title" style={{ marginTop: 12 }}>
            Antes de escribirnos
          </h2>
          <div className="faq">
            {HOME_FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="finale" id="contacto" data-scene-finale aria-labelledby="contacto-title">
          <div>
            <p className="kick">Gran Asunción y Ciudad del Este</p>
            <h2 className="h2" id="contacto-title">
              Contanos qué proceso te quita más tiempo
            </h2>
            <p>
              Escribinos con el proceso concreto, el plazo y quién decide en tu empresa. Te respondemos si podemos
              ayudarte y cuál sería el primer paso. Si no es para nosotros, también te lo decimos.
            </p>
            <div className="actions">
              <CtaLink contact={contact} />
              {contact.email ? (
                <a className="pill ghost" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HOME_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
