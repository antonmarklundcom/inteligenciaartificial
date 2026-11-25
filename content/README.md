# Contenido

Cada archivo `.md` de estas carpetas se publica como una página al hacer el build:

| Carpeta | URL | Uso |
|---|---|---|
| `content/noticias/` | `/noticias/<nombre-del-archivo>` | Noticias: qué pasó, de dónde sale el dato, qué cambia para una empresa paraguaya |
| `content/guias/` | `/blog/<nombre-del-archivo>` | Guías permanentes |

El nombre del archivo es el slug: minúsculas, sin tildes, palabras separadas por guiones.

## Front-matter

```yaml
---
title: "Entre 10 y 110 caracteres"
description: "Entre 70 y 200 caracteres. Es la meta description y el texto de la tarjeta."
date: 2026-11-25          # fecha de publicación
updated: 2026-12-02       # opcional
tags: ["Paraguay", "Regulación"]
image: "/img/archivo.webp"   # opcional; ruta en /public o URL absoluta
imageAlt: "Descripción de la imagen"
video: "/video/archivo.mp4"  # opcional; reemplaza a la imagen en la página
sources:                     # obligatorio en noticias (al menos una)
  - title: "Título del artículo original"
    publisher: "Medio"
    url: "https://…"
draft: false                 # true = no se publica
---
```

El build falla si el front-matter no cumple el esquema (`src/lib/content.ts`) o si una
noticia no tiene fuentes. `npm test` verifica además que no haya enlaces internos rotos.

## Reglas editoriales (bloqueantes)

1. **Toda afirmación de hecho de una noticia está en una de sus fuentes.** Lo que no se puede verificar no se publica.
2. Sin estadísticas inventadas, clientes, testimonios ni promesas de ahorro.
3. La lectura propia va separada de los hechos y marcada como tal («Esto es nuestra lectura»).
4. Responder la pregunta en el primer párrafo.
5. Al menos un enlace interno a un servicio y uno a una herramienta o guía.
6. Español paraguayo, voseo.
7. Una persona revisa cada pieza antes de publicarla (docs/06 §10).

## Para un pipeline automático

Un generador de contenido (por ejemplo content-engine + Claude) solo tiene que escribir
archivos que cumplan este contrato y abrir un pull request: el CI valida el esquema, las
fuentes y los enlaces, y la revisión humana ocurre en el PR. Las imágenes y los videos
van en `public/img` y `public/video` y se referencian desde `image` y `video`.
