import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function StateMessage({ title, description, action }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.description}>{description}</Text>}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.xs },
  title: { color: colors.navy, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
});
