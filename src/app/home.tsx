
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AquaMascot from "../components/AquaMascot";

const categories = [
  {
    name: "Air Jernih",
    description: "Tampilan air bening",
    icon: "water-outline",
    color: "bg-sky-100",
  },
  {
    name: "Air Keruh",
    description: "Tampilan air tidak bening",
    icon: "cloud-outline",
    color: "bg-yellow-100",
  },
  {
    name: "Air Abu-abu",
    description: "Tampilan air keabu-abuan",
    icon: "cloud",
    color: "bg-gray-200",
  },
  {
    name: "Air Coklat",
    description: "Tampilan air kecoklatan",
    icon: "water",
    color: "bg-orange-100",
  },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-[#F5FAFC]"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-14 pb-8">

        {/* HEADER */}
        <View className="flex-row items-center justify-between">

          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-[#079CC3] items-center justify-center">
              <Ionicons name="water" size={28} color="white" />
            </View>

            <View className="ml-3">
              <Text className="text-xl font-bold text-[#193B4C]">
                HydroSense
              </Text>

              <Text className="text-xs text-gray-500">
                Smart Water Quality Detection
              </Text>
            </View>
          </View>

          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center">
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#193B4C"
            />
          </TouchableOpacity>

        </View>

        {/* WELCOME */}
        <View className="mt-9">
          <Text className="text-2xl font-bold text-[#193B4C]">
            Hello, Explorer!
          </Text>

          <Text className="text-sm text-gray-500 mt-2 leading-5">
            Let&apos;s discover the visual condition of your water today.
          </Text>
        </View>

        {/* SCANNER */}
        <View className="mt-7 bg-[#079CC3] rounded-3xl p-5">

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">
                Water Quality Scanner
              </Text>

              <Text className="text-white/80 text-sm mt-2 leading-5">
                Scan your water and discover its visual category using AI.
              </Text>
            </View>

            <Ionicons
              name="scan-circle-outline"
              size={65}
              color="white"
            />
          </View>

          <TouchableOpacity
            className="mt-5 bg-white rounded-xl py-3 flex-row items-center justify-center"
            onPress={() => console.log("Open Scanner")}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color="#079CC3"
            />

            <Text className="text-[#079CC3] font-bold ml-2">
              Start Scanning
            </Text>
          </TouchableOpacity>

        </View>

        {/* CATEGORIES */}
        <View className="mt-8">

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#193B4C]">
              Water Categories
            </Text>

            <Text className="text-xs text-[#079CC3] font-semibold">
              4 Categories
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {categories.map((item) => (
              <View
                key={item.name}
                className={`w-[48%] ${item.color} rounded-2xl p-4 mb-3`}
              >
                <Ionicons
                  name={item.icon}
                  size={30}
                  color="#193B4C"
                />

                <Text className="text-[#193B4C] font-bold mt-3">
                  {item.name}
                </Text>

                <Text className="text-gray-500 text-xs mt-1">
                  {item.description}
                </Text>
              </View>
            ))}
          </View>

        </View>

        {/* AQUA ASSISTANT */}
        <View className="mt-5 rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-24 items-center justify-center">
              <AquaMascot />
            </View>

            <View className="ml-2 flex-1">
              <Text className="text-lg font-bold text-[#193B4C]">
                Meet AQUA!
              </Text>

              <Text className="mt-1 text-xs leading-5 text-gray-500">
                Your AI water quality assistant is ready to explain your
                scanning results.
              </Text>

              <TouchableOpacity
                className="mt-3 items-center rounded-full bg-[#E7F7FC] py-2.5"
                onPress={() => console.log("Open AQUA")}
              >
                <Text className="text-sm font-bold text-[#079CC3]">
                  Meet AQUA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <Text className="text-center text-xs text-gray-400 mt-8 mb-4">
          HydroSense © 2026
        </Text>

      </View>
    </ScrollView>
  );
}
