import Link from "next/link";
import { Crumbs, CtaBand } from "@/components/site/Page";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/que-no-hacemos",
  "Qué No Hacemos | Consultoría de IA en Paraguay",
  "Los proyectos de inteligencia artificial que no aceptamos y por qué: sin alcance definido, vigilancia, decisiones sin revisión humana o reducción de personal.",
);

const ITEMS = [
  { title: "“Transformación digital” sin alcance", body: "Si no se puede escribir qué entra, qué no y cómo se mide, no se puede cotizar a precio cerrado. Y sin precio cerrado, el riesgo es todo tuyo." },
  { title: "Reventa de chatbots o software genérico", body: "Si un producto estándar resuelve tu problema, te conviene comprarlo directo. Te lo decimos y, si querés, te ayudamos a elegirlo en una auditoría." },
  { title: "CRMs, ERPs y sistemas contables", body: "Nos conectamos con los que ya tenés. Construir uno es otro oficio, con otros plazos y otro mantenimiento." },
  { title: "Decisiones tributarias, legales, médicas o financieras automáticas", body: "La IA puede preparar el borrador. La decisión la confirma una persona con matrícula o con responsabilidad sobre el resultado." },
  { title: "Reconocimiento facial, vigilancia de empleados y listas de datos personales", body: "Son usos con riesgo alto para las personas y, cada vez más, con consecuencias legales. No los hacemos." },
  { title: "Proyectos para reducir personal", body: "Trabajamos para sacar tareas repetitivas del día de tu equipo, no para justificar despidos. Si ese es el objetivo principal, no somos el proveedor." },
  { title: "Ahorros garantizados y pruebas inventadas", body: "No prometemos porcentajes de ahorro ni mostramos clientes, logos o testimonios que no tenemos. Medimos antes y después, y te mostramos el resultado." },
];

export default function NotPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/que-no-hacemos", label: "Qué no hacemos" }]} />
      <p className="kick">Límites</p>
      <h1>Lo que no hacemos</h1>
      <p className="lead">
        Decir que no a tiempo también es parte del trabajo. Si tu proyecto está en esta lista, te lo decimos en la
        primera conversación, y casi siempre podemos indicarte quién sí lo hace.
      </p>
      <div className="grid two">
        {ITEMS.map((i) => (
          <article className="card" key={i.title}>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{i.title}</h2>
            <p>{i.body}</p>
          </article>
        ))}
      </div>
      <section className="block">
        <h2>Lo que sí hacemos</h2>
        <p>
          Procesos concretos, de a uno, con alcance y precio cerrados: mirá los{" "}
          <Link href="/servicios" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            servicios
          </Link>{" "}
          y el{" "}
          <Link href="/metodo" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            método
          </Link>
          .
        </p>
      </section>
      <CtaBand context="la página de qué no hacemos" />
    </main>
  );
}
