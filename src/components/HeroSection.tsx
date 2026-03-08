import { motion } from "framer-motion";
import logo from "@/assets/ooma-logo.png";
import { EcosystemVisual } from "./EcosystemVisual";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden mesh-gradient noise">
      {/* Background visual element - subtle */}
      <div className="absolute top-1/2 right-0 w-1/3 h-auto opacity-20 hidden lg:block transform -translate-y-1/2">
        <EcosystemVisual />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Main content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tighter text-gradient mb-6">
              Building Infrastructure<br />of <em className="text-primary italic">Intelligence</em>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-8 max-w-lg">
              Ooma Labs powers specialized platforms through data coordination and AI to solve critical operational challenges.
            </p>
            
            {/* Stats - Horizontal */}
            <div className="flex gap-8 mb-8">
              {[
                { num: "03", label: "Products" },
                { num: "04", label: "Innovation Areas" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-serif text-3xl text-primary block">{stat.num}</span>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#products" className="btn-solid">Explore Ecosystem</a>
              <a href="#innovation" className="btn-ghost">Learn More</a>
            </div>
          </motion.div>

          {/* Right: Visual callout */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="glass p-8 rounded-2xl glow-border">
              <div className="line-accent mb-4" />
              <h3 className="text-xl font-serif mb-4 text-primary">About Ooma Labs</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                We're a parent ecosystem powering specialized platforms that bridge critical operational gaps through intelligent data coordination.
              </p>
              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-border/30">
                <div>
                  <p className="text-2xl font-serif text-primary">∞</p>
                  <p className="text-xs text-muted-foreground">Possibilities</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
