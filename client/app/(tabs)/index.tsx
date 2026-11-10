import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import StateMessage from '../../src/components/StateMessage';
import { colors, radius, spacing } from '../../src/theme';

const categories = [
  { title: 'Phones', icon: 'phone-portrait-outline' as const },
  { title: 'Laptops', icon: 'laptop-outline' as const },
  { title: 'Tablets', icon: 'tablet-portrait-outline' as const },
  { title: 'Accessories', icon: 'headset-outline' as const },
];

export default function HomeScreen() {
  return <Screen contentContainerStyle={s.page}>
    <View style={s.top}>
      <Text style={s.brand}>Renew<Text style={s.brandX}>X</Text></Text>
      <View style={s.location}><Ionicons name="location-outline" size={15} color={colors.navy}/><Text style={s.locText}>Set location</Text></View>
    </View>
    <View style={s.search}><Ionicons name="search-outline" size={19} color={colors.muted}/><Text style={s.searchText}>Search phones, laptops and more</Text><Ionicons name="options-outline" size={19} color={colors.navy}/></View>
    <View style={s.hero}>
      <View style={s.heroCopy}>
        <Text style={s.heroEyebrow}>RENEWX MARKETPLACE</Text>
        <Text style={s.heroTitle}>Pre-owned tech.{ '\n' }Smarter value.</Text>
        <Text style={s.heroSub}>Buy • Sell • Upgrade</Text>
      </View>
      <Ionicons name="phone-portrait" size={76} color={colors.yellow}/>
    </View>
    <View style={s.section}><Text style={s.sectionTitle}>Explore categories</Text><Text style={s.see}>See all</Text></View>
    <View style={s.grid}>{categories.map(item=><View key={item.title} style={s.category}><View style={s.art}><Ionicons name={item.icon} size={36} color={colors.navy}/></View><Text style={s.catText}>{item.title}</Text></View>)}</View>
    <View style={s.section}><Text style={s.sectionTitle}>Picked for you</Text></View>
    <View style={s.empty}><StateMessage title="Live catalogue coming next" description="We’ll connect real RenewX products after verifying the backend catalogue API. No demo listings or made-up prices." /></View>
  </Screen>;
}
const s=StyleSheet.create({
 page:{gap:spacing.lg,paddingTop:spacing.lg},
 top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 brand:{fontSize:27,fontWeight:'900',fontStyle:'italic',color:colors.navy,letterSpacing:-1.4},
 brandX:{color:colors.yellow},
 location:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:colors.cloud,paddingHorizontal:10,paddingVertical:9,borderRadius:radius.pill},
 locText:{color:colors.navy,fontSize:12,fontWeight:'600'},
 search:{flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.border,borderRadius:13,paddingHorizontal:14,paddingVertical:14},
 searchText:{color:colors.muted,fontSize:13,flex:1},
 hero:{minHeight:174,backgroundColor:colors.navy,borderRadius:20,padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',overflow:'hidden'},
 heroCopy:{flex:1,gap:8},
 heroEyebrow:{color:colors.yellow,fontSize:10,fontWeight:'800',letterSpacing:1.2},
 heroTitle:{color:colors.white,fontSize:25,fontWeight:'900',lineHeight:29,maxWidth:220},
 heroSub:{color:colors.white,fontSize:12,fontWeight:'600'},
 section:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 sectionTitle:{color:colors.navy,fontSize:18,fontWeight:'800'},
 see:{color:colors.muted,fontSize:12,fontWeight:'600'},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
 category:{flexBasis:'47%',flexGrow:1,minHeight:112,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:16,padding:10,alignItems:'center',justifyContent:'center',gap:8},
 art:{height:48,alignItems:'center',justifyContent:'center'},
 catText:{color:colors.navy,fontWeight:'700',fontSize:13},
 empty:{borderWidth:1,borderColor:colors.border,borderRadius:18,padding:spacing.md,backgroundColor:colors.white}
});
