import { useEffect, useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

export default function AuthModal({ mode, onModeChange, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const isRegister = mode === "register";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const switchMode = (nextMode) => {
    setError("");
    setNotice("");
    onModeChange(nextMode);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    const form = event.currentTarget;

    try {
      if (isRegister) {
        await API.post("/auth/register", {
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          password: form.password.value,
        });
        setNotice("Your account is ready. Log in whenever you want.");
        onModeChange("login");
        return;
      }

      const response = await API.post("/auth/login", {
        email: form.email.value.trim(),
        password: form.password.value,
      });
      localStorage.setItem("token", response.data.token);
      jwtDecode(response.data.token);
      onSuccess(response.data.token);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close dialog">
          <FaTimes />
        </button>
        <div className="modal-kicker">CODECRAFT-HUB COMMUNITY</div>
        <h2 id="auth-title">{isRegister ? "Make yourself at home." : "Welcome back."}</h2>
        <p className="modal-description">
          {isRegister
            ? "Create an account to join the Codecraft Hub community. All stories are open to everyone."
            : "Sign in to your account. You can keep reading without signing in."}
        </p>

        {notice && <p className="form-notice" role="status">{notice}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}

        <form className="auth-form" onSubmit={submitHandler}>
          {isRegister && (
            <label>
              Your name
              <input name="name" type="text" placeholder="Alex Morgan" autoComplete="name" required />
            </label>
          )}
          <label>
            Email address
            <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="At least 6 characters"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={6}
              required
            />
          </label>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create my account" : "Log in"}
            {!loading && <FaArrowRight />}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New around here?"}{" "}
          <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")}>
            {isRegister ? "Log in" : "Create an account"}
          </button>
        </p>
        <p className="modal-footnote">No account needed to explore the stories.</p>
      </section>
    </div>
  );
}
