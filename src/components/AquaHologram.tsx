
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

type AquaHologramProps = {
  message: string;
  accentColor?: string;
};

export default function AquaHologram({
  message,
  accentColor = "#20CFFF",
}: AquaHologramProps) {
  const [characterY] = useState(() => new Animated.Value(90));
  const [characterOpacity] = useState(() => new Animated.Value(0));
  const [characterScale] = useState(() => new Animated.Value(0.65));

  const [rippleScale] = useState(() => new Animated.Value(0.5));
  const [rippleOpacity] = useState(() => new Animated.Value(0.8));

  const [glow] = useState(() => new Animated.Value(0.35));
  const [scanY] = useState(() => new Animated.Value(-75));

  useEffect(() => {
    // Animasi karakter muncul dari bawah
    Animated.parallel([
      Animated.timing(characterY, {
        toValue: 0,
        duration: 1100,
        easing: Easing.out(Easing.back(1.3)),
        useNativeDriver: true,
      }),
      Animated.timing(characterOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(characterScale, {
        toValue: 1,
        friction: 6,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        Speech.speak(message, {
          language: "id-ID",
          pitch: 1.05,
          rate: 0.92,
        });
      }
    });

    // Gelombang hologram berulang
    const rippleAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rippleScale, {
            toValue: 1.7,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(rippleScale, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Cahaya hologram berdenyut
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.9,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    // Garis pemindai
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 75,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: -75,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    rippleAnimation.start();
    glowAnimation.start();
    scanAnimation.start();

    return () => {
      rippleAnimation.stop();
      glowAnimation.stop();
      scanAnimation.stop();
      Speech.stop();
    };
  }, [
    characterOpacity,
    characterScale,
    characterY,
    glow,
    message,
    rippleOpacity,
    rippleScale,
    scanY,
  ]);

  const replayVoice = () => {
    Speech.stop();

    Speech.speak(message, {
      language: "id-ID",
      pitch: 1.05,
      rate: 0.92,
    });
  };

  return (
    <View className="w-full items-center justify-center">
      {/* Area hologram */}
      <View className="h-[260px] w-full items-center justify-center overflow-hidden">
        {/* Cahaya belakang */}
        <Animated.View
          style={{
            position: "absolute",
            width: 170,
            height: 170,
            borderRadius: 100,
            backgroundColor: accentColor,
            opacity: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.03, 0.15],
            }),
            transform: [{ scale: 1.3 }],
          }}
        />

        {/* Gelombang pertama */}
        <Animated.View
          style={{
            position: "absolute",
            width: 125,
            height: 125,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: accentColor,
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          }}
        />

        {/* Gelombang kedua */}
        <Animated.View
          style={{
            position: "absolute",
            width: 125,
            height: 125,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: accentColor,
            opacity: rippleOpacity.interpolate({
              inputRange: [0, 0.8],
              outputRange: [0, 0.5],
            }),
            transform: [
              {
                scale: rippleScale.interpolate({
                  inputRange: [0.5, 1.7],
                  outputRange: [0.7, 1.9],
                }),
              },
            ],
          }}
        />

        {/* Karakter hologram */}
        <Animated.View
          style={{
            opacity: characterOpacity,
            transform: [
              { translateY: characterY },
              { scale: characterScale },
            ],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 120,
              height: 150,
              borderRadius: 60,
              borderWidth: 2,
              borderColor: accentColor,
              backgroundColor: `${accentColor}18`,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: accentColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.9,
              shadowRadius: 22,
              elevation: 12,
            }}
          >
            <Ionicons
              name="water"
              size={82}
              color={accentColor}
            />

            <View
              style={{
                position: "absolute",
                bottom: 20,
                width: 48,
                height: 3,
                borderRadius: 10,
                backgroundColor: accentColor,
              }}
            />
          </View>

          <Text
            style={{
              color: accentColor,
              fontSize: 18,
              fontWeight: "800",
              letterSpacing: 5,
              marginTop: 10,
              textShadowColor: accentColor,
              textShadowRadius: 12,
            }}
          >
            A Q U A
          </Text>

          <Text className="mt-1 text-xs tracking-[3px] text-cyan-300">
            HOLOGRAM ASSISTANT
          </Text>
        </Animated.View>

        {/* Garis pemindai */}
        <Animated.View
          style={{
            position: "absolute",
            width: 145,
            height: 2,
            backgroundColor: accentColor,
            opacity: 0.65,
            transform: [{ translateY: scanY }],
          }}
        />
      </View>

      {/* Status hologram */}
      <View className="mt-1 flex-row items-center">
        <View
          className="mr-2 h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <Text
          style={{ color: accentColor }}
          className="text-xs font-bold tracking-[2px]"
        >
          AQUA SYSTEM ONLINE
        </Text>
      </View>

      {/* Kotak dialog */}
      <View className="mt-5 w-full rounded-2xl border border-cyan-400/30 bg-slate-900/90 p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={accentColor}
            />
            <Text className="ml-2 font-bold text-white">
              AQUA Assistant
            </Text>
          </View>

          <View className="rounded-full bg-cyan-400/10 px-3 py-1">
            <Text className="text-[10px] font-bold text-cyan-300">
              AI RESPONSE
            </Text>
          </View>
        </View>

        <Text className="text-sm leading-6 text-slate-200">
          {message}
        </Text>

        <TouchableOpacity
          onPress={replayVoice}
          className="mt-4 flex-row items-center self-start rounded-full bg-cyan-400/15 px-4 py-2"
        >
          <Ionicons
            name="volume-high"
            size={17}
            color={accentColor}
          />
          <Text
            style={{ color: accentColor }}
            className="ml-2 text-xs font-bold"
          >
            Dengarkan penjelasan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
