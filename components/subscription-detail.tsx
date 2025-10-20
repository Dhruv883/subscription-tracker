import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SubscriptionDetailsProps = {
  id?: string;
  logo?: string;
  name?: string;
  isActive?: boolean;
  amount?: string | number;
  nextBilling?: string;
  category?: string;
  billingCycle?: string;
  signupDate?: string;
  lastPayment?: string;
  onManage?: () => void;
  onDelete?: () => void;
};

const SubscriptionDetailsCard = ({
  logo = "https://img.logo.dev/netflix.com?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true",
  name = "Netflix",
  isActive = true,
  amount = "$15.99",
  nextBilling = "Jul 15, 2024",
  category = "Streaming",
  billingCycle = "Monthly",
  signupDate = "Jan 15, 2023",
  lastPayment = "Jun 15, 2024",
  onManage,
  onDelete,
}: SubscriptionDetailsProps) => {
  const details = [
    { label: "Category", value: category },
    { label: "Billing Cycle", value: billingCycle },
    { label: "Sign-up Date", value: signupDate },
    { label: "Last Payment", value: lastPayment },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Image source={{ uri: logo }} style={styles.icon} />
            <View style={styles.headerText}>
              <Text style={styles.title}>{name}</Text>
              <View style={styles.statusPill}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isActive ? "#34C759" : "#D9534F" },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isActive ? "#34C759" : "#D9534F" },
                  ]}
                >
                  {isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>{amount}</Text>
            </View>
            <View style={styles.summaryItemRight}>
              <Text style={styles.summaryLabelRight}>Next Billing</Text>
              <Text style={styles.summaryValueRight}>{nextBilling}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Details</Text>

            <View style={styles.detailCard}>
              {details.map((d, idx) => (
                <View
                  key={d.label}
                  style={[
                    styles.detailRow,
                    idx < details.length - 1 && styles.detailDivider,
                  ]}
                >
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue}>{d.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.manageButton} onPress={onManage}>
              <Text style={styles.manageText}>Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={20} color="#D9534F" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SubscriptionDetailsCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#eee",
  },
  headerText: {
    marginLeft: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },
  statusPill: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F2F3F5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  summaryCard: {
    marginTop: 22,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  summaryItem: {
    flexShrink: 1,
    maxWidth: "55%",
  },
  summaryItemRight: {
    alignItems: "flex-end",
    flexShrink: 1,
    maxWidth: "45%",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 6,
  },
  summaryLabelRight: {
    fontSize: 13,
    color: "#8A8A8A",
    marginBottom: 6,
    textAlign: "right",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },
  summaryValueRight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  detailsSection: {
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  detailDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EAEAEA",
  },
  detailLabel: {
    fontSize: 14,
    color: "#777",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingBottom: 25,
    paddingTop: 20,
  },
  manageButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  manageText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  deleteButton: {
    marginLeft: 12,
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    padding: 14,
  },
});
