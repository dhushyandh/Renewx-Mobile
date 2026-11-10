import { StyleSheet, Text, View } from 'react-native';
import Screen from '../src/components/Screen';
import StateMessage from '../src/components/StateMessage';
import { colors, spacing } from '../src/theme';

export default function IndexScreen() {
  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.brandRow}>
        <Text style={styles.brand}>Renew<Text style={styles.brandX}>X</Text></Text>
        <Text style={styles.crew}>CREW</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>BUY PRE-OWNED · SELL · UPGRADE</Text>
        <Text style={styles.heading}>Better tech.{ '\n' }Smarter choices.</Text>
        <Text style={styles.subheading}>
          Discover quality pre-owned electronics with a more thoughtful way to upgrade.
        </Text>
      </View>

      <StateMessage
        title="Your storefront foundation is ready"
        description="Live products will appear here after the existing RenewX product API has been audited and connected. No sample listings are shown."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingVertical: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  brand: { color: colors.navy, fontSize: 32, fontWeight: '900', letterSpacing: -1.5 },
  brandX: { color: colors.yellow },
  crew: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  hero: { marginTop: spacing.xxl, marginBottom: spacing.xl, gap: spacing.md },
  eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  heading: { color: colors.navy, fontSize: 42, lineHeight: 48, fontWeight: '800', letterSpacing: -1.5 },
  subheading: { maxWidth: 520, color: colors.muted, fontSize: 16, lineHeight: 25 },
});
