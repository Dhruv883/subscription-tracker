import CategoryItem from "@/components/category-badge";
import DonutChart from "@/components/donut-chart";
import SubscriptionCard from "@/components/subscription-card";
import { MOCK_SUBSCRIPTIONS_BY_DATE } from "@/data/subscriptions";
import { useSheets } from "@/providers/sheets-context";
import { Subscription } from "@/types/subscription";
import { formatDate } from "@/utils/date";
import { capitalize } from "@/utils/string";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubscriptionOverview() {
  const { openSubscriptionSheet } = useSheets();
  const totalSpent = 275;

  const categories = [
    {
      name: "Streaming",
      color: "#7B61FF",
      amount: 30,
    },
    { name: "Music", color: "#FF85A1", amount: 15 },
    { name: "AI", color: "#7ED957", amount: 20 },
    { name: "Utilities", color: "#FFC75F", amount: 25 },
    { name: "Education", color: "#5BC0EB", amount: 10 },
  ];

  const handleCardPress = (sub: Subscription) => {
    openSubscriptionSheet({
      logo: sub.logo,
      name: sub.name,
      isActive: sub.isActive !== false,
      amount: `$${sub.price.toFixed(2)}`,
      nextBilling: sub.nextBill ? formatDate(sub.nextBill) : "—",
      category: sub.category,
      billingCycle: capitalize(sub.billingCycle),
      signupDate: "—",
      lastPayment: "—",
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Overview</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, styles.activeToggle]}
            >
              <Text style={styles.activeText}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggleButton}>
              <Text style={styles.inactiveText}>Yearly</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DonutChart totalSpent={totalSpent} />

        <View style={styles.categories}>
          {categories.map((category, idx) => (
            <CategoryItem
              key={idx}
              name={category.name}
              color={category.color}
              amount={category.amount}
            />
          ))}
        </View>

        <View style={{ marginTop: 16, paddingBottom: 32 }}>
          {Object.entries(MOCK_SUBSCRIPTIONS_BY_DATE).map(([date, subs]) => (
            <View key={date}>
              <Text style={styles.dateHeader}>{date}</Text>
              {subs.map((sub, idx) => (
                <SubscriptionCard
                  id={sub.id}
                  key={sub.name + idx}
                  logo={sub.logo}
                  name={sub.name}
                  category={sub.category}
                  price={sub.price}
                  billingCycle={sub.billingCycle}
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
    backgroundColor: "#F9F9FB",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 0,
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: "#fff",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#888",
  },
  categories: {
    marginTop: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
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
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
});
