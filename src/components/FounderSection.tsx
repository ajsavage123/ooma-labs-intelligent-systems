import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Instagram, Mail, Plus } from "lucide-react";
import founderImg from "@/assets/WhatsApp Image 2026-07-15 at 2.42.06 PM.jpeg";

const FounderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/ajay-kumar-28ab50234?utm_source=share_via&utm_content=profile&utm_medium=member_android", color: "hover:text-[#0077B5]" },
    { icon: Instagram, href: "https://www.instagram.com/aj._.savage/", color: "hover:text-[#E4405F]" },
    { icon: Mail, href: "mailto:hello@oomalabs.com?body=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20services.%20I%20am%20looking%20for%20____________%20for%20my%20business.", color: "hover:text-[#EA4335]" }
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
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
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#0a0a0a] border border-white/10 p-10 sm:p-12 md:p-16 rounded-[4rem] relative overflow-hidden text-center lg:text-left shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4285F4]/5 blur-[100px] rounded-full pointer-events-none" />

              {/* Name — letter stagger */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 font-display tracking-tightest overflow-hidden whitespace-nowrap">
                {"Ajay Narava".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + i * 0.04,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="inline-block"
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h3>
              
              {/* Title — line draws then text slides in */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-10 sm:mb-12 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                  className="h-[2px] w-12 bg-[#EA4335] origin-left"
                />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="text-xs sm:text-sm tracking-widest uppercase text-[#EA4335] font-black"
                >
                  Founder & Lead Architect
                </motion.span>
              </div>

              {/* Quote — word-by-word cascade */}
              <p className="text-2xl sm:text-4xl lg:text-5xl text-white leading-[1.1] font-display font-black tracking-tight mb-8">
                {`"At Ooma, we engineer the invisible digital threads that empower`.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 1.3 + i * 0.06,
                      ease: "easeOut",
                    }}
                    className="inline-block mr-[0.28em]"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.4, delay: 1.3 + 10 * 0.06 }}
                  className="text-gradient-google inline-block mr-[0.28em]"
                >
                  modern
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.4, delay: 1.3 + 11 * 0.06 }}
                  className="text-gradient-google inline-block mr-[0.28em]"
                >
                  operations,
                </motion.span>
                {`building innovative technology that shapes the perfect solution."`.split(" ").map((word, i) => (
                  <motion.span
                    key={`b-${i}`}
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 1.3 + (12 + i) * 0.06,
                      ease: "easeOut",
                    }}
                    className="inline-block mr-[0.28em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
              
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isInView ? { scaleX: 1, opacity: 0.4 } : {}}
                transition={{ duration: 1.2, delay: 2.5, ease: "easeOut" }}
                className="mt-12 w-full max-w-xs mx-auto lg:mx-0 origin-left"
              >
                <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
