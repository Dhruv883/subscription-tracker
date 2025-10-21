import SpendSummary from "@/components/spend-summary";
import SubscriptionCard from "@/components/subscription-card";
import { useSheets } from "@/providers/sheets-context";
import { useSubscriptions } from "@/providers/subscriptions-context";
import { Subscription } from "@/types/subscription";
import { formatDate } from "@/utils/date";
import { computeMonthlyTotal, computeYearlyTotal } from "@/utils/spend";
import { capitalize } from "@/utils/string";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SubscriptionOverview() {
  const { openSubscriptionSheet } = useSheets();
  const { subscriptions, loading } = useSubscriptions();

  const monthlyTotal = useMemo(
    () => computeMonthlyTotal(subscriptions),
    [subscriptions]
  );
  const yearlyTotal = useMemo(
    () => computeYearlyTotal(subscriptions),
    [subscriptions]
  );

  const groupByDate = (subs: Subscription[]) => {
    // Example: group by nextBill date (format as string)
    return subs.reduce((acc, sub) => {
      const date = sub.nextBill ? formatDate(sub.nextBill) : "No Date";
      if (!acc[date]) acc[date] = [];
      acc[date].push(sub);
      return acc;
    }, {} as Record<string, Subscription[]>);
  };

  const subscriptionsByDate = useMemo(
    () => groupByDate(subscriptions),
    [subscriptions]
  );

  const handleCardPress = (sub: Subscription) => {
    const cycleLabel =
      (sub as any).billingCycle === "custom" &&
      (sub as any).customEvery &&
      (sub as any).customUnit
        ? `Every ${(sub as any).customEvery} ${(sub as any).customUnit}${
            (sub as any).customEvery > 1 ? "s" : ""
          }`
        : capitalize(sub.billingCycle);
    openSubscriptionSheet({
      id: sub.id,
      link: sub.link,
      name: sub.name,
      isActive: sub.isActive !== false,
      amount: `$${sub.price.toFixed(2)}`,
      nextBilling: sub.nextBill ? formatDate(sub.nextBill) : "—",
      category: sub.category,
      billingCycle: cycleLabel,
      signupDate: "—",
      lastPayment: "—",
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading subscriptions...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBg}>
          <SpendSummary
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            paddingHorizontal={20}
          />
        </View>

        <View style={styles.sheet}>
          {Object.entries(subscriptionsByDate).map(([date, subs]) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {subs.map((sub, idx) => (
                <SubscriptionCard
                  id={sub.id}
                  key={sub.name + idx}
                  link={sub.link}
                  name={sub.name}
                  category={sub.category}
                  price={sub.price}
                  billingCycle={
                    sub.billingCycle === "custom" &&
                    (sub as any).customEvery &&
                    (sub as any).customUnit
                      ? `Every ${(sub as any).customEvery} ${
                          (sub as any).customUnit
                        }${(sub as any).customEvery > 1 ? "s" : ""}`
                      : sub.billingCycle
                  }
                  onPress={() => handleCardPress(sub)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F2F6",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerBg: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 14,
    marginBottom: 8,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginTop: 2,
  },
  sheet: {
    marginHorizontal: -20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#444",
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9AA0B5",
    marginTop: 18,
    marginBottom: 2,
  },
});
