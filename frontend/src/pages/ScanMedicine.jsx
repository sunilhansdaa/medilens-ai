import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { analyzeMedicineImage, translateMedicineResult } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import AppIcon from "../components/AppIcon.jsx";
import logoUrl from "../assets/logo.png";
import notoSansDevanagariUrl from "../assets/fonts/NotoSansDevanagari-Regular.ttf?url";

const resultConfig = [
  { key: "medicineName", title: "Medicine Name", icon: "medicine", tone: "violet" },
  { key: "use", title: "Use", icon: "target", tone: "rose" },
  { key: "dosage", title: "How to Take", icon: "calendar", tone: "blue" },
  { key: "precautions", title: "Precautions", icon: "shield", tone: "green" },
  { key: "sideEffects", title: "Possible Side Effects", icon: "alert", tone: "amber" },
  { key: "doctorAdvice", title: "Doctor Advice", icon: "user", tone: "indigo" }
];

const sampleAnalysis = {
  medicineName: "Paracetamol 500mg Tablet",
  use: "Used to reduce fever and relieve mild to moderate pain.",
  dosage: "Use only as directed by a doctor or prescription.",
  precautions: "Avoid overdose. Consult a doctor if pregnant, breastfeeding, or if you have liver problems.",
  sideEffects: "Nausea, stomach pain, dizziness, or allergic reaction may occur.",
  doctorAdvice: "This is sample information only. Please consult a doctor or pharmacist."
};

const sampleAnalysisHindi = {
  medicineName: "पैरासिटामोल 500mg टैबलेट",
  use: "बुखार कम करने और हल्के से मध्यम दर्द में राहत देने के लिए उपयोग किया जाता है।",
  dosage: "केवल डॉक्टर के निर्देश के अनुसार लें।",
  precautions: "अधिक मात्रा न लें। गर्भवती, स्तनपान कराने वाली, या लिवर की समस्या होने पर डॉक्टर से सलाह लें।",
  sideEffects: "मतली, पेट दर्द, चक्कर आना, या एलर्जी जैसी प्रतिक्रिया हो सकती है।",
  doctorAdvice: "यह केवल नमूना जानकारी है। कोई भी दवा लेने से पहले डॉक्टर या फार्मासिस्ट से सलाह लें।"
};

const normalizeAnalysis = (analysis = {}) => ({
  medicineName: analysis.medicineName || "",
  use: analysis.use || "",
  dosage: analysis.dosage || "",
  precautions: Array.isArray(analysis.precautions) ? analysis.precautions.join(" ") : analysis.precautions || "",
  sideEffects: Array.isArray(analysis.sideEffects) ? analysis.sideEffects.join(" ") : analysis.sideEffects || "",
  doctorAdvice: analysis.doctorAdvice || ""
});

let notoSansDevanagariBase64 = "";
let logoDataUrl = "";

const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
};

const loadPdfFont = async (doc) => {
  if (!notoSansDevanagariBase64) {
    const response = await fetch(notoSansDevanagariUrl);
    const buffer = await response.arrayBuffer();
    notoSansDevanagariBase64 = arrayBufferToBase64(buffer);
  }

  doc.addFileToVFS("NotoSansDevanagari-Regular.ttf", notoSansDevanagariBase64);
  doc.addFont("NotoSansDevanagari-Regular.ttf", "NotoSansDevanagari", "normal");
};

const loadPdfLogo = async () => {
  if (!logoDataUrl) {
    const response = await fetch(logoUrl);
    const buffer = await response.arrayBuffer();
    logoDataUrl = `data:image/png;base64,${arrayBufferToBase64(buffer)}`;
  }

  return logoDataUrl;
};

const getPdfFont = (selectedLanguage) => (selectedLanguage === "Hindi" ? "NotoSansDevanagari" : "helvetica");

