import { analyzeMedicineImage, translateMedicineAnalysis } from "../services/geminiService.js";
import Report from "../models/Report.js";

export const uploadMedicineImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image file using the field name image"
    });
  }

  try {
    const language = req.body.language === "Hindi" ? "Hindi" : "English";
    const originalAnalysisResult = await analyzeMedicineImage(req.file, "English");
    const displayedResult = language === "English"
      ? originalAnalysisResult
      : await translateMedicineAnalysis(originalAnalysisResult, language);
    const report = await Report.create({
      user: req.user._id,
      ...displayedResult,
      precautions: displayedResult.precautions ? [displayedResult.precautions] : [],
      sideEffects: displayedResult.sideEffects ? [displayedResult.sideEffects] : [],
      imageType: "medicine",
      imageUrl: req.file.filename,
      language,
      originalAnalysisResult,
      displayedResult,
      selectedLanguage: language
    });

    res.status(200).json({
      ...displayedResult,
      originalAnalysisResult,
      displayedResult,
      selectedLanguage: language,
      reportId: report._id,
      createdAt: report.createdAt
    });
  } catch (error) {
    next(error);
  }
};

export const translateMedicineResult = async (req, res, next) => {
  try {
    const targetLanguage = req.body.targetLanguage === "Hindi" ? "Hindi" : "English";
    const analysisResult = req.body.analysisResult;

    if (!analysisResult) {
      return res.status(400).json({
        success: false,
        message: "analysisResult is required"
      });
    }

    const translatedResult = await translateMedicineAnalysis(analysisResult, targetLanguage);
    res.json(translatedResult);
  } catch (error) {
    next(error);
  }
};
