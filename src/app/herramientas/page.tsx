import Link from "next/link";
import { Crumbs, CtaBand } from "@/components/site/Page";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/herramientas",
  "Herramientas de IA Gratis para Empresas Paraguayas",
  "Herramientas gratuitas y sin registro para empresas paraguayas: calculadora del costo de tareas repetitivas y, próximamente, diagnóstico de madurez en IA.",
);

export default function ToolsPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/herramientas", label: "Herramientas" }]} />
      <p className="kick">Herramientas gratuitas</p>
      <h1>Herramientas para decidir con números</h1>
      <p className="lead">
        Sin registro y sin inteligencia artificial donde no hace falta: son cálculos simples, con la fórmula y los
        supuestos a la vista, para que llegues a cualquier conversación con un dato propio.
      </p>
      <div className="grid two">
        <article className="card featured">
          <p className="meta">
            <b>Disponible</b> Sin registro
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>
            <Link href="/herramientas/calculadora-de-tareas-repetitivas">Calculadora de costo de tareas repetitivas</Link>
          </h2>
          <p>Horas y costo anual en guaraníes de una tarea que se repite, y qué parte podría abordarse.</p>
          <span className="more">Abrir la calculadora →</span>
        </article>
        <article className="card">
          <p className="meta">
            <b>Próximamente</b>
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>Diagnóstico de Madurez en IA</h2>
          <p>24 preguntas para saber por dónde empezar. Resultado en pantalla y gratuito; el informe en PDF, por correo.</p>
        </article>
        <article className="card">
          <p className="meta">
            <b>Próximamente</b>
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>Biblioteca de prompts por función</h2>
          <p>Prompts probados para administración, ventas, atención al cliente y áreas profesionales, en español paraguayo.</p>
        </article>
      </div>
      <CtaBand context="la página de herramientas" secondary={{ href: "/blog", label: "Leer las guías" }} />
    </main>
  );
}
