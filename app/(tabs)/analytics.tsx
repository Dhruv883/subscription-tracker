import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DonutChart from "@/components/donut-chart";
import { MOCK_SUBSCRIPTIONS } from "@/data/subscriptions";
import { computeMonthlyTotal } from "@/utils/spend";
import CategoryItem from "@/components/category-badge";

export default function Analytics() {
  const monthlyTotal = computeMonthlyTotal(MOCK_SUBSCRIPTIONS);
  const categories = [
    { name: "Streaming", color: "#7B61FF", amount: 30 },
    { name: "Music", color: "#FF85A1", amount: 15 },
    { name: "AI", color: "#7ED957", amount: 20 },
    { name: "Utilities", color: "#FFC75F", amount: 25 },
    { name: "Education", color: "#5BC0EB", amount: 10 },
  ];
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer} edges={{ top: "off" }}>
      <ScrollView>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Monthly overview</Text>
        </View>
        <DonutChart totalSpent={monthlyTotal} />

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    height: "100%",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    marginTop: 4,
    color: "#666",
  },
  categories: {
    marginTop: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
