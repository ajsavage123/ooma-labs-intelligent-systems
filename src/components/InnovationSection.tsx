import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const areas = [
  { num: "I", title: "AI Decision Systems", desc: "Intelligent algorithms analyzing complex data for critical real-time decisions." },
  { num: "II", title: "Emergency Coordination", desc: "Orchestrating rapid response across multiple stakeholders and systems." },
  { num: "III", title: "Digital Infrastructure", desc: "Robust platforms built for reliability, scale, and seamless integration." },
  { num: "IV", title: "Scalable Data Systems", desc: "Data architectures designed to handle complexity and grow with demand." },
];

const InnovationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="innovation" className="py-32 md:py-40 section-padding" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — headline */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="counter-label mb-6 block"
            >
              Innovation
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]"
            >
              Building Systems
              That Solve <em className="text-primary">Real World</em> Problems
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="line-accent mt-8 max-w-[200px]"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm text-muted-foreground leading-relaxed mt-6 max-w-sm font-body"
            >
              Developing intelligent platforms and infrastructure that improve coordination, decision-making, and operational efficiency in complex environments.
            </motion.p>
          </div>

          {/* Right — cards */}
          <div className="lg:col-span-7 space-y-4">
            {areas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                className="editorial-card p-8 md:p-10 group cursor-default"
              >
                <div className="flex items-start gap-6 md:gap-10">
                  <span className="font-serif text-3xl text-primary/30 group-hover:text-primary/60 transition-colors duration-700 shrink-0 pt-1">
                    {area.num}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-3 group-hover:text-primary transition-colors duration-700">
                      {area.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-body">{area.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