const getDateParts = () => {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-GB");
  const fileDate = date.replace(/\//g, "-");
  const time = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  const fileTime = time.replace(":", "-").replace(/\s/g, "");

  return { date, fileDate, time, fileTime };
};

const getPdfLabels = (selectedLanguage) => {
  if (selectedLanguage === "Hindi") {
    return {
      title: "MediLens AI Medicine Analysis",
      subtitle: "Medicine Understanding Assistant",
      date: "तारीख",
      time: "समय",
      image: "इमेज",
      language: "भाषा",
      user: "यूजर",
      medicineName: "दवा का नाम",
      use: "उपयोग",
      dosage: "खुराक",
      precautions: "सावधानियां",
      sideEffects: "संभावित दुष्प्रभाव",
      doctorAdvice: "डॉक्टर की सलाह",
      warningMessage: "चेतावनी संदेश",
      warningText: "यह रिपोर्ट AI द्वारा बनाई गई है और केवल जानकारी के लिए है। जानकारी अधूरी हो सकती है। MediLens AI बीमारी का निदान या दवा निर्धारित नहीं करता। कोई भी दवा लेने से पहले डॉक्टर या फार्मासिस्ट से सलाह लें।",
      footer: "MediLens AI द्वारा जनरेट किया गया | यह केवल जानकारी के लिए है, चिकित्सा सलाह नहीं",
      notVisible: "छवि में स्पष्ट नहीं है",
      languageValue: "हिंदी",
      guest: "अतिथि",
      unavailable: "उपलब्ध नहीं"
    };
  }

  return {
    title: "MediLens AI Medicine Analysis",
    subtitle: "Medicine Understanding Assistant",
    date: "Date",
    time: "Time",
    image: "Image",
    language: "Language",
    user: "User",
    medicineName: "Medicine Name",
    use: "Use",
    dosage: "Dosage",
    precautions: "Precautions",
    sideEffects: "Side Effects",
    doctorAdvice: "Doctor Advice",
    warningMessage: "Warning Message",
    warningText: "Warning: This information may be incomplete and depends on image quality. MediLens AI does not diagnose diseases or prescribe medicine. Consult a doctor or pharmacist before taking any medicine.",
    footer: "Generated by MediLens AI | Information only, not medical advice",
    notVisible: "Not visible in the image",
    languageValue: "English",
    guest: "Guest",
    unavailable: "Not available"
  };
};

const addPdfFooter = (doc, labels, fontName) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(229, 231, 242);
    doc.line(18, pageHeight - 18, pageWidth - 18, pageHeight - 18);
    doc.setFont(fontName, "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(92, 101, 124);
    doc.text(labels.footer, 18, pageHeight - 11);
    doc.text(`${page} / ${pageCount}`, pageWidth - 30, pageHeight - 11);
  }
};

const ensurePdfSpace = (doc, y, neededHeight) => {
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y + neededHeight > pageHeight - 28) {
    doc.addPage();
    return 26;
  }

  return y;
};

const addPdfMetaLine = (doc, label, value, y, fontName) => {
  doc.setFont(fontName, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 111, 135);
  doc.text(`${label}:`, 18, y);
  doc.setTextColor(38, 47, 75);
  doc.text(String(value || "-"), 37, y);
};

