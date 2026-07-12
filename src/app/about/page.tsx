// About — "Who are we" (002).
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/about/AboutIntro";
import AboutFounded from "@/components/about/AboutFounded";
import AboutAwards from "@/components/about/AboutAwards";
import AboutResult from "@/components/about/AboutResult";
import AboutTestimonial from "@/components/about/AboutTestimonial";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About — Triptych", // EDIT
  description: "Who we are — cinematic storytelling, film, and motion.", // EDIT
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <AboutIntro />
      <AboutFounded />
      <AboutAwards />
      <AboutResult />
      <AboutTestimonial />
      <AboutCTA />
    </main>
  );
}
