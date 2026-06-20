import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Ooma Labs' development process like?",
    answer: "We follow a structured 4-phase process: Discovery (understanding your problem), Ideation & Architecture (designing the solution), Rapid Prototyping (building a functional MVP), and Iterative Refinement (polishing based on real feedback). Every project starts with a free consultation.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Timeline varies by complexity. A landing page can be ready in 3–5 days. A full web application takes 2–6 weeks. Custom software (CRM, ERP) typically takes 4–10 weeks. We always provide a clear timeline estimate before starting.",
  },
  {
    question: "What technologies do you work with?",
    answer: "We specialize in React, Next.js, TypeScript, Tailwind CSS for frontend. For backend, we use Node.js, Python, PostgreSQL, MongoDB, and MySQL. We also work with AI tools like LangChain, automation platforms (n8n, Zapier, Make), and cloud services.",
  },
  {
    question: "Do you offer post-launch support and maintenance?",
    answer: "Absolutely. We offer ongoing maintenance packages that include bug fixes, performance optimization, security updates, feature additions, and server monitoring. We believe our relationship doesn't end at launch — it begins there.",
  },
  {
    question: "How do you handle pricing?",
    answer: "We provide custom quotes based on project scope, complexity, and timeline. We offer flexible payment structures — typically a milestone-based approach. Reach out via WhatsApp or email for a free consultation and estimate.",
  },
  {
    question: "Can you work with my existing team or codebase?",
    answer: "Yes! We regularly collaborate with in-house teams and can integrate into existing workflows. Whether you need us to build from scratch, extend an existing system, or consult on architecture, we adapt to your needs.",
  },
  {
    question: "Do you sign NDAs and ensure confidentiality?",
    answer: "100%. We take client confidentiality seriously. We're happy to sign NDAs before any project discussion begins. Your ideas, data, and business information are always protected.",
  },
  {
    question: "What if I only need a design, not development?",
    answer: "We offer standalone UI/UX design, logo & brand identity, and landing page design services. You'll receive high-fidelity Figma files and all design assets. If you later decide to build, we can handle that too.",
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 ${
        isOpen ? "bg-[#0a0a0a] border-white/20 shadow-lg" : "bg-transparent hover:bg-[#0a0a0a]/50"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
      >
        <span className={`text-base md:text-lg font-bold font-display tracking-tight transition-colors pr-4 ${
          isOpen ? "text-white" : "text-white/70 group-hover:text-white"
        }`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? "bg-[#4285F4]/20 text-[#4285F4]" : "bg-white/5 text-white/40"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 md:px-8 pb-6 md:pb-8">
          <div className="h-px bg-white/5 mb-6" />
          <p className="text-white/50 text-sm md:text-base leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#4285F4]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="w-16 h-16 bg-[#4285F4]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-[#4285F4]" />
          </div>
          <h2 className="font-display font-bold text-responsive-h2 text-white tracking-tighter">
            Frequently Asked <span className="text-gradient-google">Questions</span>
          </h2>
          <p className="text-responsive-body text-white/50 max-w-xl mx-auto mt-6">
            Everything you need to know about working with Ooma Labs.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3 md:gap-4">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
