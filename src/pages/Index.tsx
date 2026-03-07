import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import InnovationSection from "@/components/InnovationSection";
import VisionSection from "@/components/VisionSection";
import FounderSection from "@/components/FounderSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductSection />
      <InnovationSection />
      <VisionSection />
      <FounderSection />
      <CTASection />
      <footer className="py-12 text-center border-t border-border/30 section-padding">
        <p className="text-sm text-muted-foreground tracking-wide">
          © 2026 Ooma Labs. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
