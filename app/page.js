import AboutUsSection from "@/components/AboutUsSection";
import CreatorProgramSection from "@/components/CreatorProgramSection";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";
import HeroReveal from "@/components/HeroReveal";
import ObjectScrollSection from "@/components/ObjectScrollSection";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <HeroReveal />

      <ObjectScrollSection />

      <CustomerReviewsSection />

      <AboutUsSection />

      <CreatorProgramSection />
    </main>
  );
}
