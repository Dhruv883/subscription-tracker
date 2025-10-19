import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Image,
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

type PickerOption = { label: string; value: string };

const CATEGORIES: PickerOption[] = [
  { label: "Streaming", value: "streaming" },
  { label: "Productivity", value: "productivity" },
  { label: "Utilities", value: "utilities" },
  { label: "Music", value: "music" },
  { label: "Gaming", value: "gaming" },
  { label: "Education", value: "education" },
];

const BILLING_CYCLES: PickerOption[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function InputWrapper({
  children,
  left,
  right,
}: {
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.inputContainer}>
      {left ? <View style={styles.inputLeft}>{left}</View> : null}
      <View style={styles.inputContent}>{children}</View>
      {right ? <View style={styles.inputRight}>{right}</View> : null}
    </View>
  );
}

function OptionPicker({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: {
  visible: boolean;
  title: string;
  options: PickerOption[];
  onClose: () => void;
  onSelect: (opt: PickerOption) => void;
}) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((o) => (
            <Pressable
              key={o.value}
              style={({ pressed }) => [
                styles.modalItem,
                pressed && { backgroundColor: "#F4F4F6" },
              ]}
              onPress={() => {
                onSelect(o);
                onClose();
              }}
            >
              <Text style={styles.modalItemLabel}>{o.label}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type AddSubscriptionFormProps = {
  keyboardOffset?: number;
};

const AddSubscriptionForm = ({ keyboardOffset }: AddSubscriptionFormProps) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState<PickerOption>(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<PickerOption>(
    BILLING_CYCLES[1]
  );
  const [nextBill, setNextBill] = useState("");

  const [pickerFor, setPickerFor] = useState<
    null | "category" | "billingCycle"
  >(null);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && amount.trim().length > 0,
    [name, amount]
  );

  const handleSubmit = () => {
    const payload = {
      name: name.trim(),
      link: link.trim(),
      category: category.value,
      amount: amount.trim(),
      billingCycle: billingCycle.value,
      nextBill: nextBill.trim(),
    };
    console.log("Add Subscription ->", payload);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        keyboardOffset ?? (Platform.OS === "ios" ? 24 : 0)
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.wrapper}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.heading}>Add New Subscription</Text>
        <View style={styles.logoBox}>
          <Image
            source={{
              uri: "https://img.logo.dev/zomato.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
            }}
            style={{ width: 70, height: 70, borderRadius: 6 }}
          />
        </View>

        {/* Name */}
        <FieldLabel>Subscription Name</FieldLabel>
        <InputWrapper>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Netflix"
            placeholderTextColor="#9AA0A6"
            style={styles.textInput}
          />
        </InputWrapper>

        {/* Link */}
        <FieldLabel>Subscription Link</FieldLabel>
        <InputWrapper>
          <TextInput
            value={link}
            onChangeText={setLink}
            placeholder="https://example.com/manage"
            placeholderTextColor="#9AA0A6"
            style={styles.textInput}
            autoCapitalize="none"
            keyboardType="url"
          />
        </InputWrapper>

        {/* Category */}
        <FieldLabel>Category</FieldLabel>
        <Pressable onPress={() => setPickerFor("category")}>
          <InputWrapper
            right={<Ionicons name="chevron-down" size={18} color="#777" />}
          >
            <Text style={styles.valueText}>{category.label}</Text>
          </InputWrapper>
        </Pressable>

        {/* Amount */}
        <FieldLabel>Amount</FieldLabel>
        <InputWrapper left={<Text style={styles.prefix}>$</Text>}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="15.49"
            placeholderTextColor="#9AA0A6"
            style={styles.textInput}
            keyboardType="decimal-pad"
          />
        </InputWrapper>

        {/* Row: Billing cycle + Next bill */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <FieldLabel>Billing Cycle</FieldLabel>
            <Pressable onPress={() => setPickerFor("billingCycle")}>
              <InputWrapper
                right={<Ionicons name="chevron-down" size={18} color="#777" />}
              >
                <Text style={styles.valueText}>{billingCycle.label}</Text>
              </InputWrapper>
            </Pressable>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <FieldLabel>Next Bill</FieldLabel>
            <InputWrapper
              right={
                <Ionicons name="calendar-outline" size={18} color="#777" />
              }
            >
              <TextInput
                value={nextBill}
                onChangeText={setNextBill}
                placeholder="dd-mm-yyyy"
                placeholderTextColor="#9AA0A6"
                style={styles.textInput}
                keyboardType="numbers-and-punctuation"
              />
            </InputWrapper>
          </View>
        </View>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !canSubmit && { opacity: 0.6 },
            pressed && canSubmit ? { transform: [{ scale: 0.99 }] } : null,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Add Subscription</Text>
        </Pressable>

        {/* Pickers */}
        <OptionPicker
          visible={pickerFor === "category"}
          title="Select Category"
          options={CATEGORIES}
          onClose={() => setPickerFor(null)}
          onSelect={(opt) => setCategory(opt)}
        />
        <OptionPicker
          visible={pickerFor === "billingCycle"}
          title="Billing Cycle"
          options={BILLING_CYCLES}
          onClose={() => setPickerFor(null)}
          onSelect={(opt) => setBillingCycle(opt)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 6,
    flexGrow: 1,
  },
  heading: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 6,
    marginBottom: 16,
  },
  logoBox: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  inputLeft: {
    marginRight: 6,
  },
  inputRight: {
    marginLeft: 6,
  },
  inputContent: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 10,
  },
  valueText: {
    fontSize: 14,
    color: "#111",
    paddingVertical: 10,
  },
  prefix: {
    color: "#8A8A8A",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#000",
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

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

export default AddSubscriptionForm;
