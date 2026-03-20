import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface CTASectionProps {
  onOpenPartner: () => void;
}

const CTASection = ({ onOpenPartner }: CTASectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="connect" className="py-16 md:py-48 bg-[#050505] relative overflow-hidden" ref={ref}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#34A853]/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 stitch-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
          <div className="max-w-4xl text-center lg:text-left w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="mb-10"
            >
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-4 w-full">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                 <span className="text-xs tracking-widest uppercase text-[#34A853] font-bold">The Ooma Horizon</span>
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-responsive-h1 font-bold tracking-tighter sm:leading-[0.8] text-white font-display"
            >
              Build the{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-google">Future</span>{" "}
              <br className="hidden sm:block" />
              with us.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col gap-8 bg-[#0a0a0a] border border-white/10 p-10 md:p-12 rounded-[3.5rem] shadow-2xl transition-all duration-500 hover:border-white/20 w-full lg:w-auto mx-auto lg:mx-0"
          >
            <p className="text-xl text-white/60 max-w-sm font-medium leading-relaxed text-center lg:text-left">
              Join OOMA LABS to co-create solutions for the world's most critical operational gaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
              <button 
                onClick={onOpenPartner}
                className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#4285F4] text-white font-bold text-sm tracking-widest uppercase rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(66,133,244,0.3)]"
              >
                <span className="relative z-10">Join as Partner</span>
                <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <a href="mailto:hello@oomalabs.com" className="inline-flex w-full sm:w-auto items-center justify-center px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-full transition-all hover:bg-white/5 hover:scale-105 active:scale-95 hover:border-white/40">
                Contact
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#34A853]/30 to-transparent" />
    </section>
  );
};

export default CTASection;
