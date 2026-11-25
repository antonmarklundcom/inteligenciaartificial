import Link from "next/link";
import { CtaLink } from "./CtaLink";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, getContact } from "@/lib/site";
import type { Faq } from "@/content/services";

export type Crumb = { href: string; label: string };

/** Breadcrumb trail with its BreadcrumbList markup. The last crumb is the current page. */
export function Crumbs({ items }: { items: Crumb[] }) {
  const all = [{ href: "/", label: "Inicio" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación">
        <ol className="crumbs">
          {all.map((c, i) => (
            <li key={c.href}>{i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
        }}
      />
    </>
  );
}

export function FaqBlock({ items, title = "Preguntas frecuentes" }: { items: Faq[]; title?: string }) {
  return (
    <section className="block">
      <h2>{title}</h2>
      <div className="faq">
        {items.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}

type CtaProps = { title?: string; body?: string; context: string; secondary?: { href: string; label: string } };

export function CtaBand({
  title = "Contanos qué proceso te quita más tiempo",
  body = "Escribinos con el proceso concreto, el plazo y quién decide en tu empresa. Te respondemos si podemos ayudarte y cuál sería el primer paso. Si no es para nosotros, también te lo decimos.",
  context,
  secondary,
}: CtaProps) {
  const contact = getContact(context);
  return (
    <aside className="cta-band">
      <h2 className="h2">{title}</h2>
      <p>{body}</p>
      <div className="actions">
        <CtaLink contact={contact} />
        {secondary ? (
          <Link className="pill ghost" href={secondary.href}>
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
