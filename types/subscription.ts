export type BillingCycle =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export type Subscription = {
  id: string;
  logo?: string;
  name: string;
  category: string;
  price: number;
  billingCycle: BillingCycle;
  nextBill?: string;
  isActive?: boolean;
  link?: string;
  customEvery?: number;
  customUnit?: "day" | "week" | "month" | "year";
};

export type SortKey =
  | "name-asc"
  | "price-asc"
  | "price-desc"
  | "nextbill-asc"
  | "nextbill-desc"
  | "name-desc";

export const SORT_LABELS: Record<SortKey, string> = {
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)",
  "nextbill-asc": "Next Bill (Soonest)",
  "nextbill-desc": "Next Bill (Latest)",
};
