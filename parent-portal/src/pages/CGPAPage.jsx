import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Award, TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

export default function CGPAPage() {
  const { t, getStudentData } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const data = getStudentData();
  
  const [selectedSem, setSelectedSem] = useState(() => {
    if (data?.cgpa?.semesterWise?.length > 0) {
      return data.cgpa.semesterWise[data.cgpa.semesterWise.length - 1].sem;
    }
    return "Sem 1";
  });

  if (!data) return null;
  const { cgpa } = data;

  const gradeColor = (g) => {
    if (["A+", "O"].includes(g)) return "#10B981";
    if (["A"].includes(g)) return "#3B82F6";
    if (["B+"].includes(g)) return "#8B5CF6";
    if (["B"].includes(g)) return "#F59E0B";
    if (["C"].includes(g)) return "#F97316";
    return "#EF4444";
  };

  const subjectsBySem = cgpa.subjectWise.reduce((acc, curr) => {
    const sem = curr.sem || "Other";
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(curr);
    return acc;
  }, {});

  const activeSubjects = subjectsBySem[selectedSem] || [];

  const radarData = activeSubjects.map((s) => ({
    subject: s.code,
    score: Math.round((s.total / s.max) * 100),
    fullMark: 100,
  }));

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Award size={22} /> {t("cgpaTitle")}</h2>
        <p className="section-subtitle">{t("cgpaSubtitle")}</p>
      </div>

      {/* Top summary */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div className="card" style={{ flex: 2, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t("overall")} {t("cgpa")}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "3rem", fontWeight: 800, color: "#10B981", lineHeight: 1.1 }}>{cgpa.overallCGPA}</div>
              <span className="badge badge-success" style={{ marginTop: "0.3rem" }}>{t("tenPointScale")}</span>
            </div>
            <div style={{ flex: 1 }}>
              {cgpa.yearWise.map((y) => (
                <div key={y.year} style={{ marginBottom: "0.7rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{t(y.year)}</span>
                    <span style={{ fontWeight: 700 }}>{y.cgpa}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(y.cgpa / 10) * 100}%`, background: y.cgpa >= 8 ? "#10B981" : y.cgpa >= 7 ? "#F59E0B" : "#EF4444" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 150 }}>
          <div className="card-title">{t("sgpaTrend")}</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={cgpa.semesterWise}>
              <Line type="monotone" dataKey="sgpa" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 4 }} />
              <XAxis dataKey="sem" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={(val) => t(val)} />
              <YAxis domain={[6, 10]} hide />
              <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [v, "SGPA"]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: "overview", label: t("semesterWise") },
          { key: "subjects", label: t("subjectMarks") },
          { key: "charts", label: t("chartsLabel") },
        ].map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === "subjects" || activeTab === "charts") && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
          {cgpa.semesterWise.map(semObj => (
            <button 
              key={semObj.sem}
              onClick={() => setSelectedSem(semObj.sem)}
              className={`btn ${selectedSem === semObj.sem ? "btn-primary" : "btn-outline"}`}
              style={{ padding: "0.4rem 1.2rem", fontSize: "0.85rem", borderRadius: "20px" }}
            >
              {t(semObj.sem)}
            </button>
          ))}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("semester")}</th>
                  <th>{t("sgpa")}</th>
                  <th>{t("credits")}</th>
                  <th>{t("progressLabel")}</th>
                  <th>{t("remarksLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {cgpa.semesterWise.map((sem) => (
                  <tr key={sem.sem}>
                    <td style={{ fontWeight: 600 }}>{t(sem.sem)}</td>
                    <td style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.1rem", fontWeight: 700, color: sem.sgpa >= 8.5 ? "#10B981" : sem.sgpa >= 7.5 ? "#3B82F6" : "#F59E0B" }}>
                      {sem.sgpa}
                    </td>
                    <td>{sem.credits}</td>
                    <td>
                      <div className="progress-bar" style={{ width: 120 }}>
                        <div className="progress-fill" style={{ width: `${(sem.sgpa / 10) * 100}%`, background: sem.sgpa >= 8 ? "#10B981" : "#F59E0B" }} />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${sem.sgpa >= 8.5 ? "badge-success" : sem.sgpa >= 7.5 ? "badge-info" : "badge-warning"}`}>
                        {sem.sgpa >= 8.5 ? t("distinction") : sem.sgpa >= 7.5 ? t("firstClass") : t("secondClass")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "subjects" && activeSubjects.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: "1rem" }}>{t(selectedSem)} - {t("subjectMarks")}</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("subject")}</th>
                  <th>{t("codeLabel")}</th>
                  <th>{t("internal")} /50</th>
                  <th>{t("external")} /100</th>
                  <th>{t("total")} /150</th>
                  <th>{t("grade")}</th>
                  <th>{t("gradePoint")}</th>
                  <th>{t("credits")}</th>
                </tr>
              </thead>
              <tbody>
                {activeSubjects.map((s) => (
                  <tr key={s.code}>
                    <td style={{ fontWeight: 500 }}>{t(s.subject)}</td>
                    <td><span className="badge badge-purple">{s.code}</span></td>
                    <td>{s.internal}</td>
                    <td>{s.external}</td>
                    <td style={{ fontWeight: 700 }}>{s.total}</td>
                    <td>
                      <span className="badge" style={{ background: `${gradeColor(s.grade)}20`, color: gradeColor(s.grade) }}>
                        {s.grade}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: gradeColor(s.grade) }}>{s.gradePoint}</td>
                    <td>{s.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "charts" && activeSubjects.length > 0 && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">{t("subjectWiseMarksPct")}</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={activeSubjects.map((s) => ({ ...s, pct: Math.round((s.total / s.max) * 100) }))} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,60,225,0.1)" />
                <XAxis dataKey="code" tick={{ fill: "var(--text-muted)", fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v, n, p) => [`${v}% (${p.payload.grade})`, t(p.payload.subject)]} />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                  {activeSubjects.map((s, i) => (
                    <Cell key={i} fill={gradeColor(s.grade)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">{t("performanceRadar")}</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(108,60,225,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={t("scoreLabel")} dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, t("scoreLabel")]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}