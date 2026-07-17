// Home — studio hero + "Selected Works" gallery.
import Header from "@/components/Header";
import HeroStudio from "@/components/HeroStudio";
import SelectedWorks from "@/components/SelectedWorks";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen">
        <Header />
        <HeroStudio />
        <SelectedWorks />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
