import { MonthPicker } from "@/components/month-picker";
import SpendSummary from "@/components/spend-summary";
import SubscriptionCard from "@/components/subscription-card";
import { useSheets } from "@/providers/sheets-context";
import { useSubscriptions } from "@/providers/subscriptions-context";
import { Subscription } from "@/types/subscription";
import { formatDate, getOccurrencesInMonth } from "@/utils/date";
import {
  computeMonthlyTotalByOccurrences,
  computeYearlyTotal,
} from "@/utils/spend";
import { capitalize } from "@/utils/string";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SubscriptionOverview() {
  const { openSubscriptionSheet } = useSheets();
  const { subscriptions, loading } = useSubscriptions();

  // Month selection: current month + next 12 months
  const [selectedOffset, setSelectedOffset] = useState<number>(0); // 0 = current, 1 = next, ... up to 12
  const now = useMemo(() => new Date(), []);
  const { selYear, selMonthIndex } = useMemo(() => {
    const y = now.getFullYear();
    const m = now.getMonth();
    const totalMonths = m + selectedOffset;
    const selYear = y + Math.floor(totalMonths / 12);
    const selMonthIndex = totalMonths % 12;
    return { selYear, selMonthIndex };
  }, [now, selectedOffset]);
  const startOfToday = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  // Build list of subscriptions that have occurrences within the selected month
  const selectedMonthSubs = useMemo(() => {
    const results: { sub: Subscription; occurrence: Date }[] = [];
    for (const s of subscriptions) {
      if (!s.nextBill || s.isActive === false) continue;
      const occs = getOccurrencesInMonth({
        anchorIso: s.nextBill,
        billingCycle: s.billingCycle,
        customEvery: s.customEvery,
        customUnit: s.customUnit,
        year: selYear,
        monthIndex: selMonthIndex,
      });
      for (const occ of occs) results.push({ sub: s, occurrence: occ });
    }
    return results;
  }, [subscriptions, selYear, selMonthIndex]);

  const monthlyTotal = useMemo(
    () => computeMonthlyTotalByOccurrences(selectedMonthSubs),
    [selectedMonthSubs]
  );
  const yearlyTotal = useMemo(
    () => computeYearlyTotal(selectedMonthSubs.map((r) => r.sub)),
    [selectedMonthSubs]
  );

  const { previousByDate, upcomingByDate } = useMemo(() => {
    const previousByDate: Record<string, Subscription[]> = {};
    const upcomingByDate: Record<string, Subscription[]> = {};
    for (const { sub: s, occurrence } of selectedMonthSubs) {
      const dt = occurrence;
      if (isNaN(dt.getTime())) continue;
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const d = String(dt.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${d}`;
      if (dt < startOfToday) {
        if (!previousByDate[key]) previousByDate[key] = [];
        previousByDate[key].push(s);
      } else {
        if (!upcomingByDate[key]) upcomingByDate[key] = [];
        upcomingByDate[key].push(s);
      }
    }
    return { previousByDate, upcomingByDate };
  }, [selectedMonthSubs, startOfToday]);

  const formatDayKey = (key: string) => {
    const [y, m, d] = key.split("-").map((n) => parseInt(n, 10));
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return formatDate(dt.toISOString());
  };

  const handleCardPress = (sub: Subscription) => {
    const cycleLabel =
      (sub as any).billingCycle === "custom" &&
      (sub as any).customEvery &&
      (sub as any).customUnit
        ? `${(sub as any).customEvery} ${(sub as any).customUnit}${
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBg}>
          <SpendSummary
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            monthLabel={new Intl.DateTimeFormat("en-US", {
              month: "long",
              year: "numeric",
            }).format(new Date(selYear, selMonthIndex, 1))}
            paddingHorizontal={20}
          />
          <MonthPicker
            baseDate={now}
            offset={selectedOffset}
            onChange={setSelectedOffset}
            minOffset={0}
            maxOffset={12}
          />
        </View>

        <View style={styles.sheet}>
          {Object.keys(upcomingByDate).length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.sectionHeader}>Upcoming</Text>
              {Object.keys(upcomingByDate)
                .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                .map((dayKey) => (
                  <View key={`up-${dayKey}`}>
                    <Text style={styles.dateHeader}>
                      {formatDayKey(dayKey)}
                    </Text>
                    {upcomingByDate[dayKey].map((sub, idx) => (
                      <SubscriptionCard
                        id={sub.id}
                        key={`up-${sub.name}-${idx}`}
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
          )}

          {Object.keys(previousByDate).length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionHeader}>Previous</Text>
              {Object.keys(previousByDate)
                .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
                .map((dayKey) => (
                  <View key={`prev-${dayKey}`}>
                    <Text style={styles.dateHeader}>
                      {formatDayKey(dayKey)}
                    </Text>
                    {previousByDate[dayKey].map((sub, idx) => (
                      <SubscriptionCard
                        id={sub.id}
                        key={`prev-${sub.name}-${idx}`}
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
          )}

          {Object.keys(upcomingByDate).length === 0 &&
            Object.keys(previousByDate).length === 0 && (
              <View style={{ paddingVertical: 16 }}>
                <Text style={{ color: "#6B7280", fontSize: 14 }}>
                  No subscriptions found for this month.
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F2F6",
    padding: 20,
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
    flex: 1,
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
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 8,
  },
});
