import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const sectors = ["Emergency Systems", "Logistics Coordination", "Intelligent Platforms", "Future Innovations"];

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" className="py-32 md:py-44 section-padding relative overflow-hidden" ref={ref}>
      {/* Ambient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-border/40" />

      <div className="max-w-[1400px] mx-auto text-center relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="counter-label mb-8 block"
        >
          Vision
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-[10rem] tracking-tight leading-[0.85]"
        >
          Beyond<br />
          <em className="text-primary">One</em> Industry
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mt-12 font-body"
        >
          Ooma Labs is not limited to healthcare. We develop technology solutions across multiple sectors — emergency systems, logistics coordination, intelligent platforms, and innovations yet to be imagined.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap justify-center gap-px mt-16"
        >
          {sectors.map((item, i) => (
            <span
              key={item}
              className="border border-border px-6 py-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-500"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
