import { useEffect } from "react";
import { Switch } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [loaded] = useFonts({
    // SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerRight: () => (
            <Switch
              style={{ marginRight: 10 }}
              thumbColor={Colors.light.tint}
              trackColor={{ false: "grey", true: "lightgrey" }}
              value={colorScheme === "dark"}
              onValueChange={toggleColorScheme}
            />
          ),
          headerLeft: () => (
            <ThemedText
              style={{ marginLeft: 10, color: Colors[colorScheme].tint }}
            >
              Dark theme
            </ThemedText>
          ),
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
