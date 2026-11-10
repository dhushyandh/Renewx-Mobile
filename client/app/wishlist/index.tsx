import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Pressable, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../src/components/Screen";
import StateMessage from "../../src/components/StateMessage";
import { commerceApi, Product } from "../../src/services/api/commerce";
import { colors, radius, spacing } from "../../src/theme";

export default function WishlistScreen() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["wishlist"], queryFn: commerceApi.wishlist });
  const remove = useMutation({
    mutationFn: commerceApi.removeWishlistItem,
    onSuccess: () => client.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  const items: Product[] = query.data?.data?.products || [];
  return <Screen contentContainerStyle={s.page}>
    <View style={s.header}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back"><Ionicons name="arrow-back" size={22} color={colors.navy}/></Pressable>
      <Text style={s.title}>Wishlist</Text>
    </View>
    {query.isPending ? <View style={s.center}><ActivityIndicator color={colors.navy}/><Text style={s.muted}>Loading saved devices…</Text></View>
    : query.isError ? <View style={s.empty}><StateMessage title="Couldn't load wishlist" description="Your saved devices couldn't be retrieved. Please try again."/><Pressable onPress={() => query.refetch()} style={s.button}><Text style={s.buttonText}>Try again</Text></Pressable></View>
    : items.length === 0 ? <View style={s.empty}><StateMessage title="Nothing saved yet" description="Tap the heart on a product to keep it here for later."/><Pressable onPress={() => router.replace("/(tabs)/shop")} style={s.button}><Text style={s.buttonText}>Explore devices</Text></Pressable></View>
    : items.map(p => {
      const id = p.id || p._id || "";
      return <View key={id} style={s.item}>
        <Pressable style={s.product} onPress={() => router.push({ pathname: "/product/[id]", params: { id } })}>
          {p.image_url || p.images?.[0] ? <Image source={{ uri: p.image_url || p.images?.[0] }} style={s.image}/> : <View style={s.image}/>}
          <View style={s.info}><Text numberOfLines={2} style={s.name}>{p.name}</Text><Text style={s.price}>₹{Number(p.price).toLocaleString("en-IN")}</Text></View>
        </Pressable>
        <Pressable disabled={remove.isPending} onPress={() => remove.mutate(id)} accessibilityRole="button" accessibilityLabel={`Remove ${p.name} from wishlist`}><Ionicons name="heart" color={colors.danger} size={22}/></Pressable>
      </View>;
    })}
  </Screen>;
}
const s=StyleSheet.create({page:{paddingTop:spacing.lg,gap:spacing.md,flexGrow:1},header:{flexDirection:"row",alignItems:"center",gap:14},title:{color:colors.navy,fontSize:24,fontWeight:"900"},center:{flex:1,alignItems:"center",justifyContent:"center",gap:12},muted:{color:colors.muted},empty:{flex:1,alignItems:"center",justifyContent:"center",gap:18},item:{flexDirection:"row",alignItems:"center",gap:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg},product:{flex:1,flexDirection:"row",alignItems:"center",gap:12},image:{width:76,height:76,backgroundColor:colors.cloud,borderRadius:radius.md},info:{flex:1,gap:6},name:{color:colors.navy,fontWeight:"800"},price:{color:colors.navy,fontWeight:"900"},button:{backgroundColor:colors.yellow,padding:14,borderRadius:radius.md},buttonText:{color:colors.navy,fontWeight:"900"}});
