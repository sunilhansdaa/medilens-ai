import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from || "/scan";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await register(form);
      navigate(from, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell in-app-auth">
      <section className="auth-card">
        <Logo size="large" className="auth-logo" />
        <div className="auth-copy">
          <p className="eyebrow">Create account</p>
          <h2>Register for MediLens AI</h2>
          <p>Create an account to scan medicines and save your history.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <Link className="auth-switch" to="/login" state={{ from }}>Already have an account? Login</Link>
      </section>
    </main>
  );
}

export default Register;
