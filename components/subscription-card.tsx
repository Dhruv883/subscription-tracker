import { capitalize } from "@/utils/string";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SubscriptionCardProps {
  id: string;
  link?: string;
  name: string;
  category: string;
  price: number;
  date?: string;
  billingCycle: string;
  onPress?: (id: string) => void;
  isActive?: boolean;
}

const SubscriptionCard = ({
  link,
  name,
  category,
  price,
  billingCycle,
  id,
  onPress,
  isActive = true,
}: SubscriptionCardProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View style={[styles.card, !isActive && { opacity: 0.75 }]}>
        <View style={styles.row}>
          {link ? (
            <Image
              source={{
                uri: `https://img.logo.dev/${link}?token=pk_N1hKCmmaSMGBeIHjP8e4Hg&retina=true`,
              }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoLetter}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{capitalize(name)}</Text>
            <Text style={styles.category}>{capitalize(category)}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.price} numberOfLines={1} ellipsizeMode="tail">
              ${price.toFixed(2)}
            </Text>
            <View>
              <Text style={styles.pillText}>{billingCycle}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoLetter: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4f46e5",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  category: {
    fontSize: 13,
    color: "#888",
  },
  billingCycle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  billing: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  rightCol: {
    width: 120,
    overflow: "hidden",
    wordWrap: "no-wrap",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 6,
  },
  pill: {
    backgroundColor: "#F1F2F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    color: "#7A7F91",
    textTransform: "capitalize",
    fontWeight: "600",
  },
});

export default SubscriptionCard;
