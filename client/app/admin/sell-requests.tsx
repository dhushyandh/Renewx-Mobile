import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../src/components/Screen";
import StateMessage from "../../src/components/StateMessage";
import { commerceApi } from "../../src/services/api/commerce";
import { useAuthStore } from "../../src/stores/authStore";
import { colors, radius, spacing } from "../../src/theme";

const filters = [
  { label: "All", value: "" }, { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" }, { label: "Rejected", value: "rejected" },
  { label: "Pickup", value: "scheduled" },
];
const money = (value: unknown) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const date = (value: string) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const statusColor = (status: string) => status === "approved" || status === "completed" ? colors.success : status === "rejected" || status === "cancelled" ? colors.danger : colors.navy;

export default function AdminSellRequestsScreen() {
  const user = useAuthStore(s => s.user);
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    setError("");
    try {
      const result = await commerceApi.adminTradeIns({ status: filter || undefined, page: 1, limit: 100 });
      setItems(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sell requests.");
    } finally { setLoading(false); setRefreshing(false); }
  }, [filter]);

  useEffect(() => { if (user?.role === "admin") load(); }, [user?.role, load]);
  const counts = useMemo(() => ({
    pending: items.filter(x => x.status === "pending").length,
    approved: items.filter(x => x.status === "approved").length,
    rejected: items.filter(x => x.status === "rejected").length,
  }), [items]);

  const openRequest = (item: any) => {
    setSelected(item);
    setApprovedAmount(String(item.valuation_amount ?? item.expected_price ?? ""));
    setAdminNote(item.admin_note || "");
    setActionError("");
  };

  const update = async (status: "approved" | "rejected") => {
    if (!selected) return;
    if (status === "approved" && (!approvedAmount.trim() || !Number.isFinite(Number(approvedAmount)) || Number(approvedAmount) < 0)) {
      setActionError("Enter a valid approved amount.");
      return;
    }
    setSaving(true); setActionError("");
    try {
      await commerceApi.updateTradeInStatus(String(selected.id || selected._id), {
        status,
        ...(status === "approved" ? { approvedAmount: Number(approvedAmount) } : {}),
        adminNote: adminNote.trim(),
      });
      setSelected(null);
      await load(true);
    } catch (err) { setActionError(err instanceof Error ? err.message : "Unable to update this request."); }
    finally { setSaving(false); }
  };

  if (user?.role !== "admin") return <Screen contentContainerStyle={s.center}><StateMessage title="Admin access required" description="Only authorised RenewX administrators can review sell requests."/><Pressable style={s.backButton} onPress={() => router.back()}><Text style={s.backText}>Go back</Text></Pressable></Screen>;

  return <Screen contentContainerStyle={s.page} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(true); }} />}>
    <View style={s.header}><Pressable onPress={() => selected ? setSelected(null) : router.back()} style={s.backIcon}><Ionicons name="arrow-back" size={21} color={colors.navy}/></Pressable><View style={{flex:1}}><Text style={s.eyebrow}>ADMIN WORKSPACE</Text><Text style={s.title}>{selected ? "Review request" : "Sell requests"}</Text></View><Pressable onPress={() => load()} style={s.refresh}><Ionicons name="refresh" size={19} color={colors.navy}/></Pressable></View>

    {selected ? <View style={s.detailCard}>
      <View style={s.detailTop}><Text style={s.sectionTitle}>{selected.brand} {selected.model}</Text><Text style={[s.status, {color:statusColor(selected.status)}]}>{String(selected.status || "pending").replace("_"," ").toUpperCase()}</Text></View>
      <Text style={s.meta}>{selected.category} · {selected.storage || "Variant not specified"} · Submitted {date(selected.created_at)}</Text>
      <View style={s.amountCard}><Text style={s.eyebrow}>CUSTOMER ESTIMATE</Text><Text style={s.amount}>{money(selected.valuation_amount ?? selected.expected_price)}</Text></View>
      <Text style={s.sectionLabel}>Customer details</Text>
      <View style={s.infoRow}><Text style={s.infoLabel}>Name</Text><Text style={s.infoValue}>{selected.customer_name || "—"}</Text></View>
      <View style={s.infoRow}><Text style={s.infoLabel}>Phone</Text><Text selectable style={s.infoValue}>{selected.customer_phone || "—"}</Text></View>
      <View style={s.infoRow}><Text style={s.infoLabel}>Email</Text><Text selectable style={s.infoValue}>{selected.customer_email || "—"}</Text></View>
      <View style={s.infoRow}><Text style={s.infoLabel}>Pickup address</Text><Text style={s.infoValue}>{[selected.address, selected.pincode].filter(Boolean).join(", ") || "—"}</Text></View>
      <Text style={s.sectionLabel}>Condition details</Text>
      {Object.entries(selected.condition || {}).filter(([key,value]) => key !== "photos" && typeof value !== "object").map(([key,value]) => <View key={key} style={s.infoRow}><Text style={s.infoLabel}>{key.replace(/([A-Z])/g," $1")}</Text><Text style={s.infoValue}>{String(value)}</Text></View>)}
      {Array.isArray(selected.photos) && selected.photos.length > 0 ? <><Text style={s.sectionLabel}>Device photos ({selected.photos.length})</Text><View style={s.photos}>{selected.photos.map((url: string, i: number) => <Image key={url + i} source={{uri:url}} style={s.photo}/>)}</View></> : <Text style={s.meta}>No device photos attached.</Text>}
      <Text style={s.sectionLabel}>Admin decision</Text>
      <Text style={s.label}>Approved amount (₹)</Text><TextInput value={approvedAmount} onChangeText={setApprovedAmount} keyboardType="numeric" placeholder="Enter final amount" placeholderTextColor={colors.muted} style={s.input}/>
      <Text style={s.label}>Admin note (optional)</Text><TextInput value={adminNote} onChangeText={setAdminNote} multiline placeholder="Add review notes for the customer…" placeholderTextColor={colors.muted} style={[s.input,s.multiline]}/>
      {actionError ? <Text style={s.error}>{actionError}</Text> : null}
      {selected.status === "pending" || selected.status === "approved" || selected.status === "rejected" ? <View style={s.actions}>
        <Pressable disabled={saving} onPress={() => update("rejected")} style={s.rejectButton}><Text style={s.rejectText}>{saving ? "Saving…" : "Reject"}</Text></Pressable>
        <Pressable disabled={saving} onPress={() => update("approved")} style={s.approveButton}>{saving ? <ActivityIndicator color={colors.navy}/> : <Text style={s.approveText}>Approve request</Text>}</Pressable>
      </View> : <Text style={s.meta}>This request has progressed beyond the admin decision stage. Status: {selected.status}.</Text>}
    </View> : <>
      <View style={s.stats}><View style={s.stat}><Text style={s.statValue}>{counts.pending}</Text><Text style={s.statLabel}>Pending</Text></View><View style={s.stat}><Text style={s.statValue}>{counts.approved}</Text><Text style={s.statLabel}>Approved</Text></View><View style={s.stat}><Text style={s.statValue}>{counts.rejected}</Text><Text style={s.statLabel}>Rejected</Text></View></View>
      <View style={s.filters}>{filters.map(item => <Pressable key={item.value || "all"} onPress={() => setFilter(item.value)} style={[s.filter, filter === item.value && s.filterActive]}><Text style={[s.filterText,filter === item.value && s.filterTextActive]}>{item.label}</Text></Pressable>)}</View>
      {loading ? <ActivityIndicator color={colors.navy} style={{marginTop:30}}/> : error ? <StateMessage title="Couldn't load requests" description={error} action={<Pressable onPress={() => load()} style={s.backButton}><Text style={s.backText}>Try again</Text></Pressable>}/> : items.length === 0 ? <StateMessage title="No sell requests" description={filter ? "There are no requests in this status." : "New customer sell requests will appear here."}/> :
        <View style={s.list}>{items.map(item => <Pressable key={String(item.id || item._id)} onPress={() => openRequest(item)} style={s.requestCard}>
          <View style={s.requestMain}><View style={{flex:1,gap:4}}><Text style={s.requestTitle}>{item.brand} {item.model}</Text><Text style={s.meta}>{item.customer_name || "Customer"} · {date(item.created_at)}</Text><Text style={s.meta}>{item.category} · {item.storage || "—"}</Text></View><Ionicons name="chevron-forward" size={19} color={colors.muted}/></View>
          <View style={s.requestBottom}><Text style={s.requestAmount}>{money(item.valuation_amount ?? item.expected_price)}</Text><Text style={[s.status,{color:statusColor(item.status)}]}>{String(item.status || "pending").replace("_"," ").toUpperCase()}</Text></View>
        </Pressable>)}</View>}
    </>}
  </Screen>;
}

