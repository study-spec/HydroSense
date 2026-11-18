
import "../../global.css";

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#079CC3",
        tabBarInactiveTintColor: "#91A4B0",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopColor: "#E5EDF1",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={typeof size === "number" ? size : 24}
              color={typeof color === "string" ? color : "#079CC3"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass-outline"
              size={typeof size === "number" ? size : 24}
              color={typeof color === "string" ? color : "#079CC3"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
