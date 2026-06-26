import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "sending" | "success" | "error";
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setStatus({ type: "sending", message: "Sending..." });

    const subject = encodeURIComponent(
      `Contact Form Message from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:robotorial.bb@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;

    setStatus({
      type: "success",
      message: "Your email client has been opened. Please send the email.",
    });

    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
  };

  return (
    <div style={styles.page}>
      <style>{cssAnimations}</style>

      {/* Cards row */}
      <div style={styles.wrapper}>
        {/* Left Panel */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Contact Information</h2>
            <p style={styles.cardSubtitle}>Our team is here to help you</p>
          </div>

          <div style={styles.cardBody}>
            <div style={styles.contactItems}>
              <ContactItem
                icon={<EmailIcon />}
                iconBg="linear-gradient(135deg, #3b4fd8, #5a6ff0)"
                label="Email"
                value="robotorial.bb@gmail.com"
              />
              <ContactItem
                icon={<PhoneIcon />}
                iconBg="linear-gradient(135deg, #6a3dd8, #9b6fef)"
                label="Phone"
                value="+91 89021 59596"
              />
              <ContactItem
                icon={<LocationIcon />}
                iconBg="linear-gradient(135deg, #c0392b, #e74c5e)"
                label="Office"
                value="Nischintapur, Budge Budge, Kolkata - 700 137, West Bengal, India"
              />
            </div>

            <div style={styles.socialSection}>
              <h3 style={styles.socialTitle}>Connect With Us</h3>
              <div style={styles.socialButtons}>
                <SocialButton icon={<FacebookIcon />} label="Facebook" />
                <SocialButton icon={<InstagramIcon />} label="Instagram" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ ...styles.card, ...styles.rightCard }}>
          <h2 style={styles.formTitle}>Send us a message</h2>

          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            />
          </div>

          {status.message && (
            <p
              style={{
                ...styles.statusMsg,
                color:
                  status.type === "error"
                    ? "#f87171"
                    : status.type === "success"
                    ? "#4ade80"
                    : "#a5b4fc",
              }}
            >
              {status.message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={status.type === "sending"}
            style={styles.sendButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#5c6cf2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#4f5de4")
            }
          >
            {status.type === "sending" ? "Opening..." : "Send Message"}
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Robot widget — centered below cards */}
      <div style={styles.robotRow}>
        <RobotWidget />
        <div style={styles.robotBubble}>
          I'd be happy to help answer your questions!
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function ContactItem({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div style={styles.contactRow}>
      <div style={{ ...styles.iconBox, background: iconBg }}>{icon}</div>
      <div>
        <p style={styles.contactLabel}>{label}</p>
        <p style={styles.contactValue}>{value}</p>
      </div>
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      style={styles.socialBtn}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
      }
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function RobotWidget() {
  return (
    <svg width="90" height="48" viewBox="0 0 90 48" fill="none" style={{ display: "block" }}>
      <rect x="4" y="14" width="82" height="26" rx="13" fill="#1e2035" stroke="#2d3055" strokeWidth="1.5" />
      <circle cx="30" cy="27" r="5" fill="#4f6ef5" opacity="0.9" />
      <circle cx="30" cy="27" r="3" fill="#7090ff" />
      <circle cx="58" cy="27" r="5" fill="#4f6ef5" opacity="0.9" />
      <circle cx="58" cy="27" r="3" fill="#7090ff" />
      <rect x="38" y="24" width="14" height="6" rx="3" fill="#e84057" />
      <line x1="44" y1="14" x2="44" y2="8" stroke="#e84057" strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="6" r="3" fill="#e84057" />
      <line x1="4" y1="27" x2="0" y2="27" stroke="#2d3055" strokeWidth="2" strokeLinecap="round" />
      <line x1="86" y1="27" x2="90" y2="27" stroke="#2d3055" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── SVG Icons ──────────────────────────────────────────────── */
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

/* ── Styles ─────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0d0f1a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px 48px",
    fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    position: "relative",
  },
  wrapper: {
    display: "flex",
    gap: "24px",
    maxWidth: "1000px",
    width: "100%",
    alignItems: "stretch",   // <-- both cards same height
  },
  /* Shared card base */
  card: {
    flex: 1,
    background: "#161827",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  /* Right card overrides */
  rightCard: {
    padding: "32px 28px",
  },
  cardHeader: {
    background: "#1e2240",
    padding: "28px 28px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.01em",
  },
  cardSubtitle: {
    margin: "6px 0 0",
    fontSize: "13.5px",
    color: "rgba(255,255,255,0.45)",
    fontFamily: "'Inter', sans-serif",
  },
  cardBody: {
    padding: "24px 28px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flex: 1,
  },
  contactItems: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  contactRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactLabel: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontFamily: "'Inter', sans-serif",
  },
  contactValue: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "rgba(255,255,255,0.85)",
    lineHeight: "1.55",
    fontFamily: "'Inter', sans-serif",
  },
  socialSection: {
    marginTop: "auto",
  },
  socialTitle: {
    margin: "0 0 12px",
    fontSize: "15px",
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  socialButtons: {
    display: "flex",
    gap: "10px",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "50px",
    color: "rgba(255,255,255,0.8)",
    fontSize: "13.5px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  formTitle: {
    margin: "0 0 24px",
    fontSize: "20px",
    fontWeight: 700,
    color: "#ffffff",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.01em",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "'Inter', sans-serif",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#1e2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
    fontFamily: "'Inter', sans-serif",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    background: "#1e2035",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical" as const,
    minHeight: "140px",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
    fontFamily: "'Inter', sans-serif",
  },
  sendButton: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    background: "#4f5de4",
    border: "none",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    letterSpacing: "0.01em",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  statusMsg: {
    margin: "0 0 10px",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  /* Robot row — centered below the two cards */
  robotRow: {
    position: "absolute",
    left: "40px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  robotBubble: {
    background: "#1e2035",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "12.5px",
    color: "rgba(255,255,255,0.7)",
    maxWidth: "100px",
    lineHeight: "1.45",
    fontFamily: "'Inter', sans-serif",
  },
};

const cssAnimations = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  input::placeholder, textarea::placeholder { color: transparent; }
  input, textarea { color-scheme: dark; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
`;
