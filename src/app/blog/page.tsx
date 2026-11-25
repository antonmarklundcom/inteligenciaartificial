import { PostIndex } from "@/components/site/PostPages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/blog",
  "Guías de Inteligencia Artificial para Empresas Paraguayas",
  "Guías prácticas sobre inteligencia artificial para empresas paraguayas: costos, por dónde empezar, riesgos, WhatsApp, datos y política de uso. Sin marketing.",
);

export default function GuidesIndex() {
  return (
    <PostIndex
      collection="guias"
      kicker="Guías"
      title="Guías para decidir sobre IA en tu empresa"
      lead="Respuestas largas a las preguntas que nos hacen antes de contratar: cuánto cuesta, por dónde empezar, qué puede salir mal y cuándo no conviene."
    />
  );
}
