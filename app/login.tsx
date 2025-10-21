import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.replace("/(tabs)/home");
    } catch (err: any) {
      Alert.alert("Login failed", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Temporary sign up handler for testing
  const onSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      Alert.alert("Sign Up Success", "Test user created. You can now log in.");
    } catch (err: any) {
      Alert.alert("Sign Up failed", err?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={{ top: "off" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor="#9AA0B5"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#9AA0B5"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable
          style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={onLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Logging in…" : "Log In"}
          </Text>
        </Pressable>
        {/* Temporary Sign Up button for testing */}
        <Pressable
          style={[styles.secondaryBtn, loading && { opacity: 0.7 }]}
          onPress={onSignUp}
          disabled={loading}
        >
          <Text style={styles.secondaryText}>Sign Up (Test Only)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F8" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "800", color: "#111", marginTop: 8 },
  subtitle: { color: "#666", marginTop: 4 },
  form: { marginTop: 24 },
  label: { fontSize: 13, color: "#444", fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#ECEDEE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
  },
  primaryBtn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: "#ECEDEE",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: { color: "#111", fontWeight: "700", fontSize: 16 },
});
