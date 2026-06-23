import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, User, Mail, Briefcase, Laptop, ChevronDown } from "lucide-react";
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

type WidgetState = "idle" | "popup" | "bubble" | "chat";

/* ─── Custom Inputs & Dropdowns ──────────────────────────── */
interface InputFieldProps {
  refVar: React.RefObject<HTMLInputElement>;
  type?: string;
  placeholder: string;
  icon: any;
  error?: boolean;
}

const InputField = React.memo(({ refVar, type = "text", placeholder, icon: Icon, error }: InputFieldProps) => {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      <input
        ref={refVar}
        type={type}
        defaultValue=""
        placeholder={placeholder}
        className={`w-full pl-10 pr-3.5 py-2.5 bg-white/5 border rounded-xl text-xs sm:text-sm text-white outline-none placeholder:text-white/25 transition-all duration-300 focus:border-[#4285F4]/60 focus:bg-white/10 ${
          error ? "border-red-500" : "border-white/10 hover:border-white/20"
        }`}
      />
    </div>
  );
});
InputField.displayName = "InputField";

interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon: any;
  error?: boolean;
}

const CustomSelect = React.memo(({ value, onChange, options, placeholder, icon: Icon, error }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl text-xs sm:text-sm py-2.5 px-3.5 bg-white/5 border text-left text-white transition-all duration-300 focus:border-[#4285F4]/60 ${
          error ? "border-red-500" : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex items-center gap-2.5 text-white/80">
          <Icon className="w-4 h-4 text-white/30 shrink-0" />
          <span className={value ? "text-white" : "text-white/25"}>
            {value || placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 py-1.5 bg-[#0e0e17] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto scrollbar-hide backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#4285F4]/10 hover:text-[#4285F4] transition-colors ${
                  value === opt ? "text-[#4285F4] bg-[#4285F4]/5 font-bold" : "text-white/70"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
CustomSelect.displayName = "CustomSelect";

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
    const gap = compact ? "space-y-2.5" : "space-y-3.5";

    return (
      <div className={gap}>
        {/* Name Input */}
        <div>
          <InputField
            refVar={nameRef}
            placeholder="Your Name"
            icon={User}
            error={!!errs.name}
          />
          {errs.name && <p className="text-red-400 text-[10px] mt-1 pl-1">{errs.name}</p>}
        </div>

        {/* Email + Phone side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <InputField
              refVar={emailRef}
              type="email"
              placeholder="Email Address"
              icon={Mail}
              error={!!errs.email}
            />
            {errs.email && <p className="text-red-400 text-[10px] mt-1 pl-1">{errs.email}</p>}
          </div>
          <div>
            <InputField
              refVar={phoneRef}
              type="tel"
              placeholder="Phone Number"
              icon={Phone}
              error={!!errs.phone}
            />
            {errs.phone && <p className="text-red-400 text-[10px] mt-1 pl-1">{errs.phone}</p>}
          </div>
        </div>

        {/* Business Type dropdown */}
        <div>
          <CustomSelect
            value={bizType}
            onChange={setBizType}
            options={BUSINESS_TYPES}
            placeholder="Type of Business"
            icon={Briefcase}
            error={!!errs.bizType}
          />
          {errs.bizType && <p className="text-red-400 text-[10px] mt-1 pl-1">{errs.bizType}</p>}
        </div>

        {/* Service selection dropdown */}
        <div>
          <CustomSelect
            value={service}
            onChange={setService}
            options={SERVICES}
            placeholder="Service Looking For"
            icon={Laptop}
            error={!!errs.service}
          />
          {errs.service && <p className="text-red-400 text-[10px] mt-1 pl-1">{errs.service}</p>}
        </div>

        {/* Submit Quote Button */}
        <motion.button
          whileHover={{ filter: "brightness(1.15)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onSend}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl text-xs sm:text-sm font-bold text-white group shadow-[0_8px_30px_rgb(66,133,244,0.3)] hover:shadow-[0_8px_30px_rgb(66,133,244,0.45)] transition-all cursor-pointer border-none"
          style={{
            padding: compact ? "0.75rem 1rem" : "0.9rem 1rem",
            background: "linear-gradient(135deg, #4285F4 0%, #7c3aed 100%)",
          }}
        >
          Get Free Quotation
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
  <div className="px-4 py-4 space-y-3.5">
    {MESSAGES.map((msg, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15, duration: 0.4 }}
        className="flex items-end gap-2.5"
      >
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-display font-black text-white relative shadow-md"
          style={{ background: "linear-gradient(135deg,#4285F4,#7c3aed)" }}
        >
          O
        </div>
        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] bg-white/5 border border-white/10"
        >
          <p
            className="text-xs sm:text-sm text-white/90 leading-relaxed font-body"
            dangerouslySetInnerHTML={{
              __html: msg.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-bold'>$1</strong>"),
            }}
          />
        </div>
      </motion.div>
    ))}
  </div>
));
ChatMessages.displayName = "ChatMessages";

/* ─── Main Widget ────────────────────────────────────────── */
const QuoteChatWidget: React.FC = () => {
  const [widgetState, setWidgetState] = useState<WidgetState>("idle");
  const [hasUnread, setHasUnread] = useState(false);
  const [shouldJump, setShouldJump] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800
  });

  /* Track window size dynamically for perfect centered exit animations */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Uncontrolled text refs — ZERO re-renders while typing */
  const nameRef  = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  /* Controlled only for dropdowns */
  const [bizType, setBizType] = useState("");
  const [service, setService] = useState("");
  const [errs, setErrs]       = useState<Record<string, string>>({});

  /* Listen for cookie consent changes to avoid overlay collisions */
  const [cookieConsentActive, setCookieConsentActive] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("ooma_cookie_consent");
      setCookieConsentActive(!consent);
    };
    checkConsent();
    window.addEventListener("cookie-consent-changed", checkConsent);
    return () => window.removeEventListener("cookie-consent-changed", checkConsent);
  }, []);

  /* Always show bubble+badge immediately. Show popup after 10 s on first visit. */
  useEffect(() => {
    setWidgetState("bubble");
    setHasUnread(true);

    const seen = localStorage.getItem("ql_popupSeen");
    if (seen || cookieConsentActive) return;

    const t = setTimeout(() => {
      setWidgetState("popup");
    }, 10_000);
    return () => clearTimeout(t);
  }, [cookieConsentActive]);

  const triggerJump = () => {
    setShouldJump(true);
    setTimeout(() => setShouldJump(false), 1100);
  };

  const closePopup = useCallback(() => {
    localStorage.setItem("ql_popupSeen", "true");
    setWidgetState("bubble");
    setHasUnread(true);

    // Bounces exactly when the shrinking centered card overlaps the bubble
    setTimeout(() => {
      triggerJump();
    }, 400);
  }, []);

  const openChat  = useCallback(() => { setWidgetState("chat"); setHasUnread(false); }, []);
  const closeChat = useCallback(() => {
    setWidgetState("bubble");
    triggerJump();
  }, []);

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
    setTimeout(() => {
      triggerJump();
    }, 400);
  }, [bizType, service]);

  const isDesktop = windowSize.width >= 1024;
  const bubbleRadius = isDesktop ? 32 : 28; // 64px on desktop, 56px on mobile
  
  const rightMargin = isDesktop ? 48 : 24;
  const bottomMargin = isDesktop 
    ? (cookieConsentActive ? 136 : 40) 
    : (cookieConsentActive ? 230 : 24);

  const bottomOffset = `${bottomMargin}px`;
  const rightOffset = `${rightMargin}px`;

  /* Mathematically mapped coordinates to shrink the centered modal popup precisely to the bubble's location */
  const popupExit = {
    opacity: 0,
    scale: 0.01,
    x: windowSize.width / 2 - (rightMargin + bubbleRadius),
    y: windowSize.height / 2 - (bottomMargin + bubbleRadius),
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  };

  const sharedFormProps: Omit<QuoteFormProps, "compact"> = {
    nameRef, emailRef, phoneRef,
    bizType, setBizType,
    service, setService,
    errs, onSend: handleSend,
  };

  /* Check if the quotation form is currently open (either center modal popup or bottom-right chat panel) */
  const isFormOpen = widgetState === "chat" || widgetState === "popup";

  return (
    <>
      {/* ══════════ 1. POPUP (centered) ══════════ */}
      <AnimatePresence>
        {widgetState === "popup" && (
          <>
            <motion.div
              key="qw-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.22 } }}
              className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-[4px]"
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
                className="pointer-events-auto w-full max-w-[420px] relative"
                style={{
                  background: "linear-gradient(160deg, #0a0a0f 0%, #111119 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2rem",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(66,133,244,0.15)",
                  overflow: "hidden",
                }}
              >
                {/* Top glow accent bar */}
                <div style={{ height: "3px", background: "linear-gradient(90deg, #4285F4 0%, #7c3aed 50%, #34A853 100%)" }} />

                <div className="p-7 sm:p-8">
                  {/* Close */}
                  <button
                    onClick={closePopup}
                    aria-label="Close"
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 bg-white/5 border border-white/10 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 text-white/65" />
                  </button>

                  {/* Online badge */}
                  <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.25em] uppercase mb-4 text-[#34A853]">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                    Online Now
                  </span>

                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2 font-display">
                    Get an Instant Quotation
                  </h2>
                  <p className="text-xs sm:text-sm mb-6 text-white/40 leading-relaxed">
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
            initial={{ opacity: 0, scale: 0.3, y: 100, x: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 100, x: 100 }}
            transition={{ type: "spring", stiffness: 280, damping: 25 }}
            className="fixed z-[150] shadow-2xl"
            style={{
              bottom: `calc(${bottomOffset} + 80px)`,
              right: rightOffset,
              width: "min(360px, calc(100vw - 32px))",
              background: "linear-gradient(160deg, #09090f 0%, #101018 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1.8rem",
              overflow: "hidden",
              maxHeight: "calc(100vh - 120px)",
              display: "flex",
              flexDirection: "column",
              transformOrigin: "bottom right",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(66,133,244,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-black text-sm flex-shrink-0 relative shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #4285F4 0%, #7c3aed 100%)",
                    boxShadow: "0 0 12px rgba(66, 133, 244, 0.35)",
                  }}
                >
                  O
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34A853] border-2 border-[#09090f] animate-pulse" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight font-display">Ooma Assistant</p>
                  <span className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-white/45 font-medium">Replies Instantly via WhatsApp</span>
                  </span>
                </div>
              </div>
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 bg-white/5 border border-white/5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <ChatMessages />

            {/* Form — scrollable if screen too small */}
            <div
              className="px-4 pb-4 overflow-y-auto flex-1 scrollbar-hide"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] pt-4.5 pb-2.5 text-white/30 font-display">
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
            className="fixed z-[160]"
            style={{ bottom: bottomOffset, right: rightOffset }}
          >
            <button
              onClick={openChat}
              aria-label="Open quotation chat"
              className="relative group outline-none cursor-pointer"
            >
              {/* Interactive Speech Tag above the bubble */}
              <AnimatePresence>
                {widgetState === "bubble" && !shouldJump && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 10 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white text-black font-display font-black text-[10px] sm:text-[12px] px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 select-none whitespace-nowrap"
                    style={{
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Hii!</span>
                    <span className="inline-block animate-chatbot-wiggle text-xs sm:text-sm">
                      👋
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerJump();
                        toast.success("Waved back! Ooma is here to help.");
                      }}
                      className="ml-1 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider bg-black/10 hover:bg-black/25 text-black hover:text-black rounded-md border-none cursor-pointer transition-colors shadow-sm font-display"
                    >
                      Wave Hi
                    </button>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pulse ring */}
              {widgetState !== "chat" && (
                <div
                  className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full pointer-events-none animate-chatbot-pulse"
                  style={{ background: "rgba(66,133,244,0.3)" }}
                />
              )}

              {/* Bubble icon — w-14 h-14 (mobile) or w-16 h-16 (desktop) styled with Absolute Claymorphic 3D styling */}
              <motion.div
                animate={shouldJump ? { y: [0, -32, 0, -16, 0, -6, 0] } : {}}
                transition={shouldJump ? { duration: 1.0, ease: "easeInOut" } : {}}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl ${
                  !shouldJump && widgetState !== "chat" ? "animate-chatbot-float" : ""
                }`}
                style={{
                  background: "linear-gradient(135deg, #4285F4 0%, #7c3aed 100%)",
                  boxShadow: "inset 4px 4px 8px rgba(255, 255, 255, 0.45), inset -4px -4px 8px rgba(0, 0, 0, 0.35), 0 12px 28px rgba(66, 133, 244, 0.45)",
                  border: "none",
                }}
              >
                {/* Custom Animated 3D Smiley Face */}
                <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-white fill-none stroke-[2.5]" style={{ strokeLinecap: "round" }}>
                  {/* Left eye */}
                  <motion.circle
                    cx="11"
                    r="2.5"
                    className={`fill-white stroke-none ${!isFormOpen ? "animate-chatbot-eye-blink" : ""}`}
                    animate={{
                      cy: isFormOpen ? 9 : 13,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                  {/* Right eye */}
                  <motion.circle
                    cx="21"
                    r="2.5"
                    className={`fill-white stroke-none ${!isFormOpen ? "animate-chatbot-eye-blink" : ""}`}
                    animate={{
                      cy: isFormOpen ? 9 : 13,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                  {/* Smiling mouth (self-drawing stroke animation) */}
                  <motion.path
                    d="M 10,18 C 12,22 20,22 22,18"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuoteChatWidget;
