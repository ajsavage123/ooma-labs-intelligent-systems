import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import PortfolioSection from "@/components/ProductSection";
import ServicesSection from "@/components/ServicesSection";
import InnovationSection from "@/components/InnovationSection";
import TechStackBanner from "@/components/TechStackBanner";
import FounderSection from "@/components/FounderSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";


const Index = () => {
  const navigate = useNavigate();

  const openPartnership = () => {
    navigate("/partnership");
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white">
      <Navbar onOpenPartner={openPartnership} />
      <HeroSection />
      <ClientLogosSection />
      <ServicesSection />
      <PortfolioSection />
      <InnovationSection />
      <TechStackBanner />
      <FounderSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />

    </div>
  );
};

export default Index;
