import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { Crumbs, CtaBand, FaqBlock } from "@/components/site/Page";
import { Calculator } from "@/components/tools/Calculator";
import { pageMeta } from "@/lib/meta";
import { absoluteUrl } from "@/lib/site";

const PATH = "/herramientas/calculadora-de-tareas-repetitivas";

export const metadata = pageMeta(
  PATH,
  "Calculadora de Costo de Tareas Repetitivas Gratis | Paraguay",
  "Calculá cuántas horas y cuántos guaraníes por año le cuesta a tu empresa una tarea manual repetitiva. Gratis, sin registro, con la fórmula y los supuestos a la vista.",
);

const FAQ = [
  { q: "¿Cómo se calcula el costo de una tarea repetitiva?", a: "Se multiplican las personas, los minutos por vez y las veces por semana por 48 semanas trabajadas, y se divide por 60 para obtener horas por año. Esas horas se multiplican por el costo por hora, que es el salario mensual con cargas dividido por 160 horas." },
  { q: "¿Qué salario tengo que cargar?", a: "El costo real para la empresa: salario más aporte patronal y aguinaldo prorrateado. Si varias personas con salarios distintos hacen la tarea, usá el promedio." },
  { q: "¿Qué es la “porción abordable”?", a: "Es la parte de la tarea que vos estimás como mecánica, multiplicada por un rango de 50% a 90%. Sirve para saber si vale la pena analizar la tarea. No es una promesa de ahorro: no descuenta lo que cuesta implementar y mantener una solución." },
  { q: "¿Guardan los datos que cargo?", a: "No. El cálculo se hace en tu navegador y no enviamos ni almacenamos el salario ni los demás datos." },
  { q: "¿A partir de qué número conviene automatizar?", a: "No hay un umbral universal. Como referencia, compará la porción abordable anual con el costo de un Sprint de Implementación (desde USD 3.500) más los costos mensuales. Si la tarea cuesta menos que eso en un año, probablemente convenga simplificarla antes que automatizarla." },
];

export default function CalculatorPage() {
  return (
    <main className="page" id="contenido">
      <Crumbs
        items={[
          { href: "/herramientas", label: "Herramientas" },
          { href: PATH, label: "Calculadora de tareas repetitivas" },
        ]}
      />
      <p className="kick">Herramienta gratuita · Sin registro</p>
      <h1>Calculadora de costo de tareas repetitivas</h1>
      <p className="lead">
        “Sé que perdemos tiempo, pero no sé cuánto cuesta.” Cargá los datos de una tarea que se repite y mirá las horas
        y los guaraníes por año. La cuenta es simple y está a la vista.
      </p>
      <Calculator />

      <section className="block">
        <h2>Cómo usar el resultado</h2>
        <ul className="ticks">
          <li>Repetí el cálculo para tres o cuatro tareas: casi siempre una sola concentra la mayor parte del costo.</li>
          <li>Validá los minutos con quien hace la tarea. Las estimaciones de la dirección suelen quedar cortas.</li>
          <li>
            Si una tarea supera con claridad el costo de implementarla, es candidata para una{" "}
            <Link href="/servicios/auditoria-de-ia" style={{ color: "var(--teal)", textDecoration: "underline" }}>
              Auditoría de Oportunidades de IA
            </Link>
            , donde medimos el proceso completo.
          </li>
          <li>
            Si ya está claro cuál es el proceso, mirá el{" "}
            <Link href="/servicios/implementacion" style={{ color: "var(--teal)", textDecoration: "underline" }}>
              Sprint de Implementación
            </Link>
            .
          </li>
        </ul>
      </section>
      <FaqBlock items={FAQ} title="Preguntas sobre la calculadora" />
      <CtaBand
        title="¿El número te llamó la atención?"
        body="Mandanos la tarea y el resultado que te dio. Te decimos si es un caso para automatizar, para simplificar o para dejar como está."
        context="la calculadora de tareas repetitivas"
        secondary={{ href: "/precios", label: "Ver precios" }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Calculadora de costo de tareas repetitivas",
          url: absoluteUrl(PATH),
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "es-PY",
          offers: { "@type": "Offer", price: 0, priceCurrency: "PYG" },
        }}
      />
    </main>
  );
}
