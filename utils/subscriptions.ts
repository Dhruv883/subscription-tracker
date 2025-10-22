import { Subscription } from "@/types/subscription";
import { getOccurrencesInMonth } from "@/utils/date";

/**
 * @description Returns all subscription occurrences for a given month and year.
 */
// TODO: Calculate for inactive subscriptions, if the subscription has been cancelled after payment date
export function getSubscriptionsForMonth(
  subscriptions: Subscription[],
  year: number,
  monthIndex: number
) {
  const results: { sub: Subscription; occurrence: Date }[] = [];

  for (const subscription of subscriptions) {
    if (!subscription.nextBill || subscription.isActive === false) continue;

    const occurrences = getOccurrencesInMonth({
      anchorIso: subscription.nextBill,
      billingCycle: subscription.billingCycle,
      customPeriod: subscription.customEvery,
      customUnit: subscription.customUnit,
      year,
      monthIndex,
    });
    for (const occurrence of occurrences) {
      results.push({ sub: subscription, occurrence });
    }
  }
  return results;
}

/**
 *  @description Groups subscriptions by date into previous and upcoming.
 */
export function groupSubscriptionsByDate(
  subscriptionOccurrences: { sub: Subscription; occurrence: Date }[],
  today: Date
) {
  const previousSubscriptionsByDate: Record<string, Subscription[]> = {};
  const upcomingSubscriptionsByDate: Record<string, Subscription[]> = {};

  for (const { sub: subscription, occurrence } of subscriptionOccurrences) {
    const date = occurrence;

    if (isNaN(date.getTime())) continue;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    if (date < today) {
      if (!previousSubscriptionsByDate[key])
        previousSubscriptionsByDate[key] = [];
      previousSubscriptionsByDate[key].push(subscription);
    } else {
      if (!upcomingSubscriptionsByDate[key])
        upcomingSubscriptionsByDate[key] = [];
      upcomingSubscriptionsByDate[key].push(subscription);
    }
  }
  return { previousSubscriptionsByDate, upcomingSubscriptionsByDate };
}

export function getSubscriptionCycleLabel(subscription: Subscription): string {
  if (
    subscription.billingCycle === "custom" &&
    subscription.customEvery &&
    subscription.customUnit
  ) {
    const plural = subscription.customEvery > 1 ? "s" : "";
    return `${subscription.customEvery} ${subscription.customUnit}${plural}`;
  }
  return (
    subscription.billingCycle.charAt(0).toUpperCase() +
    subscription.billingCycle.slice(1)
  );
}
