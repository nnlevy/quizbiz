export type CostRange = {
  min: number;
  max: number;
};

const clampNonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

export const calculateAnnualGallons = (minutes: number, gallonsPerMinute: number, days = 365) =>
  clampNonNegative(minutes) * clampNonNegative(gallonsPerMinute) * days;

export const calculateAnnualGallonsFromWeekly = (
  minutesPerWeek: number,
  gallonsPerMinute: number,
  weeks = 52,
) => clampNonNegative(minutesPerWeek) * clampNonNegative(gallonsPerMinute) * weeks;

export const calculateCostRange = (
  gallons: number,
  costPerGallonMin: number,
  costPerGallonMax: number,
): CostRange => {
  const safeGallons = clampNonNegative(gallons);
  return {
    min: safeGallons * clampNonNegative(costPerGallonMin),
    max: safeGallons * clampNonNegative(costPerGallonMax),
  };
};

export const calculateReductionSavings = (
  minutesReduced: number,
  gallonsPerMinute: number,
  costPerGallonMin: number,
  costPerGallonMax: number,
) => {
  const annualGallonsSaved = calculateAnnualGallons(minutesReduced, gallonsPerMinute, 365);
  const costRange = calculateCostRange(annualGallonsSaved, costPerGallonMin, costPerGallonMax);
  return {
    annualGallonsSaved,
    ...costRange,
  };
};
