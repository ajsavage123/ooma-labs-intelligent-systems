import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Rocket, BookOpen, Menu, X, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenPartner: () => void;
}

const Navbar = ({ onOpenPartner }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const handleLoginLogout = () => {
    if (state.currentUser) {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } else {
      navigate("/partnership");
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Vision', href: '#vision' },
    { label: 'About', href: '#founder-section' },
    { label: 'Contact Us', href: '#connect' },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled || menuOpen ? "py-2 backdrop-blur-2xl bg-[#050505]/90 border-b border-white/10" : "py-4 md:py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group shrink-0 relative z-[70]">
            <div className="relative w-6 h-6 sm:w-8 md:w-7 sm:h-8 md:h-7 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full group-hover:scale-110 transition-transform duration-300 fill-none stroke-[#FFD700] stroke-[4] md:stroke-[5]" style={{ strokeLinecap: 'round' }}>
                <path d="M 35 15 A 40 40 0 1 1 20 35" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-base md:text-sm font-display tracking-[0.2em] sm:tracking-[0.3em] font-black text-white uppercase leading-none">OOMA LABS</span>
              <span className="text-[7px] tracking-[0.4em] text-[#FFD700] font-bold mt-1 hidden sm:block">INTELLIGENT SYSTEMS</span>
            </div>
          </a>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-6 sm:gap-10 relative z-[70]">
            {/* Desktop Quick Links */}


            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-4 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-95 shadow-xl"
            >
              <span className="text-xs font-black tracking-[0.2em] uppercase text-white/70 hidden sm:block">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay / Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop for Mobile/Desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            
            <motion.div
              initial={window.innerWidth < 1024 ? { y: '100%' } : { opacity: 0 }}
              animate={window.innerWidth < 1024 ? { y: 0 } : { opacity: 1 }}
              exit={window.innerWidth < 1024 ? { y: '100%' } : { opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.4 }}
              className={`fixed z-[55] bg-[#050505] flex flex-col overflow-y-auto overflow-x-hidden
                ${window.innerWidth < 1024 
                  ? "bottom-0 left-0 right-0 h-[85vh] rounded-t-[3rem] border-t border-white/10 px-6 py-12" 
                  : "inset-0 pt-32 pb-12 px-6 md:px-12"
                }`}
            >
              {/* Background Texture/Grid */}
              <div className="absolute inset-0 stitch-grid opacity-10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4285F4]/5 blur-[150px] rounded-full pointer-events-none" />

              {/* Mobile Handle */}
              <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />

              <div className="max-w-7xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                {/* Left Side: Navigation Links */}
                <div className="flex flex-col gap-4 sm:gap-8">
                  <span className="text-[10px] tracking-widest uppercase text-[#4285F4] font-bold mb-4">Navigation</span>
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-6"
                    >
                      <span className="text-4xl sm:text-5xl lg:text-8xl font-display font-bold text-white/20 group-hover:text-white transition-all duration-500 group-hover:pl-4">
                        {item.label}
                      </span>
                      <ArrowRight className="w-6 h-6 lg:w-12 lg:h-12 text-[#4285F4] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </motion.a>
                  ))}
                </div>

                {/* Right Side: About & Info */}
                <div className="flex flex-col gap-8 lg:gap-12 lg:max-w-md">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#EA4335] font-bold block mb-4 lg:mb-6">About Ooma Labs</span>
                    <p className="text-lg lg:text-2xl text-white/60 leading-relaxed font-medium">
                      A strategic tech engineering firm dedicated to building purposeful platforms that bridge efficiency gaps in complex business operations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-white/30 font-bold block mb-4 lg:mb-6">Collaborate</span>
                      <a href="mailto:oomalabs@gmail.com?body=hi%20i%20am%20looking%20for%20colabration%20in%20your%20company%20and%20my%20name%20is%20....." className="text-base lg:text-lg text-white hover:text-[#4285F4] transition-colors block mb-2">oomalabs@gmail.com</a>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest uppercase text-white/30 font-bold block mb-4 lg:mb-6">HQ</span>
                      <p className="text-base lg:text-lg text-white">Innovation District</p>
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="flex gap-6 mt-4">
                    {[
                      { icon: Twitter, href: "#" },
                      { icon: Linkedin, href: "https://www.linkedin.com/company/oomalabs/" },
                      { icon: Instagram, href: "https://www.instagram.com/ooma.labs?igsh=YTNrOXcxd3puZWxj" }
                    ].map(({ icon: Icon, href }, i) => (
                      <motion.a 
                        key={i}
                        whileHover={{ y: -5, color: '#4285F4' }}
                        href={href}
                        target={href !== "#" ? "_blank" : undefined}
                        rel={href !== "#" ? "noopener noreferrer" : undefined}
                        className="text-white/40 transition-all"
                      >
                        <Icon className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Footer Info */}
              <div className="max-w-7xl mx-auto w-full mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                 <p className="text-[10px] tracking-widest uppercase text-white/20 font-bold">
                   © {new Date().getFullYear()} OOMA LABS. ALL RIGHTS RESERVED.
                 </p>
                 <div className="flex gap-8">
                   <a href="#" className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white transition-colors font-bold">Privacy Policy</a>
                   <a href="#" className="text-[10px] tracking-widest uppercase text-white/20 hover:text-white transition-colors font-bold">Terms of Service</a>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
