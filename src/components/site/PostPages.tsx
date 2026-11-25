import { notFound } from "next/navigation";
import { JsonLd } from "./JsonLd";
import { Crumbs, CtaBand } from "./Page";
import { PostCard } from "./PostCard";
import { COLLECTIONS, formatDate, getPost, getPosts, type Collection } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { SITE, absoluteUrl } from "@/lib/site";

const mediaUrl = (src: string) => (src.startsWith("http") ? src : absoluteUrl(src));

export function postMetadata(collection: Collection, slug: string) {
  const post = getPost(collection, slug);
  if (!post) return {};
  return pageMeta(post.url, `${post.title} | ${SITE.name}`, post.description, {
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    ...(post.image ? { images: [{ url: post.image, alt: post.imageAlt ?? post.title }] } : {}),
  });
}

export function PostIndex({ collection, kicker, title, lead }: { collection: Collection; kicker: string; title: string; lead: string }) {
  const posts = getPosts(collection);
  const { path, label } = COLLECTIONS[collection];
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: path, label }]} />
      <p className="kick">{kicker}</p>
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      <div className="grid three">
        {posts.map((post) => (
          <PostCard key={post.url} post={post} />
        ))}
      </div>
      <CtaBand context={`la sección ${label}`} secondary={{ href: "/servicios", label: "Ver servicios" }} />
    </main>
  );
}

export function PostPage({ collection, slug }: { collection: Collection; slug: string }) {
  const post = getPost(collection, slug);
  if (!post) notFound();
  const { path, label } = COLLECTIONS[collection];
  const related = getPosts(collection)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const isNews = collection === "noticias";

  return (
    <main className="page page-narrow" id="contenido">
      <article>
        <Crumbs
          items={[
            { href: path, label },
            { href: post.url, label: post.title },
          ]}
        />
        <p className="kick">{isNews ? "Noticia" : "Guía"}{post.tags.length ? ` · ${post.tags.join(" · ")}` : ""}</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        <p className="article-meta">
          <span>
            Publicado el <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated && post.updated !== post.date ? (
            <span>
              Actualizado el <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          ) : null}
          <span>{post.minutes} min de lectura</span>
          <span>Por el equipo de {SITE.name}</span>
        </p>
        {post.video ? (
          <div className="prose">
            <video src={post.video} poster={post.image} controls preload="none" playsInline />
          </div>
        ) : post.image ? (
          <div className="prose">
            {/* eslint-disable-next-line @next/next/no-img-element -- content images are pre-sized by the content pipeline */}
            <img src={post.image} alt={post.imageAlt ?? ""} loading="eager" decoding="async" />
          </div>
        ) : null}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.sources.length ? (
          <aside className="sources" aria-labelledby="fuentes">
            <h2 id="fuentes">Fuentes</h2>
            <ol>
              {post.sources.map((s) => (
                <li key={s.url}>
                  {s.publisher}:{" "}
                  <a href={s.url} rel="noopener noreferrer nofollow" target="_blank">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        ) : null}
      </article>

      {related.length ? (
        <section className="block">
          <h2>{isNews ? "Más noticias" : "Más guías"}</h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            {related.map((p) => (
              <PostCard key={p.url} post={p} />
            ))}
          </div>
        </section>
      ) : null}
      <CtaBand
        title="¿Querés saber qué significa esto para tu empresa?"
        body="Contanos en qué rubro estás y qué proceso te preocupa. Te respondemos con lo que haríamos y lo que no."
        context={post.title}
        secondary={{ href: "/herramientas/calculadora-de-tareas-repetitivas", label: "Calcular el costo de una tarea" }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": isNews ? "NewsArticle" : "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          inLanguage: "es-PY",
          mainEntityOfPage: absoluteUrl(post.url),
          image: [mediaUrl(post.image ?? SITE.ogImage)],
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@id": `${SITE.url}/#organization` },
          ...(post.sources.length ? { citation: post.sources.map((s) => s.url) } : {}),
        }}
      />
    </main>
  );
}

