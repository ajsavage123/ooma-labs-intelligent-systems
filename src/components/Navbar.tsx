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

interface NavbarProps {
  onOpenPartner: () => void;
}

const Navbar = ({ onOpenPartner }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className={`max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-500 rounded-full ${
        scrolled ? "glass-dark border-white/5 mx-6 py-3" : "bg-transparent py-0"
      }`}>
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            <svg viewBox="0 0 100 100" className="w-8 h-8 group-hover:scale-110 transition-transform duration-500 fill-none stroke-primary stroke-[6]" style={{ strokeLinecap: 'round' }}>
               <path d="M 35 15 A 40 40 0 1 1 20 35" />
            </svg>
            {scrolled && <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />}
          </div>
          <div className="flex flex-col">
            <span className="text-xs tracking-[0.4em] uppercase font-bold text-foreground">Ooma Labs</span>
          </div>
        </a>
        
        <div className="hidden md:flex items-center gap-10">
          {["Products", "Innovation", "Vision"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[10px] tracking-[0.2em] uppercase text-foreground/60 hover:text-primary transition-all duration-500 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
            </a>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/60 hover:text-primary transition-all duration-500 outline-none">
              Quick Options <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-dark border-white/10 p-2 min-w-[240px] rounded-2xl animate-in fade-in zoom-in duration-300">
              <DropdownMenuLabel className="text-[10px] tracking-[0.3em] uppercase opacity-40 px-3 py-4">Intelligence Platform</DropdownMenuLabel>
              <DropdownMenuItem onClick={onOpenPartner} className="flex items-center gap-4 p-4 rounded-xl focus:bg-primary/20 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg glass border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wider">Partner with AN</span>
                  <span className="text-[10px] opacity-60">Join Ooma Labs</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 my-2" />
              <DropdownMenuItem className="flex items-center gap-4 p-4 rounded-xl focus:bg-primary/20 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg glass border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wider">Roadmap</span>
                  <span className="text-[10px] opacity-60">Future Milestones</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem href="#innovation" className="flex items-center gap-4 p-4 rounded-xl focus:bg-primary/20 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg glass border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wider">Case Studies</span>
                  <span className="text-[10px] opacity-60">Success Inbound</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-4 p-4 rounded-xl focus:bg-primary/20 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg glass border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs uppercase tracking-wider">Community Hub</span>
                  <span className="text-[10px] opacity-60">Neural Network</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-white/10" />
          <a href="#connect" className="btn-solid !py-2.5 !px-6 rounded-full text-[9px]">
            Connect
          </a>
        </div>

        {/* Mobile menu indicator */}
        <div className="md:hidden w-8 h-8 glass flex items-center justify-center rounded-lg border-white/10">
           <div className="w-4 h-0.5 bg-foreground/60 relative after:absolute after:top-1.5 after:left-0 after:w-4 after:h-0.5 after:bg-foreground/60 before:absolute before:-top-1.5 before:left-0 before:w-4 before:h-0.5 before:bg-foreground/60" />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
