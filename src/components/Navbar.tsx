import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "@/assets/ooma-logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50" : ""
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Ooma Labs" className="w-6 h-6 invert opacity-80" />
          <span className="text-xs tracking-[0.35em] uppercase font-body font-medium text-foreground/80">Ooma Labs</span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {["Products", "Innovation", "Vision"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-500"
            >
              {item}
            </a>
          ))}
          <div className="w-px h-4 bg-border" />
          <a href="#connect" className="text-xs tracking-[0.2em] uppercase text-primary hover:text-primary/80 transition-colors duration-500">
            Connect
          </a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
