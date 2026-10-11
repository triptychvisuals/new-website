// Home — studio hero + "Selected Works" gallery. On phones the About page's
// content is inlined below the gallery so the whole site is one scroll.
import Header from "@/components/Header";
import HeroStudio from "@/components/HeroStudio";
import PartnerCard from "@/components/PartnerCard";
import SelectedWorks from "@/components/SelectedWorks";
import WorkGrid from "@/components/WorkGrid";
import Decade from "@/components/Decade";
import AboutResult from "@/components/about/AboutResult";
import AboutStatement from "@/components/about/AboutStatement";
import AboutAwards from "@/components/about/AboutAwards";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import AboutCTA from "@/components/about/AboutCTA";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContent";

export default async function Home() {
  // Portal content (empty when the portal is unreachable — the page then
  // renders exactly as authored).
  const content = await getSiteContent();

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} />
        <HeroStudio tagline={content.tagline} />
        <PartnerCard />
        <SelectedWorks />
        {/* The 6×6 "500+ projects" grid follows the Featured Work band */}
        <WorkGrid />
        {/* Scrolling on: the page dims into the 2016 → 2026 timeline */}
        <Decade />

        {/* Phones only: the About page inline, right under the third reel, so
            the mobile menu can scroll here instead of loading another page.
            Desktop keeps the standalone /about route. */}
        <div id="about" className="scroll-mt-24 sm:hidden">
          <AboutResult />
          <AboutStatement />
          <AboutAwards />
          <AboutTestimonial />
          <AboutCTA />
        </div>

      </main>
      <Footer />
    </>
  );
}
