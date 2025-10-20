import { Subscription } from "@/types/subscription";

const WEEKS_PER_MONTH = 52 / 12;
const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

function resolveCustomMonthlyCost(sub: Subscription): number {
  const price = sub.price ?? 0;
  const n = sub.customEvery && sub.customEvery > 0 ? sub.customEvery : 0;
  const unit = sub.customUnit;
  if (!n || !unit) return price; // fallback
  switch (unit) {
    case "week":
      return price * (WEEKS_PER_MONTH / n);
    case "month":
      return price / n;
    case "year":
      return price / (12 * n);
    case "day":
      return price * (DAYS_PER_MONTH / n);
    default:
      return price;
  }
}

function resolveCustomYearlyCost(sub: Subscription): number {
  const price = sub.price ?? 0;
  const n = sub.customEvery && sub.customEvery > 0 ? sub.customEvery : 0;
  const unit = sub.customUnit;
  if (!n || !unit) return price; // fallback
  switch (unit) {
    case "week":
      return price * (52 / n);
    case "month":
      return price * (12 / n);
    case "year":
      return price / n;
    case "day":
      return price * (DAYS_PER_YEAR / n);
    default:
      return price;
  }
}

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
    case "custom":
      return resolveCustomMonthlyCost(sub);
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
    case "custom":
      return resolveCustomYearlyCost(sub);
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
