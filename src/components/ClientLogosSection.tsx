import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const clients = [
  { name: "MedConnect", color: "text-[#4285F4]" },
  { name: "QuickServ", color: "text-[#34A853]" },
  { name: "NexaBridge", color: "text-[#EA4335]" },
  { name: "Bloom Digital", color: "text-[#FBBC05]" },
  { name: "UrbanNest", color: "text-[#4285F4]" },
  { name: "FreshBasket", color: "text-[#34A853]" },
  { name: "TechVault", color: "text-[#EA4335]" },
  { name: "Rakshith 360", color: "text-[#FBBC05]" },
];

const ClientLogosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-14 md:py-16 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-[10px] tracking-[0.4em] uppercase text-white/20 font-bold mb-10"
        >
          Trusted By Forward-Thinking Businesses
        </motion.p>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 md:gap-20 items-center whitespace-nowrap"
          >
            {[...clients, ...clients].map((client, i) => (
              <div
                key={i}
                className="flex items-center gap-3 group/client"
              >
                {/* Abstract logo shape */}
                <div className={`w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 group-hover/client:bg-white/10 transition-colors`}>
                  <span className={`text-sm font-black ${client.color}`}>
                    {client.name.charAt(0)}
                  </span>
                </div>
                <span className={`text-lg md:text-xl font-bold tracking-tight transition-all duration-300 opacity-30 group-hover/client:opacity-80 text-white`}>
                  {client.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
