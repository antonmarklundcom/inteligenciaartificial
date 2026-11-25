import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICES } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { getPosts } from "./content";

const posts = [...getPosts("noticias"), ...getPosts("guias")];

const ROUTES = new Set([
  "/", "/servicios", "/precios", "/metodo", "/que-no-hacemos", "/contacto", "/herramientas",
  "/herramientas/calculadora-de-tareas-repetitivas", "/noticias", "/blog", "/legal/privacidad", "/legal/uso-de-ia",
  ...SERVICES.map((s) => `/servicios/${s.slug}`),
  ...SOLUTIONS.map((s) => `/soluciones/${s.slug}`),
  ...posts.map((p) => p.url),
]);

describe("content", () => {
  it("parses every post and has something to show", () => {
    expect(getPosts("noticias").length).toBeGreaterThan(0);
    expect(getPosts("guias").length).toBeGreaterThan(0);
  });

  it("gives every news item at least one source", () => {
    for (const p of getPosts("noticias")) expect(p.sources.length, p.slug).toBeGreaterThan(0);
  });

  it("uses unique titles and descriptions", () => {
    expect(new Set(posts.map((p) => p.title)).size).toBe(posts.length);
    expect(new Set(posts.map((p) => p.description)).size).toBe(posts.length);
  });

  it("has no broken internal links in Markdown", () => {
    for (const dir of ["noticias", "guias"]) {
      const folder = join(process.cwd(), "content", dir);
      for (const file of readdirSync(folder).filter((f) => f.endsWith(".md"))) {
        const text = readFileSync(join(folder, file), "utf8");
        for (const [, href] of text.matchAll(/\]\((\/[^)#\s]*)/g)) expect(ROUTES.has(href), `${file} → ${href}`).toBe(true);
      }
    }
  });
});
