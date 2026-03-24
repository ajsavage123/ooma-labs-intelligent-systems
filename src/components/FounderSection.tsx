import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Twitter, Mail, Plus } from "lucide-react";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-40 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#EA4335]/15 blur-[150px] rounded-full -mt-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left — Visual */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <span className="badge-google !bg-[#EA4335]/10 !text-[#EA4335] !border-[#EA4335]/20">The Visionary Strategist</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative group w-full max-w-sm mx-auto lg:mx-0"
            >
              {/* Professional Box substituting standard image block */}
              <div className="aspect-[16/9] sm:aspect-[4/5] bg-gradient-to-tr from-[#111] to-[#0a0a0a] border border-white/10 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center overflow-hidden transition-all duration-700 shadow-xl group-hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4]/10 to-transparent flex items-center justify-center">
                  <span className="font-display text-7xl sm:text-9xl text-white/5 font-bold select-none group-hover:scale-110 group-hover:text-[#4285F4]/10 transition-all duration-1000">AN</span>
                </div>

                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 right-8 text-left z-20">
                  <div className="w-10 sm:w-12 h-[2px] bg-[#EA4335] mb-2 sm:mb-4"></div>
                  <p className="text-white/40 font-mono text-[10px] sm:text-xs tracking-widest uppercase">Executing Operations</p>
                </div>
                <Plus className="absolute top-6 right-6 sm:top-8 sm:right-8 w-6 h-6 sm:w-8 sm:h-8 text-[#4285F4] opacity-30 animate-pulse" />
              </div>

              {/* Floating Socials */}
              <div className="absolute -bottom-6 -right-2 lg:-right-6 flex flex-row lg:flex-col gap-3 z-30 justify-center">
                {[Linkedin, Twitter, Mail].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                    className="w-12 h-12 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer shadow-lg"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — info */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 md:p-16 rounded-[3rem] sm:rounded-[4rem] relative overflow-hidden text-center lg:text-left shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4285F4]/10 blur-[100px] rounded-full pointer-events-none" />

              <h3 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4 font-display">
                Ajay Narava
              </h3>
              
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 sm:mb-10">
                <div className="h-[2px] w-10 bg-[#EA4335]" />
                <span className="text-[10px] sm:text-xs tracking-widest uppercase text-[#EA4335] font-bold">Founder & Lead Architect</span>
              </div>

              <p className="text-responsive-h3 text-white leading-relaxed font-display font-semibold italic mb-8 border-l-0 lg:border-l-4 border-l-[#4285F4]/40 lg:pl-8">
                "We engineer the invisible digital threads that empower modern business operations."
              </p>
              
              <p className="text-responsive-body text-white/60 leading-relaxed font-medium">
                Under Ajay's leadership, Ooma Labs has specialized in architecting targeted technological interventions for complex coordination challenges, helping startups and enterprises scale through purposeful innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
