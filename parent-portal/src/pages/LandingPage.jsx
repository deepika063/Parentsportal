import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Shield, BookOpen, Bell, Globe, ArrowRight, GraduationCap, Users, TrendingUp, CreditCard } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useApp();

  const features = [
    { icon: <Shield size={24} color="#8B5CF6" />, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: <BookOpen size={24} color="#10B981" />, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: <Bell size={24} color="#F59E0B" />, title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: <Globe size={24} color="#3B82F6" />, title: t("feature4Title"), desc: t("feature4Desc") },
    { icon: <TrendingUp size={24} color="#EF4444" />, title: t("feature5Title"), desc: t("feature5Desc") },
    { icon: <CreditCard size={24} color="#F59E0B" />, title: t("feature6Title"), desc: t("feature6Desc") },
    { icon: <GraduationCap size={24} color="#8B5CF6" />, title: t("feature7Title"), desc: t("feature7Desc") },
    { icon: <Users size={24} color="#10B981" />, title: t("feature8Title"), desc: t("feature8Desc") },
  ];

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="orb" style={{ width: 600, height: 600, background: "#6C3CE1", top: -200, left: -200 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "#a855f7", bottom: -100, right: -100 }} />
        <div className="orb" style={{ width: 300, height: 300, background: "#10B981", top: "30%", right: "20%" }} />

        <div className="hero-content">
          <div className="hero-badge">
            <GraduationCap size={14} />
            {t("universityName")}
          </div>

          <h1 className="hero-title">{t("heroTitle")}</h1>
          <p className="hero-subtitle">{t("heroSubtitle")}</p>
          <p className="hero-desc">{t("heroDesc")}</p>

          <div className="hero-btns">
            <button className="hero-btn-primary" onClick={() => navigate("/login")}>
              {t("getStarted")} <ArrowRight size={18} />
            </button>
            <a href="#features" className="hero-btn-secondary">
              {t("learnMore")}
            </a>
          </div>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "3rem", flexWrap: "wrap" }}>
            {[
              { val: "500+", label: t("stat1") },
              { val: "98%", label: t("stat2") },
              { val: "24/7", label: t("stat3") },
              { val: "2", label: t("stat4") },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.8rem", fontWeight: 800, background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <h2 className="features-title">{t("featuresTitle")}</h2>
        <p className="features-subtitle">{t("featuresSubtitle")}</p>
        <div className="grid-4">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 24, padding: "3rem 2rem" }}>
          <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem" }}>
            {t("ctaTitle")}
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            {t("ctaDesc")}
          </p>
          <button className="hero-btn-primary" style={{ margin: "0 auto" }} onClick={() => navigate("/login")}>
            {t("loginNow")} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", padding: "1.5rem 2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
          {t("footerText")}
        </p>
      </footer>
    </div>
  );
}