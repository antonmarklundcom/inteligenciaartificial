import { getPosts } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed with news and guides, newest first. */
export function GET() {
  const posts = [...getPosts("noticias"), ...getPosts("guias")].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 40);
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${absoluteUrl(p.url)}</link>
<guid isPermaLink="true">${absoluteUrl(p.url)}</guid>
<pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
<description>${esc(p.description)}</description>
</item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(SITE.name)} — Noticias y guías de IA para empresas paraguayas</title>
<link>${SITE.url}</link>
<atom:link href="${absoluteUrl("/noticias/feed.xml")}" rel="self" type="application/rss+xml"/>
<description>${esc(SITE.description)}</description>
<language>es-PY</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
