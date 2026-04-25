import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard, BookOpen, Award, GraduationCap, Bell,
  CreditCard, Users, TrendingUp, LogOut, GraduationCap as Logo,
} from "lucide-react";
import Chatbot from "./Chatbot";

const navItems = [
  { path: "/dashboard", label: "dashboard", icon: <LayoutDashboard size={16} /> },
  { path: "/attendance", label: "attendance", icon: <BookOpen size={16} /> },
  { path: "/cgpa", label: "cgpa", icon: <Award size={16} /> },
  { path: "/academic", label: "academicStatus", icon: <GraduationCap size={16} /> },
  { path: "/notifications", label: "notifications", icon: <Bell size={16} /> },
  { path: "/financial", label: "financial", icon: <CreditCard size={16} /> },
  { path: "/contacts", label: "contacts", icon: <Users size={16} /> },
  { path: "/performance", label: "performance", icon: <TrendingUp size={16} /> },
];

export default function Layout({ children }) {
  const { t, logout, language, setLanguage, currentStudent } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <button className="nav-brand" onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div className="brand-icon">
            <Logo size={20} color="white" />
          </div>
          <span>{t("heroTitle")}</span>
        </button>

        {/* Mobile nav not shown — sidebar handles it */}
        <div className="nav-actions">
          {currentStudent && (
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
                {currentStudent.parentName[0]}
              </div>
              <span style={{ display: "none" }} className="show-md">{currentStudent.parentName}</span>
            </div>
          )}

          <div className="lang-toggle">
            <button className={`lang-btn ${language === "en" ? "active" : ""}`} onClick={() => setLanguage("en")}>EN</button>
            <button className={`lang-btn ${language === "te" ? "active" : ""}`} onClick={() => setLanguage("te")}>తె</button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> {t("logout")}
          </button>
        </div>
      </nav>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          {currentStudent && (
            <div style={{ padding: "0.6rem 0.8rem", marginBottom: "0.8rem", background: "var(--bg-card2)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{t(currentStudent.name)}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--primary-light)", fontWeight: 600 }}>{currentStudent.regNumber}</div>
            </div>
          )}

          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              {t(item.label)}
            </button>
          ))}

          <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.8rem", paddingTop: "0.8rem" }}>
            <button className="sidebar-link" onClick={handleLogout} style={{ color: "#EF4444" }}>
              <span className="icon"><LogOut size={16} /></span>
              {t("logout")}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          {children}
        </main>
      </div>

      <Chatbot />
    </div>
  );
}