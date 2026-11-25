import Link from "next/link";
import { CtaLink } from "@/components/site/CtaLink";
import { Crumbs } from "@/components/site/Page";
import { pageMeta } from "@/lib/meta";
import { getContact } from "@/lib/site";

export const metadata = pageMeta(
  "/contacto",
  "Contacto | Consultoría de Inteligencia Artificial en Paraguay",
  "Escribinos por WhatsApp o por correo con el proceso que querés mejorar. Respondemos si podemos ayudarte y cuál sería el primer paso. Gran Asunción y Ciudad del Este.",
);

export default function ContactPage() {
  const contact = getContact("la página de contacto");
  const hasChannel = !!contact.whatsapp || !!contact.email;
  return (
    <main className="page" id="contenido">
      <Crumbs items={[{ href: "/contacto", label: "Contacto" }]} />
      <p className="kick">Contacto</p>
      <h1>Contanos qué proceso te quita más tiempo</h1>
      <p className="lead">
        Para responderte bien necesitamos tres datos: el proceso concreto, el plazo que manejás y quién decide en tu
        empresa. Si no es un trabajo para nosotros, también te lo decimos.
      </p>
      {hasChannel ? (
        <div className="actions">
          {contact.whatsapp ? <CtaLink contact={contact} /> : null}
          {contact.email ? (
            <a className={contact.whatsapp ? "pill ghost" : "pill"} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          ) : null}
        </div>
      ) : (
        <p className="sub">Los datos de contacto se publican en los próximos días.</p>
      )}

      <section className="block">
        <h2>Antes de escribir</h2>
        <div className="grid three">
          <article className="card">
            <h3>
              <Link href="/herramientas/calculadora-de-tareas-repetitivas">Calculá el costo de la tarea</Link>
            </h3>
            <p>Dos minutos, sin registro. Llegar a la primera conversación con un número la hace mucho más útil.</p>
          </article>
          <article className="card">
            <h3>
              <Link href="/precios">Mirá los precios</Link>
            </h3>
            <p>Auditoría desde USD 1.500, talleres desde USD 900, Sprints de USD 3.500 a 7.500.</p>
          </article>
          <article className="card">
            <h3>
              <Link href="/que-no-hacemos">Revisá qué no hacemos</Link>
            </h3>
            <p>Hay proyectos que no aceptamos. Mejor saberlo antes.</p>
          </article>
        </div>
      </section>

      <section className="block">
        <h2>Dónde trabajamos</h2>
        <p>
          Atendemos de forma presencial en Gran Asunción y Ciudad del Este, y en línea para el resto del país.
          Trabajamos con empresas formalizadas de 10 a 150 personas.
        </p>
      </section>
    </main>
  );
}
