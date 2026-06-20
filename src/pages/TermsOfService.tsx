import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Scale, AlertTriangle, CreditCard, Ban, RefreshCw, Mail } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content: `By accessing and using the Ooma Labs website (oomalabs.com) and our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time, and your continued use of the site constitutes acceptance of any changes.`,
  },
  {
    icon: Scale,
    title: "2. Services & Deliverables",
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
    icon: AlertTriangle,
    title: "3. Intellectual Property",
    content: `• **Our Property:** The Ooma Labs website, brand assets, proprietary tools, and internal processes are owned by Ooma Labs and protected by intellectual property laws.
• **Client Projects:** Unless otherwise specified in a project agreement, upon full payment, clients receive full ownership and rights to the custom code, designs, and deliverables created specifically for their project.
• **Third-Party Components:** Projects may utilize open-source libraries and third-party tools. These remain subject to their respective licenses.
• **Portfolio Rights:** We reserve the right to showcase completed projects in our portfolio unless a non-disclosure agreement states otherwise.`,
  },
  {
    icon: CreditCard,
    title: "4. Payment Terms",
    content: `• All pricing is provided through custom project quotes and proposals
• Payment schedules are defined in individual project agreements, typically following a milestone-based structure
• Late payments may result in project pauses or delays
• Refund policies are outlined in individual project agreements
• All amounts are in Indian Rupees (INR) unless otherwise specified`,
  },
  {
    icon: Ban,
    title: "5. Limitation of Liability",
    content: `To the fullest extent permitted by law:

• Ooma Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services
• Our total liability for any claim shall not exceed the total amount paid by you for the specific service giving rise to the claim
• We are not responsible for any third-party services, APIs, or platforms integrated into your project
• We do not guarantee uninterrupted or error-free operation of delivered products, but we commit to resolving issues promptly under our support terms`,
  },
  {
    icon: RefreshCw,
    title: "6. Project Modifications & Cancellation",
    content: `• **Scope Changes:** Any changes to the agreed project scope may affect timeline and cost. All scope changes must be discussed and agreed upon in writing.
• **Client Cancellation:** If a client cancels a project, payment for work completed up to that point is due. Any advance payments for uncompleted work may be partially refunded based on the stage of completion.
• **Our Right to Decline:** We reserve the right to decline or discontinue a project if the client violates these terms, fails to provide required materials, or engages in unethical practices.`,
  },
  {
    icon: Mail,
    title: "7. Contact & Disputes",
    content: `For any questions, concerns, or disputes regarding these Terms of Service:

• **Email:** oomalabs@gmail.com
• **Phone:** +91 93811 67058
• **WhatsApp:** +91 94928 27058

We encourage resolving disputes through open communication. Any unresolved disputes shall be governed by the laws of India, with jurisdiction in the appropriate courts.`,
  },
];

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white">
      <Navbar onOpenPartner={() => navigate("/partnership")} />
      <div className="pt-28 md:pt-40 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="w-16 h-16 bg-[#34A853]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-[#34A853]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display tracking-tighter mb-4">
              Terms of <span className="text-gradient-google">Service</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base">
              Last updated: June 2026
            </p>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 mb-8"
          >
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Welcome to Ooma Labs. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. Please read these Terms carefully before engaging with us.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 md:p-10 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-[#34A853]/10 rounded-xl flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-[#34A853]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="text-white/50 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
