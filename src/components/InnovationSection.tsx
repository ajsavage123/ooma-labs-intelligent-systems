import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Zap, Database, Globe } from "lucide-react";

const areas = [
  { num: "01", title: "AI Decision Systems", desc: "Intelligent algorithms designed at the Ooma core, analyzing complex data for critical real-time decisions.", icon: Cpu },
  { num: "02", title: "Emergency Coordination", desc: "Orchestrating rapid response across multiple stakeholders and systems within our ecosystem.", icon: Zap },
  { num: "03", title: "Digital Infrastructure", desc: "Robust platforms built for reliability, scale, and seamless integration across sub-companies.", icon: Globe },
  { num: "04", title: "Scalable Data Systems", desc: "Data architectures designed to handle complexity and grow with the Ooma Labs demand.", icon: Database },
];

const InnovationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="innovation" className="py-16 md:py-24 px-6 md:px-10 relative overflow-hidden" ref={ref}>
      {/* Background Decorative element */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left — headline */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="counter-label mb-6 block text-primary font-bold">The Ooma Advantage</span>
              <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[0.95] text-gradient mb-8">
                Innovating the<br />
                Core of <br />
                <em className="text-primary italic">Intelligence</em>
              </h2>
              <div className="w-px h-24 bg-gradient-to-b from-primary/60 to-transparent mb-8 ml-1" />
              <p className="text-base text-foreground/70 leading-relaxed max-w-sm font-body">
                We develop the central intelligence that powers our entire ecosystem, ensuring every product benefits from shared data insights and AI excellence.
              </p>
            </motion.div>
          </div>

          {/* Right — cards */}
          <div className="lg:col-span-7 space-y-6">
            {areas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                className="editorial-card p-10 group cursor-default glass hover:border-primary/40 rounded-3xl glow-border"
              >
                <div className="flex items-start gap-8">
                  <div className="w-14 h-14 rounded-2xl glass border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[10px] tracking-[0.2em] uppercase text-primary font-mono">{area.num}</span>
                       <div className="h-px w-6 bg-primary/20" />
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4 group-hover:text-primary transition-colors duration-500">
                      {area.title}
                    </h3>
                    <p className="text-base text-foreground/60 leading-relaxed font-body">{area.desc}</p>
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
