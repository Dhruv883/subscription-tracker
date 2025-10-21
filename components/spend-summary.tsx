import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyTotal: number;
  yearlyTotal: number;
  paddingHorizontal?: number;
  style?: object;
  monthLabel?: string;
};

export default function SpendSummary({
  monthlyTotal,
  yearlyTotal,
  paddingHorizontal = 20,
  style,
  monthLabel,
}: Props) {
  const screenWidth = Dimensions.get("window").width;
  const pageWidth = screenWidth - paddingHorizontal * 2;
  const computedMonthLabel = useMemo(
    () =>
      monthLabel ||
      new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()),
    [monthLabel]
  );

  return (
    <View style={style}>
      <View style={[styles.page, { width: pageWidth }]}>
        <Text style={styles.month}>{computedMonthLabel}</Text>
        <Text style={styles.amount}>${monthlyTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    marginBottom: 8,
  },
  page: {
    alignItems: "center",
    paddingVertical: 20,
    marginRight: 20,
  },
  month: {
    color: "#9AA0B5",
    fontWeight: "700",
    fontSize: 13,
  },
  amount: {
    fontSize: 48,
    fontWeight: "900",
    marginTop: 6,
    color: "#5A67CE",
    letterSpacing: 0.25,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: "#5A67CE",
  },
});
