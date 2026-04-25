import { useApp } from "../context/AppContext";
import { BookX, RotateCcw, Clock, GraduationCap, CheckCircle, AlertTriangle } from "lucide-react";

export default function AcademicStatusPage() {
  const { t, getStudentData } = useApp();
  const data = getStudentData();
  if (!data) return null;
  const { academic } = data;
  const { courseCompletion } = academic;

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><GraduationCap size={22} /> {t("academicStatusTitle")}</h2>
        <p className="section-subtitle">{t("academicStatusSubtitle")}</p>
      </div>

      {/* Course Completion */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <GraduationCap size={18} color="var(--primary-light)" />
          <span className="card-title" style={{ margin: 0 }}>{t("courseCompletion")}</span>
        </div>
        <div className="grid-4" style={{ marginBottom: "1.2rem" }}>
          {[
            { label: t("totalCredits"), value: academic.totalCredits, color: "var(--text)" },
            { label: t("earnedCredits"), value: academic.earnedCredits, color: "#10B981" },
            { label: t("completionPercent"), value: `${courseCompletion.percentage}%`, color: "#8B5CF6" },
            { label: t("expectedGraduation"), value: courseCompletion.expectedGraduation, color: "#F59E0B" },
          ].map((s) => (
            <div className="card" key={s.label} style={{ textAlign: "center", padding: "1rem" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>{s.label}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>{t("courseProgress")}</span>
          <span style={{ fontWeight: 600 }}>{courseCompletion.completedSemesters} / {courseCompletion.totalSemesters} {t("semestersLabel")}</span>
        </div>
        <div className="progress-bar" style={{ height: 12, borderRadius: 6 }}>
          <div className="progress-fill" style={{ width: `${courseCompletion.percentage}%`, background: "var(--gradient)", borderRadius: 6 }} />
        </div>
        <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {100 - courseCompletion.percentage}% {t("remaining")} · {t("expectedGraduation")}: {courseCompletion.expectedGraduation}
        </div>

        {/* Semester timeline */}
        <div style={{ display: "flex", gap: "0.3rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
          {Array.from({ length: courseCompletion.totalSemesters }, (_, i) => i + 1).map((sem) => (
            <div key={sem} style={{
              flex: "1 1 60px",
              padding: "0.5rem",
              borderRadius: 8,
              textAlign: "center",
              fontSize: "0.78rem",
              fontWeight: 600,
              background: sem <= courseCompletion.completedSemesters ? "rgba(108,60,225,0.25)" : "var(--bg-card2)",
              border: `1px solid ${sem <= courseCompletion.completedSemesters ? "rgba(108,60,225,0.5)" : "var(--border)"}`,
              color: sem <= courseCompletion.completedSemesters ? "var(--primary-light)" : "var(--text-muted)",
            }}>
              {sem <= courseCompletion.completedSemesters ? <CheckCircle size={14} style={{ marginBottom: 2 }} /> : null}
              {t("semShort")} {sem}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Backlogs */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
            <BookX size={18} color="#EF4444" />
            <span className="card-title" style={{ margin: 0 }}>{t("backlogs")}</span>
            <span className="badge badge-danger" style={{ marginLeft: "auto" }}>{academic.backlogs.length}</span>
          </div>
          {academic.backlogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <CheckCircle size={40} color="#10B981" style={{ marginBottom: "0.8rem" }} />
              <p style={{ fontSize: "0.9rem" }}>{t("noBacklogs")}</p>
            </div>
          ) : (
            academic.backlogs.map((b) => (
              <div key={b.code} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "0.8rem" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{t(b.subject)}</div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>{t("codeLabel")}: <strong style={{ color: "var(--text)" }}>{b.code}</strong></span>
                  <span>{t("semester")}: <strong style={{ color: "var(--text)" }}>{b.semester}</strong></span>
                  <span>{t("attempts")}: <strong style={{ color: "#EF4444" }}>{b.attempts}</strong></span>
                </div>
                <div className="alert alert-danger" style={{ marginTop: "0.6rem", marginBottom: 0, padding: "0.5rem 0.8rem", fontSize: "0.78rem" }}>
                  <AlertTriangle size={13} /> {t("mustClearSubject")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Repeated Subjects */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
            <RotateCcw size={18} color="#F59E0B" />
            <span className="card-title" style={{ margin: 0 }}>{t("repeatedSubjects")}</span>
            <span className="badge badge-warning" style={{ marginLeft: "auto" }}>{academic.repeatedSubjects.length}</span>
          </div>
          {academic.repeatedSubjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <CheckCircle size={40} color="#10B981" style={{ marginBottom: "0.8rem" }} />
              <p style={{ fontSize: "0.9rem" }}>{t("noRepeated")}</p>
            </div>
          ) : (
            academic.repeatedSubjects.map((s) => (
              <div key={s.code} style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>{t(s.subject)}</div>
                  <span className={`badge ${s.cleared ? "badge-success" : "badge-warning"}`}>{s.cleared ? t("cleared") : t("pending")}</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                  <span>{t("codeLabel")}: <strong style={{ color: "var(--text)" }}>{s.code}</strong></span>
                  <span>{t("originalSem")}: <strong style={{ color: "var(--text)" }}>{s.originalSem}</strong></span>
                  <span>{t("retookIn")}: <strong style={{ color: "var(--text)" }}>{s.retakeIn}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Incomplete Subjects */}
      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <Clock size={18} color="#3B82F6" />
          <span className="card-title" style={{ margin: 0 }}>{t("incompleteSubjects")}</span>
        </div>
        {academic.incompleteSubjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
            <CheckCircle size={36} color="#10B981" style={{ marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.9rem" }}>{t("noIncomplete")}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("subject")}</th>
                  <th>{t("codeLabel")}</th>
                  <th>{t("status")}</th>
                  <th>{t("deadline")}</th>
                  <th>{t("actionRequired")}</th>
                </tr>
              </thead>
              <tbody>
                {academic.incompleteSubjects.map((s) => (
                  <tr key={s.code}>
                    <td style={{ fontWeight: 500 }}>{t(s.subject)}</td>
                    <td><span className="badge badge-purple">{s.code}</span></td>
                    <td><span className="badge badge-info">{t(s.status)}</span></td>
                    <td style={{ color: "#F59E0B", fontWeight: 600 }}>{t(s.deadline)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{t("submitWorkDeadline")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}