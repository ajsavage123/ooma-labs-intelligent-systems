import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Phone, Mail, ArrowUpRight } from "lucide-react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactOptions = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "9492827058",
      href: "https://wa.me/919492827058?text=Hi,%20I%20heard%20about%20your%20services%20and%20want%20to%20know%20more.",
      color: "text-[#25D366]",
      bg: "bg-[#25D366]/10"
    },
    {
      icon: Phone,
      label: "Direct Call",
      value: "9381167058",
      href: "tel:+919381167058",
      color: "text-[#4285F4]",
      bg: "bg-[#4285F4]/10"
    },
    {
      icon: Mail,
      label: "Official Gmail",
      value: "oomalabs@gmail.com",
      href: "mailto:oomalabs@gmail.com",
      color: "text-[#EA4335]",
      bg: "bg-[#EA4335]/10"
    }
  ];

  return (
    <section id="connect" className="py-24 md:py-48 bg-[#050505] relative overflow-hidden" ref={ref}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#34A853]/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 stitch-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-7xl font-bold tracking-tighter text-white font-display mb-20"
        >
          Build Your <span className="text-gradient-google">Product</span> with us.
        </motion.h2>

        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-12 md:gap-20">
          {contactOptions.map((option, i) => (
            <motion.a
              key={i}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group flex flex-col items-center gap-6 transition-all duration-300 transform"
            >
              {/* Icon Container with Floating Effect */}
              <div className={`relative w-24 h-24 md:w-32 md:h-32 ${option.bg} ${option.color} rounded-[2.5rem] flex items-center justify-center group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:-translate-y-4 transition-all duration-500`}>
                <option.icon className="w-10 h-10 md:w-14 md:h-14" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Text Layout: Highlighted Title, Subded Value */}
              <div className="flex flex-col items-center gap-1">
                <span className={`text-2xl md:text-4xl font-display font-bold text-white group-hover:${option.color} transition-colors duration-300 tracking-tight`}>
                  {option.label}
                </span>
                <span className="text-xs md:text-sm font-mono text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest letter-spacing-wider font-bold">
                  {option.value}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#34A853]/30 to-transparent" />
    </section>
  );
};

// Internal ArrowRight component for the icon container
const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default CTASection;
