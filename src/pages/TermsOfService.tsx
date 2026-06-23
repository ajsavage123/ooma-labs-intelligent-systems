import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp, Mail, Phone, MessageSquare } from "lucide-react";

interface Section {
  id: string;
  num: string;
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    id: "acceptance",
    num: "01",
    title: "Acceptance of Terms",
    content: `By accessing and using the Ooma Labs website (oomalabs.com) and our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.`,
  },
  {
    id: "services",
    num: "02",
    title: "Services & Deliverables",
    content: `Ooma Labs provides technology engineering services including but not limited to:

• Website and web application development
• Mobile application development
• Custom software development (CRM, ERP, etc.)
• UI/UX design and branding
• AI and automation solutions
• Integration and API services
• Maintenance and support

All project deliverables, timelines, and scope will be defined in individual project agreements or proposals. The terms in project-specific agreements take precedence over these general terms where applicable.`,
  },
  {
    id: "intellectual-property",
    num: "03",
    title: "Intellectual Property",
    content: `• **Our Property:** The Ooma Labs website, brand assets, proprietary tools, and internal processes are owned by Ooma Labs and protected by intellectual property laws.
• **Client Projects:** Unless otherwise specified in a project agreement, upon full payment, clients receive full ownership and rights to the custom code, designs, and deliverables created specifically for their project.
• **Third-Party Components:** Projects may utilize open-source libraries and third-party tools. These remain subject to their respective licenses.
• **Portfolio Rights:** We reserve the right to showcase completed projects in our portfolio unless a non-disclosure agreement states otherwise.`,
  },
  {
    id: "payment",
    num: "04",
    title: "Payment Terms",
    content: `• All pricing is provided through custom project quotes and proposals
• Payment schedules are defined in individual project agreements, typically following a milestone-based structure
• Late payments may result in project pauses or delays
• Refund policies are outlined in individual project agreements
• All amounts are in Indian Rupees (INR) unless otherwise specified`,
  },
  {
    id: "liability",
    num: "05",
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law:

• Ooma Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services
• Our total liability for any claim shall not exceed the total amount paid by you for the specific service giving rise to the claim
• We are not responsible for any third-party services, APIs, or platforms integrated into your project
• We do not guarantee uninterrupted or error-free operation of delivered products, but we commit to resolving issues promptly under our support terms`,
  },
  {
    id: "modifications",
    num: "06",
    title: "Project Modifications & Cancellation",
    content: `• **Scope Changes:** Any changes to the agreed project scope may affect timeline and cost. All scope changes must be discussed and agreed upon in writing.
• **Client Cancellation:** If a client cancels a project, payment for work completed up to that point is due. Any advance payments for uncompleted work may be partially refunded based on the stage of completion.
• **Our Right to Decline:** We reserve the right to decline or discontinue a project if the client violates these terms, fails to provide required materials, or engages in unethical practices.`,
  },
  {
    id: "contact",
    num: "07",
    title: "Contact & Disputes",
    content: `For any questions, concerns, or disputes regarding these Terms of Service:

• **Email:** oomalabs@gmail.com
• **Phone:** +91 93811 67058
• **WhatsApp:** +91 94928 27058

We encourage resolving disputes through open communication. Any unresolved disputes shall be governed by the laws of India, with jurisdiction in the appropriate courts.`,
  },
];

const TermsOfService = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px",
      }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const parseMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-white tracking-tight">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith("•")) {
        const text = trimmed.substring(1).trim();
        return (
          <div key={idx} className="flex gap-3 pl-2 items-start mt-2">
            <span className="text-[#4285F4] mt-2 select-none text-[8px]">•</span>
            <span className="flex-1 text-sm md:text-base text-white/60 leading-relaxed font-body">
              {parseMarkdown(text)}
            </span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-white/60 text-sm md:text-base leading-relaxed font-body">
          {parseMarkdown(trimmed)}
        </p>
      );
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white relative overflow-hidden">
      {/* Dynamic atmospheric glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#4285F4]/3 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-[40vh] right-[10%] w-[400px] h-[400px] bg-[#34A853]/2 blur-[140px] rounded-full pointer-events-none animate-pulse" />

      <Navbar onOpenPartner={() => navigate("/partnership")} />

      <div className="pt-32 md:pt-48 pb-24 md:pb-36 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-20 md:mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-7xl font-bold tracking-tighter text-white font-display mb-8"
            >
              Terms of <span className="font-serif italic font-normal text-[#4285F4]">Service</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-base md:text-xl leading-relaxed font-body font-light"
            >
              Please read these terms carefully. They establish our mutual obligations, intellectual property parameters, payment models, and options for dispute resolution.
            </motion.p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8 lg:gap-16">
            {/* Sticky Sidebar (Desktop only) */}
            <div className="col-span-12 lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-6">
                <span className="text-[10px] tracking-[0.25em] font-black uppercase text-white/30 font-display">
                  Table of Contents
                </span>
                <div className="flex flex-col gap-4 border-l border-white/10 pl-4 relative">
                  {sections.map((section) => {
                    const isActive = activeId === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`group flex items-baseline gap-3 text-left text-xs tracking-wider uppercase font-bold transition-all duration-300 ${
                          isActive
                            ? "text-white translate-x-1.5"
                            : "text-white/30 hover:text-white/70 hover:translate-x-1"
                        }`}
                      >
                        <span
                          className={`text-[10px] font-mono tracking-normal transition-colors duration-300 ${
                            isActive ? "text-[#4285F4]" : "text-white/20"
                          }`}
                        >
                          {section.num}
                        </span>
                        <span>{section.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-20 md:gap-28">
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="scroll-mt-32 border-t border-white/5 pt-12 md:pt-16 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-mono text-[#4285F4] select-none font-bold">
                        {section.num}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
                        {section.title}
                      </h2>
                    </div>

                    <div className="flex flex-col gap-4">
                      {renderContent(section.content)}
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-[50] p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all active:scale-95 shadow-2xl backdrop-blur-lg"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <Footer />
    </div>
  );
};

export default TermsOfService;
