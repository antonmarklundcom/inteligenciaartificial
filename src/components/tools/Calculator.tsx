"use client";

import { useId, useState } from "react";
import { ADDRESSABLE_BAND, HOURS_PER_MONTH, WORKING_WEEKS, calculate, formatInt } from "@/lib/calculator";

type Fields = { task: string; people: string; minutes: string; occurrences: string; salary: string; mechanical: number };

const INITIAL: Fields = { task: "", people: "2", minutes: "15", occurrences: "40", salary: "4500000", mechanical: 50 };

const num = (v: string) => Number(v.replace(/\./g, "").replace(",", "."));

export function Calculator() {
  const id = useId();
  const [f, setF] = useState<Fields>(INITIAL);
  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [key]: key === "mechanical" ? Number(e.target.value) : e.target.value }));

  const r = calculate({
    people: num(f.people),
    minutesPerOccurrence: num(f.minutes),
    occurrencesPerWeek: num(f.occurrences),
    monthlySalary: num(f.salary),
    mechanicalPercent: f.mechanical,
  });
  const task = f.task.trim() || "esta tarea";

  return (
    <div className="calc">
      <form className="card" onSubmit={(e) => e.preventDefault()} aria-label="Datos de la tarea">
        <div className="field">
          <label htmlFor={`${id}-task`}>Nombre de la tarea (opcional)</label>
          <input id={`${id}-task`} type="text" value={f.task} onChange={set("task")} placeholder="Ej.: responder consultas de disponibilidad" maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-people`}>Personas que la hacen</label>
          <input id={`${id}-people`} type="number" inputMode="numeric" min={1} step={1} value={f.people} onChange={set("people")} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-minutes`}>Minutos cada vez que se hace</label>
          <input id={`${id}-minutes`} type="number" inputMode="decimal" min={1} step={1} value={f.minutes} onChange={set("minutes")} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-occ`}>Veces por semana, por persona</label>
          <input id={`${id}-occ`} type="number" inputMode="numeric" min={1} step={1} value={f.occurrences} onChange={set("occurrences")} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-salary`}>Salario mensual promedio, con cargas (Gs.)</label>
          <input id={`${id}-salary`} type="number" inputMode="numeric" min={0} step={100000} value={f.salary} onChange={set("salary")} />
          <small>Incluí aporte patronal y aguinaldo prorrateado. Este dato no se guarda ni se envía: el cálculo se hace en tu navegador.</small>
        </div>
        <div className="field">
          <label htmlFor={`${id}-mech`}>
            Parte mecánica de la tarea: <strong>{f.mechanical}%</strong>
          </label>
          <input id={`${id}-mech`} type="range" min={0} max={100} step={5} value={f.mechanical} onChange={set("mechanical")} />
          <small>Es tu estimación: qué parte es copiar, buscar, clasificar o responder siempre lo mismo.</small>
        </div>
      </form>

      <div className="card featured" aria-live="polite">
        <p className="meta">Costo anual de {task}</p>
        <p className="result-big">Gs. {formatInt(r.annualCost)}</p>
        <dl className="result-rows">
          <div>
            <dt>Horas por año</dt>
            <dd>{formatInt(r.annualHours)} h</dd>
          </div>
          <div>
            <dt>Costo por hora</dt>
            <dd>Gs. {formatInt(r.hourlyCost)}</dd>
          </div>
          <div>
            <dt>Porción potencialmente abordable (horas)</dt>
            <dd>
              {formatInt(r.addressableHours[0])} – {formatInt(r.addressableHours[1])} h
            </dd>
          </div>
          <div>
            <dt>Porción potencialmente abordable (Gs.)</dt>
            <dd>
              {formatInt(r.addressableCost[0])} – {formatInt(r.addressableCost[1])}
            </dd>
          </div>
        </dl>
        <p className="assumptions">
          <strong>Fórmula.</strong> Horas por año = personas × minutos × veces por semana × {WORKING_WEEKS} semanas ÷ 60.
          Costo por hora = salario mensual ÷ {HOURS_PER_MONTH} horas. Costo anual = horas × costo por hora.
        </p>
        <p className="assumptions">
          <strong>Supuestos.</strong> {WORKING_WEEKS} semanas trabajadas por año y {HOURS_PER_MONTH} horas por mes. La
          porción abordable toma tu estimación de la parte mecánica ({f.mechanical}%) y le aplica un rango de{" "}
          {ADDRESSABLE_BAND[0] * 100}% a {ADDRESSABLE_BAND[1] * 100}%. Es una referencia para decidir si vale la pena
          analizar la tarea, no una promesa de ahorro: no descuenta el costo de implementar ni de mantener una solución.
        </p>
      </div>
    </div>
  );
}
