import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { Crumbs, CtaBand, FaqBlock } from "@/components/site/Page";
import { SERVICES, getService } from "@/content/services";
import { pageMeta } from "@/lib/meta";
import { SITE, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMeta(`/servicios/${service.slug}`, service.title, service.description);
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="page" id="contenido">
      <Crumbs
        items={[
          { href: "/servicios", label: "Servicios" },
          { href: `/servicios/${service.slug}`, label: service.short },
        ]}
      />
      <p className="kick">{service.kicker}</p>
      <h1>{service.h1}</h1>
      <p className="lead">{service.lead}</p>
      <div className="grid two" style={{ maxWidth: 860 }}>
        <div className="card featured">
          <p className="meta">Precio de partida</p>
          <p className="price">
            {service.price}
            <small>{service.priceGs}</small>
          </p>
        </div>
        <div className="card">
          <p className="meta">Plazo</p>
          <p className="price" style={{ fontSize: 24 }}>
            {service.term}
          </p>
        </div>
      </div>
      {service.note ? (
        <p className="sub" style={{ marginTop: 22 }}>
          {service.note}
        </p>
      ) : null}

      <section className="block">
        <h2>Qué incluye</h2>
        <ul className="ticks">
          {service.includes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      {service.tiers ? (
        <section className="block">
          <h2>Opciones y precios</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Opción</th>
                  <th scope="col">Alcance</th>
                  <th scope="col">Plazo</th>
                  <th scope="col">Desde</th>
                </tr>
              </thead>
              <tbody>
                {service.tiers.map((t) => (
                  <tr key={t.name}>
                    <th scope="row" style={{ whiteSpace: "normal", color: "#fff", textTransform: "none", letterSpacing: 0, fontSize: 15.5 }}>
                      {t.name}
                    </th>
                    <td>{t.scope}</td>
                    <td className="num">{t.term}</td>
                    <td className="num">
                      {t.price}
                      <br />
                      <small style={{ color: "var(--ink-mute)" }}>{t.priceGs}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="block">
        <h2>Cómo se desarrolla</h2>
        <ol className="grid three steps">
          {service.steps.map((s) => (
            <li className="card" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="block">
        <h2>Qué no incluye</h2>
        <p>Lo decimos antes de cotizar, no después de firmar.</p>
        <ul className="crosses">
          {service.excludes.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2>Para quién es, y para quién no</h2>
        <div className="grid two">
          <div className="card">
            <p className="meta">
              <b>Tiene sentido si</b>
            </p>
            <ul className="ticks" style={{ marginTop: 4 }}>
              {service.fit.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <p className="meta">
              <b>No es para vos si</b>
            </p>
            <ul className="crosses" style={{ marginTop: 4 }}>
              {service.notFit.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqBlock items={service.faq} />

      <section className="block">
        <h2>Otros servicios</h2>
        <div className="grid three">
          {others.map((s) => (
            <article className="card" key={s.slug}>
              <p className="meta">
                <b>{s.step}</b> desde {s.price}
              </p>
              <h3>
                <Link href={`/servicios/${s.slug}`}>{s.name}</Link>
              </h3>
              <p>{s.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <CtaBand context={`la página de ${service.short}`} secondary={{ href: "/metodo", label: "Cómo trabajamos" }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: absoluteUrl(`/servicios/${service.slug}`),
          serviceType: "Consultoría en inteligencia artificial",
          provider: { "@id": `${SITE.url}/#organization` },
          areaServed: { "@type": "Country", name: "Paraguay" },
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            priceSpecification: { "@type": "PriceSpecification", minPrice: service.priceFrom, priceCurrency: "USD" },
            url: absoluteUrl(`/servicios/${service.slug}`),
          },
        }}
      />
    </main>
  );
}
