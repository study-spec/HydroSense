
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
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

const MASCOTS: Record<string, any> = {
  "Air Jernih": require("../../assets/images/aqua-jernih.png"),
  "Air Abu-abu": require("../../assets/images/aqua-abu-abu.png"),
  "Air Keruh": require("../../assets/images/aqua-keruh.png"),
  "Air Coklat": require("../../assets/images/aqua-coklat.png"),
};

const CATEGORY_COLORS: Record<string, string> = {
  "Air Jernih": "#20CFFF",
  "Air Abu-abu": "#CBD5E1",
  "Air Keruh": "#FACC15",
  "Air Coklat": "#D99A55",
};

export default function AquaHologram({
  message,
  category,
  accentColor,
}: AquaHologramProps) {
  const color = accentColor || CATEGORY_COLORS[category] || "#20CFFF";

  const mascot =
    MASCOTS[category] || MASCOTS["Air Jernih"];

  // Animasi kemunculan
  const characterY = useRef(new Animated.Value(90)).current;
  const characterOpacity = useRef(new Animated.Value(0)).current;
  const characterScale = useRef(new Animated.Value(0.65)).current;

  // Animasi melayang
  const floatY = useRef(new Animated.Value(0)).current;

  // Animasi gerakan tubuh kanan-kiri
  const sway = useRef(new Animated.Value(0)).current;

  // Animasi kedipan mata
  const blink = useRef(new Animated.Value(0)).current;

  // Efek hologram
  const glow = useRef(new Animated.Value(0.35)).current;
  const rippleScale = useRef(new Animated.Value(0.5)).current;
  const rippleOpacity = useRef(new Animated.Value(0.8)).current;
  const scanY = useRef(new Animated.Value(-120)).current;

  const speakAqua = async () => {
    try {
      await Speech.stop();

      Speech.speak(message, {
        language: "id-ID",
        pitch: 1.12,
        rate: 0.9,
      });
    } catch (error) {
      console.log("AQUA speech error:", error);
    }
  };

  useEffect(() => {
    // Reset posisi awal
    characterY.setValue(90);
    characterOpacity.setValue(0);
    characterScale.setValue(0.65);

    // Animasi kemunculan AQUA
    const entranceAnimation = Animated.parallel([
      Animated.timing(characterY, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),

      Animated.timing(characterOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      Animated.spring(characterScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start(({ finished }) => {
      if (finished) {
        speakAqua();
      }
    });

    // Melayang naik-turun
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -9,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Gerakan tubuh sedikit ke kanan dan kiri
    const swayAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: -1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Kedipan mata berkala
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(2200),

        Animated.timing(blink, {
          toValue: 1,
          duration: 90,
          useNativeDriver: true,
        }),

        Animated.timing(blink, {
          toValue: 0,
          duration: 130,
          useNativeDriver: true,
        }),

        Animated.delay(2800),
      ])
    );

    // Cahaya hologram berdenyut
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.9,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.35,
          duration: 1300,
          useNativeDriver: true,
        }),
      ])
    );

    // Lingkaran radar
    const rippleAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(rippleScale, {
            toValue: 1.7,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale, {
            toValue: 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 1800,
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

    // Garis pemindai
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 120,
          duration: 2200,
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

    floatAnimation.start();
    swayAnimation.start();
    blinkAnimation.start();
    glowAnimation.start();
    rippleAnimation.start();
    scanAnimation.start();

    return () => {
      entranceAnimation.stop();
      floatAnimation.stop();
      swayAnimation.stop();
      blinkAnimation.stop();
      glowAnimation.stop();
      rippleAnimation.stop();
      scanAnimation.stop();

      Speech.stop();
    };
  }, [message, category]);

  const rotate = sway.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-2deg", "0deg", "2deg"],
  });

  const blinkOpacity = blink.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* AREA HOLOGRAM */}
      <View style={styles.hologramArea}>
        {/* Lingkaran radar luar */}
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: color,
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />

        {/* Lingkaran radar statis */}
        <View
          style={[
            styles.radar,
            {
              borderColor: `${color}35`,
            },
          ]}
        >
          <View
            style={[
              styles.radarMiddle,
              { borderColor: `${color}50` },
            ]}
          />

          <View
            style={[
              styles.radarInner,
              { borderColor: `${color}65` },
            ]}
          />
        </View>

        {/* Cahaya di belakang AQUA */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: color,
              opacity: glow,
            },
          ]}
        />

        {/* Karakter AQUA */}
        <Animated.View
          style={[
            styles.characterContainer,
            {
              opacity: characterOpacity,
              transform: [
                { translateY: characterY },
                { translateY: floatY },
                { scale: characterScale },
                { rotate },
              ],
            },
          ]}
        >
          <Image
            source={mascot}
            style={styles.mascot}
            resizeMode="contain"
          />

          {/* Kedipan visual.
              Sesuaikan posisi jika belum tepat menutupi mata maskot. */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.blinkOverlay,
              {
                backgroundColor: color,
                opacity: blinkOpacity,
              },
            ]}
          />
        </Animated.View>

        {/* Garis pemindai hologram */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.scanLine,
            {
              backgroundColor: color,
              shadowColor: color,
              transform: [{ translateY: scanY }],
            },
          ]}
        />
      </View>

      {/* STATUS SISTEM */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: color },
          ]}
        />

        <Text style={[styles.statusText, { color }]}>
          AQUA SYSTEM ONLINE
        </Text>
      </View>

      {/* KOTAK PENJELASAN */}
      <View
        style={[
          styles.messageCard,
          {
            borderColor: `${color}65`,
          },
        ]}
      >
        <View style={styles.messageHeader}>
          <View style={styles.messageTitleContainer}>
            <Ionicons
              name="water"
              size={18}
              color={color}
            />

            <Text style={[styles.messageTitle, { color }]}>
              AQUA ANALYSIS
            </Text>
          </View>

          <TouchableOpacity
            onPress={speakAqua}
            activeOpacity={0.7}
            style={[
              styles.soundButton,
              { backgroundColor: `${color}20` },
            ]}
          >
            <Ionicons
              name="volume-high"
              size={20}
              color={color}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.messageText}>
          {message}
        </Text>

        <Text style={styles.categoryText}>
          Kategori terdeteksi: {category}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  hologramArea: {
    width: 290,
    height: 290,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  radar: {
    position: "absolute",
    width: 250,
    height: 250,
    borderWidth: 1,
    borderRadius: 125,
    alignItems: "center",
    justifyContent: "center",
  },

  radarMiddle: {
    position: "absolute",
    width: 210,
    height: 210,
    borderWidth: 1,
    borderRadius: 105,
  },

  radarInner: {
    position: "absolute",
    width: 165,
    height: 165,
    borderWidth: 1,
    borderRadius: 83,
  },

  ripple: {
    position: "absolute",
    width: 145,
    height: 145,
    borderWidth: 2,
    borderRadius: 73,
  },

  glow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 100,
    opacity: 0.3,
  },

  characterContainer: {
    width: 230,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  mascot: {
    width: 230,
    height: 250,
  },

  blinkOverlay: {
    position: "absolute",
    top: "44%",
    left: "42%",
    width: 38,
    height: 7,
    borderRadius: 10,
    zIndex: 3,
  },

  scanLine: {
    position: "absolute",
    width: 230,
    height: 2,
    opacity: 0.65,
    zIndex: 4,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 16,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  messageCard: {
    width: "100%",
    backgroundColor: "rgba(10, 25, 45, 0.94)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },

  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  messageTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  messageTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  soundButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 21,
  },

  categoryText: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 12,
    fontWeight: "600",
  },
});
