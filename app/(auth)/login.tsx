import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../src/components/Screen";
import { useAuthStore } from "../../src/stores/authStore";
import { colors, radius, spacing } from "../../src/theme";

export default function LoginScreen() {
  const login = useAuthStore(s => s.login);
  const busy = useAuthStore(s => s.busy);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const submit = async () => {
    setError("");
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    try { await login(email.trim(), password); router.replace("/(tabs)"); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in. Try again."); }
  };
  return <Screen contentContainerStyle={s.page}>
    <View style={s.brandWrap}><Text style={s.logo}>Renew<Text style={s.accent}>X</Text></Text><Text style={s.kicker}>BUY PRE-OWNED  ·  SELL  ·  UPGRADE</Text></View>
    <View style={s.intro}><Text style={s.title}>Welcome back.</Text><Text style={s.copy}>Sign in to continue to your RenewX account.</Text></View>
    <View style={s.form}>
      <Text style={s.label}>Email address</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="you@example.com" placeholderTextColor={colors.muted} style={s.input}/>
      <Text style={s.label}>Password</Text>
      <View style={s.passwordRow}><TextInput value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete="current-password" placeholder="Enter your password" placeholderTextColor={colors.muted} style={s.password}/><Pressable onPress={()=>setShowPassword(v=>!v)} accessibilityRole="button" accessibilityLabel={showPassword?"Hide password":"Show password"}><Ionicons name={showPassword?"eye-off-outline":"eye-outline"} size={20} color={colors.muted}/></Pressable></View>
      {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
      <Pressable disabled={busy} onPress={submit} style={[s.submit,busy&&s.disabled]}>{busy?<ActivityIndicator color={colors.navy}/>:<Text style={s.submitText}>Sign in</Text>}</Pressable>
    </View>
    <View style={s.footer}><Text style={s.footerText}>New to RenewX?</Text><Link href="/(auth)/register" style={s.link}>Create an account</Link></View>
  </Screen>;
}
const s=StyleSheet.create({
 page:{flexGrow:1,justifyContent:"center",width:"100%",maxWidth:500,alignSelf:"center",paddingVertical:spacing.xl,gap:spacing.xl},
 brandWrap:{gap:5},logo:{color:colors.navy,fontSize:36,fontWeight:"900",fontStyle:"italic",letterSpacing:-1.5},accent:{color:colors.yellow},kicker:{color:colors.muted,fontSize:10,fontWeight:"800",letterSpacing:1.4},
 intro:{gap:8},title:{color:colors.navy,fontSize:32,fontWeight:"900",letterSpacing:-.8},copy:{color:colors.muted,fontSize:14,lineHeight:21},
 form:{gap:10},label:{color:colors.navy,fontSize:12,fontWeight:"800",marginTop:5},input:{borderWidth:1,borderColor:colors.border,borderRadius:radius.md,paddingHorizontal:14,paddingVertical:14,color:colors.navy,fontSize:14,backgroundColor:colors.white},passwordRow:{borderWidth:1,borderColor:colors.border,borderRadius:radius.md,paddingHorizontal:14,flexDirection:"row",alignItems:"center"},password:{flex:1,paddingVertical:14,color:colors.navy,fontSize:14},error:{color:"#B42318",fontSize:12,lineHeight:18,marginTop:4},
 submit:{backgroundColor:colors.yellow,borderRadius:radius.md,alignItems:"center",justifyContent:"center",minHeight:50,marginTop:10},disabled:{opacity:.6},submitText:{color:colors.navy,fontSize:14,fontWeight:"900"},
 footer:{flexDirection:"row",justifyContent:"center",gap:6},footerText:{color:colors.muted,fontSize:13},link:{color:colors.navy,fontSize:13,fontWeight:"800"}
});
