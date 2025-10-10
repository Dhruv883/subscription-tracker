import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer} edges={{ top: "off" }}>
      <ScrollView>
        <View>
          <Text>Home Page</Text>
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
