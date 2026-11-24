import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { analyzeWater } from "../services/waterAPI";

export default function ScannerScreen() {
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Mengambil foto menggunakan kamera
  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo?.uri) {
        setCameraReady(false);
        setImageUri(photo.uri);
      }
    } catch (error) {
      console.log("Camera error:", error);
      setErrorMessage("Gagal mengambil foto. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Memilih gambar dari galeri
  const pickImage = async () => {
    if (loading) return;

    try {
      setErrorMessage("");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setCameraReady(false);
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Gallery error:", error);
      setErrorMessage("Gagal membuka galeri.");
    }
  };

  // Mengirim gambar ke API dan membuka halaman analisis
  const analyzeImage = async () => {
    if (!imageUri || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      const prediction = await analyzeWater(imageUri);

      router.push({
        pathname: "/analisis",
        params: {
          imageUri,
          category: prediction.category,
          confidence: String(prediction.confidence),
        },
      });
    } catch (error) {
      console.log("Analysis error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menganalisis gambar."
      );
    } finally {
      setLoading(false);
    }
  };

  // Meminta izin kamera
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#071824]">
        <ActivityIndicator color="#20CFFF" size="large" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#071824] px-6">
        <Ionicons name="camera-outline" size={70} color="#20CFFF" />

        <Text className="mt-5 text-2xl font-extrabold text-white">
          Izin Kamera
        </Text>

        <Text className="mt-3 text-center leading-6 text-slate-400">
          HydroSense membutuhkan akses kamera untuk mengambil
          gambar sampel air.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="mt-7 w-full rounded-2xl bg-cyan-500 py-4"
        >
          <Text className="text-center font-bold text-white">
            Izinkan Kamera
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#071824]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View>
          <Text className="text-2xl font-extrabold text-white">
            Water Scanner
          </Text>

          <Text className="mt-1 text-sm text-slate-400">
            Ambil gambar sampel air
          </Text>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10">
          <Ionicons name="scan" size={24} color="#20CFFF" />
        </View>
      </View>

      {/* Area kamera / preview */}
      <View className="mx-5 mt-3 flex-1 overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#102B3B]">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <CameraView
            ref={cameraRef}
            className="flex-1"
            facing="back"
            onCameraReady={() => setCameraReady(true)}
          />
        )}

        {/* Label kamera */}
        {!imageUri && (
          <View className="absolute left-4 top-4 rounded-full bg-black/50 px-4 py-2">
            <Text className="text-xs font-semibold text-cyan-300">
              LIVE CAMERA
            </Text>
          </View>
        )}

        {imageUri && (
          <View className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-2">
            <Text className="text-xs font-semibold text-green-300">
              IMAGE PREVIEW
            </Text>
          </View>
        )}

        {/* Overlay ketika analisis berlangsung */}
        {loading && imageUri && (
          <View className="absolute inset-0 items-center justify-center bg-black/60">
            <ActivityIndicator size="large" color="#20CFFF" />
            <Text className="mt-4 font-bold text-white">
              Sedang menganalisis sampel air...
            </Text>
            <Text className="mt-2 text-xs text-slate-300">
              Mohon tunggu sebentar
            </Text>
          </View>
        )}
      </View>

      {/* Petunjuk */}
      <View className="px-6 pt-5">
        <Text className="text-center text-sm text-slate-300">
          {imageUri
            ? "Pastikan gambar sampel air terlihat jelas."
            : "Arahkan kamera ke sampel air dengan pencahayaan cukup."}
        </Text>

        {!!errorMessage && (
          <Text className="mt-3 text-center text-sm text-red-400">
            {errorMessage}
          </Text>
        )}
      </View>

      {/* Tombol kontrol */}
      <View className="px-5 pb-6 pt-5">
        {imageUri ? (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                setCameraReady(false);
                setImageUri(null);
                setErrorMessage("");
              }}
              disabled={loading}
              className="flex-1 flex-row items-center justify-center rounded-2xl border border-white/15 py-4"
            >
              <Ionicons name="refresh" size={19} color="#FFFFFF" />
              <Text className="ml-2 font-bold text-white">
                Ulangi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={analyzeImage}
              disabled={loading}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-cyan-500 py-4"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="analytics" size={19} color="#FFFFFF" />
                  <Text className="ml-2 font-bold text-white">
                    Analisis
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center justify-around">
            <TouchableOpacity
              onPress={pickImage}
              disabled={loading}
              className="h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10"
            >
              <Ionicons name="images-outline" size={25} color="#20CFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePicture}
              disabled={!cameraReady || loading}
              className="h-20 w-20 items-center justify-center rounded-full border-4 border-cyan-300 bg-cyan-500"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={34} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <View className="h-14 w-14 items-center justify-center">
              <Ionicons name="water-outline" size={27} color="#20CFFF" />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
