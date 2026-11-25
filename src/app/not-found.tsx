import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page" id="contenido">
      <p className="kick">Error 404</p>
      <h1>Esta página no existe</h1>
      <p className="lead">Puede que el enlace haya cambiado. Estas son las páginas más consultadas.</p>
      <div className="actions">
        <Link className="pill" href="/">
          Ir al inicio
        </Link>
        <Link className="pill ghost" href="/servicios">
          Servicios
        </Link>
        <Link className="pill ghost" href="/noticias">
          Noticias
        </Link>
      </div>
    </main>
  );
}
