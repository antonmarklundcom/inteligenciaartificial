---
title: "Atención al cliente por WhatsApp con IA: cómo funciona de verdad"
description: "Las piezas de un asistente de IA en WhatsApp Business, qué responde solo y qué deriva a una persona, cuánto tarda en implementarse y los errores más comunes."
date: 2026-11-25
tags: ["WhatsApp", "Atención al cliente"]
---

Un asistente de IA en WhatsApp bien hecho **responde lo frecuente, pregunta lo necesario para calificar y pasa la conversación a una persona con el contexto completo**. No reemplaza al equipo comercial: le saca de encima la parte que se repite y evita que una consulta quede sin respuesta a las diez de la noche.

## Las cinco piezas

**1. El número, sobre la API oficial.** El asistente se conecta a WhatsApp Business a través de su API. La aplicación común del teléfono no sirve para esto, y las soluciones que “automatizan” la app por fuera de la API arriesgan el bloqueo del número.

**2. La base de respuestas.** Un conjunto de información aprobada por la empresa: horarios, precios publicados, requisitos, políticas. El asistente responde con eso y solo con eso.

**3. El modelo de lenguaje.** Entiende lo que escribe el cliente, con sus abreviaturas y sus audios transcritos, y redacta la respuesta a partir de la base.

**4. Las reglas.** Qué preguntas hace para calificar, cuándo deriva, qué temas no toca. Son reglas fijas, escritas por la empresa. El modelo no decide a quién se atiende primero.

**5. La bandeja humana.** El lugar donde una persona recibe la conversación derivada, con un resumen. Si esta pieza falla, todo lo demás no sirve.

## Qué responde solo y qué no

| Responde el asistente | Pasa a una persona |
|---|---|
| Horarios, direcciones, requisitos | Reclamos |
| Precios y disponibilidad publicados | Negociación de precio o condiciones |
| Estado de un trámite, si hay de dónde consultarlo | Cualquier tema fuera de la base de respuestas |
| Preguntas de calificación | Cuando el cliente lo pide |

## Tres reglas que no negociamos

- **El asistente se presenta como asistente.** El cliente sabe que no habla con una persona.
- **Siempre hay salida a una persona**, en cualquier momento de la conversación.
- **Lo que no está en la base, no se responde.** Un modelo de lenguaje puede [inventar una respuesta convincente](/blog/que-es-una-alucinacion-de-ia); el diseño tiene que impedirlo.

## Las políticas de WhatsApp

WhatsApp permite usar su plataforma de negocios para atención al cliente con IA, pero no para chatbots de uso general que no estén al servicio de la atención de tu negocio. Los mensajes que inicia la empresa —recordatorios, seguimientos— requieren plantillas aprobadas y el consentimiento de quien los recibe. Las condiciones cambian: se revisan al definir el alcance.

## Cuánto tarda y cuánto cuesta

Nuestro [Sprint de asistente de atención por WhatsApp](/servicios/implementacion) lleva de 5 a 6 semanas y parte de USD 7.500. A eso se suman costos mensuales que dependen del volumen: conversaciones de WhatsApp, uso del modelo y hosting. Los estimamos por escrito antes de empezar. Más detalle en [cuánto cuesta implementar IA](/blog/cuanto-cuesta-implementar-inteligencia-artificial-empresa-paraguay).

## Los errores que más vemos

1. **Automatizar sin haber leído las conversaciones.** Antes de diseñar nada hay que revisar unos cientos de chats reales. Las diez preguntas frecuentes rara vez son las que la dirección supone.
2. **No definir quién atiende las derivaciones.** El asistente deriva bien y del otro lado no hay nadie.
3. **Querer que responda todo.** Cuanto más amplio el alcance, más errores. Empezar con lo frecuente y ampliar.
4. **No medir.** Sin el dato de cuántas consultas quedaban sin responder antes, no se puede saber si mejoró.

Si atendés por WhatsApp y querés saber cuánto te cuesta hoy responder lo repetido, empezá por la [calculadora](/herramientas/calculadora-de-tareas-repetitivas).
