import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: `We may collect the following types of information when you interact with our website and services:

• **Personal Information:** Name, email address, phone number, and company details provided through contact forms or partnership applications.
• **Usage Data:** Pages visited, time spent on pages, browser type, device information, and IP address collected automatically through standard web technologies.
• **Communication Data:** Records of correspondence when you contact us via email, WhatsApp, or phone.

We do not collect sensitive personal data such as financial information, health records, or government-issued identifiers through our website.`,
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: `We use collected information for the following purposes:

• To respond to your inquiries and provide requested services
• To process partnership and freelancer applications
• To improve our website experience and optimize performance
• To send relevant updates about our services (only with your consent)
• To comply with legal obligations and protect our rights
• To analyze website traffic patterns and improve our content

We will never sell, rent, or trade your personal information to third parties for marketing purposes.`,
  },
  {
    icon: Lock,
    title: "3. Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• Secure HTTPS encryption for all data transmission
• Access controls limiting data access to authorized personnel
• Regular security assessments and updates
• Secure storage practices for all collected data

While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest practical standards.`,
  },
  {
    icon: UserCheck,
    title: "4. Your Rights",
    content: `You have the following rights regarding your personal data:

• **Access:** Request a copy of the personal data we hold about you
• **Correction:** Request correction of inaccurate or incomplete data
• **Deletion:** Request deletion of your personal data (subject to legal requirements)
• **Objection:** Object to processing of your data for specific purposes
• **Portability:** Request your data in a structured, commonly used format
• **Withdraw Consent:** Withdraw previously given consent at any time

To exercise any of these rights, please contact us at oomalabs@gmail.com.`,
  },
  {
    icon: Globe,
    title: "5. Cookies & Tracking",
    content: `Our website may use cookies and similar tracking technologies to enhance your browsing experience. These include:

• **Essential Cookies:** Required for basic website functionality (e.g., remembering login state)
• **Analytics Cookies:** Help us understand how visitors interact with our website
• **Preference Cookies:** Remember your settings and preferences

You can control cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.`,
  },
  {
    icon: Mail,
    title: "6. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

• **Email:** oomalabs@gmail.com
• **Phone:** +91 93811 67058
• **WhatsApp:** +91 94928 27058

We aim to respond to all privacy-related inquiries within 48 hours.`,
  },
];

const PrivacyPolicy = () => {
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
            <div className="w-16 h-16 bg-[#4285F4]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-[#4285F4]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-display tracking-tighter mb-4">
              Privacy <span className="text-gradient-google">Policy</span>
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
              At Ooma Labs ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
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
                  <div className="w-10 h-10 bg-[#4285F4]/10 rounded-xl flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5 text-[#4285F4]" />
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

export default PrivacyPolicy;
