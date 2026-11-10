import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import StateMessage from '../../src/components/StateMessage';
import { colors, radius, spacing } from '../../src/theme';

export default function OrdersScreen() {
  return <Screen contentContainerStyle={styles.page}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>YOUR RENEWX ACTIVITY</Text>
      <Text style={styles.title}>My orders</Text>
      <Text style={styles.subtitle}>Follow purchases and delivery updates in one place.</Text>
    </View>
    <View style={styles.tabs}>
      <View style={styles.tabActive}><Text style={styles.tabActiveText}>All orders</Text></View>
      <View style={styles.tab}><Text style={styles.tabText}>In progress</Text></View>
      <View style={styles.tab}><Text style={styles.tabText}>Completed</Text></View>
    </View>
    <View style={styles.emptyCard}>
      <View style={styles.icon}><Ionicons name="receipt-outline" size={30} color={colors.navy}/></View>
      <StateMessage title="No orders yet" description="When you place an order, its status, delivery progress and order details will appear here."/>
    </View>
  </Screen>;
}
const styles=StyleSheet.create({
 page:{paddingTop:spacing.lg,gap:spacing.lg,flexGrow:1},
 header:{gap:6},eyebrow:{color:colors.muted,fontSize:10,fontWeight:'800',letterSpacing:1.2},
 title:{color:colors.navy,fontSize:26,fontWeight:'900'},subtitle:{color:colors.muted,fontSize:14,lineHeight:21},
 tabs:{flexDirection:'row',gap:8},
 tabActive:{paddingHorizontal:14,paddingVertical:10,borderRadius:radius.pill,backgroundColor:colors.navy},
 tab:{paddingHorizontal:14,paddingVertical:10,borderRadius:radius.pill,backgroundColor:colors.cloud},
 tabActiveText:{color:colors.white,fontSize:12,fontWeight:'800'},tabText:{color:colors.muted,fontSize:12,fontWeight:'700'},
 emptyCard:{flex:1,minHeight:300,borderWidth:1,borderColor:colors.border,borderRadius:radius.xl,backgroundColor:colors.white,alignItems:'center',justifyContent:'center',padding:spacing.md,gap:spacing.sm},
 icon:{width:62,height:62,borderRadius:31,backgroundColor:'#FFF7D6',alignItems:'center',justifyContent:'center'}
});
