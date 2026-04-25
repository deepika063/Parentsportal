import { useState } from "react";
import { useApp } from "../context/AppContext";
import { AlertTriangle, AlertCircle, CheckCircle, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from "recharts";

export default function AttendancePage() {
  const { t, getStudentData } = useApp();
  const [activeTab, setActiveTab] = useState("subject");
  const data = getStudentData();
  if (!data) return null;
  const { attendance } = data;

  const getColor = (p) => p >= 85 ? "#10B981" : p >= 75 ? "#F59E0B" : p >= 60 ? "#EF4444" : "#7F1D1D";
  const getBadge = (p) => {
    if (p >= 85) return { cls: "badge-success", label: t("good") };
    if (p >= 75) return { cls: "badge-warning", label: t("average") };
    if (p >= 60) return { cls: "badge-danger", label: t("low") };
    return { cls: "badge-danger", label: t("critical") };
  };

  const criticalSubjects = attendance.subjectWise.filter((s) => s.percent < 60);
  const lowSubjects = attendance.subjectWise.filter((s) => s.percent >= 60 && s.percent < 75);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><BookOpen size={22} /> {t("attendanceTitle")}</h2>
        <p className="section-subtitle">{t("attendanceSubtitle")}</p>
      </div>

      {/* Alerts */}
      {criticalSubjects.map((s) => (
        <div key={s.code} className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div><strong>{t("criticalAttendanceMsg")}</strong> {t(s.subject)} — {s.percent}% ({s.attended}/{s.total} {t("classes")})</div>
        </div>
      ))}
      {lowSubjects.map((s) => (
        <div key={s.code} className="alert alert-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div><strong>{t("lowAttendanceAlert")}</strong> {t(s.subject)} — {s.percent}% ({s.attended}/{s.total} {t("classes")}). {t("lowAttendanceMsg")}</div>
        </div>
      ))}

      {/* Overall Card */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div className="card" style={{ flex: 1, minWidth: 160, textAlign: "center" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{t("overallAttendance")}</div>
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 0.5rem" }}>
            <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--bg-card2)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={getColor(attendance.overall)} strokeWidth="3"
                strokeDasharray={`${attendance.overall} ${100 - attendance.overall}`} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: getColor(attendance.overall) }}>
              {attendance.overall}%
            </div>
          </div>
          <span className={`badge ${getBadge(attendance.overall).cls}`}>{getBadge(attendance.overall).label}</span>
        </div>

        {[
          { label: t("subjectsLessThan75"), value: attendance.subjectWise.filter((s) => s.percent < 75).length, color: "#EF4444" },
          { label: t("subjectsMoreThan85"), value: attendance.subjectWise.filter((s) => s.percent >= 85).length, color: "#10B981" },
          { label: t("totalSubjects"), value: attendance.subjectWise.length, color: "#8B5CF6" },
        ].map((s) => (
          <div className="card" key={s.label} style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{s.label}</div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: "subject", label: t("subjectWise") },
          { key: "semester", label: t("semesterWise") },
          { key: "chart", label: t("chartView") },
        ].map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "subject" && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("subject")}</th>
                  <th>{t("codeLabel")}</th>
                  <th>{t("attended")}</th>
                  <th>{t("totalClasses")}</th>
                  <th>{t("percentage")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {attendance.subjectWise.map((s) => {
                  const b = getBadge(s.percent);
                  return (
                    <tr key={s.code}>
                      <td style={{ fontWeight: 500 }}>{t(s.subject)}</td>
                      <td><span className="badge badge-purple">{s.code}</span></td>
                      <td>{s.attended}</td>
                      <td>{s.total}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${s.percent}%`, background: getColor(s.percent) }} />
                          </div>
                          <span style={{ fontWeight: 700, color: getColor(s.percent), minWidth: 38 }}>{s.percent}%</span>
                        </div>
                      </td>
                      <td><span className={`badge ${b.cls}`}>{b.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "semester" && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("semester")}</th>
                  <th>{t("attendance")} %</th>
                  <th>{t("courseProgress")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {attendance.semesterWise.map((s) => {
                  const b = getBadge(s.attendance);
                  return (
                    <tr key={s.sem}>
                      <td style={{ fontWeight: 600 }}>{t(s.sem)}</td>
                      <td style={{ fontWeight: 700, color: getColor(s.attendance) }}>{s.attendance}%</td>
                      <td>
                        <div className="progress-bar" style={{ width: 120 }}>
                          <div className="progress-fill" style={{ width: `${s.attendance}%`, background: getColor(s.attendance) }} />
                        </div>
                      </td>
                      <td><span className={`badge ${b.cls}`}>{b.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "chart" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">{t("subjectWiseAttendanceTitle")}</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={attendance.subjectWise} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,60,225,0.1)" />
                <XAxis dataKey="code" tick={{ fill: "var(--text-muted)", fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v, n, p) => [`${v}%`, t(p.payload.subject)]}
                />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "75%", fill: "#F59E0B", fontSize: 11 }} />
                <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                  {attendance.subjectWise.map((s, i) => (
                    <Cell key={i} fill={getColor(s.percent)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{t("semesterWiseAttendanceTrend")}</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={attendance.semesterWise} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,60,225,0.1)" />
                <XAxis dataKey="sem" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={(val) => t(val)} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, t("attendance")]} />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "75%", fill: "#F59E0B", fontSize: 11 }} />
                <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                  {attendance.semesterWise.map((s, i) => (
                    <Cell key={i} fill={getColor(s.attendance)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}