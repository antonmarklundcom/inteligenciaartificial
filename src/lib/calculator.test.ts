import { describe, expect, it } from "vitest";
import { calculate, formatInt } from "./calculator";

describe("calculate", () => {
  it("follows the published formula", () => {
    // 2 people × 15 min × 40 times a week × 48 weeks / 60 = 960 h
    const r = calculate({ people: 2, minutesPerOccurrence: 15, occurrencesPerWeek: 40, monthlySalary: 4_800_000, mechanicalPercent: 50 });
    expect(r.annualHours).toBe(960);
    expect(r.hourlyCost).toBe(30_000);
    expect(r.annualCost).toBe(28_800_000);
    expect(r.addressableHours).toEqual([240, 432]);
    expect(r.addressableCost).toEqual([7_200_000, 12_960_000]);
  });

  it("treats empty, negative and non-numeric input as zero", () => {
    const r = calculate({ people: NaN, minutesPerOccurrence: -5, occurrencesPerWeek: 10, monthlySalary: 1, mechanicalPercent: 500 });
    expect(r.annualHours).toBe(0);
    expect(r.annualCost).toBe(0);
  });
});

describe("formatInt", () => {
  it("uses dots as thousands separators", () => {
    expect(formatInt(28_800_000)).toBe("28.800.000");
    expect(formatInt(960)).toBe("960");
    expect(formatInt(1234.6)).toBe("1.235");
  });
});
