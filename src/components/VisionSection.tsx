import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Users, Activity, Rocket } from "lucide-react";

const sectors = [
  { icon: Globe, label: "Global Impact", desc: "Scaling solutions far beyond local constraints.", color: "text-[#4285F4]" },
  { icon: Users, label: "Human Centric", desc: "Technology designed for real-world field practitioners.", color: "text-[#EA4335]" },
  { icon: Activity, label: "Informed Response", desc: "Data-driven decisions during critical operations.", color: "text-[#FBBC05]" },
  { icon: Rocket, label: "Infinite Innovation", desc: "A continuous flow of purposeful tech builds.", color: "text-[#34A853]" }
];

const VisionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="vision" className="py-16 md:py-48 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-[#0a0a0a] border-y border-white/5 skew-y-6 -translate-y-1/2 z-0" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="mb-8"
            >
              <span className="badge-google !bg-[#FBBC05]/10 !text-[#FBBC05] !border-[#FBBC05]/20">
                Our Vision
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-responsive-h2 font-bold text-white mb-8 sm:mb-10 sm:leading-[0.85] font-display"
            >
              Infinite{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient-google">Potential</span> for{" "}
              <br className="hidden sm:block" />
              <span className="text-white">Real</span> Change.
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl mx-auto lg:mx-0 text-white/60 leading-relaxed max-w-lg mb-12 font-medium"
            >
              Ooma Labs transcends boundaries. We are architecting a global network of platforms where precise field-level coordination meets human-centric execution.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8 relative">
             <div className="absolute inset-0 bg-[#4285F4]/10 blur-[120px] pointer-events-none rounded-full scale-150" />
             {sectors.map((sector, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={isInView ? { opacity: 1, y: 0 } : {}}
                 transition={{ delay: 0.3 + i * 0.1 }}
                 className="bg-[#050505] p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center group hover:scale-105 hover:border-white/20 transition-all duration-500"
               >
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-white/10 transition-colors">
                    <sector.icon className={`w-6 h-6 md:w-7 md:h-7 ${sector.color} transition-colors`} />
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 font-display">{sector.label}</h3>
                 <p className="text-white/60 text-xs md:text-sm leading-relaxed">{sector.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
