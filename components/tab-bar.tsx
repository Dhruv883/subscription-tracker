import AddIcon from "@/assets/icons/add.svg";
import AnalyticsIcon from "@/assets/icons/analytics.svg";
import HomeIcon from "@/assets/icons/home.svg";
import ProfileIcon from "@/assets/icons/profile.svg";
import SubscriptionIcon from "@/assets/icons/subscription.svg";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type RouteNames = "home" | "subscriptions" | "add" | "analytics" | "profile";

interface IconProps {
  width: number;
  height: number;
  stroke: string;
}

const ROUTE_ICONS = {
  home: HomeIcon,
  subscriptions: SubscriptionIcon,
  add: AddIcon,
  analytics: AnalyticsIcon,
  profile: ProfileIcon,
} as const;

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? "#FFE0C2" : "#FFFFFF";
    const iconProps: IconProps = {
      width: 30,
      height: 30,
      stroke: routeName === "add" || isFocused ? "#000000" : color,
    };

    const IconComponent =
      ROUTE_ICONS[routeName as RouteNames] || ROUTE_ICONS.home;
    return <IconComponent {...iconProps} />;
  };

  const handleTabPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const renderTabButton = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const tabButtonStyle = [
      styles.tabButton,
      isFocused && route.name !== "add" ? styles.tabButtonFocused : undefined,
      route.name === "add" ? styles.tabButtonAdd : undefined,
    ];

    return (
      <TouchableOpacity
        key={index}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={() => handleTabPress(route, isFocused)}
        style={tabButtonStyle}
      >
        {getIcon(route.name, isFocused)}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.tabBarContainer}>
        {state.routes.map(renderTabButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#2b2b2b",
    backgroundColor: "#0f1720",
  },
  tabButton: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  tabButtonFocused: {
    backgroundColor: "#FFE0C2",
    color: "#000000",
  },
  tabButtonAdd: {
    backgroundColor: "#FFB86B",
  },
});

export default TabBar;
