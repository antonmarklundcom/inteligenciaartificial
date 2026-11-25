// Calculadora de Costo de Tareas Repetitivas — pure arithmetic (docs/04 §2).
// The constants are shown to the user next to every result.

export const WORKING_WEEKS = 48;
export const HOURS_PER_MONTH = 160;
/** Share of the mechanical part that could be addressed: a band, never a promise. */
export const ADDRESSABLE_BAND = [0.5, 0.9] as const;

export type CalculatorInput = {
  people: number;
  minutesPerOccurrence: number;
  occurrencesPerWeek: number;
  /** Average loaded monthly salary, in guaraníes. */
  monthlySalary: number;
  /** User estimate, 0–100. */
  mechanicalPercent: number;
};

export type CalculatorResult = {
  annualHours: number;
  hourlyCost: number;
  annualCost: number;
  addressableHours: [number, number];
  addressableCost: [number, number];
};

const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculate(input: CalculatorInput): CalculatorResult {
  const people = safe(input.people);
  const minutes = safe(input.minutesPerOccurrence);
  const occurrences = safe(input.occurrencesPerWeek);
  const salary = safe(input.monthlySalary);
  const mechanical = Math.min(100, safe(input.mechanicalPercent)) / 100;

  const annualHours = (people * minutes * occurrences * WORKING_WEEKS) / 60;
  const hourlyCost = salary / HOURS_PER_MONTH;
  const annualCost = annualHours * hourlyCost;
  const band = (v: number): [number, number] => [v * mechanical * ADDRESSABLE_BAND[0], v * mechanical * ADDRESSABLE_BAND[1]];
  return { annualHours, hourlyCost, annualCost, addressableHours: band(annualHours), addressableCost: band(annualCost) };
}

/** 12345678 → "12.345.678" (Paraguayan thousands separator), without relying on ICU. */
export function formatInt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
