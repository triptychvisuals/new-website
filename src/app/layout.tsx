import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";

// EDIT: header font (matches the DAS Studio reference)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Triptych — Selected Works", // EDIT
  description:
    "Triptych Studios — cinematic storytelling, film, and motion for brands.", // EDIT
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {/*
          The editorial gallery design has no visible WebGL, so the persistent
          <Scene /> layer (and the old <Navbar />) are intentionally unmounted.
          Both files are kept in the repo — re-enable Scene here if a future
          section needs the 3D canvas back.
        */}
        {/* Global smooth scroll + ScrollTrigger sync */}
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
