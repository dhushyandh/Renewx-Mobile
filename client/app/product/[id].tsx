import { useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../src/components/Screen";
import StateMessage from "../../src/components/StateMessage";
import { commerceApi } from "../../src/services/api/commerce";
import { useCommerceStore } from "../../src/stores/commerceStore";
import { colors, radius, spacing } from "../../src/theme";
import { useAuthStore } from "../../src/stores/authStore";
import { ApiError } from "../../src/services/api/client";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [added, setAdded] = useState(false);
  const addToCart = useCommerceStore(s => s.addToCart);
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const query = useQuery({ queryKey: ["product", id], queryFn: () => commerceApi.product(String(id)), enabled: Boolean(id), retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1 });
  const product = query.data?.data;
  const productId = product?.id || product?._id || "";
  const wishlistQuery = useQuery({ queryKey: ["wishlist"], queryFn: commerceApi.wishlist, enabled: Boolean(user), retry: 1 });
  const wishlistItems = wishlistQuery.data?.data?.products || [];
  const saved = wishlistItems.some(item => (item.id || item._id) === productId);
  const wishlistMutation = useMutation({
    mutationFn: (save: boolean) => save ? commerceApi.addWishlistItem(productId) : commerceApi.removeWishlistItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  if (!id) return <Screen contentContainerStyle={s.center}><StateMessage title="Product link is incomplete" description="Open a product from the shop catalogue to view its details."/><Pressable style={s.primary} onPress={() => router.replace("/(tabs)/shop")}><Text style={s.primaryText}>Back to shop</Text></Pressable></Screen>;
  if (query.isPending) return <Screen contentContainerStyle={s.center}><ActivityIndicator color={colors.navy}/><Text style={s.muted}>Loading product…</Text></Screen>;
  if (query.isError || !product) {
    const notFound = query.error instanceof ApiError && query.error.status === 404;
    return <Screen contentContainerStyle={s.center}>
      <StateMessage title={notFound ? "Product no longer available" : "Could not load this product"} description={notFound ? "This listing may have been removed or sold." : query.error instanceof Error ? query.error.message : "Please check your connection and try again."}/>
      {!notFound ? <Pressable style={s.primary} onPress={() => query.refetch()}><Text style={s.primaryText}>Try again</Text></Pressable> : null}
      <Pressable style={s.secondary} onPress={() => router.replace("/(tabs)/shop")}><Text style={s.secondaryText}>Back to shop</Text></Pressable>
    </Screen>;
  }
  const image = product.image_url || product.images?.[0];
  return <Screen contentContainerStyle={s.page}>
    <View style={s.top}><Pressable onPress={() => router.back()} style={s.iconButton}><Ionicons name="arrow-back" size={21} color={colors.navy}/></Pressable><Text style={s.topTitle}>Product details</Text><Pressable disabled={!user || wishlistMutation.isPending || !productId} onPress={() => wishlistMutation.mutate(!saved)} accessibilityRole="button" accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"} style={s.iconButton}><Ionicons name={saved ? "heart" : "heart-outline"} size={22} color={saved ? colors.danger : colors.navy}/></Pressable></View>
    <View style={s.imageWrap}>{image ? <Image source={{uri:image}} resizeMode="contain" style={s.image} onError={() => undefined}/> : <Ionicons name="phone-portrait-outline" size={76} color={colors.muted}/>}</View>
    <View style={s.details}>
      <Text style={s.category}>{product.category} {product.condition ? "· "+product.condition : ""}</Text><Text style={s.name}>{product.name}</Text>
      {product.brand ? <Text style={s.brand}>{product.brand}{product.model ? " · "+product.model : ""}</Text> : null}
      <View style={s.priceRow}><Text style={s.price}>₹{Number(product.price || 0).toLocaleString("en-IN")}</Text>{product.original_price && product.original_price > product.price ? <Text style={s.oldPrice}>₹{Number(product.original_price).toLocaleString("en-IN")}</Text> : null}</View>
      <Text style={[s.stock, product.stock <= 0 && {color:colors.danger}]}>{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}</Text>
      {wishlistMutation.isError ? <Text style={s.errorText}>Could not update wishlist. Please try again.</Text> : null}
      {!user ? <Text style={s.muted}>Sign in to save this device to your wishlist.</Text> : null}
      <Text style={s.section}>About this device</Text><Text style={s.description}>{product.description || "Product information will be updated by the RenewX catalogue team."}</Text>
      {product.specs ? <><Text style={s.section}>Specifications</Text><Text style={s.description}>{typeof product.specs === "string" ? product.specs : Object.entries(product.specs).map(([k,v]) => `${k}: ${String(v)}`).join("\n")}</Text></> : null}
      <Pressable disabled={product.stock <= 0} onPress={() => { addToCart(product); setAdded(true); }} style={[s.primary, product.stock <= 0 && {opacity:.45}]}><Ionicons name="bag-add-outline" size={18} color={colors.navy}/><Text style={s.primaryText}>{added ? "Added to cart · Add another" : "Add to cart"}</Text></Pressable>
      <Pressable onPress={() => router.push("/cart")} style={s.secondary}><Text style={s.secondaryText}>View cart</Text></Pressable>
    </View>
  </Screen>;
}
const s=StyleSheet.create({page:{paddingTop:spacing.md,paddingBottom:spacing.xxl,gap:spacing.md},center:{flexGrow:1,alignItems:"center",justifyContent:"center",gap:14,padding:24},muted:{color:colors.muted},top:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},topTitle:{color:colors.navy,fontSize:16,fontWeight:"800"},iconButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.cloud,alignItems:"center",justifyContent:"center"},imageWrap:{height:280,borderRadius:radius.xl,backgroundColor:colors.surface,alignItems:"center",justifyContent:"center",padding:18},image:{width:"100%",height:"100%"},details:{gap:9},category:{color:colors.muted,fontSize:12,fontWeight:"700",textTransform:"uppercase"},name:{color:colors.navy,fontSize:25,fontWeight:"900"},brand:{color:colors.muted,fontSize:13},priceRow:{flexDirection:"row",alignItems:"center",gap:10},price:{color:colors.navy,fontSize:24,fontWeight:"900"},oldPrice:{color:colors.muted,textDecorationLine:"line-through",fontSize:14},stock:{color:colors.success,fontSize:12,fontWeight:"700"},section:{color:colors.navy,fontSize:15,fontWeight:"800",marginTop:12},description:{color:colors.muted,fontSize:13,lineHeight:21},errorText:{color:colors.danger,fontSize:12,fontWeight:"600"},primary:{minHeight:50,backgroundColor:colors.yellow,borderRadius:radius.md,alignItems:"center",justifyContent:"center",flexDirection:"row",gap:8,marginTop:14},primaryText:{color:colors.navy,fontWeight:"900"},secondary:{minHeight:46,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,alignItems:"center",justifyContent:"center"},secondaryText:{color:colors.navy,fontWeight:"800"}});
