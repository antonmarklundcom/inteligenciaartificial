import Link from "next/link";
import { SITE } from "@/lib/site";
import { LogoMark } from "./Logo";

const COLUMNS = [
  {
    title: "Servicios",
    links: [
      ["/servicios/auditoria-de-ia", "Auditoría de Oportunidades de IA"],
      ["/servicios/implementacion", "Sprint de Implementación"],
      ["/servicios/capacitacion", "Capacitación en IA para equipos"],
      ["/servicios/soporte-y-optimizacion", "Soporte y optimización"],
      ["/precios", "Precios"],
    ],
  },
  {
    title: "Soluciones",
    links: [
      ["/soluciones/atencion-al-cliente", "Atención al cliente por WhatsApp"],
      ["/soluciones/inmobiliarias", "IA para inmobiliarias"],
      ["/soluciones/estudios-contables", "IA para estudios contables"],
      ["/soluciones/estudios-juridicos", "IA para estudios jurídicos"],
    ],
  },
  {
    title: "Recursos",
    links: [
      ["/herramientas/calculadora-de-tareas-repetitivas", "Calculadora de tareas repetitivas"],
      ["/herramientas", "Herramientas gratuitas"],
      ["/noticias", "Noticias de IA"],
      ["/blog", "Guías"],
    ],
  },
  {
    title: "Empresa",
    links: [
      ["/metodo", "Cómo trabajamos"],
      ["/que-no-hacemos", "Qué no hacemos"],
      ["/contacto", "Contacto"],
      ["/legal/privacidad", "Privacidad"],
      ["/legal/uso-de-ia", "Cómo usamos la IA"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="logo" href="/">
            <LogoMark />
            <span>
              inteligenciaartificial<small>.com.py</small>
            </span>
          </Link>
          <p>{SITE.tagline}. Gran Asunción y Ciudad del Este.</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2>{col.title}</h2>
            <ul>
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="footer-legal">
        © {new Date().getFullYear()} {SITE.name} · Los precios publicados son valores de partida con el alcance
        indicado. <a href="/noticias/feed.xml">RSS</a>
      </p>
    </footer>
  );
}
