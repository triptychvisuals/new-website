// Projects — the selected-works gallery (merged from the original homepage).
import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Projects — Triptych Studios", // EDIT
  description: "Selected works — film, motion, and design.", // EDIT
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <Hero />
      <Gallery />
    </main>
  );
}
