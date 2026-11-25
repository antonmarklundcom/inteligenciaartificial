import Link from "next/link";
import { Crumbs, CtaBand } from "@/components/site/Page";
import { METHOD } from "@/content/services";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/metodo",
  "Cómo Trabajamos: Método de Implementación de IA | Paraguay",
  "Nuestro método para implementar inteligencia artificial en empresas: entender el proceso, medir antes de proponer, priorizar con criterio e implementar de a un proceso.",
);

const PRINCIPLES = [
  { title: "Los números no los escribe un modelo", body: "La IA redacta, resume y clasifica. Las mediciones, las prioridades y los puntajes salen de reglas fijas y de datos de tu operación." },
  { title: "Una persona confirma lo que importa", body: "Nada tributario, legal, médico o financiero sale sin revisión humana. El diseño define quién revisa qué, y eso queda escrito." },
  { title: "Datos mínimos", body: "Se usa la información necesaria para el proceso y nada más. Definimos por escrito dónde se procesa y quién accede." },
  { title: "Costos a la vista", body: "Cada propuesta separa el costo de implementación de los costos mensuales de terceros, con el volumen que los explica." },
  { title: "Sin dependencia", body: "Entregamos documentación para que tu equipo, u otro proveedor, pueda operar y mantener lo implementado." },
  { title: "Decir que no", body: "Si la IA no es la herramienta para ese proceso, lo decimos. A veces una planilla bien armada resuelve más." },
];

export default function MethodPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/metodo", label: "Método" }]} />
      <p className="kick">Método</p>
      <h1>Cómo trabajamos</h1>
      <p className="lead">
        Cuatro pasos, siempre en el mismo orden. El método es público porque es lo que comprás: no una tecnología, sino
        una forma de decidir dónde usarla y de comprobar si funcionó.
      </p>
      <ol className="grid two steps">
        {METHOD.map((m) => (
          <li className="card" key={m.title}>
            <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{m.title}</h2>
            <p>{m.body}</p>
          </li>
        ))}
      </ol>

      <section className="block">
        <h2>Qué medimos</h2>
        <p>Los mismos cuatro indicadores antes y después, para que la comparación sea honesta.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Indicador</th>
                <th scope="col">Cómo se obtiene</th>
                <th scope="col">Qué pasa si no hay dato</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Volumen</td>
                <td>Conteo de casos por semana en tus sistemas, casillas o chats.</td>
                <td>Se muestrea dos semanas.</td>
              </tr>
              <tr>
                <td>Tiempo</td>
                <td>Minutos por caso, observados con quien hace el trabajo.</td>
                <td>Se estima con el equipo y se marca como estimación.</td>
              </tr>
              <tr>
                <td>Errores</td>
                <td>Casos que hubo que rehacer o que generaron un reclamo.</td>
                <td>Se registra durante el relevamiento.</td>
              </tr>
              <tr>
                <td>Costo</td>
                <td>Horas por costo horario cargado, con la misma fórmula de nuestra calculadora.</td>
                <td>Se usa un rango.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="sub">
          La fórmula es la de la{" "}
          <Link href="/herramientas/calculadora-de-tareas-repetitivas" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            calculadora de tareas repetitivas
          </Link>
          , que podés usar sin registrarte.
        </p>
      </section>

      <section className="block">
        <h2>Principios que no negociamos</h2>
        <div className="grid three">
          {PRINCIPLES.map((p) => (
            <article className="card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand context="la página de método" secondary={{ href: "/servicios/auditoria-de-ia", label: "Ver la auditoría" }} />
    </main>
  );
}
