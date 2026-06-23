import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ooma_cookie_consent");
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ooma_cookie_consent", "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const handleDecline = () => {
    localStorage.setItem("ooma_cookie_consent", "declined");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 bg-[#FBBC05]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5 text-[#FBBC05]" />
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-1">We value your privacy</p>
                <p className="text-white/40 text-xs md:text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept," you consent to our use of cookies in accordance with our{" "}
                  <a href="/privacy-policy" className="text-[#4285F4] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={handleDecline}
                className="flex-1 md:flex-none px-5 py-2.5 text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none px-5 py-2.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
