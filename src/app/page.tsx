// Home — studio hero + "Selected Works" gallery. On phones the About page's
// content is inlined below the gallery so the whole site is one scroll.
import Header from "@/components/Header";
import HeroStudio from "@/components/HeroStudio";
import SelectedWorks from "@/components/SelectedWorks";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutResult from "@/components/about/AboutResult";
import AboutStatement from "@/components/about/AboutStatement";
import AboutFounded from "@/components/about/AboutFounded";
import AboutAwards from "@/components/about/AboutAwards";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import AboutCTA from "@/components/about/AboutCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen">
        <Header />
        <HeroStudio />
        <SelectedWorks />
        <Gallery />

        {/* Phones only: the About page inline, right under the third reel, so
            the mobile menu can scroll here instead of loading another page.
            Desktop keeps the standalone /about route. */}
        <div id="about" className="scroll-mt-24 sm:hidden">
          <Hero />
          <AboutIntro />
          <AboutResult />
          <AboutStatement />
          <AboutFounded />
          <AboutAwards />
          <AboutTestimonial />
          <AboutCTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
