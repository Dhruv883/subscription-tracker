import Header from "@/components/header";
import TabBar from "@/components/tab-bar";
import { SheetsProvider } from "@/providers/sheets-provider";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function SubscriptionLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SheetsProvider>
        <Tabs
          screenOptions={{
            header: () => <Header />,
          }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
            }}
          />
          <Tabs.Screen
            name="subscriptions"
            options={{
              title: "Subscriptions",
            }}
          />
          <Tabs.Screen
            name="add"
            options={{
              title: "Add",
            }}
          />
          <Tabs.Screen
            name="analytics"
            options={{
              title: "Analytics",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
            }}
          />
        </Tabs>
      </SheetsProvider>
    </View>
  );
}
