import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type MonthPickerProps = {
  baseDate?: Date;
  offset: number;
  onChange: (offset: number) => void;
  minOffset?: number;
  maxOffset?: number;
  style?: object;
};

export function MonthPicker({
  baseDate,
  offset,
  onChange,
  minOffset = 0,
  maxOffset = 12,
  style,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const base = useMemo(() => baseDate ?? new Date(), [baseDate]);

  const selectedDate = useMemo(
    () => new Date(base.getFullYear(), base.getMonth() + offset, 1),
    [base, offset]
  );

  const label = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(selectedDate),
    [selectedDate]
  );

  const canDecrement = offset > minOffset;
  const canIncrement = offset < maxOffset;

  const months = useMemo(() => {
    return Array.from({ length: maxOffset - minOffset + 1 }, (_, i) => {
      const off = minOffset + i;
      const d = new Date(base.getFullYear(), base.getMonth() + off, 1);
      const short = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: d.getFullYear() !== base.getFullYear() ? "2-digit" : undefined,
      }).format(d);
      return { off, d, short };
    });
  }, [base, minOffset, maxOffset]);

  const handlePrev = () => canDecrement && onChange(offset - 1);
  const handleNext = () => canIncrement && onChange(offset + 1);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={handlePrev}
        disabled={!canDecrement}
        style={[styles.iconBtn, !canDecrement && styles.iconDisabled]}
        accessibilityLabel="Previous month"
      >
        <Ionicons name="chevron-back" size={18} color="#111" />
      </Pressable>

      <Pressable
        style={styles.labelWrap}
        onPress={() => setOpen(true)}
        accessibilityLabel="Open month picker"
      >
        <Text style={styles.label}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </Pressable>

      <Pressable
        onPress={handleNext}
        disabled={!canIncrement}
        style={[styles.iconBtn, !canIncrement && styles.iconDisabled]}
        accessibilityLabel="Next month"
      >
        <Ionicons name="chevron-forward" size={18} color="#111" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select month</Text>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingBottom: 12,
              }}
            >
              <View style={styles.grid}>
                {months.map(({ off, short }) => {
                  const selected = off === offset;
                  return (
                    <Pressable
                      key={off}
                      onPress={() => {
                        onChange(off);
                        setOpen(false);
                      }}
                      style={[
                        styles.monthItem,
                        selected && styles.monthItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.monthText,
                          selected && styles.monthTextSelected,
                        ]}
                      >
                        {short}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  iconDisabled: {
    opacity: 0.4,
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthItem: {
    width: "31%",
    marginHorizontal: "1.16%",
    marginVertical: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  monthItemSelected: {
    backgroundColor: "#E8E8EA",
  },
  monthText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  monthTextSelected: {
    color: "#111827",
  },
});
