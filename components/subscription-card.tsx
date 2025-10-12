import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SubscriptionCardProps {
  id: string;
  logo?: string;
  name: string;
  category: string;
  price: number;
  date?: string;
  billingCycle: string;
  onPress?: (id: string) => void; // <-- Add this line
}

const SubscriptionCard = ({
  logo,
  name,
  category,
  price,
  date,
  billingCycle,
  id,
  onPress,
}: SubscriptionCardProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.row}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoLetter}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.category}>{category}</Text>
          </View>
          <View
            style={{
              width: 75,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.billingCycle}>
              {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}
            </Text>
          </View>
        </View>
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    paddingRight: 0,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  billing: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#aaa",
  },
});

export default SubscriptionCard;
