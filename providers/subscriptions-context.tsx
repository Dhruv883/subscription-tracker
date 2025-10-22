import { supabase } from "@/lib/supabase";
import type { Subscription } from "@/types/subscription";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SubscriptionsContextValue = {
  subscriptions: Subscription[];
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
  addSubscription: (payload: {
    name: string;
    link?: string;
    category: string;
    price: number;
    billing_cycle: string;
    next_bill?: string | null;
    custom_billing_period?: number | null;
    custom_billing_unit?: string | null;
  }) => Promise<{ ok: boolean; error?: string }>;
  deleteSubscription: (id: string) => Promise<{ ok: boolean; error?: string }>;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue>({
  subscriptions: [],
  loading: false,
  refresh: async () => {},
  addSubscription: async () => ({ ok: false, error: "Not initialized" }),
  deleteSubscription: async () => ({ ok: false, error: "Not initialized" }),
});

export function SubscriptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user?.id) {
        setSubscriptions([]);
        setError(sessionError?.message || "No user session");
        return;
      }
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "id, name, category, currency, price, billing_cycle, custom_billing_period, custom_billing_unit, next_bill, user_id, is_active, link"
        )
        .eq("user_id", userId)
        .order("id", { ascending: false });
      if (error) {
        setSubscriptions([]);
        setError(error.message);
      } else {
        const mapped = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          currency: item.currency,
          price: item.price,
          billingCycle: item.billing_cycle,
          customEvery: item.custom_billing_period,
          customUnit: item.custom_billing_unit,
          nextBill: item.next_bill,
          userId: item.user_id,
          link: item.link,
          isActive: item.is_active,
        })) as Subscription[];
        setSubscriptions(mapped);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addSubscription: SubscriptionsContextValue["addSubscription"] =
    useCallback(
      async (payload) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return { ok: false, error: "No user session" };
        const toInsert: any = {
          name: payload.name,
          link: payload.link || null,
          category: payload.category,
          price: payload.price,
          billing_cycle: payload.billing_cycle,
          next_bill: payload.next_bill ?? null,
          custom_billing_period: payload.custom_billing_period ?? null,
          custom_billing_unit: payload.custom_billing_unit ?? null,
          user_id: session.user.id,
          is_active: true,
        };
        const { error } = await supabase
          .from("subscriptions")
          .insert([toInsert]);
        if (error) return { ok: false, error: error.message };
        await refresh();
        return { ok: true };
      },
      [refresh]
    );

  const deleteSubscription: SubscriptionsContextValue["deleteSubscription"] =
    useCallback(
      async (id) => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          return { ok: false, error: "No user session" };
        }

        const { error } = await supabase
          .from("subscriptions")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) {
          return { ok: false, error: error.message };
        }

        await refresh();
        return { ok: true };
      },
      [refresh]
    );

  const value = useMemo<SubscriptionsContextValue>(
    () => ({
      subscriptions,
      loading,
      error,
      refresh,
      addSubscription,
      deleteSubscription,
    }),
    [
      subscriptions,
      loading,
      error,
      refresh,
      addSubscription,
      deleteSubscription,
    ]
  );

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  return useContext(SubscriptionsContext);
}
