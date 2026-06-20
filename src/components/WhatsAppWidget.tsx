import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppWidget = () => {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.4, type: "spring" }}
      href="https://wa.me/919492827058?text=Hi,%20I%20heard%20about%20your%20services%20and%20want%20to%20know%20more."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <div className="absolute inset-0 w-14 h-14 bg-[#25D366] rounded-full animate-ping opacity-20" />

        {/* Button */}
        <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all active:scale-90 group-hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-white text-[#050505] px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none">
        Chat with us!
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white rotate-45" />
      </div>
    </motion.a>
  );
};

export default WhatsAppWidget;
