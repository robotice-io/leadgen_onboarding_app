"use client";
import { HeroSection } from "@/components/ui/hero-section-dark";

function HeroSectionDemo() {
  return (
    <HeroSection
      title="Welcome to Our Platform"
      subtitle={{
        regular: "Transform your ideas into ",
        gradient: "beautiful digital experiences",
      }}
      description="Transform your ideas into reality with our comprehensive suite of development tools and resources."
      ctaText="Get Started"
      ctaHref="/signup"
      bottomImage={{
        light:
          "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1920&q=80",
        dark:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1920&q=80",
      }}
      gridOptions={{
        angle: 65,
        opacity: 0.4,
        cellSize: 56,
        lightLineColor: "rgba(37,99,235,0.18)",
        darkLineColor: "rgba(96,165,250,0.22)",
      }}
    />
  );
}
export { HeroSectionDemo };
