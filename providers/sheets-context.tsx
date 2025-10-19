import type { SubscriptionDetailsProps } from "@/components/subscription-detail";
import { createContext, useContext } from "react";

export type SheetsContextValue = {
  openAddSheet: () => void;
  openSubscriptionSheet: (payload?: Partial<SubscriptionDetailsProps>) => void;
};

export const SheetsContext = createContext<SheetsContextValue>({
  openAddSheet: () => {},
  openSubscriptionSheet: () => {},
});

export function useSheets() {
  return useContext(SheetsContext);
}
