import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-accent mb-6"
        >
          Founder
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-12 md:p-16 max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-8 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground font-display">AN</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display">Ajay Narava</h3>
          <p className="text-sm uppercase tracking-[0.2em] text-accent mb-6">Founder, Ooma Labs</p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Focused on building technology platforms that improve real-world coordination and response systems. Driven by the belief that intelligent systems can solve the most critical operational challenges across industries.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
