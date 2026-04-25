import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { GraduationCap, Eye, EyeOff, Mail, Hash, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, verifyCredentials, verifyOtp, login, authStep, setAuthStep } = useApp();

  const [regNumber, setRegNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    setError("");
    if (!regNumber.trim() || !email.trim()) {
      setError(t("fillAllFields"));
      return;
    }
    setLoading(true);
    const studentData = await verifyCredentials(regNumber.trim().toUpperCase(), email.trim());
    if (!studentData) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }
    setPendingStudent(studentData);
    setOtpSent(true);
    setShowOtpInput(true);
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp.trim()) {
      setError(t("enterOtp"));
      return;
    }
    setLoading(true);
    const authData = await verifyOtp(pendingStudent, otp.trim());
    if (!authData) {
      setError(t("invalidOtp"));
      setLoading(false);
      return;
    }
    login(authData);
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="orb" style={{ width: 500, height: 500, background: "#6C3CE1", top: -150, right: -150 }} />
      <div className="orb" style={{ width: 350, height: 350, background: "#a855f7", bottom: -100, left: -100 }} />

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">
            <GraduationCap size={30} color="white" />
          </div>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>{t("loginTitle")}</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.3rem" }}>{t("loginSubtitle")}</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.8rem" }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: s <= (showOtpInput ? 2 : 1) ? "var(--gradient)" : "var(--bg-card2)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "white", flexShrink: 0,
              }}>
                {s === 1 && s < (showOtpInput ? 2 : 1) ? <CheckCircle2 size={14} /> : s}
              </div>
              {s < 2 && <div style={{ flex: 1, height: 2, background: showOtpInput ? "var(--primary)" : "var(--border)", marginLeft: "0.5rem" }} />}
              {s > 1 && <div style={{ flex: 0 }} />}
            </div>
          ))}
        </div>

        {!showOtpInput ? (
          <>
            <div className="input-group">
              <label className="input-label">
                <Hash size={12} style={{ display: "inline", marginRight: 4 }} />{t("regNumber")}
              </label>
              <input
                className="input-field"
                placeholder={t("regNumberPlaceholder")}
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <Mail size={12} style={{ display: "inline", marginRight: 4 }} />{t("parentEmail")}
              </label>
              <input
                type="email"
                className="input-field"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
            </div>

            {error && <p className="error-text" style={{ marginBottom: "0.8rem" }}>{error}</p>}

            <button className="btn btn-primary" style={{ width: "100%", padding: "0.8rem" }} onClick={handleSendOtp} disabled={loading}>
              {loading ? t("generatingOtp") : <><Mail size={16} /> {t("getOtp")}</>}
            </button>
          </>
        ) : (
          <>
            <div className="alert alert-info" style={{ marginBottom: "1.2rem" }}>
              <Mail size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{t("otpSent")} {pendingStudent?.emailToDisplay || email}</span>
            </div>

            <div className="input-group">
              <label className="input-label">
                <KeyRound size={12} style={{ display: "inline", marginRight: 4 }} />OTP
              </label>
              <input
                className="input-field"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                style={{ letterSpacing: "0.3em", textAlign: "center", fontSize: "1.2rem" }}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
              />
            </div>

            {error && <p className="error-text" style={{ marginBottom: "0.8rem" }}>{error}</p>}

            <button className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", marginBottom: "0.8rem" }} onClick={handleVerifyOtp} disabled={loading}>
              {loading ? t("verifying") : <><KeyRound size={16} /> {t("verifyOtp")}</>}
            </button>

            <button className="btn btn-outline" style={{ width: "100%", padding: "0.8rem" }} onClick={() => { setShowOtpInput(false); setOtp(""); setError(""); }}>
              <ArrowLeft size={16} /> {t("changeCredentials")}
            </button>
          </>
        )}



        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.82rem", cursor: "pointer" }} onClick={() => navigate("/")}>
            {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}