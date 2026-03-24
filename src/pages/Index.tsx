import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/ProductSection";
import ServicesSection from "@/components/ServicesSection";
import InnovationSection from "@/components/InnovationSection";
import VisionSection from "@/components/VisionSection";
import FounderSection from "@/components/FounderSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  const navigate = useNavigate();

  const openPartnership = () => {
    navigate("/partnership");
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#4285F4]/30 selection:text-white">
      <Navbar onOpenPartner={openPartnership} />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <InnovationSection />
      <VisionSection />
      <FounderSection />
      <CTASection />
      <footer className="py-8 text-center border-t border-white/10 bg-[#0a0a0a]">
        <p className="text-xs tracking-widest uppercase text-white/40 font-bold">
          © {new Date().getFullYear()} OOMA LABS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
