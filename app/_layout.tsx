import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  SystemUI.setBackgroundColorAsync("#111111");
  return (
    <>
      <Slot />
      <StatusBar style="light" backgroundColor="#111111" />
    </>
  );
}
