import type { Metadata } from "next";
import { SITE } from "./site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Per-page metadata with canonical and matching Open Graph fields. Next replaces
 * (does not merge) `openGraph` from the layout, so the shared fields are repeated here.
 */
export function pageMeta(path: string, title: string, description: string, og: OpenGraph = {}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Un cerebro formado por miles de pirámides de luz dorada, violeta y turquesa sobre fondo negro." }],
      title,
      description,
      url: path,
      ...og,
    } as OpenGraph,
  };
}
