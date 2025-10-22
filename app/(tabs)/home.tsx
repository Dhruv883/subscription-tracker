import { MonthPicker } from "@/components/month-picker";
import SpendSummary from "@/components/spend-summary";
import SubscriptionCard from "@/components/subscription-card";
import { useSheets } from "@/providers/sheets-context";
import { useSubscriptions } from "@/providers/subscriptions-context";
import { Subscription } from "@/types/subscription";
import { formatDate } from "@/utils/date";
import {
  computeMonthlyTotalByOccurrences,
  computeYearlyTotal,
} from "@/utils/spend";
import {
  getSubscriptionCycleLabel,
  getSubscriptionsForMonth,
  groupSubscriptionsByDate,
} from "@/utils/subscriptions";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface SubscriptionListSectionProps {
  title: string;
  byDate: Record<string, Subscription[]>;
  formatDayKey: (key: string) => string;
  handleCardPress: (sub: Subscription) => void;
  sectionKeyPrefix: string;
}

export default function SubscriptionOverview() {
  const { openSubscriptionSheet } = useSheets();
  const { subscriptions, loading } = useSubscriptions();

  const [monthOffset, setMonthOffset] = useState<number>(0);
  const currentDate = useMemo(() => new Date(), []);

  const { selectedYear, selectedMonthIndex } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalMonths = month + monthOffset;
    const selectedYear = year + Math.floor(totalMonths / 12);
    const selectedMonthIndex = totalMonths % 12;
    return { selectedYear, selectedMonthIndex };
  }, [currentDate, monthOffset]);

  const today = useMemo(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }, []);

  const subscriptionsForSelectedMonth = useMemo(
    () =>
      getSubscriptionsForMonth(subscriptions, selectedYear, selectedMonthIndex),
    [subscriptions, selectedYear, selectedMonthIndex]
  );

  const monthlyTotal = useMemo(
    () => computeMonthlyTotalByOccurrences(subscriptionsForSelectedMonth),
    [subscriptionsForSelectedMonth]
  );
  const yearlyTotal = useMemo(
    () => computeYearlyTotal(subscriptionsForSelectedMonth.map((r) => r.sub)),
    [subscriptionsForSelectedMonth]
  );

  const { previousSubscriptionsByDate, upcomingSubscriptionsByDate } = useMemo(
    () => groupSubscriptionsByDate(subscriptionsForSelectedMonth, today),
    [subscriptionsForSelectedMonth, today]
  );

  const formatDateKey = (key: string) => {
    const [year, month, day] = key.split("-").map((n) => parseInt(n, 10));
    const date = new Date(year, (month || 1) - 1, day || 1);
    return formatDate(date.toISOString());
  };

  const handleSubscriptionCardPress = (subscription: Subscription) => {
    const cycleLabel = getSubscriptionCycleLabel(subscription);
    openSubscriptionSheet({
      id: subscription.id,
      link: subscription.link,
      name: subscription.name,
      isActive: subscription.isActive,
      amount: `$${subscription.price.toFixed(2)}`,
      nextBilling: subscription.nextBill
        ? formatDate(subscription.nextBill)
        : "—",
      category: subscription.category,
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
            }).format(new Date(selectedYear, selectedMonthIndex, 1))}
            paddingHorizontal={20}
          />
          <MonthPicker
            baseDate={currentDate}
            offset={monthOffset}
            onChange={setMonthOffset}
            minOffset={0}
            maxOffset={12}
          />
        </View>

        <View style={styles.sheet}>
          <SubscriptionListSection
            title="Upcoming"
            byDate={upcomingSubscriptionsByDate}
            formatDayKey={formatDateKey}
            handleCardPress={handleSubscriptionCardPress}
            sectionKeyPrefix="up"
          />

          <SubscriptionListSection
            title="Previous"
            byDate={previousSubscriptionsByDate}
            formatDayKey={formatDateKey}
            handleCardPress={handleSubscriptionCardPress}
            sectionKeyPrefix="prev"
          />

          {Object.keys(upcomingSubscriptionsByDate).length === 0 &&
            Object.keys(previousSubscriptionsByDate).length === 0 && (
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

const SubscriptionListSection: React.FC<SubscriptionListSectionProps> = ({
  title,
  byDate,
  formatDayKey,
  handleCardPress,
  sectionKeyPrefix,
}) => {
  if (Object.keys(byDate).length === 0) {
    return null;
  }

  const sortedKeys = Object.keys(byDate).sort((a, b) =>
    title === "Upcoming" ? (a < b ? -1 : 1) : a > b ? -1 : 1
  );
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {sortedKeys.map((dayKey) => (
        <View key={`${sectionKeyPrefix}-${dayKey}`}>
          <Text style={styles.dateHeader}>{formatDayKey(dayKey)}</Text>
          {byDate[dayKey].map((sub, idx) => (
            <SubscriptionCard
              id={sub.id}
              key={`${sectionKeyPrefix}-${sub.name}-${idx}`}
              link={sub.link}
              name={sub.name}
              category={sub.category}
              price={sub.price}
              billingCycle={getSubscriptionCycleLabel(sub)}
              onPress={() => handleCardPress(sub)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

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
