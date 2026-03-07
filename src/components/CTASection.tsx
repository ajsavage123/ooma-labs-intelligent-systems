import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 section-padding relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-15 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, hsl(220 70% 55%), transparent 70%)" }} />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-10 font-display"
        >
          Building the Future of
          <br />
          <span className="gradient-text">Intelligent Systems</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#products" className="btn-primary-glow text-base tracking-wide">
            Explore Products
          </a>
          <a href="#innovation" className="btn-outline-glow text-base tracking-wide">
            Connect with Ooma Labs
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
