---
title: "Qué es una alucinación de IA y por qué importa en tu negocio"
description: "Por qué un modelo de lenguaje puede inventar datos con total seguridad, en qué tareas es más probable y cinco controles prácticos para que el error no llegue a un cliente."
date: 2026-11-25
tags: ["Riesgos"]
---

Una alucinación es **una respuesta falsa que un modelo de lenguaje presenta con la misma seguridad que una verdadera**: una ley que no existe, un precio inventado, una cita que nadie dijo. No es una falla ocasional que se va a corregir en la próxima versión. Es una consecuencia de cómo funcionan estos modelos, y por eso se maneja con diseño, no con confianza.

## Por qué pasa

Un modelo de lenguaje genera texto prediciendo qué palabras siguen de forma plausible. No consulta una base de hechos ni “sabe” cuándo no sabe. Cuando le falta información, lo más plausible suele ser un texto con forma de respuesta correcta. De ahí que los errores sean tan convincentes: tienen el formato, el tono y el nivel de detalle de un dato real.

Los modelos nuevos se equivocan menos que los anteriores, pero ningún proveedor serio promete que no ocurra.

## Dónde es más probable

- **Datos puntuales**: números de ley, fechas, montos, nombres propios.
- **Temas locales o poco documentados**, como buena parte de la normativa y la jurisprudencia paraguaya.
- **Preguntas sobre tu empresa** cuando el modelo no tiene tus documentos delante.
- **Pedidos que presuponen algo falso**: si preguntás “¿qué dice el artículo 40 sobre X?”, tiende a responder aunque el artículo hable de otra cosa.

## Dónde es menos probable

- Reescribir, resumir o traducir un texto que le das completo.
- Clasificar un documento entre categorías definidas.
- Extraer datos que están en el propio documento, indicando de dónde salen.

La diferencia es simple: el riesgo baja cuando el modelo **trabaja sobre material que tiene delante** y sube cuando tiene que **recordar**.

## Cinco controles que funcionan

**1. Darle la fuente.** En lugar de preguntarle al modelo qué sabe, se le entregan los documentos de la empresa y se le pide que responda solo con eso.

**2. Exigir la cita.** Cada dato de la respuesta enlaza al pasaje del que salió. Quien revisa verifica en segundos.

**3. Permitirle decir “no sé”.** Una instrucción explícita de no responder cuando la información no está, y derivar a una persona.

**4. Revisión humana donde importa.** Todo lo que sale hacia un cliente, o implica un criterio profesional, lo aprueba alguien.

**5. Probar con casos reales.** Antes de poner algo en producción se lo prueba con ejemplos de la operación, incluidos los difíciles, y se registra cuántas veces falla.

## Lo que no funciona

- Pedirle al modelo que “no invente”. Ayuda poco por sí solo.
- Preguntarle si está seguro. Puede confirmar un error con la misma convicción.
- Confiar en que “la versión paga no se equivoca”.

## En la práctica

En un [estudio jurídico](/soluciones/estudios-juridicos), esto significa no usar un modelo como fuente única de jurisprudencia. En [atención al cliente](/soluciones/atencion-al-cliente), que el asistente responda solo con contenido aprobado. En un [estudio contable](/soluciones/estudios-contables), que los números salgan de los sistemas y no del modelo.

Y para todo el equipo, que sepa reconocer el problema: es uno de los temas centrales de nuestros [talleres](/servicios/capacitacion).
