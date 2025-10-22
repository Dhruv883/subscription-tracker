import { capitalize } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SubscriptionDetailsProps = {
  id: string;
  link?: string;
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
  id,
  link,
  name,
  isActive,
  amount,
  nextBilling,
  category,
  billingCycle,
  signupDate,
  onManage,
  onDelete,
}: SubscriptionDetailsProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const details = [
    {
      label: "Category",
      value: category && capitalize(category),
    },
    { label: "Billing Cycle", value: billingCycle },
    { label: "Sign-up Date", value: signupDate },
    { label: "Next Payment", value: nextBilling },
  ];

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete?.();
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Image
              source={{
                uri: `https://img.logo.dev/${link}?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true`,
              }}
              style={styles.icon}
            />
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
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={20} color="#D9534F" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDeleteModal(false)}
        >
          <Pressable
            style={styles.deleteModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.deleteModalContent}>
              <Ionicons
                name="trash-outline"
                size={40}
                color="#D9534F"
                style={styles.deleteIcon}
              />
              <Text style={styles.deleteModalTitle}>Delete Subscription?</Text>
              <Text style={styles.deleteModalMessage}>
                Are you sure you want to delete {name}? This action cannot be
                undone.
              </Text>
            </View>

            <View style={styles.deleteModalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmDeleteButton}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.confirmDeleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    maxWidth: 320,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  deleteModalContent: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  deleteIcon: {
    marginBottom: 12,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  deleteModalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  deleteModalActions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EAEAEA",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#D9534F",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
