import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../src/components/Screen';
import { colors, radius, spacing } from '../../src/theme';

const deviceTypes = ['Phone', 'Laptop', 'Tablet', 'Audio', 'Wearable', 'Other'];

export default function SellScreen() {
  const [deviceType, setDeviceType] = useState('Phone');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');

  return <Screen contentContainerStyle={styles.page}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>GIVE YOUR DEVICE A NEW LIFE</Text>
      <Text style={styles.title}>Sell with RenewX</Text>
      <Text style={styles.subtitle}>Tell us a little about your device to get started.</Text>
    </View>
    <View style={styles.steps}>
      <View style={styles.stepActive}><Text style={styles.stepNumber}>1</Text></View><View style={styles.stepLine}/><View style={styles.step}><Text style={styles.stepNumberMuted}>2</Text></View><View style={styles.stepLine}/><View style={styles.step}><Text style={styles.stepNumberMuted}>3</Text></View>
      <Text style={styles.stepCaption}>Device details</Text>
    </View>
    <View style={styles.card}>
      <Text style={styles.label}>What are you selling?</Text>
      <View style={styles.typeGrid}>{deviceTypes.map(type => <Pressable key={type} onPress={() => setDeviceType(type)} style={[styles.typeOption, deviceType === type && styles.typeSelected]}><Text style={[styles.typeText, deviceType === type && styles.typeTextSelected]}>{type}</Text></Pressable>)}</View>
      <Text style={styles.label}>Brand</Text>
      <TextInput value={brand} onChangeText={setBrand} placeholder="e.g. Apple, Samsung, Dell" placeholderTextColor={colors.muted} style={styles.input}/>
      <Text style={styles.label}>Model</Text>
      <TextInput value={model} onChangeText={setModel} placeholder="Enter exact model name" placeholderTextColor={colors.muted} style={styles.input}/>
      <Text style={styles.label}>Device condition</Text>
      <View style={styles.conditionList}>{['Like new', 'Good', 'Fair', 'Needs repair'].map(value => <Pressable key={value} onPress={() => setCondition(value)} style={[styles.condition, condition === value && styles.conditionSelected]}><Ionicons name={condition === value ? 'radio-button-on' : 'radio-button-off'} size={18} color={condition === value ? colors.navy : colors.muted}/><Text style={styles.conditionText}>{value}</Text></Pressable>)}</View>
      <Text style={styles.label}>Anything else? (optional)</Text>
      <TextInput value={notes} onChangeText={setNotes} placeholder="Mention accessories, issues or details" placeholderTextColor={colors.muted} style={[styles.input, styles.notes]} multiline textAlignVertical="top"/>
      <View style={styles.notice}><Ionicons name="information-circle-outline" size={18} color={colors.navy}/><Text style={styles.noticeText}>This is the first step of the selling flow. Photo upload, evaluation and offer submission will be connected after the backend sell-request API is verified.</Text></View>
      <Pressable disabled={!brand.trim() || !model.trim() || !condition} style={[styles.continueButton, (!brand.trim() || !model.trim() || !condition) && styles.disabled]}><Text style={styles.continueText}>Continue</Text><Ionicons name="arrow-forward" size={17} color={colors.navy}/></Pressable>
    </View>
  </Screen>;
}
const styles=StyleSheet.create({
 page:{paddingTop:spacing.lg,paddingBottom:spacing.xxl,gap:spacing.lg},
 header:{gap:6},
 eyebrow:{color:colors.muted,fontSize:10,fontWeight:'800',letterSpacing:1.2},
 title:{color:colors.navy,fontSize:26,fontWeight:'900'},
 subtitle:{color:colors.muted,fontSize:14,lineHeight:21},
 steps:{flexDirection:'row',alignItems:'center',gap:8},
 stepActive:{width:30,height:30,borderRadius:15,backgroundColor:colors.yellow,alignItems:'center',justifyContent:'center'},
 step:{width:30,height:30,borderRadius:15,backgroundColor:colors.cloud,alignItems:'center',justifyContent:'center'},
 stepNumber:{fontWeight:'900',color:colors.navy},stepNumberMuted:{fontWeight:'800',color:colors.muted},
 stepLine:{height:2,flex:1,backgroundColor:colors.border},stepCaption:{position:'absolute',left:0,top:36,color:colors.navy,fontSize:11,fontWeight:'700'},
 card:{marginTop:spacing.sm,padding:spacing.md,borderWidth:1,borderColor:colors.border,borderRadius:radius.xl,backgroundColor:colors.white,gap:10},
 label:{color:colors.navy,fontSize:13,fontWeight:'800',marginTop:8},
 typeGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:4},
 typeOption:{borderWidth:1,borderColor:colors.border,borderRadius:radius.pill,paddingHorizontal:14,paddingVertical:9},
 typeSelected:{backgroundColor:colors.navy,borderColor:colors.navy},
 typeText:{color:colors.navy,fontSize:12,fontWeight:'700'},typeTextSelected:{color:colors.white},
 input:{minHeight:48,borderWidth:1,borderColor:colors.border,borderRadius:radius.md,paddingHorizontal:13,color:colors.navy,fontSize:14,backgroundColor:colors.white},
 conditionList:{gap:10,paddingVertical:5},
 condition:{flexDirection:'row',alignItems:'center',gap:9},
 conditionSelected:{},
 conditionText:{color:colors.text,fontSize:13,fontWeight:'600'},
 notes:{height:90,paddingTop:12},
 notice:{flexDirection:'row',gap:9,backgroundColor:colors.cloud,borderRadius:radius.md,padding:12,marginTop:4},
 noticeText:{flex:1,color:colors.muted,fontSize:11,lineHeight:17},
 continueButton:{height:50,backgroundColor:colors.yellow,borderRadius:radius.pill,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:8},
 disabled:{opacity:0.45},continueText:{color:colors.navy,fontWeight:'900',fontSize:14}
});
