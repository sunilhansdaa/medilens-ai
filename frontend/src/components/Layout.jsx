import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AppIcon from "./AppIcon.jsx";
import Logo from "./Logo.jsx";

function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, saveSettings } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modal, setModal] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    language: user?.preferences?.language || "English",
    theme: user?.preferences?.theme || "Light"
  });
  const [settingsMessage, setSettingsMessage] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    setSettingsForm({
      language: user?.preferences?.language || "English",
      theme: user?.preferences?.theme || "Light"
    });
  }, [user]);

  const requireScan = () => {
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

  const openSettings = () => {
    setSettingsMessage("");
    setIsProfileOpen(false);
    setModal("settings");
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      setSettingsMessage("");
      await saveSettings(settingsForm);
      setSettingsMessage("Settings saved successfully.");
    } catch (error) {
      setSettingsMessage("Unable to save settings. Please try again.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="MediLens AI sidebar navigation">
        <Link className="brand brand-link" to="/">
          <Logo size="medium" />
        </Link>

        <nav className="nav-list" aria-label="Primary navigation">
          <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/">
            <span><AppIcon name="home" /></span> Home
          </NavLink>
          <button className="nav-item" type="button" onClick={requireScan}>
            <span><AppIcon name="camera" /></span> Upload Medicine
          </button>
          <button className="nav-item" type="button" onClick={requireScan}>
            <span><AppIcon name="prescription" /></span> Upload Prescription
          </button>
          <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/history">
            <span><AppIcon name="history" /></span> History
          </NavLink>
          <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/safety">
            <span><AppIcon name="shield" /></span> Safety Guide
          </NavLink>
        </nav>

        <div className="sidebar-ai-card">
          <Logo size="small" showText={false} />
          <h2>AI-Powered Medicine Understanding</h2>
          <p>Upload. Analyze. Understand.</p>
          <small>Safe. Smart. Reliable.</small>
        </div>

        <div className="help-card">
          <div className="help-card-copy">
            <h2>Need Help?</h2>
            <p>If you have any questions or need assistance, we are here to help you.</p>
            <button type="button" onClick={() => setModal("expert")}>Contact Support</button>
          </div>
          <div className="help-support-icon" aria-hidden="true">
            <AppIcon name="support" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <Link className="topbar-logo" to="/" aria-label="MediLens AI home">
            <Logo size="small" />
          </Link>
          <label className="search">
            <span>?</span>
            <input placeholder="Search medicines, symptoms, or health topics..." />
          </label>
          <div className="topbar-actions">
            <button className="notification" type="button" aria-label="Information" onClick={() => setModal("info")}>i</button>
            {!isAuthenticated ? (
              <div className="auth-nav-actions">
                <Link className="outline-link" to="/login">Login</Link>
                <Link className="primary-link" to="/register">Register</Link>
              </div>
            ) : (
              <div className="profile-wrap">
                <button
                  className="profile"
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                >
                  <div className="avatar">{user?.name?.slice(0, 1).toUpperCase() || "U"}</div>
                  <span>Hello, {user?.name || "User"}</span>
                </button>
                {isProfileOpen && (
                  <div className="profile-menu">
                    <button type="button" onClick={() => { setIsProfileOpen(false); navigate("/profile"); }}>Profile</button>
                    <button type="button" onClick={() => { setIsProfileOpen(false); navigate("/history"); }}>History</button>
                    <button type="button" onClick={openSettings}>Settings</button>
                    <button type="button" onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <Outlet />
        <footer className="copyright-section">
          <p>© 2026 MediLens AI. All rights reserved.</p>
          <span>Information only, not medical advice.</span>
        </footer>
      </main>

      {modal && (
        <div className="modal-backdrop" role="presentation" onClick={() => setModal("")}>
          <section className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === "expert" ? "Professional Medical Advice" : modal === "info" ? "About MediLens AI" : modal === "settings" ? "Settings" : "How to Use MediLens AI"}</h2>
              <button type="button" onClick={() => setModal("")}>X</button>
            </div>
            <div className="modal-body">
              {modal === "expert" && <p>Please consult a doctor or pharmacist for professional medical advice.</p>}
              {modal === "info" && <p>MediLens AI explains visible medicine information. It does not diagnose diseases or prescribe medicine.</p>}
              {modal === "settings" && (
                <div className="modal-settings">
                  <p>Choose your default scan language and app theme.</p>
                  <div className="settings-grid">
                    <label>
                      Preferred language
                      <select
                        value={settingsForm.language}
                        onChange={(event) => setSettingsForm({
                          ...settingsForm,
                          language: event.target.value
                        })}
                      >
                        <option>English</option>
                        <option>Hindi</option>
                      </select>
                    </label>
                    <label>
                      Theme
                      <select
                        value={settingsForm.theme}
                        onChange={(event) => setSettingsForm({
                          ...settingsForm,
                          theme: event.target.value
                        })}
                      >
                        <option>Light</option>
                        <option>Dark</option>
                      </select>
                    </label>
                  </div>
                  {settingsMessage && <div className="auth-info">{settingsMessage}</div>}
                  <button
                    className="primary-link modal-save-button"
                    type="button"
                    disabled={isSavingSettings}
                    onClick={handleSaveSettings}
                  >
                    {isSavingSettings ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              )}
              {modal === "help" && <p>Upload a clear JPG, JPEG, or PNG image of a medicine strip or prescription, then scan it for a simple explanation.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Layout;
