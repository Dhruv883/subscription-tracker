import { FiltersModal } from "@/components/filters-modal";
import { SortModal } from "@/components/sort-modal";
import SubscriptionCard from "@/components/subscription-card";
import { MOCK_SUBSCRIPTIONS } from "@/data/subscriptions";
import { useSheets } from "@/providers/sheets-context";
import { BillingCycle, SortKey } from "@/types/subscription";
import { formatDate } from "@/utils/date";
import { capitalize } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Subscription } from "@/types/subscription";

export default function SubscriptionsScreen() {
  const { openSubscriptionSheet } = useSheets();
  const [query, setQuery] = useState("");
  const [activeModal, setActiveModal] = useState<null | "filter" | "sort">(
    null
  );
  const [sortKey, setSortKey] = useState<SortKey>("nextbill-asc");
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, boolean>
  >({});
  const [selectedCycles, setSelectedCycles] = useState<
    Record<BillingCycle, boolean>
  >({
    monthly: false,
    yearly: false,
    weekly: false,
    quarterly: false,
    custom: false,
  });
  const [status, setStatus] = useState<"all" | "active" | "cancelled">("all");

  const categories = useMemo(() => {
    const set = new Set(MOCK_SUBSCRIPTIONS.map((d) => d.category));
    return Array.from(set);
  }, []);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hasCategoryFilter = Object.values(selectedCategories).some(Boolean);
    const hasCycleFilter = Object.values(selectedCycles).some(Boolean);

    let arr = MOCK_SUBSCRIPTIONS.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q)) return false;
      if (status !== "all") {
        const isActive = d.isActive !== false;
        if (status === "active" && !isActive) return false;
        if (status === "cancelled" && isActive) return false;
      }
      if (hasCategoryFilter && !selectedCategories[d.category]) return false;
      if (hasCycleFilter && !selectedCycles[d.billingCycle]) return false;
      return true;
    });

    const byDate = (iso?: string) => (iso ? new Date(iso).getTime() : 9e15);

    arr.sort((a, b) => {
      switch (sortKey) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "nextbill-asc":
          return byDate(a.nextBill) - byDate(b.nextBill);
        case "nextbill-desc":
          return byDate(b.nextBill) - byDate(a.nextBill);
        default:
          return 0;
      }
    });

    return arr;
  }, [query, status, selectedCategories, selectedCycles, sortKey]);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const toggleCycle = (name: BillingCycle) => {
    setSelectedCycles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearFilters = () => {
    setSelectedCategories({});
    setSelectedCycles({
      monthly: false,
      yearly: false,
      weekly: false,
      quarterly: false,
      custom: false,
    });
    setStatus("all");
  };

  const handleOpenDetails = (s: Subscription) => {
    const cycleLabel =
      (s as any).billingCycle === "custom" &&
      (s as any).customEvery &&
      (s as any).customUnit
        ? `Every ${(s as any).customEvery} ${(s as any).customUnit}${
            (s as any).customEvery > 1 ? "s" : ""
          }`
        : capitalize(s.billingCycle);
    openSubscriptionSheet({
      id: s.id,
      logo: s.logo,
      name: s.name,
      isActive: s.isActive !== false,
      amount: `$${s.price.toFixed(2)}`,
      nextBilling: s.nextBill ? formatDate(s.nextBill) : "—",
      category: s.category,
      billingCycle: cycleLabel,
      signupDate: "—",
      lastPayment: "—",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={{ top: "off" }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#9a9a9a" />
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="#9a9a9a"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setActiveModal("filter")}
            style={styles.actionButton}
          >
            <Ionicons name="options-outline" size={16} color="#111" />
            <Text style={styles.actionLabel}>Filters</Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveModal("sort")}
            style={styles.actionButton}
          >
            <Ionicons name="swap-vertical" size={16} color="#111" />
            <Text style={styles.actionLabel}>Sort By</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 6 }}>
          {filteredSorted.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No subscriptions found</Text>
            </View>
          ) : (
            filteredSorted.map((sub) => (
              <View key={sub.id}>
                <SubscriptionCard
                  id={sub.id}
                  logo={sub.logo}
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
                  date={
                    sub.isActive === false
                      ? "Cancelled"
                      : sub.nextBill
                      ? `Next bill: ${formatDate(sub.nextBill, true)}`
                      : undefined
                  }
                  onPress={() => handleOpenDetails(sub)}
                  isActive={sub.isActive !== false}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <FiltersModal
        visible={activeModal === "filter"}
        onRequestClose={() => setActiveModal(null)}
        categories={categories}
        status={status}
        setStatus={setStatus}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        selectedCycles={selectedCycles}
        toggleCycle={toggleCycle}
        clearFilters={clearFilters}
      />

      <SortModal
        visible={activeModal === "sort"}
        onRequestClose={() => setActiveModal(null)}
        sortKey={sortKey}
        setSortKey={setSortKey}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F8",
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    borderColor: "#E7E7E9",
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#111",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: "#E7E7E9",
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: {
    color: "#111",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#666",
  },
});
