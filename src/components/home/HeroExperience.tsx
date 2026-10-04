"use client";

import { useEffect, useRef } from "react";
import { SplitTitle } from "./SplitTitle";
import type { SceneHandle } from "./scene";

type Props = {
  /** Primary CTA: WhatsApp link when a number is configured, otherwise the contact section. */
  contactHref: string;
  contactLabel: string;
};

// Processes and sectors we actually work on. These orbit the tree where the
// reference design showed client logos — we show no logos we have not earned.
const ORBIT_ITEMS = [
  "Atención por WhatsApp",
  "Inmobiliarias",
  "Estudios contables",
  "Estudios jurídicos",
  "Documentos",
  "Seguimiento de clientes",
  "Reportes",
  "Tareas administrativas",
];

const FEATURES = [
  {
    title: "Atención por WhatsApp",
    body: "Respuesta, calificación y seguimiento de las consultas que hoy llegan por WhatsApp y se pierden en el chat.",
  },
  {
    title: "Inmobiliarias",
    body: "Calificación de interesados, seguimiento de oportunidades y fichas de propiedades generadas automáticamente.",
  },
  {
    title: "Estudios contables",
    body: "Recepción y clasificación de documentos, comunicaciones a clientes y borradores de reportes recurrentes.",
  },
  {
    title: "Estudios jurídicos",
    body: "Borradores a partir de los precedentes del estudio, resúmenes y comparación de documentos.",
  },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function HeroExperience({ contactHref, contactLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const secondRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;
    const raf = new Set<number>();
    const frame = (cb: FrameRequestCallback) => {
      const id = requestAnimationFrame((t) => {
        raf.delete(id);
        cb(t);
      });
      raf.add(id);
    };

    let scene: SceneHandle | null = null;
    let disposed = false;
    let progress = 0;

    // --- Scroll → scene progress and overlay state ---------------------------
    const update = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const span = Math.max(1, stage.offsetHeight - innerHeight);
      progress = clamp01(scrollY / span);
      // How far past the stage we are: fades the fixed overlays as content takes over.
      const exit = clamp01((scrollY - span) / (innerHeight * 0.6));

      const heroOut = smoothstep(0.1, 0.28, progress);
      const second = smoothstep(0.76, 0.9, progress);
      const hero = heroRef.current;
      const sec = secondRef.current;
      if (hero) {
        hero.style.opacity = String(1 - heroOut);
        hero.style.transform = `translateY(${-heroOut * 34}px)`;
        hero.style.visibility = heroOut > 0.99 ? "hidden" : "visible";
      }
      if (sec) {
        const visible = second > 0.01 && exit < 1;
        sec.style.opacity = visible ? String(1 - exit) : "0";
        sec.style.visibility = visible ? "visible" : "hidden";
        sec.classList.toggle("is-inview", second > 0.18);
      }
      if (gridRef.current) gridRef.current.style.visibility = second > 0.18 && exit < 1 ? "visible" : "hidden";
      headerRef.current?.classList.toggle("is-solid", exit > 0.5);
      scene?.setProgress(progress);
      // The content sections are opaque, so stop drawing once they cover the viewport.
      scene?.setPaused(scrollY > stage.offsetHeight + 40);
    };

    // --- Orbiting chips, synced to the scene clock ---------------------------
    const cards = orbitRef.current ? Array.from(orbitRef.current.children) as HTMLElement[] : [];
    const orbit = (time: number) => {
      const fadeIn = clamp01((progress - 0.19) / 0.12);
      const fadeOut = 1 - clamp01((progress - 0.55) / 0.12);
      const presence = fadeIn * fadeOut;
      cards.forEach((card, i) => {
        if (presence <= 0) {
          card.style.opacity = "0";
          return;
        }
        const a = (i / cards.length) * Math.PI * 2 + time * 0.13 + progress * 5.8;
        const depth = (Math.sin(a) + 1) / 2;
        const rx = Math.min(innerWidth * 0.39, 650);
        const ry = Math.min(innerHeight * 0.33, 285);
        const x = innerWidth * 0.5 + Math.cos(a) * rx;
        const y = innerHeight * 0.52 + Math.sin(a) * ry;
        card.style.opacity = String(presence * smoothstep(0.3, 0.64, depth));
        card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${(depth - 0.5) * 300}px) rotateY(${Math.cos(a) * -28}deg) scale(${0.68 + depth * 0.38})`;
        card.style.zIndex = String(Math.round(depth * 20));
      });
    };

    // --- Scene ---------------------------------------------------------------
    import("./scene")
      .then(({ createScene }) => {
        if (disposed || !canvasRef.current) return;
        try {
          scene = createScene(canvasRef.current);
          scene.onFrame(orbit);
          scene.setIntro(reduceMotion ? 1 : 0);
          update();
        } catch {
          // No WebGL: the page still works on the dark background.
          canvasRef.current?.setAttribute("hidden", "");
          const fallback = (t: number) => {
            orbit(t / 1000);
            frame(fallback);
          };
          frame(fallback);
        }
      })
      .catch(() => {});

    // --- Preloader → intro ---------------------------------------------------
    root.classList.add("is-loading");
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    addEventListener("load", onLoad, { once: true });
    let shown = 0;
    let introStart = Infinity;

    const finishIntro = () => {
      root.classList.add("intro-ready");
    };
    const intro = (now: number) => {
      if (disposed) return;
      const t = clamp01((now - introStart) / 2200);
      scene?.setIntro(t * t * (3 - 2 * t));
      if (t >= 1) {
        finishIntro();
        return;
      }
      frame(intro);
    };
    const leave = () => {
      preloaderRef.current?.classList.add("is-leaving");
      root.classList.remove("is-loading");
      setTimeout(() => preloaderRef.current?.classList.add("is-gone"), 1100);
    };
    const load = (now: number) => {
      if (disposed) return;
      shown = Math.min(loaded ? 100 : 92, shown + (loaded ? (reduceMotion ? 100 : 2.4) : 0.42));
      if (counterRef.current) counterRef.current.textContent = String(Math.round(shown));
      if (shown >= 100) {
        leave();
        if (reduceMotion) {
          scene?.setIntro(1);
          finishIntro();
        } else {
          introStart = now + 500;
          frame(intro);
        }
        return;
      }
      frame(load);
    };
    frame(load);

    // --- Custom cursor (fine pointers only) ----------------------------------
    const cursor = cursorRef.current;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!cursor) return;
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-hovering", e.target instanceof Element && !!e.target.closest("a,button"));
    };
    const onPointerLeave = () => cursor?.classList.remove("is-visible");
    const follow = () => {
      if (disposed) return;
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (cursor) cursor.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
      frame(follow);
    };
    if (finePointer && !reduceMotion) {
      root.classList.add("has-custom-cursor");
      addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerleave", onPointerLeave);
      frame(follow);
    }

    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();

    return () => {
      disposed = true;
      raf.forEach((id) => cancelAnimationFrame(id));
      removeEventListener("load", onLoad);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      root.classList.remove("is-loading", "intro-ready", "has-custom-cursor");
      scene?.dispose();
    };
  }, []);

  const external = contactHref.startsWith("http");

  return (
    <>
      <div className="preloader" role="status" aria-live="polite" ref={preloaderRef}>
        <span className="preloader-logo" aria-hidden="true">
          IA
        </span>
        <div className="preloader-status">
          <span>Cargando</span>
          <strong>
            <b ref={counterRef}>0</b>%
          </strong>
        </div>
      </div>
      <div className="custom-cursor" aria-hidden="true" ref={cursorRef}>
        <span className="custom-cursor-ring" />
      </div>
      <canvas id="scene" aria-hidden="true" ref={canvasRef} />
      <div className="vignette" aria-hidden="true" />

      <header className="site-header" ref={headerRef}>
        <a className="brand" href="#top" aria-label="inteligenciaartificial.com.py — inicio">
          <span className="brand-mark" aria-hidden="true">
            IA
          </span>
          <span className="brand-name">
            inteligenciaartificial<span>.com.py</span>
          </span>
        </a>
        <nav aria-label="Principal">
          <a href="#soluciones">Soluciones</a>
          <a href="#servicios">Servicios</a>
          <a href="#metodo">Método</a>
          <a href="#que-no-hacemos">Qué no hacemos</a>
        </nav>
        <a
          className="pill primary demo"
          href={contactHref}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {contactLabel}
        </a>
      </header>

      <section className="hero-ui" aria-label="Presentación" ref={heroRef}>
        <div className="hero-title">
          <span className="kicker">
            <i />
            Consultoría e implementación de IA
          </span>
          <SplitTitle as="h1" text="IA aplicada a empresas paraguayas" />
        </div>
        <div className="hero-copy">
          <p>
            Identificamos qué procesos de tu empresa pueden automatizarse o asistirse con inteligencia artificial, y
            los implementamos con alcance y precio definidos antes de empezar.
          </p>
          <div className="actions">
            <a
              className="pill primary"
              href={contactHref}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {contactLabel}
            </a>
            <a className="pill light" href="#servicios">
              Ver servicios y precios
            </a>
          </div>
        </div>
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          <p>
            Gran Asunción y Ciudad del Este
            <br />
            <small>Empresas de 10 a 150 personas</small>
          </p>
        </div>
      </section>

      <div className="logo-flight" aria-label="Procesos y sectores en los que trabajamos" ref={orbitRef}>
        {ORBIT_ITEMS.map((item) => (
          <div className="trust-card" key={item}>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <section className="second-ui" aria-labelledby="soluciones-title" ref={secondRef}>
        <SplitTitle as="h2" id="soluciones-title" text="IA con alcance cerrado" />
        <p className="second-intro">
          No vendemos “transformación digital”. Trabajamos sobre procesos concretos: documentos, respuestas a clientes,
          seguimiento de oportunidades, reportes y tareas administrativas repetitivas.
        </p>
        <div className="feature-grid" ref={gridRef}>
          {FEATURES.map((f, i) => (
            <article key={f.title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="scroll-stage" id="top" ref={stageRef} aria-hidden="true">
        {/* Anchor placed where the scroll-driven "Soluciones" panel is fully in view. */}
        <span className="stage-anchor" id="soluciones" />
      </div>
    </>
  );
}
