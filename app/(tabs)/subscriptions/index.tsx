import { useRouter } from "expo-router";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscriptions() {
  const router = useRouter();

  const handleGoToSubscription = () => {
    router.push({
      pathname: "/(tabs)/subscriptions/[id]",
      params: { id: "123" },
    });
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewContainer} edges={{ top: "off" }}>
      <ScrollView>
        <View>
          <Text>Subscriptions Page</Text>
          <Button title="Go to Subscription" onPress={handleGoToSubscription} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    borderColor: "red",
    borderWidth: 2,
    height: "100%",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
