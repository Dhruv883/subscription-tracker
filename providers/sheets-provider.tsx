import AddSubscriptionForm from "@/components/add-subscription";
import SubscriptionDetailsCard, {
  SubscriptionDetailsProps,
} from "@/components/subscription-detail";
import { SheetsContext } from "@/providers/sheets-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";

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
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enablePanDownToClose
      >
        <BottomSheetView>
          <AddSubscriptionForm keyboardOffset={64} />
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet ref={subscriptionSheetRef} index={-1} enablePanDownToClose>
        <BottomSheetView>
          <SubscriptionDetailsCard
            {...(subscriptionPayload || {})}
            onManage={() => {
              subscriptionSheetRef.current?.close();
              const id = subscriptionPayload?.id;
              if (id)
                router.push({
                  pathname: "/manage/[id]",
                  params: { id },
                });
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </SheetsContext.Provider>
  );
}
