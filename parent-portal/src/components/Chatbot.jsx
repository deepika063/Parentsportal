import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const getBotResponse = (msg, data, t) => {
  const lower = msg.toLowerCase();
  const { student, attendance, cgpa, academic, financial, notifications } = data;

  // Greetings
  if (/^(hi|hello|hey|namaste|నమస్కారం)/i.test(lower)) {
    return t("cbHello").replace("{name}", t(student.parentName)).replace("{studentName}", t(student.name));
  }

  // Attendance
  if (lower.includes("attendance") || lower.includes("హాజరు")) {
    if (lower.includes("semester") || lower.includes("sem")) {
      let resp = `${t("cbAttendSem")}\n\n`;
      attendance.semesterWise.forEach(s => {
        resp += `• Semester ${s.sem}: **${s.attendance}%**\n`;
      });
      return resp;
    } else if (lower.includes("subject") || lower.includes("సబ్జెక్ట్")) {
      let resp = `${t("cbAttendSub")}\n\n`;
      attendance.subjectWise.forEach(s => {
        resp += `• ${t(s.subject)}: **${s.percent}%** (${s.attended}/${s.total})\n`;
      });
      return resp;
    } else {
      const low = attendance.subjectWise.filter((s) => s.percent < 75);
      let resp = `${t("cbAttendOverall").replace("{overall}", attendance.overall)}\n\n`;
      if (low.length > 0) {
        resp += `${t("cbAttendLow")}\n${low.map((s) => `• ${t(s.subject)}: ${s.percent}%`).join("\n")}\n\n`;
      }
      resp += t("cbAttendHint");
      return resp;
    }
  }

  // CGPA / marks
  if (lower.includes("cgpa") || lower.includes("marks") || lower.includes("grade") || lower.includes("sgpa") || lower.includes("మార్కులు") || lower.includes("గ్రేడ్")) {
    if (lower.includes("semester") || lower.includes("sem") || lower.includes("sgpa")) {
      let resp = `${t("cbCgpaSem")}\n\n`;
      cgpa.semesterWise.forEach(s => {
        resp += `• Semester ${s.sem}: **${s.sgpa}**\n`;
      });
      return resp;
    } else if (lower.includes("subject") || lower.includes("marks") || lower.includes("సబ్జెక్ట్")) {
      let resp = `${t("cbCgpaSub")}\n\n`;
      cgpa.subjectWise.forEach(s => {
        resp += `• ${t(s.subject)}: **${s.total}/${s.max}** (Grade: ${s.grade})\n`;
      });
      return resp;
    } else {
      const best = [...cgpa.subjectWise].sort((a, b) => b.gradePoint - a.gradePoint)[0];
      const worst = [...cgpa.subjectWise].sort((a, b) => a.gradePoint - b.gradePoint)[0];
      const latestSem = cgpa.semesterWise[cgpa.semesterWise.length - 1];
      return t("cbCgpaOverall")
        .replace("{cgpa}", cgpa.overallCGPA)
        .replace("{sgpa}", latestSem.sgpa)
        .replace("{sem}", latestSem.sem.split(" ")[1])
        .replace("{bestSub}", t(best.subject)).replace("{bestGrade}", best.grade)
        .replace("{worstSub}", t(worst.subject)).replace("{worstGrade}", worst.grade);
    }
  }

  // Fees / financial
  if (lower.includes("fee") || lower.includes("payment") || lower.includes("ఫీజు") || lower.includes("financial") || lower.includes("history") || lower.includes("transaction") || lower.includes("చెల్లింపు")) {
    if (lower.includes("history") || lower.includes("transaction") || lower.includes("paid") || lower.includes("చరిత్ర")) {
      if (financial.paymentHistory.length === 0) return t("cbFeeHistoryNull");
      let resp = `${t("cbFeeHistory")}\n\n`;
      financial.paymentHistory.forEach(p => {
        resp += `• ${new Date(p.date).toLocaleDateString("en-IN")}: **₹${p.amount.toLocaleString()}** (${t(p.status)})\n  *Txn ID: ${p.id}*\n`;
      });
      return resp;
    } else {
      return t("cbFeeStatus")
        .replace("{total}", financial.totalFee.toLocaleString())
        .replace("{paid}", financial.paidAmount.toLocaleString())
        .replace("{pending}", financial.pendingAmount.toLocaleString())
        .replace("{dueDate}", new Date(financial.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long" }));
    }
  }

  // Exams
  if (lower.includes("exam") || lower.includes("test") || lower.includes("పరీక్ష")) {
    const next = notifications.upcomingExams[0];
    return t("cbNextExam")
      .replace("{sub}", t(next.subject))
      .replace("{type}", t(next.type))
      .replace("{date}", new Date(next.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" }))
      .replace("{time}", next.time)
      .replace("{venue}", next.venue)
      .replace("{count}", notifications.upcomingExams.length);
  }

  // Backlogs
  if (lower.includes("backlog") || lower.includes("బ్యాక్‌లాగ్")) {
    if (academic.backlogs.length === 0) {
      return t("cbNoBacklogs");
    }
    const list = academic.backlogs.map((b) => `• ${t(b.subject)} (${b.code}) — ${b.attempts} attempt(s)`).join("\n");
    return t("cbBacklogs").replace("{count}", academic.backlogs.length).replace("{list}", list);
  }

  // Performance
  if (lower.includes("performance") || lower.includes("strong") || lower.includes("weak") || lower.includes("improve") || lower.includes("పనితీరు") || lower.includes("బలమైన") || lower.includes("బలహీనమైన")) {
    const strong = cgpa.subjectWise.filter((s) => s.gradePoint >= 9).map((s) => t(s.subject));
    const weak = cgpa.subjectWise.filter((s) => s.gradePoint <= 6).map((s) => t(s.subject));
    let resp = "";
    if (strong.length) resp += `${t("cbPerfStrong").replace("{list}", strong.join(", "))}\n`;
    if (weak.length) resp += `${t("cbPerfWeak").replace("{list}", weak.join(", "))}\n`;
    resp += `\n${t("cbPerfHint")}`;
    return resp;
  }

  // Student info
  if (lower.includes("student") || lower.includes("name") || lower.includes("reg") || lower.includes("branch") || lower.includes("విద్యార్థి")) {
    return t("cbStudentInfo")
      .replace("{name}", t(student.name))
      .replace("{reg}", student.regNumber)
      .replace("{branch}", t(student.branch))
      .replace("{year}", student.year)
      .replace("{sec}", t(student.section));
  }

  // Scholarship
  if (lower.includes("scholarship") || lower.includes("స్కాలర్‌షిప్")) {
    if (financial.scholarship.eligible) {
      return t("cbScholStatus")
        .replace("{type}", t(financial.scholarship.type))
        .replace("{amount}", financial.scholarship.amount.toLocaleString())
        .replace("{status}", t(financial.scholarship.status))
        .replace("{disbursed}", financial.scholarship.disbursed ? "Yes" : "No");
    }
    return t("cbScholNull");
  }

  // Contacts
  if (lower.includes("contact") || lower.includes("faculty") || lower.includes("counsellor") || lower.includes("teacher") || lower.includes("సంప్రదింపు")) {
    return t("cbContacts");
  }

  // Help
  if (lower.includes("help") || lower.includes("what can") || lower.includes("సహాయం")) {
    return t("cbHelp");
  }

  return t("cbUnknown");
};

export default function Chatbot() {
  const { t, getStudentData, isAuthenticated } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const data = getStudentData();

  useEffect(() => {
    if (open && messages.length === 0 && data) {
      setMessages([{ from: "bot", text: t("chatbotWelcome") }]);
    }
  }, [open, data]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (!isAuthenticated || !data) return null;

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 600));
    const reply = getBotResponse(text, data, t);
    setMessages((m) => [...m, { from: "bot", text: reply }]);
    setTyping(false);
  };

  const renderText = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t("chatbotTitle")}</div>
                <div style={{ fontSize: "0.72rem", opacity: 0.85 }}>● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
              <X size={14} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                {renderText(m.text)}
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot" style={{ display: "flex", gap: "4px", alignItems: "center", padding: "0.7rem" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--primary-light)", animation: `bounce 0.9s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div style={{ padding: "0 0.8rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {[t("qrAttendance"), t("qrCgpa"), t("qrFees"), t("qrExams")].map((q) => (
              <button key={q} onClick={() => { setInput(q); }} style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 12, padding: "0.25rem 0.65rem", fontSize: "0.72rem", color: "var(--text-muted)", cursor: "pointer" }}>
                {q}
              </button>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder={t("typeMessage")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="chat-send-btn" onClick={send}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(!open)} title={t("chatbotTitle")}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}