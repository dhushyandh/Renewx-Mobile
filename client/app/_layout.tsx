import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "../src/services/query/queryClient";
import { colors } from "../src/theme";
import { useAuthStore } from "../src/stores/authStore";
import CookieConsent from "../src/components/CookieConsent";

export default function RootLayout() {
  const initialize = useAuthStore(state => state.initialize);
  const ready = useAuthStore(state => state.ready);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => { void initialize(); }, [initialize]);
  useEffect(() => {
    if (!ready) return;
    const first = segments[0];
    const inAuth = first === "(auth)";
    const inOnboarding = first === "onboarding";
    if (!user && !inAuth) router.replace("/(auth)/login");
    else if (user && inAuth) router.replace(user.profile_completed ? "/(tabs)" : "/onboarding");
    else if (user && !user.profile_completed && !inOnboarding) router.replace("/onboarding");

  }, [ready, user, segments, router]);
  return <SafeAreaProvider><QueryClientProvider client={queryClient}><StatusBar style="dark" backgroundColor={colors.white}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:colors.white}}}/><CookieConsent/></QueryClientProvider></SafeAreaProvider>;
}
