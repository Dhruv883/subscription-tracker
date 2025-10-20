import { SORT_LABELS, SortKey } from "@/types/subscription";
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
  sortKey: SortKey;
  setSortKey: (k: SortKey) => void;
};

export function SortModal({
  visible,
  onRequestClose,
  sortKey,
  setSortKey,
}: Props) {
  const keys: SortKey[] = [
    "nextbill-asc",
    "nextbill-desc",
    "price-asc",
    "price-desc",
    "name-asc",
    "name-desc",
  ];
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
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Sort by</Text>
              <Pressable
                onPress={onRequestClose}
                style={styles.closeBtn}
                hitSlop={10}
              >
                <Ionicons name="close" size={20} color="#111" />
              </Pressable>
            </View>
            {keys.map((key) => (
              <Pressable
                key={key}
                style={styles.sortRow}
                onPress={() => {
                  setSortKey(key);
                  onRequestClose();
                }}
              >
                <Text
                  style={[
                    styles.sortLabel,
                    sortKey === key && { fontWeight: "700", color: "#111" },
                  ]}
                >
                  {SORT_LABELS[key]}
                </Text>
              </Pressable>
            ))}
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
    paddingTop: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
    width: "100%",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    marginTop: 8,
  },
  sortRow: {
    paddingVertical: 12,
  },
  sortLabel: {
    fontSize: 15,
    color: "#333",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
});
