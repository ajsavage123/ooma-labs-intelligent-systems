import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 section-padding" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left — label + visual */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="counter-label mb-8 block"
            >
              Founder
            </motion.span>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-32 h-32 md:w-40 md:h-40 border border-border flex items-center justify-center"
            >
              <span className="font-serif text-5xl md:text-6xl text-primary/40">AN</span>
            </motion.div>
          </div>

          {/* Right — info */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="font-serif text-4xl md:text-6xl tracking-tight mb-4">
                Ajay Narava
              </h3>
              <div className="line-accent max-w-[120px] mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg font-body">
                Focused on building technology platforms that improve real-world coordination and response systems. Driven by the belief that intelligent systems can solve the most critical operational challenges across industries.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
