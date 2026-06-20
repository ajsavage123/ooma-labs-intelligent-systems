import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { toast } from "sonner";

/* ─── Constants ─────────────────────────────────────────── */
const WA_NUMBER = "919492827058";

const SERVICES = [
  "Website Development",
  "E-Commerce Store",
  "Custom Software",
  "Mobile App Development",
  "AI Automations",
];

const BUSINESS_TYPES = [
  "Startup",
  "Small Business",
  "Enterprise",
  "Agency / Studio",
  "Individual / Freelancer",
  "Retail Store",
  "Real Estate",
  "Healthcare",
  "Travels & Tourism",
  "Others",
];

/* shared dropdown chevron bg */
const CHEVRON_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";

type WidgetState = "idle" | "popup" | "bubble" | "chat";

/* ─── Arch label ─────────────────────────────────────────── */
const ArchLabel = React.memo(() => (
  <svg
    width="110"
    height="48"
    viewBox="0 0 110 48"
    className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <path id="archCurve2" d="M 8,38 A 50,50 0 0,1 102,38" />
    </defs>
    <text
      fontSize="9.5"
      fill="rgba(255,255,255,0.9)"
      letterSpacing="1.2"
      fontFamily="'Space Grotesk','DM Sans',sans-serif"
      fontWeight="700"
    >
      <textPath href="#archCurve2" startOffset="50%" textAnchor="middle">
        ✦ We are here ✦
      </textPath>
    </text>
  </svg>
));
ArchLabel.displayName = "ArchLabel";

/* ─── Shared input style helper ──────────────────────────── */
const inputCls = (hasErr: boolean) =>
  `w-full rounded-xl text-sm py-2 px-3 bg-white/5 border text-white outline-none ` +
  `placeholder:text-white/30 transition-colors focus:border-[#4285F4]/60 focus:bg-white/10 ` +
  (hasErr ? "border-red-500" : "border-white/10");

const selectCls = (hasErr: boolean, empty: boolean) =>
  `w-full rounded-xl text-sm py-2.5 px-3 bg-[#0d0d16] border outline-none ` +
  `focus:border-[#4285F4]/60 appearance-none cursor-pointer transition-colors ` +
  (hasErr ? "border-red-500 " : "border-white/10 ") +
  (empty ? "text-white/35" : "text-white");

/* ─── QuoteForm ──────────────────────────────────────────── */
interface QuoteFormProps {
  compact?: boolean;
  nameRef: React.RefObject<HTMLInputElement>;
  emailRef: React.RefObject<HTMLInputElement>;
  phoneRef: React.RefObject<HTMLInputElement>;
  bizType: string;
  setBizType: (v: string) => void;
  service: string;
  setService: (v: string) => void;
  errs: Record<string, string>;
  onSend: () => void;
}

