import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme';
export default function TabLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:colors.navy,tabBarInactiveTintColor:colors.muted,tabBarStyle:{backgroundColor:colors.white,borderTopColor:colors.border,height:68,paddingTop:8,paddingBottom:8},tabBarLabelStyle:{fontSize:11,fontWeight:'600'}}}>
<Tabs.Screen name="index" options={{title:'Home',tabBarIcon:({color,size})=><Ionicons name="home-outline" color={color} size={size}/>}}/><Tabs.Screen name="shop" options={{title:'Shop',tabBarIcon:({color,size})=><Ionicons name="grid-outline" color={color} size={size}/>}}/><Tabs.Screen name="sell" options={{title:'Sell',tabBarIcon:({color,size})=><Ionicons name="pricetag-outline" color={color} size={size}/>}}/><Tabs.Screen name="orders" options={{title:'Orders',tabBarIcon:({color,size})=><Ionicons name="receipt-outline" color={color} size={size}/>}}/><Tabs.Screen name="profile" options={{title:'Profile',tabBarIcon:({color,size})=><Ionicons name="person-outline" color={color} size={size}/>}}/>
</Tabs>;}
