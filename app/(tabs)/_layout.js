import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme';

function TabLabel({ children, focused }) {
  return <Text style={{ color: focused ? colors.navy : colors.muted, fontSize: 11, fontWeight: focused ? '700' : '500' }}>{children}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border, height: 66, paddingTop: 8, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Home</TabLabel> }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop', tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Shop</TabLabel> }} />
      <Tabs.Screen name="sell" options={{ title: 'Sell', tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Sell</TabLabel> }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Orders</TabLabel> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: ({ focused }) => <TabLabel focused={focused}>Profile</TabLabel> }} />
    </Tabs>
  );
}
