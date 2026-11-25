"use client";

import { useEffect, useRef } from "react";
import type { SceneHandle } from "./scene";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The fixed WebGL canvas behind the home page, plus the scroll measurement that
 * drives it: section index plus the fraction of that section scrolled (0 hero,
 * 1 second panel, 2+ the exploded field), then 2.6 → 3 while the contact
 * section comes into view, where the cones regroup as the map of Paraguay.
 */
export function BrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const finale = document.querySelector<HTMLElement>("[data-scene-finale]");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target = 0;
    let progress = 0;
    const measure = () => {
      const y = scrollY;
      let p = 0;
      sections.forEach((section, i) => {
        const r = section.getBoundingClientRect();
        const top = r.top + y;
        if (y >= top - 1) p = i + Math.min(1, Math.abs((y - top) / r.height));
      });
      p = Math.min(p, 2.6);
      if (finale) p += 0.4 * clamp01((innerHeight - finale.getBoundingClientRect().top) / (innerHeight * 0.7));
      target = p;
      header?.style.setProperty("--bar", String(Math.min(1, y / 200) * 0.85));
    };
    measure();
    progress = target;
    addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);

    let scene: SceneHandle | null = null;
    let disposed = false;
    import("./scene")
      .then(({ createScene }) =>
        createScene(canvas, {
          instant: reduceMotion,
          // Eased at 10% per frame, like every other value in the scene.
          getProgress: () => (progress += (target - progress) * 0.1),
        }),
      )
      .then((handle) => {
        if (disposed) handle.dispose();
        else {
          scene = handle;
          canvas.classList.add("is-ready");
        }
      })
      .catch(() => {
        // No WebGL (or the data failed to load): the page works without the scene.
        canvas.hidden = true;
      });

    return () => {
      disposed = true;
      removeEventListener("scroll", measure);
      removeEventListener("resize", measure);
      header?.style.removeProperty("--bar");
      scene?.dispose();
    };
  }, []);

  return <canvas id="gl" aria-hidden="true" ref={canvasRef} />;
}
