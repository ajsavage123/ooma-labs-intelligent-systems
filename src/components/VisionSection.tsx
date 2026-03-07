import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 section-padding relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
          style={{ background: "radial-gradient(circle, hsl(200 100% 60%), transparent 70%)" }} />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-accent mb-6"
        >
          Our Vision
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-10 font-display"
        >
          Beyond One
          <br />
          <span className="gradient-text">Industry</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Ooma Labs is not limited to healthcare. We aim to develop technology solutions across multiple sectors including emergency systems, logistics coordination, intelligent platforms, and future innovations yet to be imagined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {["Emergency Systems", "Logistics Coordination", "Intelligent Platforms", "Future Innovations"].map((item) => (
            <span key={item} className="glass-card px-6 py-3 text-sm text-muted-foreground tracking-wide">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
