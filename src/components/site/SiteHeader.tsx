import Link from "next/link";
import { NAV, SITE, getContact } from "@/lib/site";
import { CtaLink } from "./CtaLink";
import { LogoMark } from "./Logo";

export function SiteHeader() {
  const contact = getContact("el menú");
  return (
    <header className="site-header">
      <Link className="logo" href="/" aria-label={`${SITE.name} — inicio`}>
        <LogoMark />
        <span>
          inteligenciaartificial<small>.com.py</small>
        </span>
      </Link>
      <nav aria-label="Principal">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <CtaLink contact={contact} className="pill header-cta" />
      <details className="mobile-nav">
        <summary aria-label="Menú">
          <span />
          <span />
        </summary>
        <div>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/contacto">Contacto</Link>
        </div>
      </details>
    </header>
  );
}
