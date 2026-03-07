import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="connect" className="py-32 md:py-44 section-padding relative overflow-hidden" ref={ref}>
      {/* Subtle ambient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] max-w-4xl"
        >
          Building the Future of <em className="text-primary">Intelligent</em> Systems
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mt-14"
        >
          <a href="#products" className="btn-solid">Explore Products</a>
          <a href="#connect" className="btn-ghost">Connect with Ooma Labs</a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
