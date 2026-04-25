import { useApp } from "../context/AppContext";
import { TrendingUp, TrendingDown, Star, Lightbulb, Target } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Cell, LineChart, Line, Legend,
} from "recharts";

export default function PerformancePage() {
  const { t, getStudentData } = useApp();
  const data = getStudentData();
  if (!data) return null;
  const { cgpa, attendance } = data;

  // Calculate combined performance score (60% marks + 40% attendance)
  const subjectPerformance = cgpa.subjectWise.map((s) => {
    const marksPct = Math.round((s.total / s.max) * 100);
    const att = attendance.subjectWise.find((a) => a.code === s.code);
    const attPct = att ? att.percent : 75;
    const combined = Math.round(marksPct * 0.6 + attPct * 0.4);
    return {
      ...s,
      marksPct,
      attPct,
      combined,
      label: s.code,
    };
  });

  const strongSubjects = subjectPerformance.filter((s) => s.combined >= 75).sort((a, b) => b.combined - a.combined);
  const weakSubjects = subjectPerformance.filter((s) => s.combined < 75).sort((a, b) => a.combined - b.combined);

  const radarData = subjectPerformance.map((s) => ({
    subject: s.code,
    Marks: s.marksPct,
    Attendance: s.attPct,
    fullMark: 100,
  }));

  const suggestions = [
    {
      subject: "Software Engineering (CS305)",
      issue: "Low attendance (58%) & average marks",
      suggestions: [
        "Attend all remaining classes without fail.",
        "Review syllabus and prepare summary notes.",
        "Consult Dr. Mohan Das during cabin hours for doubt clearing.",
        "Practice previous year question papers regularly.",
      ],
      priority: "high",
    },
    {
      subject: "Database Management (CS303)",
      issue: "Below average marks (67% in exams)",
      suggestions: [
        "Focus on SQL queries, normalization, and ER diagrams.",
        "Practice hands-on labs to reinforce concepts.",
        "Form a study group with peers for collaborative learning.",
        "Use online resources (Khan Academy, W3Schools) for revision.",
      ],
      priority: "medium",
    },
    {
      subject: "Machine Learning (CS306)",
      issue: "Excellent performance — maintain it!",
      suggestions: [
        "Explore advanced topics like Deep Learning to stay ahead.",
        "Work on personal ML projects to build portfolio.",
        "Consider applying for research internships in this domain.",
      ],
      priority: "low",
    },
  ];

  const trendData = data.cgpa.semesterWise.map((sem, i) => ({
    sem: sem.sem,
    SGPA: sem.sgpa,
    Attendance: data.attendance.semesterWise[i]?.attendance || 75,
  }));

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><TrendingUp size={22} /> {t("performanceTitle")}</h2>
        <p className="section-subtitle">Visual analysis of academic performance with improvement insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {[
          { label: t("strongSubjects"), value: strongSubjects.length, color: "#10B981", bg: "rgba(16,185,129,0.15)" },
          { label: t("weakSubjects"), value: weakSubjects.length, color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
          { label: t("bestSubject"), value: t(subjectPerformance.sort((a, b) => b.combined - a.combined)[0]?.code), color: "#8B5CF6", bg: "rgba(108,60,225,0.15)" },
          { label: t("avgPerformance"), value: `${Math.round(subjectPerformance.reduce((a, s) => a + s.combined, 0) / subjectPerformance.length)}%`, color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <Target size={20} color={s.color} />
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
        {/* Combined Performance Bar */}
        <div className="card">
          <div className="card-title">{t("subjectComparison")}</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,60,225,0.1)" />
              <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v, n, p) => [`${v}%`, `${p.payload.subject}`]} />
              <Bar dataKey="combined" name="Combined Score" radius={[6, 6, 0, 0]}>
                {subjectPerformance.map((s, i) => (
                  <Cell key={i} fill={s.combined >= 80 ? "#10B981" : s.combined >= 70 ? "#F59E0B" : "#EF4444"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="card">
          <div className="card-title">{t("performanceRadar")}</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(108,60,225,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Marks" dataKey="Marks" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
              <Radar name="Attendance" dataKey="Attendance" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
              <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Line */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="card-title">{t("trendAnalysis")}</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,60,225,0.1)" />
            <XAxis dataKey="sem" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: "0.78rem" }} />
            <Line type="monotone" dataKey="SGPA" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 5 }} />
            <Line type="monotone" dataKey="Attendance" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Strong / Weak */}
      <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <TrendingUp size={18} color="#10B981" />
            <span className="card-title" style={{ margin: 0 }}>{t("strongSubjects")}</span>
          </div>
          {strongSubjects.map((s) => (
            <div key={s.code} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(108,60,225,0.1)" }}>
              <Star size={16} color="#10B981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t(s.subject)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t("marksLabel")}: {s.marksPct}% · {t("attLabel")}: {s.attPct}%</div>
              </div>
              <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, color: "#10B981" }}>{s.combined}%</span>
            </div>
          ))}
          {strongSubjects.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{t("noStrongSubjects")}</p>}
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <TrendingDown size={18} color="#EF4444" />
            <span className="card-title" style={{ margin: 0 }}>{t("weakSubjects")}</span>
          </div>
          {weakSubjects.map((s) => (
            <div key={s.code} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(108,60,225,0.1)" }}>
              <TrendingDown size={16} color="#EF4444" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t(s.subject)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t("marksLabel")}: {s.marksPct}% · {t("attLabel")}: {s.attPct}%</div>
              </div>
              <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, color: "#EF4444" }}>{s.combined}%</span>
            </div>
          ))}
          {weakSubjects.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{t("noWeakSubjects")}</p>}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <Lightbulb size={18} color="#F59E0B" />
          <span className="card-title" style={{ margin: 0 }}>{t("improvementSuggestions")}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              background: s.priority === "high" ? "rgba(239,68,68,0.07)" : s.priority === "medium" ? "rgba(245,158,11,0.07)" : "rgba(16,185,129,0.07)",
              border: `1px solid ${s.priority === "high" ? "rgba(239,68,68,0.2)" : s.priority === "medium" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`,
              borderRadius: 14, padding: "1rem 1.2rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700 }}>{t(s.subject)}</span>
                <span className={`badge ${s.priority === "high" ? "badge-danger" : s.priority === "medium" ? "badge-warning" : "badge-success"}`}>
                  {s.priority === "high" ? t("needsAttention") : s.priority === "medium" ? t("improve") : t("maintain")}
                </span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.7rem" }}>📌 {t(s.issue)}</div>
              <ul style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {s.suggestions.map((tip, j) => (
                  <li key={j} style={{ fontSize: "0.83rem", color: "var(--text)" }}>{t(tip)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}