const QuoteForm = React.memo(
  ({
    compact,
    nameRef,
    emailRef,
    phoneRef,
    bizType,
    setBizType,
    service,
    setService,
    errs,
    onSend,
  }: QuoteFormProps) => {
    const gap = compact ? "space-y-2" : "space-y-3";
    const optStyle = { background: "#0d0d16", color: "white" };

    return (
      <div className={gap}>
        {/* Row 1 — Name (full width) */}
        <div>
          <input
            ref={nameRef}
            placeholder="Your Name"
            defaultValue=""
            className={inputCls(!!errs.name)}
          />
          {errs.name && <p className="text-red-400 text-[10px] mt-1">{errs.name}</p>}
        </div>

        {/* Row 2 — Email + Phone side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              defaultValue=""
              className={inputCls(!!errs.email)}
            />
            {errs.email && <p className="text-red-400 text-[10px] mt-1">{errs.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              <input
                ref={phoneRef}
                type="tel"
                placeholder="Phone"
                defaultValue=""
                className={`${inputCls(!!errs.phone)} pl-8`}
              />
            </div>
            {errs.phone && <p className="text-red-400 text-[10px] mt-1">{errs.phone}</p>}
          </div>
        </div>

        {/* Row 3 — Business type */}
        <div>
          <select
            value={bizType}
            onChange={(e) => setBizType(e.target.value)}
            className={selectCls(!!errs.bizType, !bizType)}
            style={{
              backgroundImage: CHEVRON_BG,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="" disabled style={{ color: "rgba(255,255,255,0.35)" }}>
              Type of Business
            </option>
            {BUSINESS_TYPES.map((b) => (
              <option key={b} value={b} style={optStyle}>
                {b}
              </option>
            ))}
          </select>
          {errs.bizType && <p className="text-red-400 text-[10px] mt-1">{errs.bizType}</p>}
        </div>

        {/* Row 4 — Service */}
        <div>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={selectCls(!!errs.service, !service)}
            style={{
              backgroundImage: CHEVRON_BG,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="" disabled style={{ color: "rgba(255,255,255,0.35)" }}>
              Service Looking For
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s} style={optStyle}>
                {s}
              </option>
            ))}
          </select>
          {errs.service && <p className="text-red-400 text-[10px] mt-1">{errs.service}</p>}
        </div>

        {/* Send CTA */}
        <motion.button
          whileHover={{ filter: "brightness(1.12)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onSend}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl text-sm font-semibold text-white group"
          style={{
            padding: compact ? "0.65rem 1rem" : "0.85rem 1rem",
            background: "linear-gradient(135deg,#4285F4 0%,#7c3aed 100%)",
            boxShadow: "0 6px 20px rgba(66,133,244,0.3)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send &amp; Get Free Quotation
          <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </motion.button>
      </div>
    );
  }
);
QuoteForm.displayName = "QuoteForm";

/* ─── Chat greeting messages ─────────────────────────────── */
const MESSAGES = [
  "👋 Hi! I'm here to help you get a **free quotation** for your project.",
  "Fill in your details below and I'll forward them straight to WhatsApp. ⚡",
];

const ChatMessages = React.memo(() => (
  <div className="px-4 py-3.5 space-y-2.5">
    {MESSAGES.map((msg, i) => (
      <div key={i} className="flex items-end gap-2">
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg,#4285F4,#7c3aed)" }}
        >
          O
        </div>
        <div
          className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[85%]"
          style={{ background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.15)" }}
        >
          <p
            className="text-sm text-white/90 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: msg.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        </div>
      </div>
    ))}
  </div>
));
ChatMessages.displayName = "ChatMessages";

/* ─── Main Widget ────────────────────────────────────────── */
const QuoteChatWidget: React.FC = () => {
  const [widgetState, setWidgetState] = useState<WidgetState>("idle");
  const [hasUnread, setHasUnread] = useState(false);

  /* Uncontrolled text refs — ZERO re-renders while typing */
  const nameRef  = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  /* Controlled only for dropdowns */
  const [bizType, setBizType] = useState("");
  const [service, setService] = useState("");
  const [errs, setErrs]       = useState<Record<string, string>>({});

  /* Always show bubble+badge immediately. Show popup after 10 s on first visit. */
  useEffect(() => {
    // Show bubble + badge right away so the "1" indicator is always visible
    setWidgetState("bubble");
    setHasUnread(true);

    const seen = localStorage.getItem("ql_popupSeen");
    if (seen) return; // already seen popup — don't show again

    const t = setTimeout(() => {
      setWidgetState("popup");
    }, 10_000);
    return () => clearTimeout(t);
  }, []);

  const closePopup = useCallback(() => {
    localStorage.setItem("ql_popupSeen", "true");
    setWidgetState("bubble");
    setHasUnread(true);
  }, []);

  const openChat  = useCallback(() => { setWidgetState("chat"); setHasUnread(false); }, []);
  const closeChat = useCallback(() => setWidgetState("bubble"), []);

  const handleSend = useCallback(() => {
    const name  = nameRef.current?.value.trim()  ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const phone = phoneRef.current?.value.trim() ?? "";

    const e: Record<string, string> = {};
    if (!name)  e.name  = "Name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = "Valid email required";
    if (!phone) e.phone = "Phone is required";
    if (!bizType) e.bizType = "Select a business type";
    if (!service) e.service = "Select a service";
    setErrs(e);
    if (Object.keys(e).length > 0) return;

    const msg =
      `Hi Ooma Labs! I'd like a free quotation.\n\n` +
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n` +
      `Business: ${bizType}\nService: ${service}`;

    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
    toast.success("Opening WhatsApp with your quotation details!");
    setWidgetState("bubble");
  }, [bizType, service]);

  /* Popup slide-to-bubble exit animation */
  const popupExit = {
    opacity: 0,
    scale: 0.05,
    x: "calc(50vw - 60px)",
    y: "calc(50vh - 60px)",
    transition: { duration: 0.48, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] },
  };

  const sharedFormProps: Omit<QuoteFormProps, "compact"> = {
    nameRef, emailRef, phoneRef,
    bizType, setBizType,
    service, setService,
    errs, onSend: handleSend,
  };

  return (
    <>
      {/* ══════════ 1. POPUP (centred) ══════════ */}
      <AnimatePresence>
        {widgetState === "popup" && (
          <>
            <motion.div
              key="qw-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.22 } }}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[3px]"
              onClick={closePopup}
            />
            <motion.div
              key="qw-popup"
              initial={{ opacity: 0, scale: 0.9, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={popupExit}
              transition={{ type: "spring", stiffness: 310, damping: 26 }}
              className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-[440px] relative"
                style={{
                  background: "linear-gradient(160deg,#0e0e17 0%,#12121e 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "1.75rem",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.65),0 0 0 1px rgba(66,133,244,0.1)",
                  overflow: "hidden",
                }}
              >
                {/* Gradient accent bar */}
                <div style={{ height: "2px", background: "linear-gradient(90deg,#4285F4 0%,#7c3aed 50%,#34A853 100%)" }} />

                <div className="p-6 sm:p-7">
                  {/* Close */}
                  <button
                    onClick={closePopup}
                    aria-label="Close"
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <X className="w-3.5 h-3.5 text-white/50" />
                  </button>

                  {/* Online badge */}
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#34A853" }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                    Online Now
                  </span>

                  <h2 className="text-[1.5rem] sm:text-[1.65rem] font-bold text-white leading-tight mb-1" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                    Get an Instant Quotation
                  </h2>
                  <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.42)" }}>
                    Free. No commitments. Delivered straight on WhatsApp.
                  </p>

                  <QuoteForm {...sharedFormProps} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════ 2. CHAT PANEL (above bubble, bottom-right) ══════════ */}
      <AnimatePresence>
        {widgetState === "chat" && (
          <motion.div
            key="qw-chat"
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            /* Position: right-4 on mobile, right-6 on desktop. Bottom = bubble height (56px) + gap (16px) + bottom offset (24px) = 96px */
            className="fixed z-[150]"
            style={{
              bottom: "96px",
              right: "clamp(16px, 4vw, 24px)",
              width: "min(360px, calc(100vw - 32px))",
              background: "linear-gradient(160deg,#0d0d16 0%,#111119 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1.4rem",
              boxShadow: "0 28px 60px rgba(0,0,0,0.55),0 0 0 1px rgba(66,133,244,0.07)",
              overflow: "hidden",
              maxHeight: "calc(100vh - 120px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(66,133,244,0.05)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#4285F4,#7c3aed)" }}
                >
                  O
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Ooma Labs</p>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                    <span className="text-[10px] text-white/45">Online · Replies instantly</span>
                  </span>
                </div>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X className="w-3.5 h-3.5 text-white/45" />
              </button>
            </div>

            {/* Messages */}
            <ChatMessages />

            {/* Form — scrollable if screen too small */}
            <div
              className="px-4 pb-4 overflow-y-auto flex-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] pt-3 pb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Your Details
              </p>
              <QuoteForm {...sharedFormProps} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ 3. FLOATING BUBBLE (bottom-right always) ══════════ */}
      <AnimatePresence>
        {(widgetState === "bubble" || widgetState === "chat") && (
          <motion.div
            key="qw-bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.08 }}
            /* Always bottom-right: right-4 mobile, right-6 desktop */
            className="fixed z-[160]"
            style={{ bottom: "24px", right: "clamp(16px, 4vw, 24px)" }}
          >
            <button
              onClick={openChat}
              aria-label="Open quotation chat"
              className="relative group outline-none"
            >
              {/* Arch "We are here" — hidden when chat is open */}
              {widgetState !== "chat" && <ArchLabel />}

              {/* Unread badge */}
              <AnimatePresence>
                {hasUnread && widgetState !== "chat" && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#ef4444", boxShadow: "0 0 0 2.5px #050505" }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                      className="text-[9px] font-bold text-white leading-none"
                    >
                      1
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pulse ring */}
              {widgetState !== "chat" && (
                <motion.div
                  animate={{ scale: [1, 1.65], opacity: [0.38, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 w-16 h-16 rounded-full pointer-events-none"
                  style={{ background: "rgba(66,133,244,0.38)" }}
                />
              )}

              {/* Bubble icon — enlarged to w-16 h-16 */}
              <motion.div
                animate={
                  widgetState !== "chat"
                    ? { scale: [1, 1.08, 1], rotate: [0, -6, 6, -6, 6, 0] }
                    : {}
                }
                transition={{
                  scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 6, ease: "easeInOut", repeatDelay: 2 },
                }}
                whileHover={{ scale: 1.12, rotate: 0 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,#4285F4 0%,#7c3aed 100%)",
                  boxShadow: "0 10px 32px rgba(66,133,244,0.5),0 0 0 2.5px rgba(66,133,244,0.25)",
                }}
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuoteChatWidget;
