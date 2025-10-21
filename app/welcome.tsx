import { Image } from "expo-image";
import { Link, router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  return (
    <SafeAreaView style={styles.safeArea} edges={{ top: "off" }}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Subscription Tracker</Text>
          <Text style={styles.subtitle}>
            Track, analyze, and stay on top of your recurring expenses.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryText}>Get Started</Text>
          </Pressable>
          <Text style={styles.footerText}>
            Already have an account? <Link href="/login">Log in</Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#111111" },
  container: { flex: 1, padding: 24, justifyContent: "space-between" },
  logoWrap: { alignItems: "center", marginTop: 40 },
  logo: { width: 120, height: 120, borderRadius: 28 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#C8CAD0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  actions: { marginBottom: 24 },
  primaryBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: { color: "#111", fontWeight: "800", fontSize: 16 },
  footerText: { color: "#C8CAD0", textAlign: "center", marginTop: 12 },
});
