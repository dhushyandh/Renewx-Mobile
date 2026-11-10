import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { colors, radius, spacing } from '../../src/theme';

const items = [
  { icon:'person-outline' as const, title:'Personal information', detail:'Name, email and phone' },
  { icon:'location-outline' as const, title:'Saved addresses', detail:'Manage delivery locations' },
  { icon:'heart-outline' as const, title:'Wishlist', detail:'Devices you have saved' },
  { icon:'help-circle-outline' as const, title:'Help and support', detail:'Get help with RenewX' },
  { icon:'document-text-outline' as const, title:'Terms and privacy', detail:'Policies and legal information' },
];

export default function ProfileScreen() {
  return <Screen contentContainerStyle={styles.page}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
      <Text style={styles.title}>Profile</Text>
    </View>
    <View style={styles.accountCard}>
      <View style={styles.avatar}><Ionicons name="person" size={28} color={colors.navy}/></View>
      <View style={styles.accountCopy}><Text style={styles.accountTitle}>Welcome to RenewX</Text><Text style={styles.accountSubtitle}>Sign in to manage your account</Text></View>
      <Ionicons name="chevron-forward" size={19} color={colors.muted}/>
    </View>
    <Text style={styles.sectionTitle}>Account settings</Text>
    <View style={styles.menu}>
      {items.map((item,index)=><Pressable key={item.title} style={[styles.menuItem,index===items.length-1&&styles.lastItem]}>
        <View style={styles.menuIcon}><Ionicons name={item.icon} size={20} color={colors.navy}/></View>
        <View style={styles.menuCopy}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuDetail}>{item.detail}</Text></View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted}/>
      </Pressable>)}
    </View>
    <View style={styles.footer}><Text style={styles.footerBrand}>Renew<Text style={styles.footerX}>X</Text></Text><Text style={styles.footerText}>BUY PRE-OWNED · SELL · UPGRADE</Text></View>
  </Screen>;
}
const styles=StyleSheet.create({
 page:{paddingTop:spacing.lg,paddingBottom:spacing.xxl,gap:spacing.lg},
 header:{gap:5},eyebrow:{color:colors.muted,fontSize:10,fontWeight:'800',letterSpacing:1.2},
 title:{color:colors.navy,fontSize:26,fontWeight:'900'},
 accountCard:{flexDirection:'row',alignItems:'center',gap:13,padding:spacing.md,borderRadius:radius.lg,backgroundColor:colors.cloud},
 avatar:{width:54,height:54,borderRadius:27,backgroundColor:colors.yellow,alignItems:'center',justifyContent:'center'},
 accountCopy:{flex:1,gap:4},accountTitle:{color:colors.navy,fontSize:15,fontWeight:'800'},accountSubtitle:{color:colors.muted,fontSize:12},
 sectionTitle:{color:colors.navy,fontSize:16,fontWeight:'800',marginBottom:-8},
 menu:{borderWidth:1,borderColor:colors.border,borderRadius:radius.lg,backgroundColor:colors.white,paddingHorizontal:14},
 menuItem:{minHeight:70,flexDirection:'row',alignItems:'center',gap:12,borderBottomWidth:1,borderBottomColor:colors.border},
 lastItem:{borderBottomWidth:0},menuIcon:{width:38,height:38,borderRadius:12,backgroundColor:colors.cloud,alignItems:'center',justifyContent:'center'},
 menuCopy:{flex:1,gap:4},menuTitle:{color:colors.navy,fontSize:13,fontWeight:'800'},menuDetail:{color:colors.muted,fontSize:11},
 footer:{alignItems:'center',gap:4,paddingTop:spacing.md},footerBrand:{color:colors.navy,fontSize:21,fontWeight:'900',fontStyle:'italic'},
 footerX:{color:colors.yellow},footerText:{color:colors.muted,fontSize:9,fontWeight:'700',letterSpacing:1}
});
