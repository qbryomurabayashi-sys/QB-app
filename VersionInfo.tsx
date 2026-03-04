import { PerformanceData } from './types';

export const calculatePerformanceMetrics = (monthlyCuts: number[], excludedFromAverage: boolean[]) => {
  const safeCuts = monthlyCuts || new Array(12).fill(0);
  const safeExcluded = excludedFromAverage || new Array(12).fill(false);

  // 1. Current Total (Sum of ALL inputs, regardless of exclusion)
  const currentTotal = safeCuts.reduce((a, b) => a + (b || 0), 0);

  // 2. Average Calculation (Inputs > 0 AND Not Excluded)
  const validMonths = safeCuts.map((v, i) => ({ v, i }))
    .filter(item => item.v > 0 && !safeExcluded[item.i]);

  const validSum = validMonths.reduce((a, item) => a + item.v, 0);
  const validCount = validMonths.length;
  const average = validCount > 0 ? Math.round(validSum / validCount) : 0;

  // 3. Yearly Forecast
  // Fill '0' months with 'average'.
  const emptyCount = safeCuts.filter(v => v === 0).length;
  const predictedTotal = currentTotal + (average * emptyCount);

  return { currentTotal, average, predictedTotal, emptyCount };
};

export const calculateCutScore = (cuts: number) => {
  if (cuts < 6000) return 5;
  const base = 15;
  const extra = Math.floor((cuts - 6000) / 100);
  const total = base + extra;
  return Math.min(total, 50);
};
