// Home — the reel, Global Impact (the labels), the latest release, the reels, the
// timeline, and a closing invitation to start a project.
import type { Viewport } from "next";
import Header from "@/components/Header";
import HeroStudio from "@/components/HeroStudio";
import LatestCards from "@/components/LatestCards";
import PartnerCard from "@/components/PartnerCard";
import SelectedWorks from "@/components/SelectedWorks";
import Decade from "@/components/Decade";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContent";

// The hero footage runs to the top of the screen on phones — the status
// bar (clock, battery) goes black to match. Other pages take the page colour.
export const viewport: Viewport = { themeColor: "#000000" };

export default async function Home() {
  // Portal content (empty when the portal is unreachable — the page then
  // renders exactly as authored).
  const content = await getSiteContent();

  return (
    <>
      <main className="relative min-h-screen">
        <Header logo={content.logo} overlay />
        <HeroStudio tagline={content.tagline} intro={false} />
        {/* Global Impact — the labels, the live views and the numbers — right under the video */}
        <PartnerCard />
        {/* The newest release, big, and the one before it */}
        <LatestCards />
        <SelectedWorks />
        {/* The 2016 → 2026 timeline */}
        <Decade />

        {/* Then: an invitation to start a project, and three ways onward */}
        <ClosingCTA />

      </main>
      <Footer />
    </>
  );
}
