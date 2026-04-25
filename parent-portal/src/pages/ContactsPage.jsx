import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Users, Phone, Mail, MapPin, Clock, GraduationCap, BookOpen } from "lucide-react";

export default function ContactsPage() {
  const { t, getStudentData } = useApp();
  const [activeTab, setActiveTab] = useState("counsellors");
  const data = getStudentData();
  if (!data) return null;
  const { contacts } = data;

  const ContactCard = ({ name, designation, email, phone, cabin, availability, subject, code }) => (
    <div className="card" style={{ transition: "all 0.2s" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
          background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "white",
        }}>
          {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{t(name)}</div>
          <div style={{ color: "var(--primary-light)", fontSize: "0.82rem", fontWeight: 500, marginBottom: "0.5rem" }}>
            {t(designation || subject)}
          </div>
          {code && <span className="badge badge-purple" style={{ marginBottom: "0.6rem", display: "inline-block" }}>{code}</span>}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Mail size={13} /> <a href={`mailto:${email}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{email}</a>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Phone size={13} /> <a href={`tel:${phone}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{phone}</a>
            </div>
            {cabin && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={13} /> {cabin}
              </div>
            )}
            {availability && (
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={13} /> {availability}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <a href={`tel:${phone}`} className="btn btn-primary" style={{ flex: 1, fontSize: "0.78rem", padding: "0.5rem" }}>
          <Phone size={13} /> {t("call") || "Call"}
        </a>
        <a href={`mailto:${email}`} className="btn btn-outline" style={{ flex: 1, fontSize: "0.78rem", padding: "0.5rem" }}>
          <Mail size={13} /> {t("email")}
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title"><Users size={22} /> {t("contactsTitle")}</h2>
        <p className="section-subtitle">Reach out to counsellors, faculty, and administrative staff</p>
      </div>

      <div className="tabs">
        {[
          { key: "counsellors", label: t("counsellors"), icon: <Users size={14} /> },
          { key: "faculty", label: t("faculty"), icon: <BookOpen size={14} /> },
          { key: "administration", label: t("administration"), icon: <GraduationCap size={14} /> },
        ].map((tab) => (
          <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "counsellors" && (
        <div className="grid-2">
          {contacts.counsellors.map((c) => (
            <ContactCard key={c.id} {...c} />
          ))}
        </div>
      )}

      {activeTab === "faculty" && (
        <div className="grid-3">
          {contacts.faculty.map((f) => (
            <ContactCard key={f.id} {...f} designation={f.subject} />
          ))}
        </div>
      )}

      {activeTab === "administration" && (
        <div className="grid-2">
          {contacts.administration.map((a) => (
            <ContactCard key={a.id} {...a} availability="Mon-Fri, 9AM-5PM" />
          ))}
        </div>
      )}
    </div>
  );
}