const addPdfSection = (doc, label, value, y, labels, fontName, selectedLanguage) => {
  const maxWidth = 174;
  const safeValue = value || labels.notVisible;
  const lines = doc.splitTextToSize(String(safeValue), maxWidth);
  const sectionHeight = 10 + lines.length * 5.2;
  y = ensurePdfSpace(doc, y, sectionHeight);

  doc.setFont(fontName, selectedLanguage === "Hindi" ? "normal" : "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(82, 45, 220);
  doc.text(label, 18, y);

  doc.setFont(fontName, "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(27, 35, 59);
  doc.text(lines, 18, y + 6.5, { lineHeightFactor: 1.25 });

  return y + sectionHeight;
};

async function downloadPdf(analysis, selectedLanguage, user, selectedFile) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pdfLogo = await loadPdfLogo();

  if (selectedLanguage === "Hindi") {
    await loadPdfFont(doc);
  }

  const safe = normalizeAnalysis(analysis);
  const labels = getPdfLabels(selectedLanguage);
  const fontName = getPdfFont(selectedLanguage);
  const { date, fileDate, time, fileTime } = getDateParts();
  const imageName = selectedFile?.name || labels.unavailable;
  const languageValue = labels.languageValue;
  const userName = user?.name || labels.guest;

  doc.setFillColor(98, 54, 233);
  doc.rect(0, 0, 210, 36, "F");
  doc.addImage(pdfLogo, "PNG", 18, 8, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(labels.title, 43, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(labels.subtitle, 43, 25);

  addPdfMetaLine(doc, labels.date, date, 49, fontName);
  addPdfMetaLine(doc, labels.time, time, 56, fontName);
  addPdfMetaLine(doc, labels.image, imageName, 63, fontName);
  addPdfMetaLine(doc, labels.language, languageValue, 70, fontName);
  addPdfMetaLine(doc, labels.user, userName, 77, fontName);

  let y = 94;
  const sections = [
    [labels.medicineName, safe.medicineName],
    [labels.use, safe.use],
    [labels.dosage, safe.dosage],
    [labels.precautions, safe.precautions],
    [labels.sideEffects, safe.sideEffects],
    [labels.doctorAdvice, safe.doctorAdvice],
    [labels.warningMessage, labels.warningText]
  ];

  sections.forEach(([label, value]) => {
    y = addPdfSection(doc, label, value, y, labels, fontName, selectedLanguage);
  });

  addPdfFooter(doc, labels, fontName);
  doc.save(`MediLens_Report_${fileDate}_${fileTime}.pdf`);
}

function ScanMedicine() {
  const { user, saveSettings } = useAuth();
  const [language, setLanguage] = useState(user?.preferences?.language || "English");
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalAnalysisResult, setOriginalAnalysisResult] = useState(null);
  const [displayedResult, setDisplayedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const translationCacheRef = useRef({});

  useEffect(() => {
    setLanguage(user?.preferences?.language || "English");
  }, [user]);

  useEffect(() => {
    if (!originalAnalysisResult) {
      return undefined;
    }

    let isCurrent = true;
    const cachedResult = translationCacheRef.current[language];

    if (cachedResult) {
      setDisplayedResult(cachedResult);
      return undefined;
    }

    const translateCurrentResult = async () => {
      if (language === "English") {
        const englishResult = normalizeAnalysis(originalAnalysisResult);
        translationCacheRef.current.English = englishResult;
        setDisplayedResult(englishResult);
        return;
      }

      try {
        setIsTranslating(true);
        setError("");
        const translated = normalizeAnalysis(await translateMedicineResult(originalAnalysisResult, language));

        if (!isCurrent) {
          return;
        }

        translationCacheRef.current[language] = translated;
        setDisplayedResult(translated);
      } catch (apiError) {
        if (isCurrent) {
          setError(apiError.response?.data?.message || "Unable to translate result. Please try again.");
        }
      } finally {
        if (isCurrent) {
          setIsTranslating(false);
        }
      }
    };

    translateCurrentResult();

    return () => {
      isCurrent = false;
    };
  }, [language, originalAnalysisResult]);

  const handleFileSelect = (file) => {
    setError("");
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be 10MB or less.");
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const response = await analyzeMedicineImage(selectedFile, language);
      const original = normalizeAnalysis(response.originalAnalysisResult || response);
      const displayed = normalizeAnalysis(response.displayedResult || response);
      translationCacheRef.current = {
        English: original,
        [language]: displayed
      };
      setOriginalAnalysisResult(original);
      setDisplayedResult(displayed);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);

    if (user) {
      saveSettings({
        language: nextLanguage,
        theme: user.preferences?.theme || "Light"
      }).catch(() => {});
    }
  };

  const handleSample = () => {
    translationCacheRef.current = {
      English: sampleAnalysis,
      Hindi: sampleAnalysisHindi
    };
    setOriginalAnalysisResult(sampleAnalysis);
    setDisplayedResult(language === "Hindi" ? sampleAnalysisHindi : sampleAnalysis);
    setError("");
  };

  return (
    <div className="workspace">
      <div className="left-content">
        <section className="upload-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Medicine scanner</p>
              <h2>Upload Medicine or Prescription</h2>
            </div>
            <select aria-label="Select response language" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
          <p className="helper-text">Changing language will translate current result without scanning again.</p>
          <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files?.[0]); }}>
            <input id="medicine-image-input" type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
            <span className="upload-icon"><AppIcon name="upload" /></span>
            <strong>{selectedFile ? selectedFile.name : "Drag and drop image here"}</strong>
            <small>Choose JPG, PNG, or JPEG up to 10MB</small>
            <div className="upload-actions">
              <label className="choose-file-button" htmlFor="medicine-image-input" role="button" tabIndex={0}>Choose Image</label>
              <button type="button" className="analyze-button" disabled={!selectedFile || isLoading} onClick={handleAnalyze}>
                {isLoading ? "Analyzing..." : "Analyze Image"}
              </button>
              <button type="button" className="ghost-button" onClick={handleSample}>Try Sample</button>
            </div>
          </div>
          {error && <div className="status-alert error-alert"><span>!</span>{error}</div>}
        </section>
      </div>
      <aside className="result-panel">
        <div className="result-header">
          <div><span className="result-icon"><AppIcon name="medicine" /></span><h2>Analysis Result</h2></div>
          <div className="language-pill">{language}</div>
        </div>
        {isLoading && <div className="status-alert loading-alert"><span className="spinner" />Analyzing image with AI...</div>}
        {isTranslating && <div className="status-alert loading-alert"><span className="spinner" />Translating...</div>}
        {!displayedResult && !isLoading && <div className="status-alert idle-alert"><span>i</span>Upload an image to see AI analysis here</div>}
        <div className="result-list">
          {resultConfig.map((card) => (
            <article className="result-card" key={card.key}>
              <span className={`card-icon ${card.tone}`}><AppIcon name={card.icon} /></span>
              <div><h3>{card.title}</h3><p>{displayedResult?.[card.key] || "Not visible in the uploaded image."}</p></div>
            </article>
          ))}
        </div>
        <div className="result-actions">
          <button className="outline-button" type="button" disabled={!displayedResult} onClick={() => downloadPdf(displayedResult, language, user, selectedFile)}>Download Report</button>
        </div>
      </aside>
    </div>
  );
}

export default ScanMedicine;
