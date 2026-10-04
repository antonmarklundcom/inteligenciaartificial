import type { Metadata } from "next";
import { HeroExperience } from "@/components/home/HeroExperience";
import { HomeSections } from "@/components/home/HomeSections";
import "./home.css";

export const metadata: Metadata = {
  title: "Inteligencia artificial para empresas paraguayas | inteligenciaartificial.com.py",
  description:
    "Consultoría e implementación de inteligencia artificial para empresas paraguayas. Alcance cerrado, precio cerrado, resultados medidos por vos.",
};

/** WhatsApp link from NEXT_PUBLIC_WHATSAPP_NUMBER (digits, country code first, e.g. 5959…). */
function whatsappHref(): string | null {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const text = encodeURIComponent("Hola, quiero consultar sobre IA para mi empresa (desde el inicio del sitio).");
  return `https://wa.me/${digits}?text=${text}`;
}

export default function Home() {
  const whatsapp = whatsappHref();
  const contactHref = whatsapp ?? "#contacto";
  const contactLabel = whatsapp ? "Hablar por WhatsApp" : "Contacto";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined;

  return (
    <main className="home">
      <HeroExperience contactHref={contactHref} contactLabel={contactLabel} />
      <HomeSections contactHref={contactHref} contactLabel={contactLabel} email={email} />
    </main>
  );
}
