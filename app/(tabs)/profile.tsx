import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView style={styles.safeArea} edges={{ top: "off" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatarBox}>
            <Image
              source={{ uri: "https://i.pravatar.cc/160?img=68" }}
              style={styles.avatar}
            />
            <Pressable style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.name}>Ethan Carter</Text>
          <Text style={styles.email}>ethan.carter@email.com</Text>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <Row label="Edit Profile" />
          <View style={styles.divider} />
          <Row label="Change Password" />
        </View>

        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <View style={styles.card}>
          <Row label="Notifications" />
          <View style={styles.divider} />
          <Row label="Currency" value="USD" />
          <View style={styles.divider} />
          <Row label="Appearance" value="Light" />
        </View>

        <Pressable
          style={styles.logoutBtn}
          onPress={async () => {
            try {
              await supabase.auth.signOut();
            } finally {
              router.replace("/welcome");
            }
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#222" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  avatarBox: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#EEE",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: { width: 112, height: 112 },
  editBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A7A7A",
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "800",
    color: "#9AA0B5",
  },
  card: {
    backgroundColor: "#ECEDEE",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLabel: { fontSize: 14, color: "#222", fontWeight: "600" },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowValue: { fontSize: 12, color: "#666" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#DBDDE2",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E6E8",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  logoutText: { marginLeft: 8, color: "#222", fontWeight: "600" },
});
