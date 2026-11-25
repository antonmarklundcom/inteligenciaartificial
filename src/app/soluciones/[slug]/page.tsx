import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs, CtaBand, FaqBlock } from "@/components/site/Page";
import { SOLUTIONS, getSolution } from "@/content/solutions";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SOLUTIONS.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props) {
  const solution = getSolution((await params).slug);
  if (!solution) return {};
  return pageMeta(`/soluciones/${solution.slug}`, solution.title, solution.description);
}

export default async function SolutionPage({ params }: Props) {
  const solution = getSolution((await params).slug);
  if (!solution) notFound();
  const others = SOLUTIONS.filter((s) => s.slug !== solution.slug);

  return (
    <main className="page" id="contenido">
      <Crumbs
        items={[
          { href: "/servicios", label: "Servicios" },
          { href: `/soluciones/${solution.slug}`, label: solution.short },
        ]}
      />
      <p className="kick">{solution.kicker}</p>
      <h1>{solution.h1}</h1>
      <p className="lead">{solution.lead}</p>

      <section className="block">
        <h2>Cómo se trabaja hoy</h2>
        <ul className="crosses">
          {solution.today.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2>Dónde ayuda la IA</h2>
        <p>Cada caso de uso con su control: qué revisa una persona y qué no se delega.</p>
        <div className="grid two">
          {solution.useCases.map((u) => (
            <article className="card" key={u.title}>
              <h3>{u.title}</h3>
              <p>{u.body}</p>
              <p className="note">
                <strong style={{ color: "var(--teal)", fontWeight: 500 }}>Control:</strong> {u.check}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>Dónde no funciona</h2>
        <ul className="crosses">
          {solution.limits.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2>Por dónde empezar</h2>
        <p>{solution.firstStep}</p>
        <div className="actions">
          <Link className="pill ghost" href="/servicios/auditoria-de-ia">
            Auditoría de IA
          </Link>
          <Link className="pill ghost" href="/servicios/implementacion">
            Sprint de Implementación
          </Link>
          <Link className="pill ghost" href="/herramientas/calculadora-de-tareas-repetitivas">
            Calcular el costo de una tarea
          </Link>
        </div>
      </section>

      <FaqBlock items={solution.faq} />

      <section className="block">
        <h2>Otras soluciones</h2>
        <div className="grid three">
          {others.map((s) => (
            <article className="card" key={s.slug}>
              <h3>
                <Link href={`/soluciones/${s.slug}`}>{s.h1}</Link>
              </h3>
              <p>{s.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand context={`la página de ${solution.short}`} secondary={{ href: "/precios", label: "Ver precios" }} />
    </main>
  );
}
