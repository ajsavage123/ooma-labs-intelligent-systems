import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import rakshith from "@/assets/rakshith.jpg";
import medexpert from "@/assets/medexpert.jpg";
import codebluer from "@/assets/codebluer.jpg";

const staticProjects = [
  {
    name: "Rakshith 360",
    tagline: "AI-DRIVEN EMERGENCY COORDINATION",
    description: "Smart Emergency Medical Assistant: An AI-driven integrated system ensuring precise coordination between ambulances and hospitals.",
    color: "text-[#EA4335]",
    border: "group-hover:border-[#EA4335]/40",
    bgHover: "group-hover:bg-[#EA4335]/5",
    image: rakshith,
    link: "https://rakshith360.vercel.app/"
  },
  {
    name: "MedExpert",
    tagline: "HEALTHCARE WORKFORCE ECOSYSTEM",
    description: "Medical Professionals & Healthcare Workforce Ecosystem connecting medical facilities with elite technical talent for critical needs.",
    color: "text-[#34A853]",
    border: "group-hover:border-[#34A853]/40",
    bgHover: "group-hover:bg-[#34A853]/5",
    image: medexpert,
    link: "https://medexpert.rf.gd/"
  },
  {
    name: "CodeBlueR",
    tagline: "PROFESSIONAL COMMUNITY PLATFORM",
    description: "A professional network for emergency response practitioners to share intelligence and expand global coordination nodes.",
    color: "text-[#4285F4]",
    border: "group-hover:border-[#4285F4]/40",
    bgHover: "group-hover:bg-[#4285F4]/5",
    image: codebluer,
    link: "https://codebluer.vercel.app/"
  },
];

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group w-full flex flex-col md:flex-row gap-6 md:gap-8 items-center rounded-[2rem] sm:rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 md:p-8 transition-all duration-500 hover:shadow-2xl ${project.border} ${project.bgHover}`}
    >
      <div className="w-full md:w-2/5 relative overflow-hidden aspect-[16/9] md:aspect-[4/3] rounded-xl sm:rounded-2xl shadow-2xl bg-[#111] border border-white/5 shrink-0 group/img">
        {project.image ? (
          <>
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 group-hover:blur-[2px] blur-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            {/* Professional Fading Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40 opacity-50" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="font-mono text-[10px] text-[#4285F4] opacity-50 mb-2">{`// strategic build`}</div>
            <div className="font-mono text-xs text-[#4285F4] font-bold">System Online</div>
          </div>
        )}
        
        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      <div className="w-full md:w-3/5 flex flex-col py-2">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3 font-display">{project.name}</h3>
        <p className={`text-[10px] sm:text-sm font-bold tracking-widest uppercase mb-4 md:mb-6 ${project.color}`}>{project.tagline}</p>
        <p className="text-white/60 text-sm sm:text-lg leading-relaxed mb-6 md:mb-8">
          {project.description}
        </p>

        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-auto align-self-start px-5 py-2.5 sm:px-6 sm:py-3 w-fit border border-white/10 rounded-xl text-white font-bold text-[10px] sm:text-sm bg-white/5 hover:bg-white/10 transition-colors uppercase tracking-widest text-center"
        >
          View Live Project
        </a>
      </div>
    </motion.div>
  );
};

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-12 md:py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-24 text-center"
        >
          <span className="badge-google mb-6 inline-block">Our Projects</span>
          <h2 className="font-display font-bold text-responsive-h2 text-white mt-4 tracking-tighter">
            Our <span className="text-[#EA4335]">Portfolio</span>.
          </h2>
          <p className="text-responsive-body text-white/50 max-w-2xl mx-auto mt-6">
            A selection of high-performance systems engineered for real-world impact.
          </p>
        </motion.div>

        {/* Vertical List View */}
        <div className="flex flex-col gap-6 md:gap-8 w-full">
          {staticProjects.map((project, i) => (
            <ProjectCard key={project.name + i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
