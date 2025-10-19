import React, { useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyTotal: number;
  yearlyTotal: number;
  paddingHorizontal?: number;
  style?: object;
};

export default function SpendSummary({
  monthlyTotal,
  yearlyTotal,
  paddingHorizontal = 20,
  style,
}: Props) {
  const [page, setPage] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const pageWidth = screenWidth - paddingHorizontal * 2;
  const pagerRef = useRef<ScrollView | null>(null);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date()),
    []
  );

  return (
    <View style={style}>
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const p = Math.round(x / pageWidth);
          if (p !== page) setPage(p);
        }}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        <View style={[styles.page, { width: pageWidth }]}>
          <Text style={styles.month}>{monthLabel}</Text>
          <Text style={styles.amount}>${monthlyTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.page, { width: pageWidth }]}>
          <Text style={styles.month}>Year to date</Text>
          <Text style={styles.amount}>${yearlyTotal.toFixed(2)}</Text>
        </View>
      </ScrollView>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, page === 0 && styles.dotActive]} />
        <View style={[styles.dot, page === 1 && styles.dotActive]} />
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
    color: "#7B61FF",
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
    backgroundColor: "#7B61FF",
  },
});
