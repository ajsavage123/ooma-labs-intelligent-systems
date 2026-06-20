import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FounderSection from "@/components/FounderSection";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Heart, Zap, Shield, Lightbulb, Users } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "We only build technology that solves real problems. Every line of code has a purpose.",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
  },
  {
    icon: Heart,
    title: "Human-Centric",
    description: "Technology should serve people, not the other way around. We design for real-world users.",
    color: "text-[#EA4335]",
    bg: "bg-[#EA4335]/10",
  },
  {
    icon: Zap,
    title: "Speed & Quality",
    description: "We deliver fast without cutting corners. Rapid iteration with production-grade quality.",
    color: "text-[#FBBC05]",
    bg: "bg-[#FBBC05]/10",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Clear communication, honest timelines, and no hidden surprises throughout the process.",
    color: "text-[#34A853]",
    bg: "bg-[#34A853]/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We leverage cutting-edge technologies and creative approaches to deliver exceptional results.",
    color: "text-[#4285F4]",
    bg: "bg-[#4285F4]/10",
  },
  {
    icon: Users,
    title: "Partnership Mindset",
    description: "We don't just build for clients — we build with them. Your success is our success.",
    color: "text-[#EA4335]",
    bg: "bg-[#EA4335]/10",
  },
];

const milestones = [
  { year: "2024", title: "Ooma Labs Founded", description: "Started with a vision to bridge efficiency gaps in business operations through technology." },
  { year: "2024", title: "Rakshith 360 Launched", description: "Our flagship AI-driven emergency coordination system went live, solving real-world healthcare logistics." },
  { year: "2025", title: "MedExpert Platform", description: "Built and launched the healthcare workforce ecosystem connecting medical facilities with talent." },
  { year: "2025", title: "CodeBlueR Community", description: "Created a professional network for emergency response practitioners." },
  { year: "2026", title: "Scaling Operations", description: "Expanding our service portfolio and partner network to serve startups and enterprises globally." },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white">
      <Navbar onOpenPartner={() => navigate("/partnership")} />

      {/* Hero */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4285F4]/10 blur-[150px] rounded-full -mr-40 -mt-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-google mb-6 inline-block">About Us</span>
            <h1 className="text-4xl md:text-7xl font-bold text-white font-display tracking-tighter mt-4 mb-8">
              Engineering the <span className="text-gradient-google">Future</span>,<br className="hidden md:block" /> One Platform at a Time.
            </h1>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Ooma Labs is a strategic tech engineering firm dedicated to building purposeful platforms that bridge efficiency gaps in complex business operations. We don't just write code — we engineer solutions that transform how businesses operate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#4285F4] font-bold">Our Mission</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight mt-4 mb-6">
                Technology That Solves Real Problems
              </h2>
              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                We exist to identify structural inefficiencies in business operations and engineer targeted technology solutions that make a measurable impact. From AI-driven coordination systems to custom business tools, every project we take on must have a clear purpose and a tangible outcome.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#EA4335] font-bold">Our Story</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight mt-4 mb-6">
                Born From a Need for Better Systems
              </h2>
              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Ooma Labs was founded by Ajay Narava with a simple observation: critical operations often rely on broken, inefficient, or non-existent digital infrastructure. Starting with emergency healthcare coordination, we've since expanded to serve businesses across multiple sectors, always maintaining our core principle — technology must be purposeful.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tighter">
              Our <span className="text-gradient-google">Values</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 hover:border-white/20 hover:-translate-y-1 transition-all duration-500 group"
              >
                <div className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-7 h-7 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white font-display mb-3">{value.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display tracking-tighter">
              Our <span className="text-gradient-google">Journey</span>
            </h2>
          </motion.div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/10" />
            <div className="flex flex-col gap-8">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-16 md:pl-20"
                >
                  {/* Dot on line */}
                  <div className="absolute left-[18px] md:left-[26px] top-2 w-3 h-3 rounded-full bg-[#4285F4] border-2 border-[#050505] z-10" />
                  <span className="text-xs tracking-[0.3em] uppercase text-[#4285F4] font-bold">{milestone.year}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white font-display mt-1 mb-2">{milestone.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <FounderSection />

      <Footer />
    </div>
  );
};

export default About;
