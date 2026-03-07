import { motion } from "framer-motion";
import logo from "@/assets/ooma-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pb-20 md:pb-32">
      {/* Geometric line accents */}
      <div className="absolute top-0 left-12 md:left-20 w-px h-full bg-gradient-to-b from-transparent via-border/40 to-transparent" />
      <div className="absolute top-0 right-12 md:right-20 w-px h-full bg-gradient-to-b from-transparent via-border/40 to-transparent" />

      {/* Subtle warm glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(38 90% 55%), transparent 70%)" }} />

      <div className="relative z-10 section-padding max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mb-12"
        >
          <img src={logo} alt="Ooma Labs" className="w-10 h-10 invert opacity-60" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0, 1] }}
              className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.9] tracking-tight text-foreground"
            >
              Designing<br />
              Technology<br />
              That <em className="text-primary">Solves</em>
            </motion.h1>
          </div>

          <div className="lg:col-span-4 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="line-accent mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed font-body mb-8 max-w-sm">
                Ooma Labs builds intelligent platforms that solve critical operational problems using technology, data systems, and AI-driven coordination.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#products" className="btn-solid">Explore</a>
                <a href="#innovation" className="btn-ghost">Discover</a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom counter bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 pt-6 border-t border-border/30 flex items-center justify-between"
        >
          <div className="flex gap-12">
            {[
              { num: "03", label: "Products" },
              { num: "04", label: "Innovation Areas" },
              { num: "∞", label: "Possibilities" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-serif text-2xl text-primary">{stat.num}</span>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-muted-foreground text-xs tracking-[0.3em] uppercase hidden md:block"
          >
            Scroll ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
