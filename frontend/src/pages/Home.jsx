import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AppIcon from "../components/AppIcon.jsx";
import { getReports } from "../services/api.js";
import heroMedicine from "../assets/hero-medicine.png";
const workSteps = [
  {
    number: "01",
    icon: "upload",
    title: "Upload Image",
    description: "Upload a clear image of your medicine strip or prescription."
  },
  {
    number: "02",
    icon: "ai",
    title: "AI Analysis",
    description: "MediLens AI analyzes the uploaded image using AI."
  },
  {
    number: "03",
    icon: "info",
    title: "Get Information",
    description: "View medicine use, dosage, precautions, side effects, and doctor advice."
  },
  {
    number: "04",
    icon: "download",
    title: "Download Report",
    description: "Save or download your medicine analysis report as PDF."
  }
];

const keyFeatures = [
  {
    icon: "language",
    title: "Multi Language",
    description: "Get medicine results in English or Hindi."
  },
  {
    icon: "shield",
    title: "Accurate & Reliable",
    description: "AI-powered medicine analysis with safety-focused information."
  },
  {
    icon: "pdf",
    title: "PDF Reports",
    description: "Download clean medicine analysis reports."
  },
  {
    icon: "history",
    title: "History Tracking",
    description: "Save and view your previous medicine scans."
  },
  {
    icon: "lock",
    title: "Secure & Private",
    description: "Your uploaded medicine data stays protected."
  },
  {
    icon: "fast",
    title: "Fast Analysis",
    description: "Get medicine details quickly in seconds."
  }
];

const normalizeRecentReport = (report) => ({
  id: report._id || report.id,
  medicineName: report.displayedResult?.medicineName || report.medicineName || "Unknown medicine",
  language: report.selectedLanguage || report.language || "English",
  createdAt: report.createdAt || new Date().toISOString(),
  imageUrl: report.imageUrl || ""
});

const getUploadImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}/uploads/${imageUrl}`;
};

const formatRecentDate = (dateValue) =>
  new Date(dateValue).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

function Home({ section }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [recentAnalysesLoading, setRecentAnalysesLoading] = useState(false);
  const [recentAnalysesError, setRecentAnalysesError] = useState("");
  const [failedRecentImages, setFailedRecentImages] = useState({});

  useEffect(() => {
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section]);

  useEffect(() => {
    if (!isAuthenticated) {
      setRecentAnalyses([]);
      setRecentAnalysesError("");
      setRecentAnalysesLoading(false);
      return;
    }

    setRecentAnalysesLoading(true);
    setRecentAnalysesError("");

    getReports()
      .then((data) => {
        const reports = (data.data || []).slice(0, 5).map(normalizeRecentReport);
        setRecentAnalyses(reports);
      })
      .catch(() => {
        setRecentAnalyses([]);
        setRecentAnalysesError("Unable to load recent analyses.");
      })
      .finally(() => setRecentAnalysesLoading(false));
  }, [isAuthenticated]);

  const handleScanNow = () => {
    if (isAuthenticated) {
      navigate("/scan");
      return;
    }

    navigate("/login", {
      state: {
        from: "/scan",
        message: "Please login or create an account to scan medicines."
      }
    });
  };

  return (
    <div className="public-page">
      <div className={`home-top-grid ${!isAuthenticated ? "home-top-grid-public" : ""}`}>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">AI-powered medicine clarity</p>
            <h2>Understand Your <span>Medicine</span> Better</h2>
            <p>Upload a medicine strip or prescription image and get clear explanations in English or Hindi. Get details about medicine, uses, dosage, side effects, precautions and more in seconds.</p>
          <button className="primary-cta" type="button" onClick={handleScanNow}>Scan Now</button>
        </div>
        <div className="medicine-art" aria-hidden="true">
          <img className="hero-medicine-image" src={heroMedicine} alt="" />
        </div>
      </section>

        {isAuthenticated && <aside className="recent-analyses-card" aria-labelledby="recent-analyses-title">
          <div className="recent-analyses-header">
            <h2 id="recent-analyses-title">Recent Analyses</h2>
            <button type="button" onClick={() => navigate("/history")}>View All</button>
          </div>
          <div className="recent-analyses-list">
            {recentAnalysesLoading && <p className="recent-analyses-state">Loading recent analyses...</p>}
            {!recentAnalysesLoading && recentAnalysesError && <p className="recent-analyses-state">{recentAnalysesError}</p>}
            {!recentAnalysesLoading && !recentAnalysesError && recentAnalyses.length === 0 && (
              <p className="recent-analyses-state">No medicine analyses saved yet.</p>
            )}
            {!recentAnalysesLoading && recentAnalyses.map((analysis) => (
              <button
                className="recent-analysis-item"
                key={analysis.id}
                type="button"
                onClick={() => navigate("/history")}
              >
                <span className="recent-thumb">
                  {analysis.imageUrl && !failedRecentImages[analysis.id] ? (
                    <img
                      src={getUploadImageUrl(analysis.imageUrl)}
                      alt={`${analysis.medicineName} scan`}
                      onError={() => setFailedRecentImages((current) => ({ ...current, [analysis.id]: true }))}
                    />
                  ) : (
                    <AppIcon name="image" />
                  )}
                </span>
                <span className="recent-analysis-copy">
                  <strong>{analysis.medicineName}</strong>
                  <small>{formatRecentDate(analysis.createdAt)}</small>
                  <em>{analysis.language}</em>
                </span>
                <AppIcon name="chevronRight" className="recent-chevron" />
              </button>
            ))}
          </div>
        </aside>}
      </div>

      <section className="content-section dashboard-section" id="how-it-works">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Simple workflow</p>
            <h2>How MediLens AI Works</h2>
          </div>
        </div>
        <div className="steps-grid">
          {workSteps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <span className="step-icon"><AppIcon name={step.icon} /></span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section dashboard-section" id="key-features">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Built for clarity</p>
            <h2>Key Features</h2>
          </div>
        </div>
        <div className="features-grid">
          {keyFeatures.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon"><AppIcon name={feature.icon} /></span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="about">
        <h2>About MediLens AI</h2>
        <article className="list-card"><span><AppIcon name="info" /></span><p>MediLens AI is a medicine understanding assistant for visible medicine and prescription information.</p></article>
      </section>

      <section className="content-section" id="safety">
        <h2>Safety Information</h2>
        <article className="list-card"><span><AppIcon name="shield" /></span><p>This app does not diagnose diseases or prescribe medicine. Always consult a doctor or pharmacist.</p></article>
      </section>

      <section className="content-section" id="contact">
        <h2>Contact / Help</h2>
        <article className="list-card"><span><AppIcon name="support" /></span><p>Use a clear image with readable medicine name and dosage text for best results.</p></article>
      </section>
    </div>
  );
}

export default Home;
