import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../src/components/Screen";
import StateMessage from "../src/components/StateMessage";
import { commerceApi } from "../src/services/api/commerce";
import { useAuthStore } from "../src/stores/authStore";
import { colors, radius, spacing } from "../src/theme";

const money = (value: unknown) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const statusLabel: Record<string, string> = {
  pending: "Awaiting review", approved: "Offer approved", rejected: "Request declined",
  scheduled: "Pickup scheduled", picked_up: "Device collected", inspected: "Inspection complete",
  completed: "Completed", cancelled: "Cancelled",
};

export default function SellRequestsScreen() {
  const user = useAuthStore(state => state.user);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["my-trade-ins"],
    queryFn: () => commerceApi.myTradeIns({ page: 1, limit: 50 }),
    enabled: Boolean(user),
    retry: 1,
  });
  const cancel = useMutation({
    mutationFn: (id: string) => commerceApi.cancelTradeIn(id, "Cancelled by seller"),
    onSuccess: () => client.invalidateQueries({ queryKey: ["my-trade-ins"] }),
  });
  const items = query.data?.data || [];

  if (!user) return <Screen contentContainerStyle={s.center}>
    <StateMessage title="Sign in to view sell requests" description="Your device submissions and pickup progress are linked to your account." />
    <Pressable onPress={() => router.push("/(auth)/login")} style={s.button}><Text style={s.buttonText}>Sign in</Text></Pressable>
  </Screen>;

  return <Screen contentContainerStyle={s.page} refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} />}>
    <View style={s.header}>
      <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.navy} /></Pressable>
      <View style={{ flex: 1 }}>
        <Text style={s.eyebrow}>SELL WITH RENEWX</Text>
        <Text style={s.title}>My sell requests</Text>
      </View>
      <Pressable onPress={() => query.refetch()}><Ionicons name="refresh" size={20} color={colors.navy} /></Pressable>
    </View>
    {query.isPending ? <View style={s.center}><ActivityIndicator color={colors.navy} /><Text style={s.muted}>Loading your requests…</Text></View>
      : query.isError ? <View style={s.center}><StateMessage title="Couldn't load sell requests" description={query.error instanceof Error ? query.error.message : "Check your connection and try again."} /><Pressable onPress={() => query.refetch()} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable></View>
      : items.length === 0 ? <View style={s.center}><StateMessage title="No sell requests yet" description="Submit a device and track its review, valuation and pickup here." /><Pressable onPress={() => router.push("/(tabs)/sell")} style={s.button}><Text style={s.buttonText}>Sell a device</Text></Pressable></View>
      : items.map((item: any) => {
        const id = String(item.id || item._id);
        const status = String(item.status || "pending");
        return <View key={id} style={s.card}>
          <View style={s.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={s.device}>{item.brand} {item.model}</Text>
              <Text style={s.meta}>{item.category} · {item.storage || "Standard"}</Text>
            </View>
            <Text style={[s.status, status === "completed" ? s.success : status === "rejected" || status === "cancelled" ? s.danger : null]}>{statusLabel[status] || status.replace(/_/g, " ")}</Text>
          </View>
          <View style={s.valueRow}><Text style={s.meta}>Current estimated / approved value</Text><Text style={s.value}>{money(item.valuation_amount ?? item.expected_price)}</Text></View>
          {item.created_at ? <Text style={s.meta}>Submitted {new Date(item.created_at).toLocaleDateString("en-IN")}</Text> : null}
          {item.admin_note ? <Text style={s.note}>RenewX update: {item.admin_note}</Text> : null}
          {status === "pending" ? <Pressable disabled={cancel.isPending} onPress={() => cancel.mutate(id)} style={s.cancelButton}><Text style={s.cancelText}>{cancel.isPending && cancel.variables === id ? "Cancelling…" : "Cancel request"}</Text></Pressable> : null}
          {cancel.isError && cancel.variables === id ? <Text style={s.error}>{cancel.error instanceof Error ? cancel.error.message : "Unable to cancel request."}</Text> : null}
        </View>;
      })}
  </Screen>;
}

const s = StyleSheet.create({
  page: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: colors.navy, fontSize: 24, fontWeight: "900" },
  center: { flex: 1, minHeight: 240, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: 14 },
  muted: { color: colors.muted, fontSize: 12 },
  card: { padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, gap: 10, backgroundColor: colors.white },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  device: { color: colors.navy, fontWeight: "900", fontSize: 16 },
  meta: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  status: { color: colors.navy, fontSize: 11, fontWeight: "900", textTransform: "capitalize", textAlign: "right", maxWidth: 130 },
  success: { color: colors.success },
  danger: { color: colors.danger },
  valueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  value: { color: colors.navy, fontSize: 18, fontWeight: "900" },
  note: { color: colors.navy, backgroundColor: colors.cloud, padding: 10, borderRadius: radius.md, fontSize: 12, lineHeight: 17 },
  button: { backgroundColor: colors.yellow, borderRadius: radius.md, paddingHorizontal: 18, paddingVertical: 13 },
  buttonText: { color: colors.navy, fontWeight: "900" },
  cancelButton: { alignSelf: "flex-start", borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, paddingHorizontal: 13, paddingVertical: 9 },
  cancelText: { color: colors.danger, fontSize: 12, fontWeight: "800" },
  error: { color: colors.danger, fontSize: 12 },
});
