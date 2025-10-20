import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  const navigation = useNavigation<any>();
  const canGoBack = navigation?.canGoBack?.() ?? false;

  return (
    <SafeAreaView edges={{ top: "maximum" }} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          {canGoBack ? (
            <Pressable
              style={styles.iconBtn}
              onPress={() => router.back()}
              android_ripple={{ color: "#eee" }}
            >
              <Ionicons name="chevron-back" size={24} color="#111" />
            </Pressable>
          ) : (
            <View style={styles.brandDot}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={22}
                color="#111"
              />
            </View>
          )}
        </View>

        <View style={styles.center} />

        <View style={styles.right}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => {}}
            android_ripple={{ color: "#eee" }}
          >
            <Ionicons name="notifications-outline" size={22} color="#111" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
  },
  container: {
    height: 72,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomColor: "#EEE",
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  left: { width: 48, alignItems: "flex-start" },
  center: { flex: 1, alignItems: "center" },
  right: { width: 48, alignItems: "flex-end" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F5",
  },
  brandDot: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F3F5",
  },
});

export default Header;
