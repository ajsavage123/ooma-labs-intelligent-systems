import { motion } from "framer-motion";

const techStack = [
  { name: "JavaScript", color: "text-[#F7DF1E]" },
  { name: "React.js", color: "text-[#61DAFB]" },
  { name: "Next.js", color: "text-white" },
  { name: "Tailwind CSS", color: "text-[#06B6D4]" },
  { name: "MongoDB", color: "text-[#47A248]" },
  { name: "PostgreSQL", color: "text-[#336791]" },
  { name: "MySQL", color: "text-[#4479A1]" },
  { name: "GitHub", color: "text-white" },
  { name: "LangChain", color: "text-[#FBBC05]" },
  { name: "Python", color: "text-[#3776AB]" },
  { name: "n8n", color: "text-[#FF6D5A]" },
  { name: "Zapier", color: "text-[#FF4F00]" },
  { name: "Make", color: "text-[#8123FF]" },
];

const TechStackBanner = () => {
  return (
    <div className="py-12 bg-[#050505] border-y border-white/5 overflow-hidden relative group">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-16 md:gap-24 items-center pl-16 md:pl-24"
        >
          {/* Duplicate for infinite loop */}
          {[...techStack, ...techStack].map((tech, i) => (
            <div key={i} className="flex items-center gap-4 group/tech">
              <div className={`text-2xl md:text-3xl font-black tracking-tighter transition-all duration-300 group-hover/tech:scale-110 ${tech.color} opacity-40 group-hover/tech:opacity-100`}>
                {tech.name}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
    </div>
  );
};

export default TechStackBanner;
