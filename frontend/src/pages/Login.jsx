import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from || "/scan";
  const message = location.state?.message;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(form);
      navigate(from, { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell in-app-auth">
      <section className="auth-card">
        <Logo size="large" className="auth-logo" />
        <div className="auth-copy">
          <p className="eyebrow">Welcome back</p>
          <h2>Login to MediLens AI</h2>
          <p>Login to scan medicines and view your private report history.</p>
        </div>
        {message && <div className="auth-info">{message}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <Link className="auth-switch" to="/register" state={{ from, message }}>Create an account</Link>
      </section>
    </main>
  );
}

export default Login;
