import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Screen from "../../src/components/Screen";
import StateMessage from "../../src/components/StateMessage";
import { commerceApi, Product } from "../../src/services/api/commerce";
import { colors, radius, spacing } from "../../src/theme";

const categories = ["All", "SMARTPHONES", "LAPTOPS", "TABLETS", "AUDIO", "WEARABLES", "ACCESSORIES", "GAMING", "MONITORS"];

export default function ShopScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(params.category || "All");
  const [sort, setSort] = useState<"recommended" | "low" | "high">("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (params.category) setActiveCategory(params.category);
  }, [params.category]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const productsQuery = useInfiniteQuery({
    queryKey: ["products", activeCategory, debouncedQuery, sort],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => commerceApi.products({
      page: pageParam, limit: 24,
      ...(activeCategory !== "All" ? { category: activeCategory } : {}),
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
      ...(sort === "low" ? { sort: "price_asc" } : sort === "high" ? { sort: "price_desc" } : {}),
    }),
    getNextPageParam: (lastPage) => lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const loadNextPage = () => productsQuery.fetchNextPage();

  const products = useMemo(() => productsQuery.data?.pages.flatMap(page => page.data) || [], [productsQuery.data]);

  return (
    <Screen contentContainerStyle={styles.page} refreshControl={<RefreshControl refreshing={productsQuery.isRefetching} onRefresh={() => productsQuery.refetch()} tintColor={colors.navy} />}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>DISCOVER RENEWX</Text><Text style={styles.title}>Shop devices</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open sort options" onPress={() => setFiltersOpen(v => !v)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.navy} />
        </Pressable>
      </View>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={19} color={colors.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search phones, laptops and more" placeholderTextColor={colors.muted} returnKeyType="search" style={styles.searchInput} accessibilityLabel="Search products" />
        {query.length > 0 ? <Pressable onPress={() => setQuery("")} accessibilityRole="button" accessibilityLabel="Clear search"><Ionicons name="close-circle" size={18} color={colors.muted}/></Pressable> : null}
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Categories</Text><Text style={styles.count}>Browse by device</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map(category => {
          const selected = activeCategory === category;
          return <Pressable key={category} onPress={() => setActiveCategory(category)} style={[styles.chip, selected && styles.chipActive]}>
            <Text style={[styles.chipText, selected && styles.chipTextActive]}>{category === "All" ? "All devices" : category.charAt(0) + category.slice(1).toLowerCase()}</Text>
          </Pressable>;
        })}
      </ScrollView>
      {filtersOpen ? <View style={styles.filterPanel}>
        <Text style={styles.filterTitle}>Sort products</Text>
        {([{key:"recommended",label:"Recommended"},{key:"low",label:"Price: low to high"},{key:"high",label:"Price: high to low"}] as const).map(option =>
          <Pressable key={option.key} onPress={() => setSort(option.key)} style={styles.sortOption}>
            <Ionicons name={sort === option.key ? "radio-button-on" : "radio-button-off"} size={17} color={sort === option.key ? colors.navy : colors.muted}/>
            <Text style={styles.sortText}>{option.label}</Text>
          </Pressable>
        )}
      </View> : null}
      <View style={styles.resultsHeader}><Text style={styles.sectionTitle}>Available devices</Text><Text style={styles.count}>{productsQuery.data?.pages[0]?.total ?? "—"} listings</Text></View>
      {productsQuery.isPending ? <View style={styles.status}><ActivityIndicator color={colors.navy}/><Text style={styles.statusText}>Loading the live catalogue…</Text></View>
      : productsQuery.isError ? <View style={styles.emptyCard}>
        <StateMessage title="Couldn't load products" description={productsQuery.error instanceof Error ? productsQuery.error.message : "Please check your connection and try again."}/>
        <Pressable onPress={() => productsQuery.refetch()} style={styles.resetButton}><Text style={styles.resetText}>Try again</Text></Pressable>
      </View>
      : products.length === 0 ? <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}><Ionicons name="search-outline" size={28} color={colors.navy}/></View>
        <StateMessage title={query.trim() ? "No matching devices" : "No devices available yet"} description="Try another search or category. New listings will appear here when they are published."/>
        <Pressable onPress={() => {setQuery("");setActiveCategory("All");setSort("recommended");}} style={styles.resetButton}><Text style={styles.resetText}>Clear filters</Text></Pressable>
      </View>
      : <><View style={styles.grid}>{products.map(product => <ProductCard key={product.id || product._id} product={product}/>)}</View>{productsQuery.hasNextPage ? <Pressable disabled={productsQuery.isFetchingNextPage} onPress={() => loadNextPage()} style={styles.loadMore}>{productsQuery.isFetchingNextPage ? <ActivityIndicator color={colors.navy}/> : <Text style={styles.resetText}>Load more devices</Text>}</Pressable> : null}{productsQuery.isFetchNextPageError ? <Pressable onPress={() => loadNextPage()} style={styles.loadMore}><Text style={styles.resetText}>Could not load more · Retry</Text></Pressable> : null}</>}
    </Screen>
  );
}

