import CategoryItem from "@/components/category-badge";
import DonutChart from "@/components/donut-chart";
import SubscriptionCard from "@/components/subscription-card";
import SubscriptionDetailsCard from "@/components/subscription-detail";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SubscriptionOverview() {
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const subscriptionsByDate: {
    [date: string]: {
      logo: string;
      name: string;
      category: string;
      price: number;
      billingCycle: string;
      id: string;
    }[];
  } = {
    "June 24, 2024": [
      {
        logo: "https://img.logo.dev/netflix.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "Netflix",
        category: "Streaming",
        price: 15,
        billingCycle: "monthly",
        id: "netflix",
      },
    ],
    "July 1, 2024": [
      {
        logo: "https://img.logo.dev/spotify.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "Spotify",
        category: "Music",
        price: 10,
        billingCycle: "monthly",
        id: "spotify",
      },
      {
        logo: "https://img.logo.dev/youtube.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "YouTube",
        category: "Streaming",
        price: 20,
        billingCycle: "yearly",
        id: "youtube",
      },
    ],
    "July 15, 2024": [
      {
        logo: "https://img.logo.dev/netflix.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "Netflix",
        category: "Streaming",
        price: 10,
        billingCycle: "monthly",
        id: "netflix",
      },
      {
        logo: "https://img.logo.dev/youtube.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "YouTube",
        category: "Streaming",
        price: 20,
        billingCycle: "monthly",
        id: "youtube",
      },
      {
        logo: "https://img.logo.dev/spotify.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "Spotify",
        category: "Music",
        price: 10,
        billingCycle: "weekly",
        id: "spotify",
      },
      {
        logo: "https://img.logo.dev/netflix.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
        name: "Netflix",
        category: "Streaming",
        price: 20,
        billingCycle: "quarterly",
        id: "netflix",
      },
    ],
  };

  const handleCardPress = (id: string) => {
    console.log("Card pressed:", id);

    bottomSheetRef.current?.expand();
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
          {Object.entries(subscriptionsByDate).map(([date, subs]) => (
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
                  onPress={handleCardPress}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} index={-1} enablePanDownToClose={true}>
        <BottomSheetView>
          <SubscriptionDetailsCard />
        </BottomSheetView>
      </BottomSheet>
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
