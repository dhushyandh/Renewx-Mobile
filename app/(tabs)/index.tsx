import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import StateMessage from '../../src/components/StateMessage';
import RenewXMark from '../../assets/branding/RenewXMark';
import { CategoryArtwork } from '../../assets/categories/CategoryArtwork';
import StorefrontHero from '../../assets/banners/StorefrontHero';
import EmptyCatalogue from '../../assets/illustrations/EmptyCatalogue';
import { colors, radius, spacing } from '../../src/theme';

const categories = [
  { title: 'Phones', kind: 'phone' as const },
  { title: 'Laptops', kind: 'laptop' as const },
  { title: 'Tablets', kind: 'tablet' as const },
  { title: 'Accessories', kind: 'accessories' as const },
];

export default function HomeScreen() {
  return <Screen contentContainerStyle={s.page}>
    <View style={s.top}>
      <RenewXMark size={27} tagline />
      <View style={s.location}><Ionicons name="location-outline" size={15} color={colors.navy}/><Text style={s.locText}>Set location</Text></View>
    </View>
    <View style={s.search}><Ionicons name="search-outline" size={19} color={colors.muted}/><Text style={s.searchText}>Search phones, laptops and more</Text><Ionicons name="options-outline" size={19} color={colors.navy}/></View>
    <StorefrontHero />
    <View style={s.section}><Text style={s.sectionTitle}>Explore categories</Text><Text style={s.see}>See all</Text></View>
    <View style={s.grid}>{categories.map(item=><View key={item.title} style={s.category}><View style={s.art}><CategoryArtwork kind={item.kind} size={66}/></View><Text style={s.catText}>{item.title}</Text></View>)}</View>
    <View style={s.section}><Text style={s.sectionTitle}>Picked for you</Text></View>
    <View style={s.empty}><EmptyCatalogue/><StateMessage title="Live catalogue coming next" description="We’ll connect real RenewX products after verifying the backend catalogue API. No demo listings or made-up prices." /></View>
  </Screen>;
}
const s=StyleSheet.create({
 page:{gap:spacing.lg,paddingTop:spacing.lg},
 top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 location:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:colors.cloud,paddingHorizontal:10,paddingVertical:9,borderRadius:radius.pill},
 locText:{color:colors.navy,fontSize:12,fontWeight:'600'},
 search:{flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.border,borderRadius:13,paddingHorizontal:14,paddingVertical:14},
 searchText:{color:colors.muted,fontSize:13,flex:1},
 section:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 sectionTitle:{color:colors.navy,fontSize:18,fontWeight:'800'},
 see:{color:colors.muted,fontSize:12,fontWeight:'600'},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
 category:{flexBasis:'47%',flexGrow:1,minHeight:112,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:10,alignItems:'center',justifyContent:'center',gap:4},
 art:{height:72,alignItems:'center',justifyContent:'center'},
 catText:{color:colors.navy,fontWeight:'700',fontSize:13},
 empty:{borderWidth:1,borderColor:colors.border,borderRadius:18,paddingBottom:spacing.md,backgroundColor:colors.white}
});
