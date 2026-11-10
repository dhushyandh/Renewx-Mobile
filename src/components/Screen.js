import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function Screen({ children, scroll = true, contentContainerStyle, style }) {
  const content = <View style={[styles.content, contentContainerStyle]}>{children}</View>;

  return scroll ? (
    <ScrollView
      style={[styles.root, style]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {content}
    </ScrollView>
  ) : (
    <View style={[styles.root, styles.fixed, style]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  fixed: { paddingHorizontal: spacing.md },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', padding: spacing.md },
});
