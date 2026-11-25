import type { MetadataRoute } from "next";
import { SERVICES } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = [...getPosts("noticias"), ...getPosts("guias")];
  const newest = posts.map((p) => p.updated ?? p.date).sort().at(-1);
  const page = (path: string, priority: number, lastModified?: string) => ({ url: absoluteUrl(path), priority, lastModified });
  return [
    page("/", 1, newest),
    page("/servicios", 0.9),
    ...SERVICES.map((s) => page(`/servicios/${s.slug}`, 0.9)),
    ...SOLUTIONS.map((s) => page(`/soluciones/${s.slug}`, 0.8)),
    page("/precios", 0.8),
    page("/herramientas", 0.7),
    page("/herramientas/calculadora-de-tareas-repetitivas", 0.8),
    page("/metodo", 0.6),
    page("/que-no-hacemos", 0.6),
    page("/contacto", 0.6),
    page("/noticias", 0.7, getPosts("noticias")[0]?.date),
    page("/blog", 0.7, getPosts("guias")[0]?.date),
    ...posts.map((p) => page(p.url, 0.6, p.updated ?? p.date)),
    page("/legal/privacidad", 0.2),
    page("/legal/uso-de-ia", 0.3),
  ];
}
