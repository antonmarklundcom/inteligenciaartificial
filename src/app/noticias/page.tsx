import { PostIndex } from "@/components/site/PostPages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "/noticias",
  "Noticias de Inteligencia Artificial para Empresas | Paraguay",
  "Noticias de inteligencia artificial que afectan a las empresas paraguayas: regulación, protección de datos, WhatsApp, modelos y precios. Con fuentes y sin exageraciones.",
);

export default function NewsIndex() {
  return (
    <PostIndex
      collection="noticias"
      kicker="Noticias"
      title="Noticias de inteligencia artificial, leídas desde Paraguay"
      lead="Qué pasó, de dónde sale el dato y qué cambia para una empresa paraguaya. Cada noticia enlaza sus fuentes; lo que no pudimos verificar, no se publica."
    />
  );
}
