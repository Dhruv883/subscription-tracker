import Header from "@/components/header";
import { Stack } from "expo-router";

export default function ManageLayout() {
  return (
    <Stack screenOptions={{ header: () => <Header /> }}>
      <Stack.Screen name="[id]" options={{ title: "Manage" }} />
    </Stack>
  );
}
