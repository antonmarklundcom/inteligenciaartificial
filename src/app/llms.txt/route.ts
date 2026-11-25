import { SERVICES } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { getPosts } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Plain-text map of the site for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const line = (path: string, title: string, note: string) => `- [${title}](${absoluteUrl(path)}): ${note}`;
  const body = `# ${SITE.name}

> ${SITE.description} Atiende en Gran Asunción y Ciudad del Este a empresas de 10 a 150 personas. Los precios publicados son valores de partida en dólares con referencia en guaraníes.

## Servicios
${SERVICES.map((s) => line(`/servicios/${s.slug}`, s.name, `desde ${s.price} (${s.priceGs}); ${s.term}. ${s.summary}`)).join("\n")}
${line("/precios", "Precios", "todos los precios de partida y lo que no incluyen.")}

## Soluciones
${SOLUTIONS.map((s) => line(`/soluciones/${s.slug}`, s.h1, s.summary)).join("\n")}

## Herramientas
${line("/herramientas/calculadora-de-tareas-repetitivas", "Calculadora de costo de tareas repetitivas", "gratuita, sin registro; horas y costo anual en guaraníes de una tarea manual.")}

## Guías
${getPosts("guias").map((p) => line(p.url, p.title, p.description)).join("\n")}

## Noticias
${getPosts("noticias").map((p) => line(p.url, p.title, `${p.date}. ${p.description}`)).join("\n")}

## Empresa
${line("/metodo", "Cómo trabajamos", "método en cuatro pasos y qué se mide.")}
${line("/que-no-hacemos", "Qué no hacemos", "proyectos que no se aceptan y por qué.")}
${line("/contacto", "Contacto", "WhatsApp y correo.")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
