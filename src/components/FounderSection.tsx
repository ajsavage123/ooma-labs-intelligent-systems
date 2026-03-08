import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Twitter, Mail } from "lucide-react";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 relative overflow-hidden" ref={ref}>
      {/* Decorative vertical line */}
      <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left — label + visual */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="counter-label text-primary font-bold mb-12 block tracking-[0.4em]">The Visionary</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative group"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 glass border-primary/20 rounded-[3rem] flex items-center justify-center overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                <span className="font-serif text-7xl md:text-9xl text-primary/40 relative z-10 select-none group-hover:scale-110 transition-transform duration-700">AN</span>
              </div>
              
              {/* Floating Socials */}
              <div className="absolute -bottom-4 -right-4 flex flex-col gap-2">
                {[Linkedin, Twitter, Mail].map((Icon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="w-10 h-10 glass border-white/10 rounded-xl flex items-center justify-center text-foreground/60 hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — info */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 relative"
            >
              <div className="absolute top-10 right-10 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 4.44772 14.4647 4 15.017 4H21.017C21.5693 4 22.017 4.44772 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C8.55228 16 9 15.5523 9 15V9C9 8.44772 8.55228 8 8 8H5C3.89543 8 3 7.10457 3 6V5C3 4.44772 3.44772 4 4 4H10C10.5523 4 11 4.44772 11 5V15C11 18.3137 8.31371 21 5 21H3Z" />
                </svg>
              </div>

              <h3 className="font-serif text-5xl md:text-7xl tracking-tighter text-gradient mb-8">
                Ajay Narava
              </h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-primary/40" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Chief Strategist</span>
              </div>

              <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-body mb-8 italic">
                "We don't just build software. We engineer the invisible threads that hold complex operations together during the most critical moments."
              </p>
              
              <p className="text-sm text-foreground/50 leading-relaxed font-body">
                Ajay is focused on building technology platforms that bridge the gap between chaotic real-world processes and structured digital intelligence. Under his leadership, Ooma Labs is evolving into a multi-industry ecosystem of coordination.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
