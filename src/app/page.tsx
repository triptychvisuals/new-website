// Home — studio hero + "Selected Works" gallery. On phones the About page's
// content is inlined below the gallery so the whole site is one scroll.
import type { Viewport } from "next";
import Header from "@/components/Header";
import HeroStudio from "@/components/HeroStudio";
import PartnerCard from "@/components/PartnerCard";
import SelectedWorks from "@/components/SelectedWorks";
import WorkGrid from "@/components/WorkGrid";
import Decade from "@/components/Decade";
import AboutResult from "@/components/about/AboutResult";
import AboutStatement from "@/components/about/AboutStatement";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import AboutCTA from "@/components/about/AboutCTA";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/siteContent";
import fs from "node:fs";
import path from "node:path";

/**
 * Real frames for the timeline cards: /public/decade/<year>.(jpg|png|webp)
 * — e.g. 2019.jpg becomes the 2019 card's picture. EDIT: drop files there.
 */
function decadeStills(): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "decade");
  if (!fs.existsSync(dir)) return {};
  const out: Record<string, string> = {};
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(\d{4})\.(jpe?g|png|webp)$/i);
    if (m) out[m[1]] = `/decade/${encodeURIComponent(f)}`;
  }
  return out;
}

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
        <Header logo={content.logo} />
        <HeroStudio tagline={content.tagline} />
        <PartnerCard />
        <SelectedWorks />
        {/* "10 years strong" on the colour field, opening the timeline */}
        <WorkGrid />
        {/* Scrolling on: the page dims into the 2016 → 2026 timeline */}
        <Decade stills={decadeStills()} />

        {/* Phones only: the About page inline, right under the third reel, so
            the mobile menu can scroll here instead of loading another page.
            Desktop keeps the standalone /about route. */}
        <div id="about" className="scroll-mt-24 sm:hidden">
          <AboutResult />
          <AboutStatement />
          <AboutTestimonial />
          <AboutCTA />
        </div>

      </main>
      <Footer />
    </>
  );
}
