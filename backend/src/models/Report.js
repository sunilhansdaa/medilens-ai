import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    medicineName: {
      type: String,
      trim: true
    },
    use: {
      type: String,
      trim: true
    },
    dosage: {
      type: String,
      trim: true
    },
    precautions: {
      type: [String],
      default: []
    },
    sideEffects: {
      type: [String],
      default: []
    },
    doctorAdvice: {
      type: String,
      trim: true
    },
    imageType: {
      type: String,
      enum: ["medicine", "prescription"],
      default: "medicine"
    },
    imageUrl: {
      type: String,
      trim: true
    },
    language: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English"
    },
    originalAnalysisResult: {
      medicineName: { type: String, trim: true, default: "" },
      use: { type: String, trim: true, default: "" },
      dosage: { type: String, trim: true, default: "" },
      precautions: { type: String, trim: true, default: "" },
      sideEffects: { type: String, trim: true, default: "" },
      doctorAdvice: { type: String, trim: true, default: "" }
    },
    displayedResult: {
      medicineName: { type: String, trim: true, default: "" },
      use: { type: String, trim: true, default: "" },
      dosage: { type: String, trim: true, default: "" },
      precautions: { type: String, trim: true, default: "" },
      sideEffects: { type: String, trim: true, default: "" },
      doctorAdvice: { type: String, trim: true, default: "" }
    },
    selectedLanguage: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English"
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
