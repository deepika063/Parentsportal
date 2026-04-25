import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { GraduationCap } from "lucide-react";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useApp();

  return (
    <nav className="navbar">
      <button className="nav-brand" onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
        <div className="brand-icon">
          <GraduationCap size={20} color="white" />
        </div>
        <span>{t("heroTitle")}</span>
      </button>

      <div className="nav-actions">
        <div className="lang-toggle">
          <button className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>EN</button>
          <button className={`lang-btn ${language === "te" ? "active" : ""}`} onClick={() => setLanguage("te")}>తె</button>
        </div>

        <button className="btn btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.82rem" }} onClick={() => navigate("/login")}>
          {t("login")}
        </button>
      </div>
    </nav>
  );
}