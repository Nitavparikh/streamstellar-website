import { Deliverability } from "@/components/Deliverability";
import { FeatureSections } from "@/components/FeatureSections";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntegrateSection } from "@/components/IntegrateSection";
import { LogoCloud } from "@/components/LogoCloud";
import { Navbar } from "@/components/Navbar";
import { ViewerPreviewSection } from "@/components/ViewerPreviewSection";

export default function Home() {
  return (
    <div className="relative bg-black min-h-screen text-white selection:bg-violet-500/20 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <IntegrateSection />
        <FeatureSections />
        <ViewerPreviewSection />
        <Deliverability />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
