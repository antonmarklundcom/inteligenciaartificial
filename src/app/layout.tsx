import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { JsonLd } from "@/components/site/JsonLd";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SITE } from "@/lib/site";
import "./globals.css";
import "./site.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Consultoría en Inteligencia Artificial para Empresas | Paraguay",
    template: "%s | inteligenciaartificial.com.py",
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    types: { "application/rss+xml": [{ url: "/noticias/feed.xml", title: "Noticias de IA para empresas paraguayas" }] },
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Un cerebro formado por miles de pirámides de luz dorada, violeta y turquesa sobre fondo negro." }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  image: `${SITE.url}${SITE.ogImage}`,
  areaServed: [
    { "@type": "City", name: "Asunción" },
    { "@type": "City", name: "Ciudad del Este" },
    { "@type": "Country", name: "Paraguay" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Asunción", addressCountry: "PY" },
  knowsLanguage: "es",
  priceRange: "USD 900 – 7.500",
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  inLanguage: "es-PY",
  publisher: { "@id": `${SITE.url}/#organization` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PY" className={interTight.variable}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <JsonLd data={[ORGANIZATION, WEBSITE]} />
      </body>
    </html>
  );
}
