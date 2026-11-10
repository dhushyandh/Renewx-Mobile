import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme';

type Props = { size?: number; tagline?: boolean };
export default function RenewXMark({ size = 30, tagline = false }: Props) {
  return <View>
    <Text style={[styles.wordmark,{fontSize:size}]}>Renew<Text style={styles.x}>X</Text></Text>
    {tagline ? <Text style={styles.tagline}>BUY PRE-OWNED  ·  SELL  ·  UPGRADE</Text> : null}
  </View>;
}
const styles=StyleSheet.create({
  wordmark:{color:colors.navy,fontWeight:'900',letterSpacing:-1.5,fontStyle:'italic'},
  x:{color:colors.yellow},
  tagline:{color:colors.muted,fontSize:9,fontWeight:'800',letterSpacing:1.15,marginTop:2}
});
