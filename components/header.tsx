import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  return (
    <SafeAreaView style={{ borderColor: "blue", borderWidth: 2 }}>
      <Text>Sub Tracker</Text>
    </SafeAreaView>
  );
};

export default Header;