function ProductCard({product}:{product:Product}) {
  return <Pressable onPress={() => router.push({pathname:"/product/[id]",params:{id:product.id || product._id || ""}})} style={styles.productCard}>
    {(product.image_url || product.images?.[0]) ? <Image source={{uri:product.image_url || product.images?.[0] || ""}} style={styles.productImage} resizeMode="contain"/> : <View style={styles.imageFallback}><Ionicons name="phone-portrait-outline" size={36} color={colors.muted}/></View>}
    <View style={styles.productInfo}><Text numberOfLines={1} style={styles.productName}>{product.name}</Text><Text style={styles.productCategory}>{product.category}{product.condition ? " · "+product.condition : ""}</Text><Text style={styles.price}>₹{product.price.toLocaleString("en-IN")}</Text><Text style={styles.stock}>{product.stock > 0 ? "In stock" : "Out of stock"}</Text></View>
  </Pressable>;
}

const styles=StyleSheet.create({
 page:{gap:spacing.lg,paddingTop:spacing.lg,paddingBottom:spacing.xxl},
 header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
 eyebrow:{color:colors.muted,fontSize:10,fontWeight:"800",letterSpacing:1.4,marginBottom:5},
 title:{color:colors.navy,fontSize:26,lineHeight:32,fontWeight:"900"},
 filterButton:{width:44,height:44,borderRadius:radius.md,borderWidth:1,borderColor:colors.border,alignItems:"center",justifyContent:"center",backgroundColor:colors.white},
 search:{minHeight:50,flexDirection:"row",alignItems:"center",gap:10,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,backgroundColor:colors.white,paddingHorizontal:14},
 searchInput:{flex:1,color:colors.navy,fontSize:14,paddingVertical:12},
 sectionHeading:{flexDirection:"row",alignItems:"baseline",justifyContent:"space-between",marginBottom:-8},
 sectionTitle:{color:colors.navy,fontSize:17,fontWeight:"800"},
 count:{color:colors.muted,fontSize:12,fontWeight:"500"},
 chips:{gap:8,paddingVertical:2},
 chip:{borderRadius:radius.pill,borderWidth:1,borderColor:colors.border,backgroundColor:colors.white,paddingHorizontal:15,paddingVertical:10},
 chipActive:{backgroundColor:colors.navy,borderColor:colors.navy},
 chipText:{color:colors.navy,fontSize:12,fontWeight:"700"},chipTextActive:{color:colors.white},
 filterPanel:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,padding:spacing.md,gap:12},
 filterTitle:{color:colors.navy,fontSize:14,fontWeight:"800"},
 sortOption:{flexDirection:"row",alignItems:"center",gap:9,paddingVertical:4},sortText:{color:colors.text,fontSize:13,fontWeight:"600"},
 resultsHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:2},
 status:{minHeight:180,alignItems:"center",justifyContent:"center",gap:12},statusText:{color:colors.muted,fontSize:13},
 emptyCard:{borderWidth:1,borderColor:colors.border,borderRadius:radius.xl,padding:spacing.md,backgroundColor:colors.white,alignItems:"center",gap:spacing.sm,minHeight:250,justifyContent:"center"},
 emptyIcon:{width:62,height:62,borderRadius:31,backgroundColor:"#FFF7D6",alignItems:"center",justifyContent:"center"},
 loadMore:{minHeight:46,alignItems:"center",justifyContent:"center",borderRadius:radius.pill,backgroundColor:colors.yellow,marginTop:8},
 resetButton:{borderRadius:radius.pill,backgroundColor:colors.yellow,paddingHorizontal:18,paddingVertical:11,marginTop:4},resetText:{color:colors.navy,fontSize:12,fontWeight:"800"},
 grid:{flexDirection:"row",flexWrap:"wrap",gap:12},
 productCard:{width:"48%",borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,backgroundColor:colors.white,overflow:"hidden"},
 productImage:{width:"100%",height:138,backgroundColor:colors.surface},
 imageFallback:{height:138,backgroundColor:colors.surface,alignItems:"center",justifyContent:"center"},
 productInfo:{padding:11,gap:4},productName:{color:colors.navy,fontSize:13,fontWeight:"800"},productCategory:{color:colors.muted,fontSize:11},price:{color:colors.navy,fontSize:15,fontWeight:"900",marginTop:4},stock:{color:colors.muted,fontSize:10,fontWeight:"600"}
});
