import SubscriptionDetailsCard, {
  SubscriptionDetailsProps,
} from "@/components/subscription-detail";
import { SheetsContext } from "@/providers/sheets-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";

export function SheetsProvider({ children }: { children: React.ReactNode }) {
  const addSheetRef = useRef<BottomSheet>(null);
  const subscriptionSheetRef = useRef<BottomSheet>(null);
  const [subscriptionPayload, setSubscriptionPayload] = useState<
    Partial<SubscriptionDetailsProps> | undefined
  >();

  const openAddSheet = useCallback(() => {
    addSheetRef.current?.expand();
  }, []);

  const openSubscriptionSheet = useCallback(
    (payload?: Partial<SubscriptionDetailsProps>) => {
      if (payload) setSubscriptionPayload(payload);
      subscriptionSheetRef.current?.expand();
    },
    []
  );

  return (
    <SheetsContext.Provider value={{ openAddSheet, openSubscriptionSheet }}>
      {children}

      {/* Add Sheet */}
      <BottomSheet
        ref={addSheetRef}
        index={-1}
        style={{ flex: 1 }}
        enablePanDownToClose
      >
        <BottomSheetView>
          <View>
            <Text>Add form goes here</Text>
            <Text>Add form goes here</Text>
            <Text>Add form goes here</Text>
            <Text>Add form goes here</Text>
            <Text>Add form goes here</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet ref={subscriptionSheetRef} index={-1} enablePanDownToClose>
        <BottomSheetView>
          <SubscriptionDetailsCard {...(subscriptionPayload || {})} />
        </BottomSheetView>
      </BottomSheet>
    </SheetsContext.Provider>
  );
}
