import { MOCK_SUBSCRIPTIONS } from "@/data/subscriptions";
import type { BillingCycle, Subscription } from "@/types/subscription";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PickerOption = { label: string; value: string };

const CATEGORIES: PickerOption[] = [
  { label: "Streaming", value: "Streaming" },
  { label: "Productivity", value: "Productivity" },
  { label: "Utilities", value: "Utilities" },
  { label: "Music", value: "Music" },
  { label: "Gaming", value: "Gaming" },
  { label: "Education", value: "Education" },
  { label: "Shopping", value: "Shopping" },
];

const BILLING_CYCLES: PickerOption[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

export default function ManageSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const initial: Subscription | undefined = useMemo(
    () => MOCK_SUBSCRIPTIONS.find((s) => s.id === id),
    [id]
  );

  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<PickerOption>(
    CATEGORIES.find((c) => c.value === initial?.category) || CATEGORIES[0]
  );
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [billingCycle, setBillingCycle] = useState<PickerOption>(
    BILLING_CYCLES.find((c) => c.value === initial?.billingCycle) ||
      BILLING_CYCLES[1]
  );
  const [nextBill, setNextBill] = useState(
    initial?.nextBill ? formatDate(initial.nextBill) : ""
  );
  const [isActive, setIsActive] = useState(initial?.isActive !== false);
  const [link, setLink] = useState(initial?.link ?? "");
  const [pickerFor, setPickerFor] = useState<
    null | "category" | "billingCycle"
  >(null);

  const canSave = useMemo(
    () => name.trim().length > 0 && price.trim().length > 0,
    [name, price]
  );

  const onSave = () => {
    const payload = {
      id,
      name: name.trim(),
      category: category.value,
      price: parseFloat(price),
      billingCycle: billingCycle.value as BillingCycle,
      nextBill: nextBill.trim(),
      isActive,
      link: link.trim(),
    };
    console.log("Save Subscription ->", payload);
    router.back();
  };

  useEffect(() => {
    if (!initial) return;
    setName(initial.name ?? "");
    setCategory(
      CATEGORIES.find((c) => c.value === initial.category) || CATEGORIES[0]
    );
    setPrice(String(initial.price ?? ""));
    setBillingCycle(
      BILLING_CYCLES.find((c) => c.value === initial.billingCycle) ||
        BILLING_CYCLES[1]
    );
    setNextBill(initial.nextBill ? formatDate(initial.nextBill) : "");
    setIsActive(initial.isActive !== false);
    setLink(initial.link ?? "");
  }, [initial]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F7F7F8" }}
      edges={{ top: "off" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={24}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.wrapper}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Status</Text>
          <View style={styles.segmentContainer}>
            <Pressable
              onPress={() => setIsActive(true)}
              style={[styles.segmentItem, isActive && styles.segmentItemActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isActive && styles.segmentTextActive,
                ]}
              >
                Active
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsActive(false)}
              style={[
                styles.segmentItem,
                !isActive && styles.segmentItemActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  !isActive && styles.segmentTextActive,
                ]}
              >
                Inactive
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Netflix"
              placeholderTextColor="#9AA0A6"
              style={styles.textInput}
            />
          </View>

          <Text style={styles.label}>Manage Link</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="link-outline" size={16} color="#777" />
            <TextInput
              value={link}
              onChangeText={setLink}
              placeholder="https://example.com/manage"
              placeholderTextColor="#9AA0A6"
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <Text style={styles.label}>Category</Text>
          <Pressable onPress={() => setPickerFor("category")}>
            <View style={styles.inputContainer}>
              <Text style={styles.valueText}>{category.label}</Text>
              <Ionicons name="chevron-down" size={18} color="#777" />
            </View>
          </Pressable>

          <Text style={styles.label}>Price</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>$</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="15.99"
              placeholderTextColor="#9AA0A6"
              style={styles.textInput}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.label}>Billing Cycle</Text>
          <Pressable onPress={() => setPickerFor("billingCycle")}>
            <View style={styles.inputContainer}>
              <Text style={styles.valueText}>{billingCycle.label}</Text>
              <Ionicons name="chevron-down" size={18} color="#777" />
            </View>
          </Pressable>

          <Text style={styles.label}>Next Bill</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={16} color="#777" />
            <TextInput
              value={nextBill}
              onChangeText={setNextBill}
              placeholder="dd-mm-yyyy"
              placeholderTextColor="#9AA0A6"
              style={styles.textInput}
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </ScrollView>

        <View style={styles.saveBtnContainer}>
          <Pressable
            style={[styles.saveBtn, !canSave && { opacity: 0.6 }]}
            disabled={!canSave}
            onPress={onSave}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={pickerFor === "category"}
          onRequestClose={() => setPickerFor(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickerFor(null)}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Select Category</Text>
              {CATEGORIES.map((o) => (
                <Pressable
                  key={o.value}
                  style={({ pressed }) => [
                    styles.modalItem,
                    pressed && { backgroundColor: "#F4F4F6" },
                  ]}
                  onPress={() => {
                    setCategory(o);
                    setPickerFor(null);
                  }}
                >
                  <Text style={styles.modalItemLabel}>{o.label}</Text>
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          animationType="fade"
          transparent
          visible={pickerFor === "billingCycle"}
          onRequestClose={() => setPickerFor(null)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickerFor(null)}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={styles.modalTitle}>Billing Cycle</Text>
              {BILLING_CYCLES.map((o) => (
                <Pressable
                  key={o.value}
                  style={({ pressed }) => [
                    styles.modalItem,
                    pressed && { backgroundColor: "#F4F4F6" },
                  ]}
                  onPress={() => {
                    setBillingCycle(o);
                    setPickerFor(null);
                  }}
                >
                  <Text style={styles.modalItemLabel}>{o.label}</Text>
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  wrapper: { padding: 16, paddingTop: 8 },
  label: { fontSize: 13, color: "#666", marginTop: 12, marginBottom: 8 },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E7E7E9",
    borderWidth: StyleSheet.hairlineWidth,
  },
  textInput: { flex: 1, fontSize: 14, color: "#111" },
  valueText: { flex: 1, fontSize: 14, color: "#111", paddingVertical: 10 },
  prefix: { color: "#8A8A8A", fontWeight: "600", marginRight: 6 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F3F5",
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentItemActive: {
    backgroundColor: "#111",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  segmentTextActive: {
    color: "#fff",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: "#E7E7E9",
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusCtrl: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusText: { color: "#111", fontWeight: "600" },
  saveBtnContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F7F7F8",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  modalItemLabel: {
    fontSize: 14,
    color: "#222",
    fontWeight: "600",
  },
});
