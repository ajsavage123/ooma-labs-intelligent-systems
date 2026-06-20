import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowRight, Mail, BookOpen, Briefcase } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const helpfulLinks = [
    { icon: Home, label: "Homepage", href: "/", color: "text-[#4285F4]", bg: "bg-[#4285F4]/10" },
    { icon: Briefcase, label: "Our Services", href: "/#services", color: "text-[#34A853]", bg: "bg-[#34A853]/10" },
    { icon: BookOpen, label: "About Us", href: "/about", color: "text-[#FBBC05]", bg: "bg-[#FBBC05]/10" },
    { icon: Mail, label: "Contact Us", href: "/#connect", color: "text-[#EA4335]", bg: "bg-[#EA4335]/10" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4285F4]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 stitch-grid opacity-5 pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 md:px-12 text-center relative z-10">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <span className="text-[8rem] md:text-[12rem] font-black text-white/5 font-display tracking-tighter leading-none select-none">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tighter mb-4">
            Page Not <span className="text-gradient-google">Found</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base mb-4">
            The page <code className="text-[#EA4335]/60 bg-white/5 px-2 py-0.5 rounded text-xs">{location.pathname}</code> doesn't exist.
          </p>
          <p className="text-white/30 text-sm mb-12">
            It might have been moved, deleted, or you may have mistyped the URL.
          </p>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {helpfulLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="group bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3"
            >
              <div className={`w-10 h-10 ${link.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="text-white/60 text-xs font-bold tracking-wider uppercase group-hover:text-white transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-95 group"
        >
          Take Me Home
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.a>
      </div>
    </div>
  );
};

export default NotFound;
