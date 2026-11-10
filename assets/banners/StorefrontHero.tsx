import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors, radius, spacing } from '../../src/theme';

const heroArt=`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><circle cx="91" cy="90" r="78" fill="#fff" opacity=".3"/><path d="M53 34h72a13 13 0 0 1 13 13v91H40V47a13 13 0 0 1 13-13" fill="#111827"/><rect x="47" y="43" width="84" height="82" rx="7" fill="#F3F4F6"/><rect x="54" y="51" width="70" height="66" rx="4" fill="#FFC400"/><circle cx="89" cy="84" r="19" fill="#fff" opacity=".8"/><path d="M79 84l7 7 14-16" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="89" cy="132" r="4" fill="#9CA3AF"/><path d="M28 27l7 7m-7 0 7-7M145 25l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#fff" opacity=".9"/></svg>`;

export default function StorefrontHero(){return <View style={s.wrap}>
 <View style={s.copy}><Text style={s.kicker}>THE SMARTER WAY TO TECH</Text><Text style={s.title}>Good tech.{"\n"}Better value.</Text><Text style={s.sub}>Pre-loved devices. Fresh possibilities.</Text></View>
 <SvgXml xml={heroArt} width={150} height={150}/>
 </View>}
const s=StyleSheet.create({wrap:{minHeight:190,backgroundColor:colors.yellow,borderRadius:radius.xl,padding:spacing.lg,flexDirection:'row',alignItems:'center',overflow:'hidden'},copy:{flex:1,gap:8},kicker:{fontSize:9,fontWeight:'900',letterSpacing:1.2,color:colors.navy},title:{fontSize:30,lineHeight:33,fontWeight:'900',letterSpacing:-1,color:colors.navy},sub:{fontSize:12,lineHeight:17,color:colors.navy,maxWidth:185}});
