import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Shield, Code } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    color: "text-[#FBBC05]",
    bg: "bg-[#FBBC05]/10",
    border: "hover:border-[#FBBC05]/40",
    title: "Deep Discovery",
    desc: "We identify structural inefficiencies that standard solutions often miss.",
  },
  {
    icon: Code,
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
    border: "hover:border-[#4285F4]/40",
    title: "Strategic Engineering",
    desc: "Performance-critical web and mobile systems built for scale and reliability.",
  },
  {
    icon: Shield,
    color: "text-[#EA4335]",
    bg: "bg-[#EA4335]/10",
    border: "hover:border-[#EA4335]/40",
    title: "Ecosystem Resilience",
    desc: "Ensuring your digital infrastructure remains secure and future-proof.",
  },
];

const HeroSection = () => {
  return (
    <section className="hero-container relative pt-16 pb-12 md:pt-40 md:pb-24 overflow-hidden stitch-grid bg-[#050505]">
      {/* Video Background Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto opacity-80 saturate-150 contrast-110"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        >
          <source src="/Video%20Project.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-[#050505]/40" />
        {/* Left edge fade */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
      </div>

      <div className="hero-content max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 
            className="sr-only"
            aria-hidden="false"
          >
            Web Development, App Development & AI Automation for Businesses in Hyderabad — Ooma Labs
          </h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-responsive-h1 font-bold text-white mb-8 font-display reveal-text"
          >
            Engineering <span className="text-[#4285F4]">solutions</span> that bridge{" "}
            <span className="text-gradient-google">efficiency</span> gaps.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-responsive-body text-white/60 mb-10 max-w-2xl mx-auto reveal-subtext"
          >
            Ooma Labs is a strategic tech engineering firm. We architect and build
            high-performance applications or new innovative technology that solve structural
            inefficiencies for startups and enterprises.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0 reveal-buttons"
          >
            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-google-blue flex items-center justify-center gap-2 group shadow-md w-full sm:w-auto"
            >
              Explore Our Solutions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById("innovation")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-google-outline w-full sm:w-auto"
            >
              Learn Our Process
            </button>
          </motion.div>
        </div>

        {/* Feature Cards — Desktop Grid / Mobile Horizontal Scroll */}
        <div className="mt-20 sm:mt-24">
          <div className="carousel-container pb-8 md:grid md:grid-cols-3 md:gap-8 md:pb-0">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                className={`carousel-item bg-[#0a0a0a] p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-300 ${feature.border} flex flex-col items-center text-center group`}
              >
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">{feature.title}</h3>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
