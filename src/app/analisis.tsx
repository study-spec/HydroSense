
import { useLocalSearchParams, router } from "expo-router";
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

const WATER_CATEGORIES = {
  "Air Jernih": {
    color: "#20CFFF",
    message:
      "Halo! Aku AQUA. Sampel air ini teridentifikasi sebagai air jernih berdasarkan tampilan visualnya. Tetap lakukan pengujian lanjutan untuk memastikan kualitas air, ya!",
    description:
      "Air terlihat jernih dan memiliki sedikit partikel yang tampak secara visual.",
    recommendation:
      "Lakukan pemeriksaan lanjutan untuk memastikan kualitas air.",
  },

  "Air Abu-abu": {
    color: "#CBD5E1",
    message:
      "Halo! Aku AQUA. Hmm, sampel air ini terlihat berwarna abu-abu. Ada kemungkinan terdapat partikel atau material yang memengaruhi tampilannya.",
    description:
      "Air menunjukkan warna abu-abu yang dapat berkaitan dengan material tersuspensi.",
    recommendation:
      "Periksa sumber air dan lakukan pengujian kualitas lebih lanjut.",
  },

  "Air Keruh": {
    color: "#FACC15",
    message:
      "Halo! Aku AQUA. Sepertinya air ini cukup keruh. Tampilan ini bisa berkaitan dengan adanya partikel seperti tanah atau lumpur.",
    description:
      "Air terlihat keruh dan memiliki tingkat kejernihan visual yang rendah.",
    recommendation:
      "Hindari menentukan keamanan air hanya dari tampilannya. Lakukan pengujian lanjutan.",
  },

  "Air Coklat": {
    color: "#D99A55",
    message:
      "Halo! Aku AQUA. Wah, sampel air ini terlihat kecokelatan. Kondisi ini dapat berkaitan dengan tanah, lumpur, atau material lainnya.",
    description:
      "Air menunjukkan warna kecokelatan yang mungkin berkaitan dengan material terlarut atau tersuspensi.",
    recommendation:
      "Periksa sumber air dan lakukan pengujian kualitas sebelum digunakan.",
  },
} as const;

type WaterCategory = keyof typeof WATER_CATEGORIES;

// ========================================
// HELPER PARAMETER
// ========================================

function getParamValue(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

// ========================================
// HALAMAN ANALISIS
// ========================================

export default function AnalysisScreen() {
  const [showAqua, setShowAqua] = useState(false);

  // Mengambil data dari Scanner
  const params = useLocalSearchParams<{
    imageUri?: string | string[];
    category?: string | string[];
    confidence?: string | string[];
  }>();

  const selectedImage = getParamValue(params.imageUri);
  const categoryParam = getParamValue(params.category);
  const confidenceParam = getParamValue(params.confidence);

  // Validasi kategori dari API
  const isValidCategory = Object.prototype.hasOwnProperty.call(
    WATER_CATEGORIES,
    categoryParam
  );

  if (!isValidCategory) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#071824] px-6">
        <Ionicons
          name="alert-circle-outline"
          size={65}
          color="#FACC15"
        />

        <Text className="mt-5 text-center text-xl font-extrabold text-white">
          Hasil Analisis Belum Tersedia
        </Text>

        <Text className="mt-3 text-center leading-6 text-slate-400">
          Silakan kembali ke scanner dan lakukan analisis gambar terlebih dahulu.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/scanner")}
          className="mt-7 w-full rounded-2xl bg-cyan-500 py-4"
        >
          <Text className="text-center font-bold text-[#071824]">
            Kembali ke Scanner
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const category = categoryParam as WaterCategory;
  const result = WATER_CATEGORIES[category];

  // Confidence dari API sudah dalam bentuk persen
  const parsedConfidence = Number(confidenceParam);

  const confidence =
    Number.isFinite(parsedConfidence) &&
    parsedConfidence >= 0 &&
    parsedConfidence <= 100
      ? parsedConfidence
      : null;

  const categoryColor = result.color;
  const aquaMessage = result.message;

  return (
    <SafeAreaView className="flex-1 bg-[#071824]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-extrabold text-white">
              Hasil Analisis
            </Text>

            <Text className="mt-1 text-sm text-slate-400">
              HydroSense Water Scanner
            </Text>
          </View>

          <View
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${categoryColor}20`,
            }}
          >
            <Ionicons
              name="water"
              size={24}
              color={categoryColor}
            />
          </View>
        </View>

        {/* PREVIEW GAMBAR */}
        <View className="h-40 items-center justify-center overflow-hidden rounded-2xl bg-[#183C4D]">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
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

        {/* HASIL KLASIFIKASI */}
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
            style={{ color: categoryColor }}
            className="mt-2 text-2xl font-extrabold"
          >
            {category}
          </Text>

          {/* CONFIDENCE */}
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-sm text-slate-400">
              Confidence model
            </Text>

            <Text className="font-bold text-white">
              {confidence !== null
                ? `${confidence.toFixed(1)}%`
                : "Tidak tersedia"}
            </Text>
          </View>

          <View className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
            <View
              style={{
                width: `${confidence ?? 0}%`,
                backgroundColor: categoryColor,
              }}
              className="h-full rounded-full"
            />
          </View>

          <Text className="mt-3 text-xs leading-5 text-slate-400">
            Confidence merupakan tingkat keyakinan prediksi model,
            bukan persentase kemurnian atau keamanan air.
          </Text>
        </View>

        {/* DESKRIPSI */}
        <View className="mt-5 rounded-2xl border border-white/10 bg-[#102B3B] p-4">
          <View className="mb-2 flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={categoryColor}
            />

            <Text className="ml-2 font-bold text-white">
              Deskripsi Sampel
            </Text>
          </View>

          <Text className="text-sm leading-6 text-slate-300">
            {result.description}
          </Text>
        </View>

        {/* REKOMENDASI */}
        <View className="mt-4 rounded-2xl border border-white/10 bg-[#102B3B] p-4">
          <View className="mb-2 flex-row items-center">
            <Ionicons
              name="bulb-outline"
              size={20}
              color="#FACC15"
            />

            <Text className="ml-2 font-bold text-white">
              Rekomendasi
            </Text>
          </View>

          <Text className="text-sm leading-6 text-slate-300">
            {result.recommendation}
          </Text>
        </View>

        {/* PANGGIL AQUA */}
        {!showAqua && (
          <TouchableOpacity
            onPress={() => setShowAqua(true)}
            activeOpacity={0.8}
            style={{
              backgroundColor: categoryColor,
            }}
            className="mt-6 flex-row items-center justify-center rounded-2xl py-4"
          >
            <Ionicons
              name="sparkles"
              size={20}
              color="#071824"
            />

            <Text className="ml-2 font-bold text-[#071824]">
              Panggil AQUA Assistant
            </Text>
          </TouchableOpacity>
        )}

        {/* AQUA HOLOGRAM */}
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
              category={category}
              accentColor={categoryColor}
            />

            <TouchableOpacity
              onPress={() => setShowAqua(false)}
              className="mt-5 items-center rounded-xl border border-white/10 py-3"
            >
              <Text className="text-sm font-semibold text-slate-400">
                Tutup AQUA Assistant
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CATATAN PENTING */}
        <View className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <View className="flex-row items-center">
            <Ionicons
              name="alert-circle"
              size={20}
              color="#FBBF24"
            />

            <Text className="ml-2 font-bold text-amber-300">
              Catatan Penting
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
