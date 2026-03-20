import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Shield, Code } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden stitch-grid bg-[#050505]">
      {/* Decorative blobs for "Stitch" vibe with smooth animation */}
      <motion.div 
        animate={{ 
          x: [0, -50, 0, 50, 0],
          y: [0, 50, 0, -50, 0],
          scale: [1, 1.1, 1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4285F4]/15 blur-[120px] rounded-full -mr-48 -mt-24 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, 50, 0, -50, 0],
          y: [0, -50, 0, 50, 0],
          scale: [1, 1.2, 1, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#EA4335]/10 blur-[100px] rounded-full -ml-40 -mb-20 pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="badge-google">
              Technology Solutions for the Real World
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-responsive-h1 font-bold text-white mb-8 font-display"
          >
            Solving <span className="text-[#4285F4]">real-world</span> challenges
            <br className="hidden sm:block" />{" "}
            through <span className="text-gradient-google">purposeful</span> tech.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-responsive-body text-white/60 mb-10 max-w-2xl mx-auto"
          >
            Ooma Labs identifies efficiency gaps in complex scenarios and builds targeted technological innovations to bridge them. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0"
          >
            <button className="btn-google-blue flex items-center justify-center gap-2 group shadow-md w-full sm:w-auto">
              Explore Our Solutions
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="btn-google-outline w-full sm:w-auto">
              Learn Our Process
            </button>
          </motion.div>
        </div>

        {/* Dynamic Mobile View (Horizontal Scroll) */}
        <div className="mt-20 sm:mt-24">
          <div className="carousel-container pb-8 md:grid md:grid-cols-3 md:gap-8 md:pb-0">
             {[
               { icon: Lightbulb, color: 'text-[#FBBC05]', bg: 'bg-[#FBBC05]/10', border: 'hover:border-[#FBBC05]/40', title: 'Problem Discovery', desc: 'We pinpoint friction points in real-world workflows that others overlook.' },
               { icon: Shield, color: 'text-[#34A853]', bg: 'bg-[#34A853]/10', border: 'hover:border-[#34A853]/40', title: 'Reliable Prototyping', desc: 'Functional solutions built with security and field-level performance in mind.' },
               { icon: Code, color: 'text-[#4285F4]', bg: 'bg-[#4285F4]/10', border: 'hover:border-[#4285F4]/40', title: 'Precision Build', desc: 'Rapidly turning innovative concepts into deployed platforms.' }
             ].map((feature, i) => (
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
