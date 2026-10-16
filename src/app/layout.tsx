import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import { socials } from "@/lib/about";

const NAME = "Triptych Studios";
// EDIT: the default search-result title + description.
const DESCRIPTION =
  "Triptych Studios is a Chicago video production studio making music videos, commercials and brand films since 2016. Imagination in motion.";

export const metadata: Metadata = {
  title: { default: `${NAME}® — Chicago Video Production`, template: `%s — ${NAME}` },
  description: DESCRIPTION,
  applicationName: NAME,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: NAME,
    title: `${NAME}® — Imagination in Motion`,
    description: DESCRIPTION,
    url: site.url,
    locale: "en_US",
    images: [{ url: "/press/triptych-banner.jpg", width: 2000, height: 1050 }],
  },
  twitter: { card: "summary_large_image", title: NAME, description: DESCRIPTION, images: ["/press/triptych-banner.jpg"] },
  robots: { index: true, follow: true },
  // Google Search Console + Pinterest claims, once filled in (lib/site.ts).
  verification: {
    ...(site.googleVerify ? { google: site.googleVerify } : {}),
    ...(site.pinterestVerify ? { other: { "p:domain_verify": site.pinterestVerify } } : {}),
  },
};

// Structured data: tells Google who the studio is, so a search for the name
// shows the right site, logo and (with a verified Business Profile) the
// knowledge panel. EDIT: details in lib/site.ts + lib/about.ts.
const sameAs = [
  ...socials.map((s) => s.href).filter((h) => /^https?:/.test(h)),
  ...(site.googleBusinessUrl ? [site.googleBusinessUrl] : []),
];
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: NAME,
      alternateName: ["Triptych", "Triptych Visuals"],
      url: site.url,
      logo: `${site.url}/press/triptych-icon-1024.png`,
      email: site.email,
      foundingDate: "2016", // EDIT
      founder: { "@type": "Person", name: "Lawrence Mahone" }, // EDIT
      sameAs,
    },
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: NAME,
      url: site.url,
      image: `${site.url}/triptych-logo.png`,
      email: site.email,
      description: DESCRIPTION,
      parentOrganization: { "@id": `${site.url}/#org` },
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.country,
      },
      areaServed: "Worldwide",
      sameAs,
    },
    { "@type": "WebSite", "@id": `${site.url}/#site`, name: NAME, url: site.url, publisher: { "@id": `${site.url}/#org` } },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the pre-paint theme script below stamps
    // data-theme on <html> before React hydrates — an expected mismatch.
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Google Sans — site typeface (EDIT weights in the css2 URL) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
