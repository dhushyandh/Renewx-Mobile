import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "../src/services/query/queryClient";
import { colors } from "../src/theme";
import { useAuthStore } from "../src/stores/authStore";

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  useEffect(() => { void initialize(); }, [initialize]);
  return <SafeAreaProvider><QueryClientProvider client={queryClient}><StatusBar style="dark" backgroundColor={colors.white}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.white}}}/></QueryClientProvider></SafeAreaProvider>;
}
