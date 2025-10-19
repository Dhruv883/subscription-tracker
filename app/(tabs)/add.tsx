import AddSubscriptionForm from "@/components/add-subscription";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Add() {
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer} edges={{ top: "off" }}>
      <View style={{ flex: 1 }}>
        <AddSubscriptionForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
