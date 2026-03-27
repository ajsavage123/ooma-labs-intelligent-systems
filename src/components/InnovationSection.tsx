import { motion } from "framer-motion";
import { Search, PenTool, GitPullRequest, FastForward } from "lucide-react";
import { Suspense } from "react";
import InnovationThreeDBackground from "@/components/InnovationThreeDBackground";

const steps = [
  {
    icon: Search,
    phase: "Discovery Phase",
    title: "Discovery Phase",
    desc: "We dive deep into real-world scenarios to identify operational friction points and missing links.",
    color: "bg-[#4285F4]/10 text-[#4285F4]",
    hoverColor: "hover:border-[#4285F4]/30"
  },
  {
    icon: PenTool,
    phase: "Phase 01",
    title: "Ideate & Architect",
    desc: "Collaborative design of custom technology solutions that target specifically the identified gaps.",
    color: "bg-[#EA4335]/10 text-[#EA4335]",
    hoverColor: "hover:border-[#EA4335]/30"
  },
  {
    icon: FastForward,
    phase: "Phase 02",
    title: "Rapid Prototyping",
    desc: "Fast deployment of high-fidelity functional prototypes focused on effectiveness over complexity.",
    color: "bg-[#FBBC05]/10 text-[#FBBC05]",
    hoverColor: "hover:border-[#FBBC05]/30"
  },
  {
    icon: GitPullRequest,
    phase: "Phase 03",
    title: "Iterative Refinement",
    desc: "Constant refinement of solutions based on feedback from the field and stakeholders.",
    color: "bg-[#34A853]/10 text-[#34A853]",
    hoverColor: "hover:border-[#34A853]/30"
  }
];

const InnovationSection = () => {
  return (
    <section id="innovation" className="py-24 bg-[#050505] relative overflow-hidden stitch-grid">
      <Suspense fallback={null}>
        <InnovationThreeDBackground />
      </Suspense>
      <div className="absolute inset-0 bg-[#050505]/95 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-responsive-h2 font-black text-white mb-8 font-display tracking-tight"
          >
            A systematic process <br className="hidden sm:block" />
            to solve <span className="text-gradient-google">hard problems.</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-xl md:text-2xl text-white/70 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Ooma Labs doesn't just build apps; we architect targeted interventions for critical operations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`bg-[#0a0a0a] p-8 md:p-10 rounded-[3rem] border border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden shadow-2xl`}
            >
              <div className="relative z-10">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 block mb-8">
                   {step.phase}
                </span>
                
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-6 font-display tracking-tight">{step.title}</h3>
                <p className="text-white/50 text-base leading-relaxed font-medium">{step.desc}</p>
              </div>
              
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
