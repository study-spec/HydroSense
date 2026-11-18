
import { View, Image } from "react-native";

export default function AquaMascot() {
  return (
    <View className="items-center justify-center">
      <Image
        source={require("../../assets/images/Hydro-Mascot.png")}
        resizeMode="contain"
        style={{
          width: 75,
          height: 95,
        }}
      />
    </View>
  );
}
