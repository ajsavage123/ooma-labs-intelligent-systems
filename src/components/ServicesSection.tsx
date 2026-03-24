import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Laptop, Cpu, TrendingUp, Link, Wrench, Palette, Bot, CheckCircle2, ChevronDown } from "lucide-react";

const serviceCategories = [
  {
    icon: Laptop,
    title: "Development Services",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
    items: [
      "Website Development",
      "E-commerce Excellence",
      "Web App Engineering",
      "Android App Development",
      "High-Conversion Landing Pages"
    ]
  },
  {
    icon: Cpu,
    title: "Custom Software",
    color: "text-[#34A853]",
    bg: "bg-[#34A853]/10",
    items: [
      "CRM Development",
      "ERP Systems & Business Tools",
      "Booking & Appointment Systems",
      "Inventory Management Systems",
      "Admin Dashboards"
    ]
  },
  {
    icon: TrendingUp,
    title: "Business Support",
    color: "text-[#FBBC05]",
    bg: "bg-[#FBBC05]/10",
    items: [
      "MVP Development for Startups",
      "SaaS Product Engineering",
      "Custom Automation Tools",
      "Internal Business Tools"
    ]
  },
  {
    icon: Link,
    title: "Integration Services",
    color: "text-[#EA4335]",
    bg: "bg-[#EA4335]/10",
    items: [
      "Payment Gateway Integration",
      "Custom API Integration",
      "WhatsApp Business Automation",
      "AI Chatbot Integration",
      "Google Sheets & CRM Sync"
    ]
  },
  {
    icon: Wrench,
    title: "Support & Maintenance",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
    items: [
      "Website Maintenance",
      "App Updates & Bug Fixing",
      "Hosting & Server Setup",
      "Performance Optimization"
    ]
  },
  {
    icon: Palette,
    title: "Design & Branding",
    color: "text-[#34A853]",
    bg: "bg-[#34A853]/10",
    items: [
      "UI/UX Interface Design",
      "Logo & Brand Identity",
      "High-Impact Landing Page Design",
      "Content Upload & Management"
    ]
  },
  {
    icon: Bot,
    title: "AI & Automation",
    color: "text-[#FBBC05]",
    bg: "bg-[#FBBC05]/10",
    items: [
      "AI Chatbot Development",
      "AI Customer Support Bots",
      "Workflow Automation (Zapier, Make, n8n)"
    ]
  }
];

const ServiceCard = ({ category, index }: { category: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`relative group bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 transition-all duration-500 cursor-pointer overflow-hidden ${
        isExpanded ? "border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] -translate-y-4" : "hover:border-white/20"
      }`}
    >
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div 
            animate={{ 
              scale: isExpanded ? 1.1 : 1,
              rotate: isExpanded ? 5 : 0
            }}
            className={`w-20 h-20 ${category.bg} ${category.color} rounded-[2rem] flex items-center justify-center transition-transform duration-500`}
          >
            <category.icon className="w-10 h-10" />
          </motion.div>
          
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-2xl font-bold text-white font-display transition-colors">
              {category.title}
            </h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0, opacity: isExpanded ? 0 : 0.5 }}
              className="mt-2"
            >
              <ChevronDown className="w-5 h-5 text-white/40" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/5 pt-6"
            >
              <ul className="space-y-4">
                {category.items.map((item: string, idx: number) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 group/item"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${category.color} opacity-40 shrink-0`} />
                    <span className="text-white/70 text-sm font-medium">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8">
                <span className={`text-[10px] font-bold tracking-widest uppercase ${category.color} animate-pulse`}>
                  Start Your Project
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative background accent */}
      <div className={`absolute inset-0 ${category.color.replace('text-', 'bg-')}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-[#050505] relative overflow-hidden stitch-grid">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#4285F4]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="badge-google mb-6 inline-block">The Portfolio</span>
          <h2 className="font-display font-bold text-responsive-h2 text-white mt-4 tracking-tighter">
            Elevate Your <span className="text-gradient-google">Business</span> with Ooma.
          </h2>
          <p className="text-responsive-body text-white/50 max-w-2xl mx-auto mt-6">
            Hover or click to explore our specialized engineering services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, i) => (
            <ServiceCard key={i} category={category} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
