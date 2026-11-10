import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import Screen from "../../src/components/Screen";
import { useAuthStore } from "../../src/stores/authStore";
import { colors, radius, spacing } from "../../src/theme";

export default function RegisterScreen() {
  const register = useAuthStore(s => s.register);
  const busy = useAuthStore(s => s.busy);
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  const submit=async()=>{
    setError("");
    if(name.trim().length<2||!email.trim()||password.length<8){setError("Enter your name, a valid email and a password with at least 8 characters.");return;}
    try{await register(name.trim(),email.trim(),password);router.replace("/(tabs)");}
    catch(e){setError(e instanceof Error?e.message:"Unable to create account. Try again.");}
  };
  return <Screen contentContainerStyle={s.page}>
    <Text style={s.logo}>Renew<Text style={s.accent}>X</Text></Text>
    <View style={s.intro}><Text style={s.title}>Create your account.</Text><Text style={s.copy}>Join RenewX to buy, sell and upgrade your tech.</Text></View>
    <View style={s.form}>
      <Text style={s.label}>Full name</Text><TextInput value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" placeholder="Your name" placeholderTextColor={colors.muted} style={s.input}/>
      <Text style={s.label}>Email address</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="you@example.com" placeholderTextColor={colors.muted} style={s.input}/>
      <Text style={s.label}>Password</Text><TextInput value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" placeholder="At least 8 characters" placeholderTextColor={colors.muted} style={s.input}/>
      {error?<Text accessibilityRole="alert" style={s.error}>{error}</Text>:null}
      <Pressable disabled={busy} onPress={submit} style={[s.submit,busy&&{opacity:.6}]}>{busy?<ActivityIndicator color={colors.navy}/>:<Text style={s.submitText}>Create account</Text>}</Pressable>
    </View>
    <View style={s.footer}><Text style={s.copy}>Already have an account?</Text><Link href="/(auth)/login" style={s.link}>Sign in</Link></View>
  </Screen>;
}
const s=StyleSheet.create({page:{flexGrow:1,justifyContent:"center",maxWidth:500,width:"100%",alignSelf:"center",gap:spacing.xl,paddingVertical:spacing.xl},logo:{color:colors.navy,fontSize:36,fontWeight:"900",fontStyle:"italic"},accent:{color:colors.yellow},intro:{gap:8},title:{color:colors.navy,fontSize:30,fontWeight:"900"},copy:{color:colors.muted,fontSize:14,lineHeight:21},form:{gap:10},label:{color:colors.navy,fontSize:12,fontWeight:"800",marginTop:4},input:{borderWidth:1,borderColor:colors.border,borderRadius:radius.md,padding:14,color:colors.navy,backgroundColor:colors.white},error:{color:"#B42318",fontSize:12},submit:{backgroundColor:colors.yellow,borderRadius:radius.md,minHeight:50,alignItems:"center",justifyContent:"center",marginTop:8},submitText:{color:colors.navy,fontWeight:"900",fontSize:14},footer:{flexDirection:"row",justifyContent:"center",gap:8},link:{color:colors.navy,fontWeight:"800",fontSize:13}});
