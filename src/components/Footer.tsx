import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail, Phone, MessageCircle, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thank you for subscribing!", {
      description: "You'll receive our latest updates and insights.",
    });
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Our Process", href: "#innovation" },
    { label: "Vision", href: "#vision" },
    { label: "About", href: "#founder-section" },
    { label: "Contact Us", href: "#connect" },
  ];

  const serviceLinks = [
    "Website Development",
    "Android App Development",
    "Custom Software & CRM",
    "AI & Automation",
    "UI/UX Design",
    "API Integration",
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/company/oomalabs/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/ooma.labs?igsh=YTNrOXcxd3puZWxj", label: "Instagram" },
    { icon: Mail, href: "mailto:hello@oomalabs.com", label: "Email" },
  ];

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#4285F4]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Newsletter Bar */}
        <div className="py-12 md:py-16 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight">
                Stay in the <span className="text-gradient-google">loop</span>.
              </h3>
              <p className="text-white/40 mt-2 text-sm md:text-base">
                Get the latest insights, updates, and project highlights from Ooma Labs.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#4285F4]/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#4285F4] hover:bg-[#4285F4]/90 text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all active:scale-95 flex items-center gap-2 shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 group mb-6">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#FFD700] stroke-[5]" style={{ strokeLinecap: 'round' }}>
                  <path d="M 35 15 A 40 40 0 1 1 20 35" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-display tracking-[0.3em] font-black text-white uppercase leading-none">OOMA LABS</span>
                <span className="text-[7px] tracking-[0.4em] text-[#FFD700] font-bold mt-1">INTELLIGENT SYSTEMS</span>
              </div>
            </a>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs">
              A strategic tech engineering firm building purposeful platforms that bridge efficiency gaps in complex business operations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  href={social.href}
                  target={social.href !== "#" ? "_blank" : undefined}
                  rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="border-b border-white/5 sm:border-b-0 pb-6 sm:pb-0">
            <button 
              onClick={() => toggleSection("quickLinks")}
              className="flex justify-between items-center w-full sm:pointer-events-none text-left"
            >
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-bold">Quick Links</h4>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 sm:hidden ${openSection === "quickLinks" ? "rotate-180" : ""}`} />
            </button>
            <div className={`mt-4 sm:mt-6 space-y-3 transition-all duration-300 overflow-hidden sm:block ${openSection === "quickLinks" ? "max-h-96 opacity-100" : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"}`}>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#4285F4]" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="border-b border-white/5 sm:border-b-0 pb-6 sm:pb-0">
            <button 
              onClick={() => toggleSection("services")}
              className="flex justify-between items-center w-full sm:pointer-events-none text-left"
            >
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-bold">Services</h4>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 sm:hidden ${openSection === "services" ? "rotate-180" : ""}`} />
            </button>
            <div className={`mt-4 sm:mt-6 space-y-3 transition-all duration-300 overflow-hidden sm:block ${openSection === "services" ? "max-h-96 opacity-100" : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"}`}>
              <ul className="space-y-3">
                {serviceLinks.map((service) => (
                  <li key={service}>
                    <a href="#services" className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#34A853]" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="pb-6 sm:pb-0">
            <button 
              onClick={() => toggleSection("contact")}
              className="flex justify-between items-center w-full sm:pointer-events-none text-left"
            >
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-bold">Contact</h4>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 sm:hidden ${openSection === "contact" ? "rotate-180" : ""}`} />
            </button>
            <div className={`mt-4 sm:mt-6 space-y-4 transition-all duration-300 overflow-hidden sm:block ${openSection === "contact" ? "max-h-96 opacity-100" : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"}`}>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:hello@oomalabs.com" className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors group">
                    <div className="w-9 h-9 bg-[#EA4335]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#EA4335]/20 transition-colors">
                      <Mail className="w-4 h-4 text-[#EA4335]" />
                    </div>
                    hello@oomalabs.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919381167058" className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors group">
                    <div className="w-9 h-9 bg-[#4285F4]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#4285F4]/20 transition-colors">
                      <Phone className="w-4 h-4 text-[#4285F4]" />
                    </div>
                    +91 93811 67058
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919492827058" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors group">
                    <div className="w-9 h-9 bg-[#25D366]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </div>
                    WhatsApp Chat
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <div className="w-9 h-9 bg-[#FBBC05]/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#FBBC05]" />
                    </div>
                    Gachibowli, Hyderabad, Telangana 500032
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/20 font-bold">
            © {new Date().getFullYear()} Ooma Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-[10px] tracking-[0.15em] uppercase text-white/20 hover:text-white/60 transition-colors font-bold">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-[10px] tracking-[0.15em] uppercase text-white/20 hover:text-white/60 transition-colors font-bold">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
