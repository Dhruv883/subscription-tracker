import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  SystemUI.setBackgroundColorAsync("#111111");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <StatusBar style="light" backgroundColor="#111111" />
    </GestureHandlerRootView>
  );
}
