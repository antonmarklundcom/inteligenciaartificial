import { Crumbs } from "@/components/site/Page";
import { pageMeta } from "@/lib/meta";
import { SITE, getContact } from "@/lib/site";

export const metadata = pageMeta(
  "/legal/privacidad",
  "Política de Privacidad | inteligenciaartificial.com.py",
  "Qué datos recoge este sitio, para qué se usan y cómo ejercer tus derechos. La calculadora no guarda ni envía los datos que cargás.",
);

export default function PrivacyPage() {
  const { email } = getContact();
  return (
    <main className="page page-narrow" id="contenido">
      <Crumbs items={[{ href: "/legal/privacidad", label: "Privacidad" }]} />
      <p className="kick">Legal</p>
      <h1>Política de privacidad</h1>
      <p className="article-meta">Vigente desde el 25 de noviembre de 2026</p>
      <div className="prose">
        <p>
          Esta política describe qué información trata {SITE.name} cuando visitás el sitio o nos escribís. Está
          redactada para leerse en dos minutos.
        </p>
        <h2>Qué datos recogemos</h2>
        <ul>
          <li>
            <strong>Navegación.</strong> El servidor registra datos técnicos habituales (dirección IP, navegador, página
            solicitada y hora) para operar el sitio y protegerlo de abusos.
          </li>
          <li>
            <strong>Calculadora de tareas repetitivas.</strong> El cálculo se realiza en tu navegador. No recibimos ni
            almacenamos el salario ni los demás valores que cargás.
          </li>
          <li>
            <strong>Contacto.</strong> Si nos escribís por WhatsApp o por correo, recibimos los datos que vos decidas
            enviarnos (nombre, empresa, teléfono, contenido del mensaje).
          </li>
        </ul>
        <h2>Para qué los usamos</h2>
        <p>
          Para responder tu consulta, preparar una propuesta si la pedís y mantener el sitio en funcionamiento. No
          vendemos ni cedemos datos personales a terceros con fines comerciales, y no usamos los datos de consultas ni
          de clientes para entrenar modelos de inteligencia artificial.
        </p>
        <h2>Con quién se comparten</h2>
        <p>
          Con los proveedores que hacen posible el servicio (alojamiento del sitio, correo y mensajería), que los tratan
          por cuenta nuestra. Si te comunicás por WhatsApp, también se aplican las condiciones de ese servicio.
        </p>
        <h2>Cuánto tiempo se conservan</h2>
        <p>
          Las consultas que no derivan en una relación comercial se eliminan a los 24 meses. Los registros técnicos del
          servidor se conservan por un plazo breve y luego se eliminan o se agregan.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Podés pedirnos acceder a tus datos, corregirlos o eliminarlos
          {email ? (
            <>
              {" "}
              escribiendo a <a href={`mailto:${email}`}>{email}</a>
            </>
          ) : (
            " por el mismo canal por el que nos contactaste"
          )}
          . Respondemos todas las solicitudes. En Paraguay, la Ley N.º 7593/2025 de Protección de Datos Personales
          entra en vigencia el 27 de noviembre de 2027; esta política se actualizará cuando se publique su
          reglamentación.
        </p>
        <h2>Cambios</h2>
        <p>Si esta política cambia, publicamos la nueva versión en esta página con su fecha de vigencia.</p>
      </div>
    </main>
  );
}
