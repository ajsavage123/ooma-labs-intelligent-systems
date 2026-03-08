import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "@/assets/ooma-logo.png";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Briefcase, Rocket, BookOpen, Users, Compass } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

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
      // Take to login page
      navigate("/login");
    }
  };

  const handleLoginLogout = () => {
    if (state.currentUser) {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } else {
      // Direct to partnership form instead of login
      navigate("/partnership");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-xl bg-background/80 border-b border-border/20" : "py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7">
              <svg viewBox="0 0 100 100" className="w-full h-full group-hover:scale-110 transition-transform duration-300 fill-none stroke-primary stroke-[6]" style={{ strokeLinecap: 'round' }}>
                 <path d="M 35 15 A 40 40 0 1 1 20 35" />
              </svg>
            </div>
            <span className="text-xs tracking-widest uppercase font-bold text-foreground">OOMA Labs</span>
          </a>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Products', 'Innovation', 'Vision'].map((item) => (
              <a
                key={item}
                href={item === 'Products' ? '/products' : `#${item.toLowerCase()}`}
                className="text-xs tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {item}
              </a>
            ))}
            
            <div className="w-px h-4 bg-border/30" />
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-xs tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors duration-300 outline-none">
                More <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-dark border-white/10 p-2 min-w-[200px] rounded-lg">
                <DropdownMenuLabel className="text-[10px] tracking-widest uppercase opacity-50 px-3 py-2">Tools</DropdownMenuLabel>
                <DropdownMenuItem onClick={onOpenPartner} className="flex items-center gap-3 p-3 rounded-md focus:bg-primary/20 cursor-pointer">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Partner</span>
                    <span className="text-[10px] opacity-60">Join Ooma Labs</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-1" />
                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-md focus:bg-primary/20 cursor-pointer">
                  <Rocket className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Roadmap</span>
                    <span className="text-[10px] opacity-60">Future Plans</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-md focus:bg-primary/20 cursor-pointer">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium">Case Studies</span>
                    <span className="text-[10px] opacity-60">Success Stories</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {state.currentUser ? (
              <>
                {state.currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-block px-4 py-2 text-xs tracking-widest uppercase rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleWorkspaceClick}
                  className="hidden sm:inline-block px-4 py-2 text-xs tracking-widest uppercase rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Workspace
                </button>
                <button
                  onClick={handleLoginLogout}
                  className="px-4 py-2 text-xs tracking-widest uppercase rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleWorkspaceClick}
                className="px-4 py-2 text-xs tracking-widest uppercase rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                OOMA Workspace
              </button>
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
