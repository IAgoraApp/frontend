import { journeySteps } from '../data/catalog';

export function journeyProgress(journey) {
  const total = journeySteps.reduce((sum, step) => sum + step.items.length, 0);
  const done = journeySteps.reduce(
    (sum, step) =>
      sum +
      step.items.filter((_, index) => journey[`${step.id}-${index}`]).length,
    0
  );
  return { total, done, percent: total ? (done / total) * 100 : 0 };
}
