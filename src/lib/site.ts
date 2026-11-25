// Single source for the site's identity, navigation and contact details.

export const SITE = {
  name: "inteligenciaartificial.com.py",
  shortName: "IA Paraguay",
  url: (process.env.APP_BASE_URL || "https://inteligenciaartificial.com.py").replace(/\/$/, ""),
  tagline: "Consultoría e implementación de inteligencia artificial para empresas paraguayas",
  description:
    "Consultoría e implementación de inteligencia artificial para empresas paraguayas. Alcance cerrado, precio cerrado, resultados medidos por vos.",
  locale: "es_PY",
  areas: ["Asunción", "Gran Asunción", "Ciudad del Este"],
  ogImage: "/og.jpg",
} as const;

export const NAV = [
  { href: "/servicios", label: "Servicios" },
  { href: "/precios", label: "Precios" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/noticias", label: "Noticias" },
  { href: "/blog", label: "Guías" },
] as const;

export type Contact = {
  /** Primary call to action: WhatsApp when a number is configured, otherwise the contact page. */
  href: string;
  label: string;
  external: boolean;
  whatsapp: string | null;
  email: string | null;
};

/** WhatsApp link from NEXT_PUBLIC_WHATSAPP_NUMBER (digits, country code first, e.g. 5959…). */
export function whatsappHref(message: string): string | null {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getContact(context = "el sitio"): Contact {
  const whatsapp = whatsappHref(`Hola, quiero consultar sobre IA para mi empresa (desde ${context}).`);
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;
  return {
    href: whatsapp ?? "/contacto",
    label: whatsapp ? "Hablar por WhatsApp" : "Contacto",
    external: !!whatsapp,
    whatsapp,
    email,
  };
}

export const absoluteUrl = (path = "/") => `${SITE.url}${path === "/" ? "" : path}`;
