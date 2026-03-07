import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Brain, Radio, Server, Database } from "lucide-react";

const areas = [
  { icon: Brain, title: "AI Decision Systems", desc: "Intelligent algorithms that analyze complex data to support critical real-time decisions." },
  { icon: Radio, title: "Emergency Coordination", desc: "Technology that orchestrates rapid response across multiple stakeholders and systems." },
  { icon: Server, title: "Digital Infrastructure", desc: "Robust platforms built for reliability, scale, and seamless integration." },
  { icon: Database, title: "Scalable Data Systems", desc: "Data architectures designed to handle complexity and grow with demand." },
];

const InnovationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="innovation" className="py-32 section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center mb-8 font-display"
        >
          Building Systems That Solve
          <br />
          <span className="gradient-text">Real World Problems</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-20 leading-relaxed"
        >
          Ooma Labs focuses on developing intelligent platforms and infrastructure that improve coordination, decision-making, and operational efficiency in complex environments.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="glass-card p-8 group hover:border-primary/30 transition-all duration-500"
            >
              <area.icon className="w-10 h-10 text-accent mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-xl font-semibold mb-3 font-display">{area.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
