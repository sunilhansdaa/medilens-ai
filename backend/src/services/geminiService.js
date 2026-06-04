import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

const emptyMedicineResponse = {
  medicineName: "",
  use: "",
  dosage: "",
  precautions: "",
  sideEffects: "",
  doctorAdvice: ""
};

const getMedicinePrompt = (language = "English") => {
  const languageRule =
    language === "Hindi"
      ? "Return the medicine explanation completely in simple, natural Hindi. Do not translate medicine brand names. Keep dosage numbers and units unchanged. Use clear Hindi suitable for common users. Do not use awkward machine translation. Do not add extra medical claims."
      : "Return the medicine explanation completely in simple English language.";

  return `
You are MediLens AI, a medicine understanding assistant.
Analyze the uploaded medicine strip or prescription image.

${languageRule}

Return only valid JSON with this exact shape:
{
  "medicineName": "",
  "use": "",
  "dosage": "",
  "precautions": "",
  "sideEffects": "",
  "doctorAdvice": ""
}

Rules:
- Identify the medicine name only if it is clearly visible.
- Explain the purpose or use in simple language.
- Include dosage only if it is visible in the image. Do not guess dosage.
- List precautions in simple language.
- List possible side effects in simple language.
- Do not diagnose diseases.
- Do not prescribe medicine.
- Say that the information may be incomplete because it depends on the image quality.
- Include clear doctor advice telling the user to consult a doctor or pharmacist before taking medicine.
- Do not include markdown, code fences, or extra text.
`;
};

const parseGeminiJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw error;
    }

    return JSON.parse(match[0]);
  }
};

const createGeminiError = (error) => {
  const message = error?.message || "";

  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    const apiKeyError = new Error("Gemini API key is invalid. Please check backend .env and restart the server.");
    apiKeyError.statusCode = 502;
    return apiKeyError;
  }

  if (message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
    const quotaError = new Error("Gemini quota limit reached. Please try again later or check your Google AI Studio quota.");
    quotaError.statusCode = 429;
    return quotaError;
  }

  const fallbackError = new Error("AI analysis failed. Please try again with a clearer image.");
  fallbackError.statusCode = 502;
  return fallbackError;
};

const normalizeMedicineResponse = (data) => ({
  medicineName: data.medicineName || "",
  use: data.use || "",
  dosage: data.dosage || "",
  precautions: Array.isArray(data.precautions)
    ? data.precautions.join(" ")
    : data.precautions || "",
  sideEffects: Array.isArray(data.sideEffects)
    ? data.sideEffects.join(" ")
    : data.sideEffects || "",
  doctorAdvice: data.doctorAdvice || ""
});

const getTranslationPrompt = (analysisResult, targetLanguage) => `
You are MediLens AI.
${targetLanguage === "Hindi"
  ? "Translate the medicine analysis into simple, natural Hindi. Do not translate medicine brand names. Keep dosage numbers and units unchanged. Use clear Hindi suitable for common users. Do not use awkward machine translation. Do not add extra medical claims."
  : "Translate only the JSON values into simple English."}
Keep the JSON keys exactly in English.
Do not add markdown, code fences, or extra text.

Return only valid JSON with this exact shape:
{
  "medicineName": "",
  "use": "",
  "dosage": "",
  "precautions": "",
  "sideEffects": "",
  "doctorAdvice": ""
}

JSON to translate:
${JSON.stringify(normalizeMedicineResponse(analysisResult))}
`;

export const analyzeMedicineImage = async (file, language = "English") => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is missing in environment variables");
    error.statusCode = 500;
    throw error;
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const imageBuffer = await fs.readFile(file.path);
  const imageBase64 = imageBuffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [
        {
          text: getMedicinePrompt(language)
        },
        {
          inlineData: {
            mimeType: file.mimetype,
            data: imageBase64
          }
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      return emptyMedicineResponse;
    }

    const parsedResponse = parseGeminiJson(response.text);

    return normalizeMedicineResponse(parsedResponse);
  } catch (error) {
    throw createGeminiError(error);
  }
};

export const translateMedicineAnalysis = async (analysisResult, targetLanguage = "English") => {
  const normalizedResult = normalizeMedicineResponse(analysisResult);

  if (targetLanguage === "English") {
    return normalizedResult;
  }

  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is missing in environment variables");
    error.statusCode = 500;
    throw error;
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [
        {
          text: getTranslationPrompt(normalizedResult, targetLanguage)
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    if (!response.text) {
      return normalizedResult;
    }

    return normalizeMedicineResponse(parseGeminiJson(response.text));
  } catch (error) {
    throw createGeminiError(error);
  }
};
