import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Triptych Studios® - Imagination in Motion", // EDIT: browser-tab / search-result title
  description:
    "Triptych Studios — cinematic storytelling, film, and motion for brands.", // EDIT
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        {/* Every visit starts on the light theme — dark is only ever set by
            clicking the toggle. sessionStorage (not localStorage) keeps that
            choice while browsing between pages, then clears on the next visit.
            Applied before paint so there's no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}`,
          }}
        />
        {/*
          The editorial gallery design has no visible WebGL, so the persistent
          <Scene /> layer (and the old <Navbar />) are intentionally unmounted.
          Both files are kept in the repo — re-enable Scene here if a future
          section needs the 3D canvas back.
        */}
        {/* Global smooth scroll + ScrollTrigger sync. The site footer lives in
            the individual pages so standalone routes (e.g. /work/[slug]) can
            provide their own. */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
