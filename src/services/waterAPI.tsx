
export type WaterCategory =
  | "Air Jernih"
  | "Air Abu-abu"
  | "Air Keruh"
  | "Air Coklat";

export type WaterPrediction = {
  category: WaterCategory;
  confidence: number;
};

// ========================================
// MODE PENGUJIAN
// ========================================

// true  = simulasi AI, tanpa internet
// false = menggunakan API backend sungguhan

export const USE_MOCK_AI = true;

// Ganti kategori ini untuk mencoba hasil berbeda
const MOCK_RESULT: WaterPrediction = {
  category: "Air Jernih",
  confidence: 94.2,
};

// ========================================
// FUNGSI ANALISIS
// ========================================

export async function analyzeWater(
  imageUri: string
): Promise<WaterPrediction> {

  if (!imageUri) {
    throw new Error("Gambar belum dipilih.");
  }

  // MODE SIMULASI AI
  if (USE_MOCK_AI) {
    // Simulasi proses analisis selama 2 detik
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return MOCK_RESULT;
  }

  // MODE API SUNGGUHAN
  const API_URL = "http://ALAMAT-IP-KOMPUTER:8000";

  const formData = new FormData();

  formData.append(
    "file",
    {
      uri: imageUri,
      name: "water-sample.jpg",
      type: "image/jpeg",
    } as any
  );

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Gagal menganalisis gambar. Status: ${response.status}`
    );
  }

  const data = await response.json();

  const validCategories: WaterCategory[] = [
    "Air Jernih",
    "Air Abu-abu",
    "Air Keruh",
    "Air Coklat",
  ];

  if (!validCategories.includes(data.category)) {
    throw new Error("Kategori hasil AI tidak dikenali.");
  }

  const confidence = Number(data.confidence);

  if (
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 1
  ) {
    throw new Error("Nilai confidence tidak valid.");
  }

  return {
    category: data.category,
    confidence: confidence * 100,
  };
}
