import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Briefcase, Rocket, BookOpen } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenPartner: () => void;
}

const Navbar = ({ onOpenPartner }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWorkspaceClick = () => {
    if (state.currentUser && state.currentUser.workspace_access) {
      navigate("/workspace");
    } else {
      navigate("/login");
    }
  };

  const handleLoginLogout = () => {
    if (state.currentUser) {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } else {
      navigate("/partnership");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 backdrop-blur-xl bg-[#050505]/80 border-b border-white/10" : "py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full group-hover:scale-110 transition-transform duration-300 fill-none stroke-[#FFD700] stroke-[8] sm:stroke-[6]" style={{ strokeLinecap: 'round' }}>
                <path d="M 35 15 A 40 40 0 1 1 20 35" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm font-display tracking-[0.15em] sm:tracking-widest font-bold text-white uppercase truncate">OOMA LABS</span>
          </a>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {['Products', 'Innovation', 'Vision'].map((item) => (
              <a
                key={item}
                href={item === 'Products' ? '/products' : `#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/70 hover:text-[#4285F4] transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-[#4285F4] transition-colors duration-200 outline-none">
                More <ChevronDown className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 p-2 min-w-[220px] rounded-xl shadow-2xl z-[60]">
                <DropdownMenuLabel className="text-[10px] tracking-widest uppercase text-white/40 px-3 py-2">Exploration</DropdownMenuLabel>
                <DropdownMenuItem onClick={onOpenPartner} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors focus:bg-white/5">
                  <Briefcase className="w-4 h-4 text-[#4285F4]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white/90">Partnership</span>
                    <span className="text-[11px] text-white/40">Collaborate with us</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors focus:bg-white/5">
                  <Rocket className="w-4 h-4 text-[#34A853]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white/90">Future Roadmap</span>
                    <span className="text-[11px] text-white/40">Our upcoming journey</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors focus:bg-white/5">
                  <BookOpen className="w-4 h-4 text-[#FBBC05]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white/90">Case Library</span>
                    <span className="text-[11px] text-white/40">Learn from our builds</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons / Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {state.currentUser ? (
                <>
                  {state.currentUser.role === "admin" && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleWorkspaceClick}
                    className="px-4 py-2 bg-[#4285F4]/10 text-[#4285F4] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#4285F4]/20 transition-all border border-[#4285F4]/20"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={handleLoginLogout}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleWorkspaceClick}
                  className="px-5 py-2.5 bg-[#FFD700] text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#e6c200] transition-all active:scale-95"
                >
                  OOMA Workspace
                </button>
              )}
            </div>

            {/* Mobile Workspace Toggle (Visible only on very small screens) */}
            <button
               onClick={handleWorkspaceClick}
               className="sm:hidden w-8 h-8 flex items-center justify-center bg-[#FFD700] text-black rounded-full"
            >
               <Briefcase className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
