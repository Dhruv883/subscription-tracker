import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type CategoryItemProps = {
  name: string;
  color: string;
  amount: number;
  style?: ViewStyle;
};

export default function CategoryItem({
  name,
  color,
  amount,
  style,
}: CategoryItemProps) {
  return (
    <View style={[styles.categoryItem, style]}>
      <View style={[styles.colorDot, { backgroundColor: color }]} />
      <Text style={styles.categoryText}>
        {name}: ${amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    color: "#444",
  },
});