const s = StyleSheet.create({
  page:{paddingTop:spacing.lg,paddingBottom:spacing.xxl,gap:spacing.md},center:{flex:1,justifyContent:"center",alignItems:"center",padding:24,gap:14},
  header:{flexDirection:"row",alignItems:"center",gap:12},backIcon:{width:38,height:38,borderRadius:12,backgroundColor:colors.cloud,alignItems:"center",justifyContent:"center"},
  refresh:{width:38,height:38,borderRadius:12,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center"},
  eyebrow:{color:colors.muted,fontSize:9,fontWeight:"900",letterSpacing:1.1},title:{color:colors.navy,fontSize:24,fontWeight:"900"},
  stats:{flexDirection:"row",gap:9},stat:{flex:1,padding:13,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,backgroundColor:colors.white,gap:5},
  statValue:{fontSize:22,fontWeight:"900",color:colors.navy},statLabel:{fontSize:10,color:colors.muted,fontWeight:"700"},
  filters:{flexDirection:"row",flexWrap:"wrap",gap:7},filter:{paddingHorizontal:13,paddingVertical:9,borderRadius:radius.pill,borderWidth:1,borderColor:colors.border},
  filterActive:{backgroundColor:colors.navy,borderColor:colors.navy},filterText:{fontSize:11,fontWeight:"800",color:colors.navy},filterTextActive:{color:colors.white},
  list:{gap:10},requestCard:{padding:14,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,backgroundColor:colors.white,gap:12},
  requestMain:{flexDirection:"row",alignItems:"center"},requestTitle:{fontSize:14,fontWeight:"900",color:colors.navy},meta:{fontSize:11,color:colors.muted,lineHeight:17},
  requestBottom:{borderTopWidth:1,borderTopColor:colors.border,paddingTop:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  requestAmount:{fontSize:16,fontWeight:"900",color:colors.navy},status:{fontSize:10,fontWeight:"900",letterSpacing:.5},
  detailCard:{padding:15,borderWidth:1,borderColor:colors.border,borderRadius:radius.xl,backgroundColor:colors.white,gap:11},
  detailTop:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10},sectionTitle:{fontSize:17,fontWeight:"900",color:colors.navy},
  amountCard:{backgroundColor:"#FFF8DB",padding:15,borderRadius:radius.lg,gap:5},amount:{fontSize:27,fontWeight:"900",color:colors.navy},
  sectionLabel:{fontSize:13,fontWeight:"900",color:colors.navy,marginTop:7},infoRow:{flexDirection:"row",justifyContent:"space-between",gap:12,paddingVertical:7,borderBottomWidth:1,borderBottomColor:colors.border},
  infoLabel:{fontSize:11,color:colors.muted,flex:1,textTransform:"capitalize"},infoValue:{fontSize:11,color:colors.navy,fontWeight:"700",flex:1.5,textAlign:"right"},
  photos:{flexDirection:"row",flexWrap:"wrap",gap:8},photo:{width:86,height:86,borderRadius:radius.md,backgroundColor:colors.cloud},
  label:{fontSize:12,fontWeight:"800",color:colors.navy},input:{minHeight:46,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,paddingHorizontal:12,color:colors.navy,fontSize:13},
  multiline:{minHeight:76,paddingTop:10,textAlignVertical:"top"},actions:{flexDirection:"row",gap:9,marginTop:6},rejectButton:{flex:1,minHeight:48,borderWidth:1,borderColor:colors.danger,borderRadius:radius.pill,alignItems:"center",justifyContent:"center"},
  rejectText:{color:colors.danger,fontWeight:"900"},approveButton:{flex:1.5,minHeight:48,backgroundColor:colors.yellow,borderRadius:radius.pill,alignItems:"center",justifyContent:"center"},
  approveText:{color:colors.navy,fontWeight:"900"},error:{color:colors.danger,fontSize:12},backButton:{padding:12,borderRadius:radius.md,backgroundColor:colors.yellow},backText:{color:colors.navy,fontWeight:"900"},
});
