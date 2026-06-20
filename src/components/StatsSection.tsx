import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Briefcase, Users, Layers, Clock } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: 15,
    suffix: "+",
    label: "Projects Delivered",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
  },
  {
    icon: Users,
    value: 12,
    suffix: "+",
    label: "Happy Clients",
    color: "text-[#34A853]",
    bg: "bg-[#34A853]/10",
  },
  {
    icon: Layers,
    value: 13,
    suffix: "+",
    label: "Technologies",
    color: "text-[#FBBC05]",
    bg: "bg-[#FBBC05]/10",
  },
  {
    icon: Clock,
    value: 2,
    suffix: "+",
    label: "Years of Innovation",
    color: "text-[#EA4335]",
    bg: "bg-[#EA4335]/10",
  },
];

const AnimatedCounter = ({ target, suffix, isInView }: { target: number; suffix: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 md:py-20 bg-[#050505] relative overflow-hidden" ref={ref}>
      {/* Subtle top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4285F4]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4285F4]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 text-center group hover:border-white/20 hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <p className={`text-4xl md:text-5xl font-black font-display tracking-tighter ${stat.color} mb-3`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} isInView={isInView} />
              </p>
              <p className="text-white/40 text-xs md:text-sm font-bold tracking-[0.15em] uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
