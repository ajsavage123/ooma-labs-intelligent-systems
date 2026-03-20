import { motion } from "framer-motion";
import { Search, PenTool, GitPullRequest, FastForward } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery Phase",
    desc: "We dive deep into real-world scenarios to identify operational friction points and missing links.",
    color: "bg-[#4285F4]/10 text-[#4285F4]",
    hoverColor: "hover:border-[#4285F4]/30"
  },
  {
    icon: PenTool,
    title: "Ideate & Architect",
    desc: "Collaborative design of custom technology solutions that target specifically the identified gaps.",
    color: "bg-[#EA4335]/10 text-[#EA4335]",
    hoverColor: "hover:border-[#EA4335]/30"
  },
  {
    icon: FastForward,
    title: "Rapid Prototyping",
    desc: "Fast deployment of high-fidelity functional prototypes focused on effectiveness over complexity.",
    color: "bg-[#FBBC05]/10 text-[#FBBC05]",
    hoverColor: "hover:border-[#FBBC05]/30"
  },
  {
    icon: GitPullRequest,
    title: "Iterative Refinement",
    desc: "Constant refinement of solutions based on feedback from the field and stakeholders.",
    color: "bg-[#34A853]/10 text-[#34A853]",
    hoverColor: "hover:border-[#34A853]/30"
  }
];

const InnovationSection = () => {
  return (
    <section id="innovation" className="py-16 md:py-32 bg-[#050505] relative overflow-hidden stitch-grid">
      <div className="absolute inset-0 bg-[#050505]/90 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="badge-google">
              How We Build
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-responsive-h2 font-bold text-white mb-8 font-display"
          >
            A systematic <span className="text-[#4285F4]">process</span> 
            <br className="hidden sm:block" /> to solve <span className="text-[#EA4335]">hard</span> problems.
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-responsive-body text-white/60 leading-relaxed max-w-2xl mx-auto"
          >
            Ooma Labs doesn't just build apps; we architect targeted interventions for critical operations.
          </motion.p>
        </div>

        {/* Dynamic Mobile View (Horizontal Scroll) */}
        <div>
          <div className="carousel-container pb-8 xl:grid xl:grid-cols-4 xl:gap-8 xl:pb-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`carousel-item bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] flex flex-col items-center text-center group transition-all hover:scale-[1.03] ${step.hoverColor} border border-white/10 shadow-2xl`}
              >
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-display">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                
                <div className="mt-8 text-[10px] font-bold tracking-widest uppercase text-white/20">
                   Phase 0{i+1}
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
