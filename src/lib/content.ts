// Markdown content: content/noticias (news) and content/guias (evergreen guides).
// Files are read at build time. The front-matter contract is documented in
// content/README.md — it is what an automated content pipeline has to produce.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { z } from "zod";

export const COLLECTIONS = {
  noticias: { dir: "noticias", path: "/noticias", label: "Noticias" },
  guias: { dir: "guias", path: "/blog", label: "Guías" },
} as const;
export type Collection = keyof typeof COLLECTIONS;

const date = z.preprocess((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v), z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const frontmatterSchema = z.object({
  title: z.string().min(10).max(110),
  description: z.string().min(70).max(200),
  date,
  updated: date.optional(),
  tags: z.array(z.string()).default([]),
  /** Path under /public or absolute URL. */
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  /** Path under /public or absolute URL of an .mp4. */
  video: z.string().optional(),
  /** Every factual claim in a news item must be traceable to one of these. */
  sources: z.array(z.object({ title: z.string(), publisher: z.string(), url: z.string().url() })).default([]),
  draft: z.boolean().default(false),
});

export type Post = z.infer<typeof frontmatterSchema> & {
  slug: string;
  collection: Collection;
  url: string;
  html: string;
  minutes: number;
};

const cache = new Map<Collection, Post[]>();

export function getPosts(collection: Collection): Post[] {
  // Cached per build only: in development new files must show up without a restart.
  const hit = process.env.NODE_ENV === "production" ? cache.get(collection) : undefined;
  if (hit) return hit;
  const { dir, path } = COLLECTIONS[collection];
  const folder = join(process.cwd(), "content", dir);
  const posts = readdirSync(folder)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(folder, file), "utf8"));
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) throw new Error(`content/${dir}/${file}: ${parsed.error.message}`);
      if (collection === "noticias" && parsed.data.sources.length === 0) {
        throw new Error(`content/${dir}/${file}: a news item needs at least one source`);
      }
      const slug = file.replace(/\.md$/, "");
      return {
        ...parsed.data,
        slug,
        collection,
        url: `${path}/${slug}`,
        html: marked.parse(content, { async: false }),
        minutes: Math.max(1, Math.round(content.split(/\s+/).length / 210)),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  cache.set(collection, posts);
  return posts;
}

export const getPost = (collection: Collection, slug: string) => getPosts(collection).find((p) => p.slug === slug);

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** "25 de noviembre de 2026" — formatted by hand so it never depends on the server's ICU data. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}
