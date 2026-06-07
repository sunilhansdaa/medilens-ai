import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://medilens-ai-two.vercel.app",
  timeout: 60000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medilens_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const registerUser = async (payload) => {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/api/auth/login", payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

export const updateSettings = async (payload) => {
  const response = await api.put("/api/auth/settings", payload);
  return response.data;
};

export const analyzeMedicineImage = async (imageFile, language = "English") => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("language", language);

  const response = await api.post("/api/medicine/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
};

export const translateMedicineResult = async (analysisResult, targetLanguage = "English") => {
  const response = await api.post("/api/medicine/translate", {
    analysisResult,
    targetLanguage
  });

  return response.data;
};

export const getReports = async () => {
  const response = await api.get("/api/reports");
  return response.data;
};

export const deleteReportById = async (reportId) => {
  const response = await api.delete(`/api/reports/${reportId}`);
  return response.data;
};

export default api;
