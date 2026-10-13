// -------------------------------------------------------------------------
// EDIT: the legal documents. Each has a number (shown like the other page
// index markers), a title, when it was last updated, and sections with an
// id (for the sticky section nav), a heading and paragraphs.
// These are starting templates, not legal advice — have them reviewed.
// -------------------------------------------------------------------------
import { site } from "./site";

export type LegalSection = { id: string; heading: string; body: string[] };
export type LegalDoc = {
  slug: "privacy" | "terms" | "disclaimer";
  number: string;
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
};

const studio = `${site.name} ${site.suffix}`;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    number: "004",
    title: "Privacy Policy",
    lead: "What we collect when you visit, why, and what we never do with it.",
    updated: "October 13, 2026", // EDIT
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        body: [
          `${studio} is a video production studio based in Chicago, Illinois. This policy covers ${site.url.replace("https://", "")} and the project portal we share with clients.`,
          `Questions about anything here can go to ${site.email}.`,
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        body: [
          "When you browse the site we collect nothing that identifies you. We do not run advertising trackers, we do not fingerprint browsers, and we do not sell data — there is nothing to sell.",
          "If you write to us or send a project brief, we keep what you send (your name, email, and the brief itself) for as long as we are talking about the project, and for our records afterwards.",
          "If you subscribe to the newsletter we keep your email until you unsubscribe. Every email has a one-click unsubscribe link.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies",
        body: [
          "The site sets one functional cookie, used only while the site is in private preview, to remember that you have signed in. It holds no personal information and expires on its own.",
          "Your light/dark preference is kept in your browser for the length of your visit and never leaves it.",
          "Embedded video players (YouTube) load from their privacy-enhanced domain, which sets no cookies until you press play. Once you do, YouTube's own privacy policy applies to that player.",
        ],
      },
      {
        id: "client-portal",
        heading: "The client portal",
        body: [
          "Clients working with us use a portal to review cuts, approve frames and track delivery. Portal accounts hold your name, email and the material we exchange for your project. Access is limited to you, your team and ours.",
          "Finished work is only published to this site with your sign-off.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        body: [
          "You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email us and we will do it within 30 days.",
          "If you are in the EU/UK, you also have the right to complain to your local data protection authority.",
        ],
      },
      {
        id: "changes",
        heading: "Changes to this policy",
        body: [
          "When this policy changes, the date at the top changes with it. Material changes will be noted on this page for 30 days.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    number: "005",
    title: "Terms of Service",
    lead: "The ground rules for using this site and the work shown on it.",
    updated: "October 13, 2026", // EDIT
    sections: [
      {
        id: "use-of-site",
        heading: "Using this site",
        body: [
          `By using ${site.url.replace("https://", "")} you agree to these terms. If you do not agree, please do not use the site.`,
          "The site is provided for information about the studio and its work. We may change, pause or remove any part of it at any time.",
        ],
      },
      {
        id: "work-and-rights",
        heading: "The work and who owns it",
        body: [
          `Every film, frame, still and piece of writing on this site is owned by ${studio} or by the artists, labels and brands we made it for, and is protected by copyright.`,
          "You may watch and share links to the work. You may not download, re-upload, edit, re-cut, or use any of it commercially without written permission from us and from the rights holder.",
          "Artist names, label marks and brand logos belong to their owners and appear here only to credit the work.",
        ],
      },
      {
        id: "store",
        heading: "Store purchases",
        body: [
          "Orders are confirmed by email. Prices are in US dollars and include no taxes or duties unless stated at checkout.",
          "Physical items can be returned unworn within 14 days of delivery for a refund of the item price. Digital items (LUTs, presets, downloads) are final sale once delivered.",
        ],
      },
      {
        id: "briefs",
        heading: "Project briefs and quotes",
        body: [
          "A brief sent through this site is a conversation starter, not a booking. Nothing is scheduled, and no price is final, until both sides sign a production agreement.",
        ],
      },
      {
        id: "liability",
        heading: "Liability",
        body: [
          "The site is offered as-is. To the extent the law allows, we are not liable for any loss arising from using it or from relying on anything on it.",
        ],
      },
      {
        id: "law",
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the State of Illinois, and any dispute will be heard in the courts of Cook County, Illinois.", // EDIT
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    number: "006",
    title: "Disclaimer",
    lead: "A few plain statements about what this site is and is not.",
    updated: "October 13, 2026", // EDIT
    sections: [
      {
        id: "credits",
        heading: "Credits and attribution",
        body: [
          `Work shown here was produced, directed, shot or edited by ${studio} as credited on each project. Where a project was a collaboration, the other companies involved are named on the project page or in the video's own credits.`,
          "Project counts, years and awards reflect our records at the date at the top of this page.",
        ],
      },
      {
        id: "third-parties",
        heading: "Third-party content",
        body: [
          "Videos play through YouTube. Links to other sites — press, partners, platforms — are provided for reference. We do not control those sites and are not responsible for what they publish.",
        ],
      },
      {
        id: "no-endorsement",
        heading: "No endorsement implied",
        body: [
          "Showing work made for an artist, label or brand does not mean that artist, label or brand endorses this studio or any other project on this site.",
        ],
      },
      {
        id: "accuracy",
        heading: "Accuracy",
        body: [
          "We keep the site current, but things change. If you spot an error in a credit or a date, tell us and we will fix it.",
        ],
      },
    ],
  },
];

export const legalBySlug = (slug: string) => legalDocs.find((d) => d.slug === slug);
