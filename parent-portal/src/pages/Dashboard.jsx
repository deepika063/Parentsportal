import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { BookOpen, TrendingUp, CreditCard, AlertTriangle, User, GraduationCap, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  const { t, getStudentData } = useApp();
  const navigate = useNavigate();
  const data = getStudentData();
  if (!data) return null;
  const { student, attendance, cgpa, academic, financial, notifications } = data;

  const stats = [
    {
      icon: <BookOpen size={22} color="#8B5CF6" />,
      bg: "rgba(108,60,225,0.15)",
      value: `${attendance.overall}%`,
      label: t("overallAttendance"),
      color: attendance.overall < 75 ? "#EF4444" : "#10B981",
      path: "/attendance",
    },
    {
      icon: <TrendingUp size={22} color="#10B981" />,
      bg: "rgba(16,185,129,0.15)",
      value: cgpa.overallCGPA,
      label: t("overallCGPA"),
      color: "#10B981",
      path: "/cgpa",
    },
    {
      icon: <CreditCard size={22} color="#F59E0B" />,
      bg: "rgba(245,158,11,0.15)",
      value: `₹${financial.pendingAmount.toLocaleString()}`,
      label: t("pendingFees"),
      color: "#F59E0B",
      path: "/financial",
    },
    {
      icon: <AlertTriangle size={22} color="#EF4444" />,
      bg: "rgba(239,68,68,0.15)",
      value: academic.backlogs.length,
      label: t("activeBacklogs"),
      color: academic.backlogs.length > 0 ? "#EF4444" : "#10B981",
      path: "/academic",
    },
  ];

  const lowAttSubjects = attendance.subjectWise.filter((s) => s.percent < 75);
  const upcomingExams = notifications.upcomingExams.slice(0, 3);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #961df9ff 0%, #ba99e4ff 100%)",
        borderRadius: 20, padding: "1.8rem 2rem", marginBottom: "1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={26} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "0.82rem", opacity: 0.85, marginBottom: "0.2rem" }}>{t("welcomeBack")},</div>
            <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
              {t(student.parentName)}
            </div>
            <div style={{ fontSize: "0.82rem", opacity: 0.8 }}>{t(student.name)} · {student.regNumber}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.6rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>{t("branch")}</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t(student.branch)}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.6rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>{t("year")}</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{student.year}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "0.6rem 1rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>{t("section")}</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t(student.section)}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ cursor: "pointer" }} onClick={() => navigate(s.path)}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {lowAttSubjects.length > 0 && (
        <div className="alert alert-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>{t("attendanceAlertTitle")}</strong> {lowAttSubjects.length} {t("subjectsLowAttendance")}
            {lowAttSubjects.map((s) => `${t(s.subject)} (${s.percent}%)`).join(", ")}
          </div>
        </div>
      )}

      {financial.pendingAmount > 0 && (
        <div className="alert alert-danger">
          <CreditCard size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>{t("feePendingTitle")}</strong> ₹{financial.pendingAmount.toLocaleString()} {t("dueBy")}{" "}
            {new Date(financial.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Student Info */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <GraduationCap size={18} color="var(--primary-light)" />
            <span className="card-title" style={{ margin: 0 }}>{t("studentInfo")}</span>
          </div>
          {[
            [t("studentName"), t(student.name)],
            [t("regNoLabel"), student.regNumber],
            [t("branch"), t(student.branch)],
            [t("yearSection"), `${student.year} / ${t(student.section)}`],
            [t("email"), student.email],
            [t("parentNameLabel"), t(student.parentName)],
            [t("parentPhoneLabel"), student.parentPhone],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(108,60,225,0.1)", fontSize: "0.86rem" }}>
              <span style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Exams */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Calendar size={18} color="var(--secondary)" />
            <span className="card-title" style={{ margin: 0 }}>{t("upcomingExams")}</span>
          </div>
          {upcomingExams.map((exam) => (
            <div key={exam.id} style={{ display: "flex", gap: "0.8rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(108,60,225,0.1)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Calendar size={18} color="#F59E0B" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t(exam.subject)}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
                  {new Date(exam.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {exam.time} · {exam.venue}
                </div>
                <span className={`badge ${exam.type === "End Semester" ? "badge-danger" : "badge-warning"}`} style={{ marginTop: "0.3rem" }}>{t(exam.type)}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{ width: "100%", marginTop: "1rem", fontSize: "0.82rem" }} onClick={() => navigate("/notifications")}>
            {t("viewAllExams")}
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <Award size={18} color="#10B981" />
          <span className="card-title" style={{ margin: 0 }}>{t("semWiseSgpa")}</span>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          {data.cgpa.semesterWise.map((sem) => (
            <div key={sem.sem} style={{
              flex: "1 1 100px",
              background: "var(--bg-card2)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "0.8rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.3rem" }}>{t(sem.sem)}</div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: sem.sgpa >= 8 ? "#10B981" : sem.sgpa >= 7 ? "#F59E0B" : "#EF4444" }}>{sem.sgpa}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{sem.credits} cr</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}