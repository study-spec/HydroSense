import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AquaHologram from "../components/AquaHologram";

const WATER_RESULT = {
  category: "Air Coklat",
  confidence: 92.5,
  description:
    "Sampel air menunjukkan tampilan berwarna coklat. Kondisi visual ini dapat berkaitan dengan partikel tanah, lumpur, atau material lain yang tersuspensi di dalam air.",
  recommendation:
    "Sebaiknya lakukan pemeriksaan lanjutan untuk mengetahui penyebab perubahan warna. Jangan menentukan keamanan air hanya berdasarkan tampilan visual.",
  color: "#D99A55",
};

const getAquaColor = (category: string) => {
  switch (category) {
    case "Air Jernih":
      return "#20CFFF";
    case "Air Keruh":
      return "#FACC15";
    case "Air Abu-abu":
      return "#CBD5E1";
    case "Air Coklat":
      return "#D99A55";
    default:
      return "#20CFFF";
  }
};

export default function AnalysisScreen() {
  const [showAqua, setShowAqua] = useState(false);
  const { imageUri } = useLocalSearchParams<{
    imageUri?: string;
  }>();

  const aquaMessage =
    `Halo! Aku AQUA, asisten HydroSense. ` +
    `Hasil analisis visual menunjukkan kategori ${WATER_RESULT.category} ` +
    `dengan tingkat kepercayaan model ${WATER_RESULT.confidence} persen. ` +
    `${WATER_RESULT.description} ${WATER_RESULT.recommendation}`;

  return (
    <SafeAreaView className="flex-1 bg-[#071824]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-extrabold text-white">
              Hasil Analisis
            </Text>
            <Text className="mt-1 text-sm text-slate-400">
              HydroSense Water Scanner
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10">
            <Ionicons
              name="water"
              size={24}
              color="#20CFFF"
            />
          </View>
        </View>

        {/* Preview sampel */}
        <View className="h-40 items-center justify-center overflow-hidden rounded-2xl bg-[#183C4D]">
        {imageUri ? (
            <Image
            source={{ uri: imageUri }}
            className="h-full w-full"
            resizeMode="cover"
            />
          ) : (
            <>
              <Ionicons
              name="water-outline"
              size={70}
              color="#B6DCE8"
              />
              <Text className="mt-2 text-xs text-slate-400">
               Belum ada gambar sampel
              </Text>
            </>
          )}
        </View>

        {/* Hasil model */}
        <View className="mt-5 rounded-3xl border border-white/10 bg-[#102B3B] p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-slate-400">
              Kategori terdeteksi
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={21}
              color="#4ADE80"
            />
          </View>

          <Text
            style={{ color: WATER_RESULT.color }}
            className="mt-2 text-2xl font-extrabold"
          >
            {WATER_RESULT.category}
          </Text>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-sm text-slate-400">
              Confidence model
            </Text>
            <Text className="font-bold text-white">
              {WATER_RESULT.confidence}%
            </Text>
          </View>

          <View className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
            <View
              style={{
                width: `${WATER_RESULT.confidence}%`,
                backgroundColor: WATER_RESULT.color,
              }}
              className="h-full rounded-full"
            />
          </View>

          <Text className="mt-3 text-xs leading-5 text-slate-400">
            Confidence merupakan tingkat keyakinan prediksi model,
            bukan persentase kemurnian atau keamanan air.
          </Text>
        </View>

        {/* Tombol memanggil AQUA */}
        {!showAqua && (
          <TouchableOpacity
            onPress={() => setShowAqua(true)}
            className="mt-6 flex-row items-center justify-center rounded-2xl bg-cyan-500 py-4"
          >
            <Ionicons
              name="sparkles"
              size={20}
              color="#FFFFFF"
            />
            <Text className="ml-2 font-bold text-white">
              Panggil AQUA Assistant
            </Text>
          </TouchableOpacity>
        )}

        {/* Hologram AQUA */}
        {showAqua && (
          <View className="mt-8">
            <Text className="mb-2 text-center text-xl font-extrabold text-white">
              AQUA is appearing...
            </Text>

            <Text className="mb-2 text-center text-xs text-slate-400">
              Initializing holographic assistant
            </Text>

            <AquaHologram
              message={aquaMessage}
              accentColor={getAquaColor(WATER_RESULT.category)}
            />
          </View>
        )}

        {/* Informasi tambahan */}
        <View className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle"
              size={20}
              color="#FBBF24"
            />
            <Text className="ml-2 font-bold text-amber-300">
              Catatan penting
            </Text>
          </View>

          <Text className="mt-2 text-xs leading-5 text-slate-300">
            HydroSense mengklasifikasikan tampilan visual air.
            Hasil ini tidak dapat memastikan kandungan bakteri,
            pH, tingkat kekeruhan terukur, maupun kelayakan air
            untuk diminum.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
