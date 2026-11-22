
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

type AquaHologramProps = {
  message: string;
  category: string;
  accentColor?: string;
};

const MASCOTS = {
  "Air Jernih": require("../../assets/images/aqua-jernih.png"),
  "Air Abu-abu": require("../../assets/images/aqua-abu-abu.png"),
  "Air Keruh": require("../../assets/images/aqua-keruh.png"),
  "Air Coklat": require("../../assets/images/aqua-coklat.png"),
};

async function speakAqua(message: string) {
  const voices = await Speech.getAvailableVoicesAsync();

  const indoVoices = voices.filter((voice) =>
    voice.language?.toLowerCase().startsWith("id")
  );

  const femaleVoice = indoVoices.find((voice) =>
    /female|woman|perempuan|wanita/i.test(
      `${voice.name} ${voice.identifier}`
    )
  );

  Speech.stop();

  Speech.speak(message, {
    language: "id-ID",
    voice: femaleVoice?.identifier,
    pitch: 1.12,
    rate: 0.9,
  });
}

export default function AquaHologram({
  message,
  category,
  accentColor = "#20CFFF",
}: AquaHologramProps) {
  const [characterY] = useState(() => new Animated.Value(90));
  const [characterOpacity] = useState(() => new Animated.Value(0));
  const [characterScale] = useState(() => new Animated.Value(0.65));

  const [rippleScale] = useState(() => new Animated.Value(0.5));
  const [rippleOpacity] = useState(() => new Animated.Value(0.8));
  const [glow] = useState(() => new Animated.Value(0.35));
  const [scanY] = useState(() => new Animated.Value(-120));

  const mascot =
    MASCOTS[category as keyof typeof MASCOTS] ??
    MASCOTS["Air Jernih"];

  useEffect(() => {
    const entrance = Animated.parallel([
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
    ]);

    entrance.start(({ finished }) => {
      if (finished) speakAqua(message);
    });

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

    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 120,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: -120,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    rippleAnimation.start();
    glowAnimation.start();
    scanAnimation.start();

    return () => {
      entrance.stop();
      rippleAnimation.stop();
      glowAnimation.stop();
      scanAnimation.stop();
      Speech.stop();
    };
  }, [
    message,
    characterY,
    characterOpacity,
    characterScale,
    rippleScale,
    rippleOpacity,
    glow,
    scanY,
  ]);

  const replayVoice = () => {
    speakAqua(message);
  };

  return (
    <View className="w-full items-center justify-center">
      {/* Radar dan area maskot */}
      <View className="h-[300px] w-full items-center justify-center overflow-hidden">

        {/* Cahaya radar */}
        <Animated.View
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 150,
            backgroundColor: accentColor,
            opacity: glow.interpolate({
              inputRange: [0, 1],
              outputRange: [0.02, 0.12],
            }),
          }}
        />

        {/* Lingkaran radar */}
        {[250, 210, 165].map((size, index) => (
          <View
            key={size}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: index === 0 ? 2 : 1,
              borderColor: accentColor,
              opacity: 0.35 + index * 0.15,
            }}
          />
        ))}

        {/* Gelombang radar */}
        <Animated.View
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: accentColor,
            opacity: rippleOpacity,
            transform: [{ scale: rippleScale }],
          }}
        />

        {/* Maskot asli */}
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
          <Image
            source={mascot}
            resizeMode="contain"
            style={{
              width: 230,
              height: 250,
            }}
          />
        </Animated.View>

        {/* Garis pemindai radar */}
        <Animated.View
          style={{
            position: "absolute",
            width: 250,
            height: 2,
            backgroundColor: accentColor,
            opacity: 0.65,
            transform: [{ translateY: scanY }],
          }}
        />
      </View>

      {/* Status AQUA */}
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

      {/* Dialog AQUA */}
      <View
        className="mt-5 w-full rounded-2xl border bg-slate-900/90 p-4"
        style={{ borderColor: `${accentColor}50` }}
      >
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

          <Text
            style={{ color: accentColor }}
            className="text-[10px] font-bold"
          >
            AI RESPONSE
          </Text>
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
