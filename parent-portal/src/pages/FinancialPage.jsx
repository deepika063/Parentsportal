import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CreditCard, CheckCircle, AlertCircle, Award, History } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function FinancialPage() {
  const { t, getStudentData } = useApp();
  const [activeTab, setActiveTab] = useState("overview");
  const data = getStudentData();
  if (!data) return null;
  const { financial } = data;

  const paidPct = Math.round((financial.paidAmount / financial.totalFee) * 100);
  const pieColors = ["#10B981", "#6C3CE1", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"];

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><CreditCard size={22} /> {t("financialTitle")}</h2>
        <p className="section-subtitle">{t("financialSubtitle")}</p>
      </div>

      {financial.pendingAmount > 0 && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>{t("feeDue")}</strong> ₹{financial.pendingAmount.toLocaleString()} {t("pendingPayBefore")}{" "}
            {new Date(financial.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} {t("avoidLateFees")}
          </div>
        </div>
      )}

      {/* Fee Summary Cards */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {[
          { label: t("totalFee"), value: `₹${financial.totalFee.toLocaleString()}`, color: "var(--text)", bg: "rgba(108,60,225,0.15)" },
          { label: t("paidAmount"), value: `₹${financial.paidAmount.toLocaleString()}`, color: "#10B981", bg: "rgba(16,185,129,0.15)" },
          { label: t("pendingAmount"), value: `₹${financial.pendingAmount.toLocaleString()}`, color: "#EF4444", bg: "rgba(239,68,68,0.15)" },
          { label: t("paymentProgress"), value: `${paidPct}%`, color: "#8B5CF6", bg: "rgba(108,60,225,0.15)" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <CreditCard size={20} color={s.color} />
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.82rem" }}>
          <span style={{ color: "var(--text-muted)" }}>{t("overallFeePayment")}</span>
          <span style={{ fontWeight: 700 }}>{paidPct}% {t("paidProgressLabel")}</span>
        </div>
        <div className="progress-bar" style={{ height: 14, borderRadius: 7 }}>
          <div className="progress-fill" style={{ width: `${paidPct}%`, background: "linear-gradient(90deg,#10B981,#6C3CE1)", borderRadius: 7 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>{t("paidLabel")} ₹{financial.paidAmount.toLocaleString()}</span>
          <span>{t("dueLabel")} {new Date(financial.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>{t("pendingLabel")} ₹{financial.pendingAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="tabs">
        {[
          { key: "overview", label: t("feeBreakup") },
          { key: "history", label: t("paymentHistory") },
          { key: "scholarship", label: t("scholarshipStatus") },
        ].map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title">{t("feeBreakup")}</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t("feeItemLabel")}</th>
                    <th>{t("amount")}</th>
                    <th>{t("shareLabel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {financial.feeBreakup.map((f) => (
                    <tr key={f.item}>
                      <td style={{ fontWeight: 500 }}>{t(f.item)}</td>
                      <td style={{ fontWeight: 700 }}>₹{f.amount.toLocaleString()}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div className="progress-bar" style={{ width: 80 }}>
                            <div className="progress-fill" style={{ width: `${Math.round((f.amount / financial.totalFee) * 100)}%`, background: "var(--primary)" }} />
                          </div>
                          <span style={{ fontSize: "0.78rem" }}>{Math.round((f.amount / financial.totalFee) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="card-title" style={{ alignSelf: "flex-start" }}>{t("feeDistribution")}</div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={financial.feeBreakup} dataKey="amount" nameKey="item" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {financial.feeBreakup.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`₹${v.toLocaleString()}`, ""]} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <History size={16} color="var(--primary-light)" />
            <span className="card-title" style={{ margin: 0 }}>{t("paymentHistory")}</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{t("txnIdLabel")}</th>
                  <th>{t("date")}</th>
                  <th>{t("amount")}</th>
                  <th>{t("paymentMode")}</th>
                  <th>{t("receiptNo")}</th>
                  <th>{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {financial.paymentHistory.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: "var(--primary-light)" }}>{p.id}</td>
                    <td>{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td style={{ fontWeight: 700, color: "#10B981" }}>₹{p.amount.toLocaleString()}</td>
                    <td>{t(p.mode)}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{p.receipt}</td>
                    <td>
                      <span className={`badge ${p.status === "Paid" || p.status === "Credited" ? "badge-success" : "badge-warning"}`}>
                        {p.status === "Credited" ? `✓ ${t("creditedStatus")}` : t(p.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "scholarship" && (
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Award size={18} color="#F59E0B" />
            <span className="card-title" style={{ margin: 0 }}>{t("scholarshipStatus")}</span>
          </div>
          <div style={{
            background: financial.scholarship.eligible ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${financial.scholarship.eligible ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            borderRadius: 16, padding: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.2rem" }}>
              {financial.scholarship.eligible
                ? <CheckCircle size={28} color="#10B981" />
                : <AlertCircle size={28} color="#EF4444" />}
              <div>
                <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
                  {financial.scholarship.eligible ? t("scholarshipAwarded") : t("notEligible")}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{t("academicYear")}</div>
              </div>
            </div>
            {financial.scholarship.eligible && (
              <div className="grid-2">
                {[
                  { label: t("scholarshipType"), value: t(financial.scholarship.type) },
                  { label: t("scholarshipAmount"), value: `₹${financial.scholarship.amount.toLocaleString()}` },
                  { label: t("status"), value: t(financial.scholarship.status) },
                  { label: t("disbursementDate"), value: financial.scholarship.disbursedDate },
                ].map((s) => (
                  <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.8rem 1rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{s.label}</div>
                    <div style={{ fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}