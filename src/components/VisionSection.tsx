import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const sectors = ["Emergency Systems", "Logistics Coordination", "Intelligent Platforms", "Future Innovations"];

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" className="py-16 md:py-24 px-6 md:px-10 relative overflow-hidden" ref={ref}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full opacity-50" />
      
      {/* Ambient lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="counter-label text-primary font-bold tracking-[0.6em]">The Ooma Horizon</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-[12rem] tracking-tighter leading-[0.75] text-gradient"
        >
          Limitless<br />
          <em className="text-primary italic">Intelligence</em>
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "200px" } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mt-16"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed mt-12 font-body"
        >
          Ooma Labs transcends boundaries. We are architecting a cross-industry neural network of platforms where data coordination meets human-centric design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-4 mt-20"
        >
          {sectors.map((item, i) => (
            <motion.span
              key={item}
              whileHover={{ scale: 1.05, borderColor: "rgba(245,158,11,0.5)" }}
              className="glass border-white/5 px-8 py-4 text-[10px] tracking-[0.3em] uppercase text-foreground/70 rounded-full transition-all duration-500 cursor-default"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
