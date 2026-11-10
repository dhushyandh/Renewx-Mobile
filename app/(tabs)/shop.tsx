import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import StateMessage from '../../src/components/StateMessage';
import { colors, radius, spacing } from '../../src/theme';

const categories = ['All devices', 'Phones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'Accessories'];

export default function ShopScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All devices');
  const [sort, setSort] = useState<'recommended' | 'low' | 'high'>('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resultTitle = useMemo(() => {
    if (query.trim()) return 'No matching products yet';
    if (activeCategory !== 'All devices') return 'No products in this category yet';
    return 'Catalogue is getting ready';
  }, [query, activeCategory]);

  return (
    <Screen contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DISCOVER RENEWX</Text>
          <Text style={styles.title}>Shop devices</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open filters" onPress={() => setFiltersOpen(v => !v)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <Ionicons name="search-outline" size={19} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search phones, laptops and more"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
          accessibilityLabel="Search products"
        />
        {query.length > 0 ? <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear search"><Ionicons name="close-circle" size={18} color={colors.muted}/></Pressable> : null}
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.count}>Browse by device</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {categories.map(category => {
          const selected = activeCategory === category;
          return <Pressable key={category} onPress={() => setActiveCategory(category)} style={[styles.chip, selected && styles.chipActive]}>
            <Text style={[styles.chipText, selected && styles.chipTextActive]}>{category}</Text>
          </Pressable>;
        })}
      </ScrollView>

      {filtersOpen ? (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Sort products</Text>
          <View style={styles.sortRow}>
            {([{key:'recommended', label:'Recommended'}, {key:'low', label:'Price: low to high'}, {key:'high', label:'Price: high to low'}] as const).map(option => (
              <Pressable key={option.key} onPress={() => setSort(option.key)} style={[styles.sortOption, sort === option.key && styles.sortOptionActive]}>
                <Ionicons name={sort === option.key ? 'radio-button-on' : 'radio-button-off'} size={17} color={sort === option.key ? colors.navy : colors.muted}/>
                <Text style={styles.sortText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.filterNote}>Price and condition filters will be enabled when the live catalogue API is connected.</Text>
        </View>
      ) : null}

      <View style={styles.resultsHeader}>
        <Text style={styles.sectionTitle}>All products</Text>
        <Text style={styles.count}>Live listings</Text>
      </View>

      <View style={styles.emptyCard}>
        <View style={styles.emptyIcon}><Ionicons name="cube-outline" size={30} color={colors.navy}/></View>
        <StateMessage
          title={resultTitle}
          description="We're preparing the live RenewX catalogue. Products, prices and availability will appear here directly from the marketplace."
        />
        <Pressable onPress={() => { setQuery(''); setActiveCategory('All devices'); setSort('recommended'); setFiltersOpen(false); }} style={styles.resetButton}>
          <Text style={styles.resetText}>Clear search and filters</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  eyebrow: { color:colors.muted, fontSize:10, fontWeight:'800', letterSpacing:1.4, marginBottom:5 },
  title: { color:colors.navy, fontSize:26, lineHeight:32, fontWeight:'900' },
  filterButton: { width:44, height:44, borderRadius:radius.md, borderWidth:1, borderColor:colors.border, alignItems:'center', justifyContent:'center', backgroundColor:colors.white },
  search: { minHeight:50, flexDirection:'row', alignItems:'center', gap:10, borderWidth:1, borderColor:colors.border, borderRadius:radius.md, backgroundColor:colors.white, paddingHorizontal:14 },
  searchInput: { flex:1, color:colors.navy, fontSize:14, paddingVertical:12 },
  sectionHeading: { flexDirection:'row', alignItems:'baseline', justifyContent:'space-between', marginBottom:-8 },
  sectionTitle: { color:colors.navy, fontSize:17, fontWeight:'800' },
  count: { color:colors.muted, fontSize:12, fontWeight:'500' },
  chips: { gap:8, paddingVertical:2 },
  chip: { borderRadius:radius.pill, borderWidth:1, borderColor:colors.border, backgroundColor:colors.white, paddingHorizontal:15, paddingVertical:10 },
  chipActive: { backgroundColor:colors.navy, borderColor:colors.navy },
  chipText: { color:colors.navy, fontSize:12, fontWeight:'700' },
  chipTextActive: { color:colors.white },
  filterPanel: { backgroundColor:colors.surface, borderWidth:1, borderColor:colors.border, borderRadius:radius.lg, padding:spacing.md, gap:12 },
  filterTitle: { color:colors.navy, fontSize:14, fontWeight:'800' },
  sortRow: { gap:10 },
  sortOption: { flexDirection:'row', alignItems:'center', gap:9, paddingVertical:4 },
  sortOptionActive: { opacity:1 },
  sortText: { color:colors.text, fontSize:13, fontWeight:'600' },
  filterNote: { color:colors.muted, fontSize:12, lineHeight:18 },
  resultsHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:2 },
  emptyCard: { borderWidth:1, borderColor:colors.border, borderRadius:radius.xl, padding:spacing.md, backgroundColor:colors.white, alignItems:'center', gap:spacing.sm, minHeight:260, justifyContent:'center' },
  emptyIcon: { width:62, height:62, borderRadius:31, backgroundColor:'#FFF7D6', alignItems:'center', justifyContent:'center' },
  resetButton: { borderRadius:radius.pill, backgroundColor:colors.yellow, paddingHorizontal:18, paddingVertical:11, marginTop:4 },
  resetText: { color:colors.navy, fontSize:12, fontWeight:'800' }
});
