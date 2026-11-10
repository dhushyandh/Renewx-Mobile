import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, spacing } from '../../src/theme';

const illustration=`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="140" viewBox="0 0 180 140"><ellipse cx="90" cy="122" rx="65" ry="9" fill="#E5E7EB"/><rect x="49" y="16" width="82" height="96" rx="13" fill="#111827"/><rect x="55" y="23" width="70" height="82" rx="8" fill="#F3F4F6"/><rect x="63" y="34" width="54" height="49" rx="6" fill="#FFC400"/><path d="M77 60h26" stroke="#111827" stroke-width="4" stroke-linecap="round"/><circle cx="90" cy="94" r="4" fill="#9CA3AF"/><circle cx="38" cy="42" r="13" fill="#FFC400"/><path d="M33 42h10m-5-5v10" stroke="#111827" stroke-width="2.5" stroke-linecap="round"/><circle cx="143" cy="66" r="10" fill="#E5E7EB"/><path d="M139 66h8" stroke="#6B7280" stroke-width="2" stroke-linecap="round"/></svg>`;

export default function EmptyCatalogue(){return <View style={s.wrap}><SvgXml xml={illustration} width={180} height={140}/><Text style={s.title}>Nothing here just yet</Text><Text style={s.copy}>New-to-you tech will show up here when the catalogue has matching products.</Text></View>}
const s=StyleSheet.create({wrap:{alignItems:'center',padding:spacing.lg,gap:spacing.xs},title:{color:colors.navy,fontSize:17,fontWeight:'800'},copy:{color:colors.muted,fontSize:13,lineHeight:19,textAlign:'center',maxWidth:300}});
