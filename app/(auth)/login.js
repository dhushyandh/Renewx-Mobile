import { Text, View } from 'react-native';
import { colors } from '../../src/theme';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
      <Text style={{ color: colors.navy, fontSize: 20, fontWeight: '700' }}>Sign in to RenewX</Text>
      <Text style={{ color: colors.muted, marginTop: 8 }}>Authentication UI will be connected after the existing API flow is audited.</Text>
    </View>
  );
}
