import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bell, Calendar, BookOpen, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";

export default function NotificationsPage() {
  const { t, getStudentData } = useApp();
  const [activeTab, setActiveTab] = useState("exams");
  const data = getStudentData();
  if (!data) return null;
  const { notifications } = data;

  const today = new Date("2026-03-14");

  const getDaysUntil = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const calendarTypeConfig = {
    exam: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", icon: <BookOpen size={16} /> },
    holiday: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", icon: <CheckCircle size={16} /> },
    deadline: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", icon: <AlertTriangle size={16} /> },
    result: { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", icon: <Info size={16} /> },
    registration: { color: "#8B5CF6", bg: "rgba(108,60,225,0.1)", border: "rgba(108,60,225,0.3)", icon: <Calendar size={16} /> },
  };

  const priorityBadge = {
    high: "badge-danger",
    medium: "badge-warning",
    low: "badge-info",
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Bell size={22} /> {t("notificationsTitle")}</h2>
        <p className="section-subtitle">{t("notificationsSubtitle")}</p>
      </div>

      {/* General alerts at top */}
      {notifications.general.filter((n) => n.priority === "high").map((n) => (
        <div key={n.id} className="alert alert-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>{t(n.title)}</strong> — {t(n.message)}
            <div style={{ fontSize: "0.75rem", marginTop: "0.2rem", opacity: 0.8 }}>{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
        </div>
      ))}

      <div className="tabs">
        {[
          { key: "exams", label: t("upcomingExams") },
          { key: "calendar", label: t("academicCalendar") },
          { key: "general", label: t("generalNotifications") },
        ].map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "exams" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {notifications.upcomingExams.map((exam) => {
            const days = getDaysUntil(exam.date);
            return (
              <div key={exam.id} className="card" style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                  background: exam.type === "End Semester" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                  border: `1px solid ${exam.type === "End Semester" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.1rem", fontWeight: 800, color: exam.type === "End Semester" ? "#EF4444" : "#F59E0B" }}>
                    {new Date(exam.date).getDate()}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {new Date(exam.date).toLocaleDateString("en-IN", { month: "short" })}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{t(exam.subject)}</span>
                    <span className={`badge ${exam.type === "End Semester" ? "badge-danger" : "badge-warning"}`}>{t(exam.type)}</span>
                    <span className="badge badge-purple">{exam.code}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.4rem", fontSize: "0.82rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                    <span><Clock size={12} style={{ display: "inline", marginRight: 3 }} />{exam.time}</span>
                    <span>📍 {exam.venue}</span>
                  </div>
                </div>

                <div style={{ textAlign: "center", minWidth: 70 }}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.4rem", fontWeight: 800, color: days <= 3 ? "#EF4444" : days <= 7 ? "#F59E0B" : "#10B981" }}>
                    {days}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{t("daysLeft")}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "calendar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {notifications.academicCalendar.map((event) => {
            const cfg = calendarTypeConfig[event.type] || calendarTypeConfig.registration;
            const days = getDaysUntil(event.startDate);
            return (
              <div key={event.id} style={{
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                borderRadius: 14, padding: "1rem 1.2rem",
                display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cfg.color}20`, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: cfg.color, marginBottom: "0.2rem" }}>{t(event.event)}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    {event.endDate !== event.startDate && ` — ${new Date(event.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
                  </div>
                </div>
                <span className="badge" style={{ background: `${cfg.color}20`, color: cfg.color }}>
                  {days > 0 ? `${days}d` : days === 0 ? t("todayLabel") : t("pastLabel")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "general" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {notifications.general.map((n) => (
            <div key={n.id} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: n.priority === "high" ? "rgba(239,68,68,0.15)" : n.priority === "medium" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {n.priority === "high" ? <AlertTriangle size={18} color="#EF4444" /> : <Info size={18} color="#3B82F6" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                  <span style={{ fontWeight: 600 }}>{t(n.title)}</span>
                  <span className={`badge ${priorityBadge[n.priority]}`}>{n.priority}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>{t(n.message)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}