import { Subscription } from "@/types/subscription";

const WEEKS_PER_MONTH = 52 / 12;

export function monthlyCostOf(sub: Subscription): number {
  const price = sub.price ?? 0;
  switch (sub.billingCycle) {
    case "weekly":
      return price * WEEKS_PER_MONTH;
    case "monthly":
      return price;
    case "quarterly":
      return price / 3;
    case "yearly":
      return price / 12;
    default:
      return price;
  }
}

export function yearlyCostOf(sub: Subscription): number {
  const price = sub.price ?? 0;
  switch (sub.billingCycle) {
    case "weekly":
      return price * 52;
    case "monthly":
      return price * 12;
    case "quarterly":
      return price * 4;
    case "yearly":
      return price;
    default:
      return price;
  }
}

function isActive(sub: Subscription): boolean {
  return sub.isActive !== false;
}

export function computeMonthlyTotal(subs: Subscription[]): number {
  const total = subs
    .filter(isActive)
    .reduce((sum, s) => sum + monthlyCostOf(s), 0);
  return roundCurrency(total);
}

export function computeYearlyTotal(subs: Subscription[]): number {
  const total = subs
    .filter(isActive)
    .reduce((sum, s) => sum + yearlyCostOf(s), 0);
  return roundCurrency(total);
}

export function roundCurrency(n: number): number {
  return Math.round(n * 100) / 100;
}
