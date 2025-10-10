import AddIcon from "@/assets/icons/add.svg";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface IconProps {
  width: number;
  height: number;
  stroke: string;
}

export default function SubscriptionDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const iconProps: IconProps = {
    width: 30,
    height: 30,
    stroke: "#000000",
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 16 }}
        >
          <AddIcon {...iconProps} />
        </TouchableOpacity>
      </TouchableOpacity>

      <Text>Subscription Detail Page</Text>
      <Text>ID: {id}</Text>
    </View>
  );
}
