import { describe, expect, it } from "vitest";
import {
  calculateAnnualGallons,
  calculateAnnualGallonsFromWeekly,
  calculateCostRange,
  calculateReductionSavings,
} from "../src/react-app/utils/calculators";

describe("calculator engine", () => {
  it("calculates annual gallons from daily minutes", () => {
    expect(calculateAnnualGallons(10, 2, 365)).toBe(7300);
  });

  it("calculates annual gallons from weekly minutes", () => {
    expect(calculateAnnualGallonsFromWeekly(20, 4, 52)).toBe(4160);
  });

  it("returns zero for negative or invalid inputs", () => {
    expect(calculateAnnualGallons(-5, 2, 365)).toBe(0);
  });

  it("calculates cost ranges from gallons", () => {
    const range = calculateCostRange(1000, 0.01, 0.02);
    expect(range).toEqual({ min: 10, max: 20 });
  });

  it("calculates reduction savings", () => {
    const reduction = calculateReductionSavings(5, 2, 0.01, 0.02);
    expect(reduction.annualGallonsSaved).toBe(3650);
    expect(reduction.min).toBe(36.5);
    expect(reduction.max).toBe(73);
  });
});
