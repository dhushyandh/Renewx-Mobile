import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../src/components/Screen';
import StateMessage from '../../src/components/StateMessage';
import { colors, spacing } from '../../src/theme';

export default function HomeScreen() {
  return (
    <Screen contentContainerStyle={styles.container}>
      <Text style={styles.brand}>Renew<Text style={styles.brandX}>X</Text> <Text style={styles.crew}>CREW</Text></Text>
      <Text style={styles.eyebrow}>BUY PRE-OWNED · SELL · UPGRADE</Text>
      <Text style={styles.heading}>Better tech. Smarter choices.</Text>
      <StateMessage title="Storefront foundation" description="Live products will be connected after the existing product API contract is verified. No demo listings are displayed." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.xl, gap: spacing.md },
  brand: { color: colors.navy, fontSize: 28, fontWeight: '900' },
  brandX: { color: colors.yellow },
  crew: { color: colors.muted, fontSize: 11, letterSpacing: 2 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  heading: { color: colors.navy, fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
});
