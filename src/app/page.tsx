// Home — studio landing (hero + project carousel).
import Header from "@/components/Header";
import HomeHero from "@/components/home/HomeHero";
import ProjectCarousel from "@/components/home/ProjectCarousel";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Header />
      <HomeHero />
      <ProjectCarousel />
    </main>
  );
}
