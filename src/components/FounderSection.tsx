import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Instagram, Mail, Plus } from "lucide-react";
import founderImg from "@/assets/founder.jpg";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/ajay-kumar-28ab50234?utm_source=share_via&utm_content=profile&utm_medium=member_android", color: "hover:text-[#0077B5]" },
    { icon: Instagram, href: "https://www.instagram.com/aj._.savage/", color: "hover:text-[#E4405F]" },
    { icon: Mail, href: "mailto:oomalabs@gmail.com?body=hi%20i%20am%20looking%20for%20colabration%20in%20your%20company%20and%20my%20name%20is%20.....", color: "hover:text-[#EA4335]" }
  ];

  return (
    <section id="founder-section" className="py-24 md:py-40 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#EA4335]/10 blur-[150px] rounded-full -mt-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left — Visual */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative group w-full max-w-md mx-auto lg:mx-0"
            >
              {/* Professional Box with Image */}
              <div className="aspect-[4/5] bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden transition-all duration-700 shadow-2xl group-hover:border-white/20">
                <img 
                  src={founderImg} 
                  alt="Ajay Narava" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] hover:grayscale-0"
                />
                
                <div className="absolute bottom-10 left-8 right-8 text-left z-20">
                  <div className="w-12 h-[3px] bg-[#EA4335] mb-4"></div>
                  <p className="text-white/80 font-display text-xl font-bold tracking-tight">Ajay Narava</p>
                  <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase mt-1">Founding Director</p>
                </div>
                
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Socials */}
              <div className="absolute -bottom-6 -right-2 lg:-right-8 flex flex-row lg:flex-col gap-4 z-30 justify-center">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                    className={`w-14 h-14 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white ${social.color} hover:border-white/30 transition-all cursor-pointer shadow-xl`}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
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
              className="bg-[#0a0a0a] border border-white/10 p-10 sm:p-12 md:p-16 rounded-[4rem] relative overflow-hidden text-center lg:text-left shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4285F4]/5 blur-[100px] rounded-full pointer-events-none" />

              <h3 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 font-display tracking-tightest">
                Ajay Narava
              </h3>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-10 sm:mb-12">
                <div className="h-[2px] w-12 bg-[#EA4335]" />
                <span className="text-xs sm:text-sm tracking-widest uppercase text-[#EA4335] font-black">Founder & Lead Architect</span>
              </div>

              <p className="text-2xl sm:text-4xl lg:text-5xl text-white leading-[1.1] font-display font-black tracking-tight mb-8">
                "At Ooma, we engineer the invisible digital threads that empower <span className="text-gradient-google">modern operations</span>, building innovative technology that shapes the perfect solution."
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-12">
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">Currently Scaling Ooma</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
