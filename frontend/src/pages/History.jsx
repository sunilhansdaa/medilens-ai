import { useEffect, useState } from "react";
import AppIcon from "../components/AppIcon.jsx";
import { deleteReportById, getReports } from "../services/api.js";

const normalizeReport = (report) => ({
  id: report._id,
  medicineName: report.displayedResult?.medicineName || report.medicineName || "Unknown medicine",
  uploadedImagePath: report.imageUrl || "",
  originalAnalysisResult: report.originalAnalysisResult || {},
  displayedResult: report.displayedResult || {
    medicineName: report.medicineName || "",
    use: report.use || "",
    dosage: report.dosage || "",
    precautions: Array.isArray(report.precautions) ? report.precautions.join(" ") : report.precautions || "",
    sideEffects: Array.isArray(report.sideEffects) ? report.sideEffects.join(" ") : report.sideEffects || "",
    doctorAdvice: report.doctorAdvice || ""
  },
  language: report.selectedLanguage || report.language || "English",
  createdAt: report.createdAt
});

const getUploadImageUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${apiBaseUrl}/uploads/${imagePath}`;
};

function History() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    getReports()
      .then((data) => setReports((data.data || []).map(normalizeReport)))
      .catch(() => setError("Unable to load history."));
  }, []);

  const filtered = reports.filter((report) =>
    [report.medicineName, report.displayedResult.use, report.language]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    await deleteReportById(id);
    setReports((current) => current.filter((report) => report.id !== id));
  };

  return (
    <section className="history-page">
      <div className="history-header">
        <div><p className="eyebrow">Saved analysis</p><h2>Report History</h2></div>
        <label className="history-search"><span>?</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reports..." /></label>
      </div>
      {error && <div className="auth-error">{error}</div>}
      {filtered.length === 0 ? (
        <div className="empty-history"><span><AppIcon name="history" /></span><h3>No reports found</h3><p>Scan a medicine image to save reports here.</p></div>
      ) : (
        <div className="history-grid">
          {filtered.map((report) => (
            <article className="history-card" key={report.id}>
              <div className="history-card-top">
                <span className="history-badge history-thumbnail">
                  {report.uploadedImagePath && !failedImages[report.id] ? (
                    <img
                      src={getUploadImageUrl(report.uploadedImagePath)}
                      alt={`${report.medicineName} scan`}
                      onError={() => setFailedImages((current) => ({ ...current, [report.id]: true }))}
                    />
                  ) : (
                    <AppIcon name="image" />
                  )}
                </span>
                <div><h3>{report.medicineName}</h3><p>{new Date(report.createdAt).toLocaleString()} - {report.language}</p></div>
              </div>
              <div className="history-details">
                <p><strong>Image:</strong> {report.uploadedImagePath}</p>
                <p><strong>Use:</strong> {report.displayedResult.use || "Not visible"}</p>
                <p><strong>Dosage:</strong> {report.displayedResult.dosage || "Not visible"}</p>
                <p><strong>Doctor Advice:</strong> {report.displayedResult.doctorAdvice || "Not visible"}</p>
              </div>
              <div className="history-actions"><button type="button" className="delete-report-button" onClick={() => handleDelete(report.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default History;
