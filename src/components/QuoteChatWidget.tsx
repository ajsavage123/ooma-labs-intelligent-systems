import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
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
  const [mood, setMood] = useState<"happy" | "sad">("happy");
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

  const [bizType, setBizType] = useState("");
  const [service, setService] = useState("");
  const [errs, setErrs]       = useState<Record<string, string>>({});
  const [showBubble, setShowBubble] = useState(true);
  const sadTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (sadTimeoutRef.current) clearTimeout(sadTimeoutRef.current);
    };
  }, []);

  /* Track mouse position for robot head look-around effect using Framer Motion values to bypass React render cycles */
  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headSpringX = useSpring(headX, { stiffness: 120, damping: 14 });
  const headSpringY = useSpring(headY, { stiffness: 120, damping: 14 });

  const widgetCenterRef = useRef({ x: 0, y: 0 });

  const updateWidgetCenter = useCallback(() => {
    const widgetEl = document.getElementById("ooma-chatbot-bubble");
    if (widgetEl) {
      const rect = widgetEl.getBoundingClientRect();
      widgetCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }, []);

  // Update center position on mount, state changes, and resize
  useEffect(() => {
    const t = setTimeout(updateWidgetCenter, 100);
    window.addEventListener("resize", updateWidgetCenter);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateWidgetCenter);
    };
  }, [widgetState, updateWidgetCenter]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (widgetCenterRef.current.x === 0) {
        updateWidgetCenter();
        if (widgetCenterRef.current.x === 0) return;
      }

      const dx = e.clientX - widgetCenterRef.current.x;
      const dy = e.clientY - widgetCenterRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      const maxOffset = 2.5; // Subtle offset for head tracking
      const scale = Math.min(distance / 300, 1) * maxOffset;
      const offsetX = (dx / distance) * scale;
      const offsetY = (dy / distance) * scale;

      headX.set(offsetX);
      headY.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [updateWidgetCenter, headX, headY]);

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
    setMood("sad");
    setShowBubble(true);
    if (sadTimeoutRef.current) clearTimeout(sadTimeoutRef.current);
    sadTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
      setMood("happy");
    }, 5000);

    // Bounces exactly when the shrinking centered card overlaps the bubble
    setTimeout(() => {
      triggerJump();
    }, 400);
  }, []);

  const openChat  = useCallback(() => {
    setWidgetState("chat");
    setHasUnread(false);
    setMood("happy");
    if (sadTimeoutRef.current) {
      clearTimeout(sadTimeoutRef.current);
      sadTimeoutRef.current = null;
    }
  }, []);

  const closeChat = useCallback(() => {
    setWidgetState("bubble");
    setMood("sad");
    setShowBubble(true);
    if (sadTimeoutRef.current) clearTimeout(sadTimeoutRef.current);
    sadTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
      setMood("happy");
    }, 5000);
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
    setMood("happy");
    setShowBubble(false);
    if (sadTimeoutRef.current) {
      clearTimeout(sadTimeoutRef.current);
      sadTimeoutRef.current = null;
    }
    setTimeout(() => {
      triggerJump();
    }, 400);
  }, [bizType, service]);

  const isDesktop = windowSize.width >= 1024;
  const bubbleRadius = isDesktop ? 32 : 24; // 64px on desktop, 48px on mobile
  
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
              id="ooma-chatbot-bubble"
              onClick={openChat}
              aria-label="Open quotation chat"
              className="relative group outline-none cursor-pointer"
            >
              {/* Interactive Speech Tag above the bubble */}
              <AnimatePresence>
                {widgetState === "bubble" && !shouldJump && showBubble && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 10 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute bottom-full mb-3 right-0 bg-white text-black font-display font-black text-[10px] sm:text-[12px] px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 select-none whitespace-nowrap"
                    style={{
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>
                      {mood === "happy" 
                        ? "Hi! I'm Ooma AI." 
                        : "I told you it's free... don't leave me! 🥺"}
                    </span>
                    {mood === "happy" && (
                      <span className="inline-block animate-chatbot-wiggle text-xs sm:text-sm">
                        👋
                      </span>
                    )}
                    <div className="absolute -bottom-1 right-7 sm:right-8 w-2 h-2 bg-white rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pulse ring */}
              {widgetState !== "chat" && (
                <div
                  className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full pointer-events-none animate-chatbot-pulse"
                  style={{ background: "rgba(229,57,53,0.25)" }}
                />
              )}

              {/* Bubble icon — Transparent background so only the robot floats */}
              <motion.div
                animate={shouldJump ? { y: [0, -32, 0, -16, 0, -6, 0] } : {}}
                transition={shouldJump ? { duration: 1.0, ease: "easeInOut" } : {}}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center ${
                  !shouldJump && widgetState !== "chat" ? "animate-chatbot-float" : ""
                }`}
                style={{
                  background: "transparent",
                  border: "none",
                }}
              >
                {/* Custom Animated Red Robot (Matches attached spec image) */}
                <svg viewBox="0 0 32 32" className="w-full h-full text-white fill-none" style={{ strokeLinecap: "round" }}>
                  {/* Left resting arm */}
                  <path
                    d="M 10,22 Q 6.5,25 7.5,28"
                    stroke="#D32F2F"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="7.5" cy="28" r="1.3" fill="#212121" />

                  {/* Right waving arm (waves exactly once on page load) */}
                  <motion.g
                    style={{ transformOrigin: "22px 22px" }}
                    animate={{ rotate: [0, -15, 10, -15, 10, 0] }}
                    transition={{ delay: 1.2, duration: 1.8, ease: "easeInOut" }}
                  >
                    <path
                      d="M 22,22 Q 25,19.5 27,15"
                      stroke="#D32F2F"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="27" cy="15" r="1.5" fill="#212121" />
                    {/* Waving fingers */}
                    <path d="M 27,15 L 26,12" stroke="#212121" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M 27,15 L 28.5,12.5" stroke="#212121" strokeWidth="0.8" strokeLinecap="round" />
                    <path d="M 27,15 L 29.5,14.5" stroke="#212121" strokeWidth="0.8" strokeLinecap="round" />
                  </motion.g>

                  {/* Body Torso */}
                  <path
                    d="M 10.5,21.5 C 10.5,20.5 21.5,20.5 21.5,21.5 L 19.5,28.5 C 19.5,29.5 12.5,29.5 12.5,28.5 Z"
                    fill="#E53935"
                    stroke="#b71c1c"
                    strokeWidth="0.5"
                  />
                  {/* Hexagon Chest Badge */}
                  <path
                    d="M 16,23 L 18,24 L 18,26 L 16,27 L 14,26 L 14,24 Z"
                    stroke="white"
                    strokeWidth="0.8"
                    fill="none"
                  />

                  {/* Head group (follows mouse) */}
                  <motion.g
                    style={{ x: headSpringX, y: headSpringY }}
                  >
                    {/* Neck connector */}
                    <rect x="14" y="19" width="4" height="2.5" fill="#212121" rx="0.5" />

                    {/* Left ear bracket */}
                    <rect x="1" y="6.5" width="3.5" height="9" rx="1.5" fill="#D32F2F" />
                    {/* Right ear bracket */}
                    <rect x="27.5" y="6.5" width="3.5" height="9" rx="1.5" fill="#D32F2F" />

                    {/* Head base */}
                    <rect x="4" y="2.5" width="24" height="17" rx="3.5" fill="#E53935" stroke="#b71c1c" strokeWidth="0.75" />

                    {/* Visor Screen */}
                    <rect x="6.5" y="5" width="19" height="12" rx="2" fill="#121212" stroke="#424242" strokeWidth="0.5" />

                    {/* Left eye */}
                    <motion.circle
                      cx="11.5"
                      fill="white"
                      style={{ transformOrigin: "11.5px 10.5px" }}
                      animate={{
                        cy: isFormOpen ? 8.5 : 10.5,
                        r: 1.8,
                        scaleY: [1, 1, 1, 0.1, 1, 1],
                      }}
                      transition={{
                        cy: { type: "spring", stiffness: 200, damping: 15 },
                        scaleY: {
                          repeat: Infinity,
                          duration: 4.5,
                          times: [0, 0.9, 0.92, 0.94, 0.96, 1],
                          ease: "easeInOut"
                        }
                      }}
                    />

                    {/* Right eye */}
                    <motion.circle
                      cx="20.5"
                      fill="white"
                      style={{ transformOrigin: "20.5px 10.5px" }}
                      animate={{
                        cy: isFormOpen ? 8.5 : 10.5,
                        r: 1.8,
                        scaleY: [1, 1, 1, 0.1, 1, 1],
                      }}
                      transition={{
                        cy: { type: "spring", stiffness: 200, damping: 15 },
                        scaleY: {
                          repeat: Infinity,
                          duration: 4.5,
                          times: [0, 0.9, 0.92, 0.94, 0.96, 1],
                          ease: "easeInOut"
                        }
                      }}
                    />

                    {/* Smiling/Sad mouth */}
                    <motion.path
                      animate={{
                        d: mood === "happy" 
                          ? "M 14,13.5 Q 16,15.0 18,13.5" 
                          : "M 14,15.5 Q 16,13.8 18,15.5"
                      }}
                      transition={{ type: "spring", stiffness: 150, damping: 12 }}
                      stroke="white"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </motion.g>
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
