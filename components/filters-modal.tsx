import { Chip } from "@/components/chip";
import type { BillingCycle } from "@/types/subscription";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  categories: string[];
  status: "all" | "active" | "cancelled";
  setStatus: (s: "all" | "active" | "cancelled") => void;
  selectedCategories: Record<string, boolean>;
  toggleCategory: (name: string) => void;
  selectedCycles: Record<BillingCycle, boolean>;
  toggleCycle: (name: BillingCycle) => void;
  clearFilters: () => void;
};

export function FiltersModal({
  visible,
  onRequestClose,
  categories,
  status,
  setStatus,
  selectedCategories,
  toggleCategory,
  selectedCycles,
  toggleCycle,
  clearFilters,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onRequestClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable style={styles.clearBtn} onPress={clearFilters}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </Pressable>
              <Pressable style={styles.closeBtn} onPress={onRequestClose}>
                <Ionicons name="close-outline" size={18} color="#111" />
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.rowWrap}>
                {(["all", "active", "cancelled"] as const).map((s) => (
                  <Chip
                    key={s}
                    label={s[0].toUpperCase() + s.slice(1)}
                    selected={status === s}
                    onPress={() => setStatus(s)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.rowWrap}>
                {categories.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    selected={!!selectedCategories[c]}
                    onPress={() => toggleCategory(c)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Billing cycle</Text>
              <View style={styles.rowWrap}>
                {(
                  [
                    "weekly",
                    "monthly",
                    "quarterly",
                    "yearly",
                    "custom",
                  ] as BillingCycle[]
                ).map((cycle) => (
                  <Chip
                    key={cycle}
                    label={cycle[0].toUpperCase() + cycle.slice(1)}
                    selected={!!selectedCycles[cycle]}
                    onPress={() => toggleCycle(cycle)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  clearBtnText: {
    color: "#333",
    fontWeight: "600",
  },
  closeBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    marginBottom: 8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
    width: "100%",
    alignSelf: "center",
  },
});
