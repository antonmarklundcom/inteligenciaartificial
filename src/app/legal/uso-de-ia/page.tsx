import Link from "next/link";
import { Crumbs } from "@/components/site/Page";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/legal/uso-de-ia",
  "Cómo Usamos la Inteligencia Artificial en este Sitio",
  "Dónde usamos inteligencia artificial en este sitio y en nuestro trabajo, y dónde no: los cálculos son deterministas y las noticias se publican con fuentes verificables.",
);

export default function AiUsePage() {
  return (
    <main className="page page-narrow" id="contenido">
      <Crumbs items={[{ href: "/legal/uso-de-ia", label: "Cómo usamos la IA" }]} />
      <p className="kick">Transparencia</p>
      <h1>Cómo usamos la inteligencia artificial</h1>
      <div className="prose">
        <p>Le pedimos a nuestros clientes que sepan dónde interviene la IA en sus procesos. Corresponde decir lo mismo de los nuestros.</p>
        <h2>En el contenido</h2>
        <ul>
          <li>
            Las <Link href="/noticias">noticias</Link> y las <Link href="/blog">guías</Link> se redactan con asistencia de modelos de lenguaje. Cada dato de una noticia tiene que
            estar respaldado por una fuente enlazada al pie; lo que no se puede verificar no se publica.
          </li>
          <li>No inventamos estadísticas, clientes, testimonios ni casos de éxito.</li>
          <li>Cuando una afirmación es nuestra opinión o nuestra experiencia, lo decimos.</li>
        </ul>
        <h2>En las herramientas</h2>
        <ul>
          <li>
            La <Link href="/herramientas/calculadora-de-tareas-repetitivas">calculadora de tareas repetitivas</Link> no usa IA: es aritmética, con la fórmula publicada.
          </li>
          <li>En las herramientas de diagnóstico, los puntajes se calculan con reglas fijas. Un modelo de lenguaje nunca asigna un puntaje.</li>
        </ul>
        <h2>En el sitio</h2>
        <p>
          La animación de la página de inicio —un cerebro de diez mil pirámides que se reagrupa como el mapa del
          Paraguay— es código y geometría, no una imagen generada.
        </p>
        <h2>En el trabajo con clientes</h2>
        <p>
          Usamos modelos de lenguaje para redactar, resumir y clasificar, con servicios cuyas condiciones excluyen el
          entrenamiento con datos del cliente. Las mediciones, las prioridades y las recomendaciones las firma una
          persona. Más detalle en <Link href="/metodo">cómo trabajamos</Link>.
        </p>
      </div>
    </main>
  );
}
