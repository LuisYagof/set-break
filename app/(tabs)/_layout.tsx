import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Timers",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="playlist.add" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="countdown"
        options={{
          title: "Countdown",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="timer" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
