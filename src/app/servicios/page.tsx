import Link from "next/link";
import { Crumbs, CtaBand } from "@/components/site/Page";
import { SERVICES } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/servicios",
  "Servicios de Inteligencia Artificial para Empresas | Paraguay",
  "Auditoría, implementación, capacitación y soporte de inteligencia artificial para empresas paraguayas. Cuatro servicios con alcance, plazo y precio publicados.",
);

export default function ServicesPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/servicios", label: "Servicios" }]} />
      <p className="kick">Servicios</p>
      <h1>Servicios de inteligencia artificial para empresas</h1>
      <p className="lead">
        Cuatro servicios, cada uno con su alcance, su plazo y su precio de partida publicados. El camino habitual es
        auditoría, después un Sprint sobre el proceso que más rinde y, si la solución queda en uso, soporte mensual. El
        taller funciona como entrada independiente.
      </p>
      <div className="grid two">
        {SERVICES.map((s) => (
          <article className={`card${s.featured ? " featured" : ""}`} key={s.slug}>
            <p className="meta">
              <b>{s.step}</b> {s.term}
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>
              <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
            </h2>
            <p className="price">
              {s.price}
              <small>desde · {s.priceGs}</small>
            </p>
            <p>{s.summary}</p>
            <Link className="more" href={`/servicios/${s.slug}`}>
              Alcance, entregables y preguntas →
            </Link>
          </article>
        ))}
      </div>

      <section className="block">
        <h2>Por rubro y por canal</h2>
        <p>Los mismos servicios, aplicados a los procesos que conocemos mejor.</p>
        <div className="grid four">
          {SOLUTIONS.map((s) => (
            <article className="card" key={s.slug}>
              <h3>
                <Link href={`/soluciones/${s.slug}`}>{s.h1}</Link>
              </h3>
              <p>{s.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>¿No sabés por cuál empezar?</h2>
        <p>
          Medí primero cuánto te cuesta la tarea que más se repite con la{" "}
          <Link href="/herramientas/calculadora-de-tareas-repetitivas" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            calculadora de tareas repetitivas
          </Link>
          . Si el número justifica mirar más de cerca, la auditoría es el paso siguiente. También podés leer{" "}
          <Link href="/metodo" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            cómo trabajamos
          </Link>{" "}
          y{" "}
          <Link href="/que-no-hacemos" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            qué no hacemos
          </Link>
          .
        </p>
      </section>
      <CtaBand context="la página de servicios" secondary={{ href: "/precios", label: "Ver todos los precios" }} />
    </main>
  );
}
