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
    <section id="connect" className="py-16 md:py-24 px-6 md:px-10 relative overflow-hidden" ref={ref}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-40" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)", backgroundSize: "100px 100px" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="counter-label text-primary font-bold tracking-[0.4em]">The New Paradigm</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
              className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] text-gradient"
            >
              Architecting<br />
              the <em className="text-primary italic">Intelligence</em><br />
              Era
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col gap-6"
          >
            <p className="text-base text-foreground/60 max-w-xs font-body leading-relaxed">
              Join Ooma Labs and access Ooma workspace in defining the future of high-impact technology systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onOpenPartner}
                className="btn-solid rounded-full glass border-primary/20"
              >
                Join as Partner <ArrowUpRight className="w-4 h-4" />
              </button>
              <a href="mailto:hello@oomalabs.com" className="btn-ghost rounded-full glass">
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default CTASection;
