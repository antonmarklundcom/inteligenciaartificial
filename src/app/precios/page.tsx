import Link from "next/link";
import { Crumbs, CtaBand, FaqBlock } from "@/components/site/Page";
import { SERVICES } from "@/content/services";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/precios",
  "Precios de Consultoría en Inteligencia Artificial | Paraguay",
  "Cuánto cuesta la consultoría y la implementación de IA en Paraguay: auditoría desde USD 1.500, talleres desde USD 900 y Sprints de USD 3.500 a 7.500. Precios publicados.",
);

const FAQ = [
  { q: "¿Por qué publican los precios?", a: "Porque ahorra tiempo a las dos partes. Si el precio de partida está fuera de tu presupuesto, es mejor saberlo antes de la primera reunión." },
  { q: "¿Los precios incluyen IVA?", a: "Los valores publicados son de partida y no incluyen IVA. La cotización final lo detalla, junto con la forma de pago." },
  { q: "¿Qué son los costos mensuales de terceros?", a: "Lo que cobran los proveedores de tecnología por el uso: la API del modelo de lenguaje, las conversaciones de WhatsApp Business, el hosting y eventuales licencias. Los paga el cliente directamente y los estimamos por escrito antes de empezar, porque dependen del volumen." },
  { q: "¿En qué moneda se factura?", a: "En guaraníes o en dólares, según se acuerde. Los valores en guaraníes son una referencia que se revisa periódicamente con el tipo de cambio." },
  { q: "¿Hacen descuentos?", a: "No bajamos de los precios de partida. Lo que sí hacemos es ajustar el alcance: menos procesos en la auditoría o una primera etapa más chica en el Sprint." },
];

export default function PricingPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/precios", label: "Precios" }]} />
      <p className="kick">Precios</p>
      <h1>Cuánto cuesta trabajar con nosotros</h1>
      <p className="lead">
        Todos los precios son valores de partida con el alcance indicado. La cotización final se entrega por escrito
        antes de empezar y no cambia durante el trabajo, salvo que vos pidas cambiar el alcance.
      </p>

      {SERVICES.map((s) => (
        <section className="block" key={s.slug}>
          <h2>
            <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
          </h2>
          <p>{s.summary}</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Opción</th>
                  <th scope="col">Alcance</th>
                  <th scope="col">Plazo</th>
                  <th scope="col">Desde (USD)</th>
                  <th scope="col">Referencia (Gs.)</th>
                </tr>
              </thead>
              <tbody>
                {(s.tiers ?? [{ name: s.short, scope: "De 3 a 5 procesos, informe escrito y presentación.", price: s.price, priceGs: s.priceGs, term: "3 semanas" }]).map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td>{t.scope}</td>
                    <td className="num">{t.term}</td>
                    <td className="num">{t.price}</td>
                    <td className="num">{t.priceGs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="block">
        <h2>Lo que el precio no incluye</h2>
        <ul className="crosses">
          <li>Costos mensuales de terceros: API de modelos, WhatsApp Business, hosting y licencias. Se estiman por escrito antes de empezar.</li>
          <li>Cambios fuera del alcance firmado, que se cotizan como orden de cambio.</li>
          <li>Traslados fuera de Gran Asunción y Ciudad del Este.</li>
        </ul>
        <p className="sub">
          ¿Querés saber si el número cierra? Calculá primero cuánto te cuesta hoy la tarea con la{" "}
          <Link href="/herramientas/calculadora-de-tareas-repetitivas" style={{ color: "var(--teal)", textDecoration: "underline" }}>
            calculadora de tareas repetitivas
          </Link>
          .
        </p>
      </section>
      <FaqBlock items={FAQ} title="Preguntas sobre precios" />
      <CtaBand context="la página de precios" secondary={{ href: "/servicios", label: "Ver servicios" }} />
    </main>
  );
}
