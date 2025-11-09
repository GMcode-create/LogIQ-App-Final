import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DetailedFeaturesSection from "@/components/DetailedFeaturesSection";
import PerformanceSection from "@/components/PerformanceSection";
import DemoSection from "@/components/DemoSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Skip Links for Keyboard Navigation */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#features" className="skip-link">
          Skip to features
        </a>
        <a href="#demo" className="skip-link">
          Skip to demo
        </a>
        <a href="#footer" className="skip-link">
          Skip to footer
        </a>
      </div>
      
      <Navbar />
      
      <main id="main-content" role="main">
        <section id="hero" aria-label="Hero">
          <HeroSection />
        </section>
        <section id="features" aria-label="Features">
          <FeaturesSection />
          <DetailedFeaturesSection />
        </section>
        <section id="performance" aria-label="Performance">
          <PerformanceSection />
        </section>
        <section id="demo" aria-label="Interactive Demo">
          <DemoSection />
        </section>
        <TargetAudienceSection />
        <section id="testimonials" aria-label="About">
          <TestimonialsSection />
        </section>
        <CTASection />
      </main>
      
      <Footer id="footer" />
    </div>
  );
};

export default Index;
