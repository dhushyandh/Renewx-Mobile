import { Text, View } from 'react-native';
import { colors } from '../../src/theme';

export default function SellScreen() {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}><Text style={{ color: colors.navy, fontWeight: '700' }}>Sell your device</Text></View>;
}
