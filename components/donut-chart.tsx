import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const DonutChart = ({ totalSpent }: { totalSpent: number }) => {
  return (
    <View style={styles.chartContainer}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="40"
          stroke="#eee"
          strokeWidth="10"
          fill="none"
        />
        <Circle
          cx="50"
          cy="50"
          r="40"
          stroke="#7B61FF"
          strokeWidth="10"
          strokeDasharray="251.2"
          strokeDashoffset="100"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.chartTextContainer}>
        <Text style={styles.totalSpent}>${totalSpent}</Text>
        <Text style={styles.subText}>Total Spent</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  chartTextContainer: {
    position: "absolute",
    alignItems: "center",
  },
  totalSpent: {
    fontSize: 22,
    fontWeight: "700",
  },
  subText: {
    color: "#888",
    fontSize: 12,
  },
});

export default DonutChart;
