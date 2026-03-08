import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
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
    <div className="min-h-screen bg-background mesh-gradient noise selection:bg-primary/20">
      <Navbar onOpenPartner={openPartnership} />
      <HeroSection />
      <ProductSection />
      <InnovationSection />
      <VisionSection />
      <FounderSection />
      <CTASection onOpenPartner={openPartnership} />
      <footer className="py-16 text-center border-t border-border/20 section-padding">
        <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground font-body">
          © 2026 Ooma Labs. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
