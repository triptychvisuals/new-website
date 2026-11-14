// -------------------------------------------------------------------------
// EDIT: the legal documents. Each has a number (shown like the other page
// index markers), a title, when it was last updated, and sections with an
// id (for the sticky section nav), a heading and paragraphs.
// These are starting templates, not legal advice. Have them reviewed, and
// keep them in step with the production agreement and with Stripe.
// -------------------------------------------------------------------------
import { site } from "./site";
import { servicesList } from "./pages";

export type LegalSection = { id: string; heading: string; body: string[] };
export type LegalDoc = {
  slug: "privacy" | "terms" | "refunds" | "disclaimer";
  number: string;
  title: string;
  lead: string;
  updated: string;
  sections: LegalSection[];
};

const studio = `${site.name} ${site.suffix}`;
const domain = site.url.replace("https://", "");
const owner = `${studio} is operated by ${site.legalName}, an ${site.lawState} limited liability company`;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    number: "004",
    title: "Privacy Policy",
    lead: "What we collect, why we collect it, who we share it with, and how we keep it safe.",
    updated: "November 13, 2026", // EDIT
    sections: [
      {
        id: "who-we-are",
        heading: "Who we are",
        body: [
          `${owner}, a creative production company based in Chicago, Illinois. This policy covers ${domain}, the project portal we share with clients, and any payment you make to us.`,
          `Questions about anything here can go to ${site.email}.`,
        ],
      },
      {
        id: "what-we-collect",
        heading: "What we collect",
        body: [
          "When you browse the site we collect nothing that identifies you. We do not run advertising trackers, we do not fingerprint browsers, and we do not sell data.",
          "If you write to us or send a project brief, we keep what you send (your name, email, phone number if you give it, and the brief itself) for as long as we are talking about the project, and for our records afterwards.",
          "If you book a project, buy from the store or join a monthly program, we keep your name, email, billing address and a record of what you bought and paid. We need these to deliver the work, send receipts and keep our tax records.",
          "If you subscribe to the newsletter we keep your email until you unsubscribe. Every email has a one-click unsubscribe link.",
        ],
      },
      {
        id: "how-we-use-it",
        heading: "How we use it",
        body: [
          "We use your information only to answer you, plan and deliver your project, take payment, send receipts and project updates, provide customer support, meet our legal and tax obligations, and prevent fraud.",
          "We do not use your information for advertising and we do not sell or rent it to anyone.",
        ],
      },
      {
        id: "payments",
        heading: "Payments",
        body: [
          "Card and bank payments are processed by Stripe, Inc. When you pay, your card or bank details go straight to Stripe over an encrypted connection. We never see or store your full card number.",
          "Stripe receives your payment details, name, email and billing address in order to process the payment and to protect against fraud. Stripe's use of that information is covered by Stripe's own privacy policy, available at stripe.com/privacy.",
          "We receive a record of the payment from Stripe (the amount, date, the last four digits of the card and the card brand) so we can match it to your project and answer billing questions.",
        ],
      },
      {
        id: "who-we-share-with",
        heading: "Who we share it with",
        body: [
          "We share information only with the service providers we need to run the studio, and only what each one needs: Stripe for payments, Vercel for hosting this site, and Google Workspace for email and file delivery. Each is bound by its own privacy and security commitments.",
          "We may also share information if the law requires it, or to protect our rights in a payment dispute. We never share it for anyone else's marketing.",
        ],
      },
      {
        id: "cookies",
        heading: "Cookies",
        body: [
          "The site itself sets no tracking or advertising cookies.",
          "Your light/dark preference is kept in your browser for the length of your visit and never leaves it.",
          "Embedded video players (YouTube) load from their privacy-enhanced domain, which sets no cookies until you press play. Once you do, YouTube's own privacy policy applies to that player.",
          "Stripe may set its own cookies on its checkout and payment pages to prevent fraud.",
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
        id: "security",
        heading: "How we keep it safe",
        body: [
          "The site and portal are served only over encrypted (HTTPS) connections. Payment details are handled entirely by Stripe, which is certified to PCI DSS Level 1, the highest standard in the payments industry.",
          "Access to client information is limited to the people working on your project.",
          "No system is perfectly secure. If we ever learn of a breach that affects your information, we will tell you promptly.",
        ],
      },
      {
        id: "retention",
        heading: "How long we keep it",
        body: [
          "We keep project and payment records for as long as the law requires for tax and accounting purposes, generally seven years. Everything else we keep only as long as it is useful for your project or our working relationship.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        body: [
          "You can ask what we hold about you, ask us to correct it, or ask us to delete it. Email us and we will do it within 30 days, except for records we are required by law to keep.",
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
    lead: "The ground rules for using this site, booking work with us, and paying for it.",
    updated: "November 13, 2026", // EDIT
    sections: [
      {
        id: "use-of-site",
        heading: "Using this site",
        body: [
          `${owner}. By using ${domain}, booking a project, joining a monthly program or buying from the store, you agree to these terms. If you do not agree, please do not use the site or our services.`,
          "The site is provided for information about the studio and its work. We may change, pause or remove any part of it at any time.",
        ],
      },
      {
        id: "services",
        heading: "What we offer",
        body: [
          "We produce music videos, commercials, brand films and short-form social content. We sell three kinds of work: custom productions quoted per project, fixed-price packages (such as a single premium vertical video), and monthly content programs. The store also sells apparel, prints and digital goods.",
          "What is included in each project or package, the price, and the delivery date are set out in your quote, invoice or production agreement before you pay anything.",
          `Starting prices, in US dollars: ${servicesList.map((x) => `${x.name.toLowerCase()} ${x.from.replace(/^From /, "from ").replace(/ USD$/, "")}`).join("; ")}. Every project is quoted on its brief.`,
          "We also run monthly content programs and single vertical videos for artists and brands; ask us for current rates. All prices are in US dollars. Projects are booked with a deposit and paid securely through Stripe. See our Refund & Cancellation Policy.",
        ],
      },
      {
        id: "booking-and-payment",
        heading: "Booking and payment",
        body: [
          "A brief sent through this site is a conversation starter, not a booking. Nothing is scheduled, and no price is final, until you accept a written quote or sign a production agreement and pay the deposit.",
          "Custom productions are booked with a deposit, usually 50% of the project price, which reserves your dates and pays for pre-production. The balance is due on the date shown on your invoice, before final files are delivered. Fixed-price packages are paid in full at booking.", // EDIT: match the agreement
          `All prices are in US dollars. Payments are processed securely by Stripe. Charges appear on your card statement as ${site.statementDescriptor}. You will get an emailed receipt for every payment.`,
          "Prices do not include sales tax unless stated. Where tax applies, it is shown on the invoice or at checkout.",
        ],
      },
      {
        id: "monthly-programs",
        heading: "Monthly programs and recurring billing",
        body: [
          "Monthly programs, such as the Content Accelerator Program, are billed automatically once a month on the date you joined, to the card you signed up with, until you cancel. The monthly price and exactly what each month includes are shown before you sign up and on your receipt.",
          "Each month's work (shoot time, number of edited videos, revisions and stills) is set out in the program description. Anything not used in a month does not roll over to the next month.",
          `You can cancel at any time by emailing ${site.email}. Cancelling stops the next charge. You keep everything already delivered, and you can still use the rest of the month you have paid for. See the Refund & Cancellation Policy for details.`,
          "If we change the price of a program, we will email you at least 30 days before the new price applies, so you can cancel first if you choose.",
        ],
      },
      {
        id: "delivery",
        heading: "Delivery",
        body: [
          "All work is delivered digitally, as download links or through the client portal. Nothing is shipped unless you buy a physical item from the store.",
          "Delivery dates are set in your quote or agreement. Monthly program edits are delivered within 72 hours of the shoot unless agreed otherwise. If a delay comes up on our side, we will tell you right away along with the new date.",
          "Delivery dates depend on you too: if footage, feedback, approvals or payments arrive late, the delivery date moves by the same amount of time.",
          "Physical store orders ship to the address you give at checkout. We email tracking details when your order ships.",
        ],
      },
      {
        id: "revisions",
        heading: "Revisions and approval",
        body: [
          "Each project includes the number of revision rounds stated in your quote, package or program (for example, one round per video in the Content Accelerator Program). Extra rounds, or changes to the agreed creative direction after approval, are quoted separately before any work is done.",
          "When you approve a cut, or do not ask for changes within 7 days of delivery, the work is treated as accepted.",
        ],
      },
      {
        id: "refunds",
        heading: "Refunds and cancellations",
        body: [
          "Refunds and cancellations are covered by our Refund & Cancellation Policy, which forms part of these terms.",
        ],
      },
      {
        id: "billing-questions",
        heading: "Billing questions and disputes",
        body: [
          `If a charge looks wrong or you are unhappy with the work, please contact us first at ${site.email}. We reply within one business day and will put it right, including a refund where our policy provides one. Most issues are resolved faster this way than through a bank dispute.`,
        ],
      },
      {
        id: "work-and-rights",
        heading: "The work and who owns it",
        body: [
          `Every film, frame, still and piece of writing on this site is owned by ${studio} or by the artists, labels and brands we made it for, and is protected by copyright.`,
          "You may watch and share links to the work. You may not download, re-upload, edit, re-cut, or use any of it commercially without written permission from us and from the rights holder.",
          "For work we make for you, the rights you receive are set out in your production agreement. Usage rights pass to you once the project is paid in full.",
          "Artist names, label marks and brand logos belong to their owners and appear here only to credit the work.",
        ],
      },
      {
        id: "store",
        heading: "Store purchases",
        body: [
          "Orders are confirmed by email. Prices are in US dollars and include no taxes or duties unless stated at checkout.",
          "Returns are covered by the Refund & Cancellation Policy.",
        ],
      },
      {
        id: "liability",
        heading: "Liability",
        body: [
          "The site is offered as-is. To the extent the law allows, we are not liable for any loss arising from using it or from relying on anything on it. For paid work, our total liability is limited to the amount you paid for that project.",
        ],
      },
      {
        id: "law",
        heading: "Governing law",
        body: [
          `These terms are governed by the laws of the State of ${site.lawState}, and any dispute will be heard in the state or federal courts located in ${site.lawState}.`, // EDIT: name the county once chosen
        ],
      },
      {
        id: "contact",
        heading: "Contact",
        body: [
          `${site.legalName}. Email ${site.email}${site.phone ? `, phone ${site.phone}` : ""}. Mailing address: ${site.street}${site.pmb ? `, PMB ${site.pmb}` : ""}, ${site.city}, ${site.region} ${site.postalCode}.`,
        ],
      },
    ],
  },
  {
    slug: "refunds",
    number: "006",
    title: "Refund & Cancellation Policy",
    lead: "How cancellations, rescheduling and refunds work for productions, packages, monthly programs and the store.",
    updated: "November 13, 2026", // EDIT
    sections: [
      {
        id: "summary",
        heading: "The short version",
        body: [
          "Cancel more than 14 days before your shoot and we refund your deposit, minus anything we have already spent on your project. Cancel inside 14 days and the deposit is kept, because the crew, gear and locations are already booked.", // EDIT: match the agreement
          "Monthly programs can be cancelled at any time and stop at the end of the month you paid for. Store items can be returned within 14 days. Digital downloads are final.",
          "If something goes wrong on our side, we fix it or refund you. That is our promise.",
        ],
      },
      {
        id: "productions",
        heading: "Custom productions",
        body: [
          "Your deposit reserves your dates and pays for pre-production: treatment, planning, and booking crew, gear and locations.",
          "If you cancel 15 or more days before the first shoot day, we refund your deposit minus any costs already paid out for your project (such as a treatment already delivered, location fees or crew deposits). We show you an itemized list of those costs.", // EDIT
          "If you cancel 14 days or fewer before the first shoot day, the deposit is non-refundable.", // EDIT
          "Once filming has taken place, the full project price is due and no refund is given for work already completed. If you end a project during post-production, you pay for the work done up to that point.",
        ],
      },
      {
        id: "rescheduling",
        heading: "Rescheduling, weather and illness",
        body: [
          "You can move your shoot date once at no charge if you tell us at least 7 days before the shoot. Later changes, or a second change, may carry the cost of any fees we cannot recover.", // EDIT
          "If weather, illness or anything else beyond either side's control prevents a shoot, we reschedule at no extra cost. Your deposit carries over to the new date.",
          "If the artist or talent does not show up on the day, the day is treated as used, and rebooking is quoted as a new shoot day.",
        ],
      },
      {
        id: "packages",
        heading: "Fixed-price packages",
        body: [
          "Packages such as a single premium vertical video are paid in full at booking.",
          "Cancel at least 72 hours before the shoot for a full refund. Cancel within 72 hours of the shoot and you can reschedule once, but the payment is not refunded. Once filming has happened the package is not refundable.", // EDIT
        ],
      },
      {
        id: "monthly-programs",
        heading: "Monthly programs",
        body: [
          `You can cancel a monthly program at any time by emailing ${site.email}. We confirm the cancellation by email.`,
          "Cancelling stops your next payment. You keep access to the rest of the month you have already paid for, and everything already delivered is yours to keep.",
          "We do not give partial refunds for unused shoot time, videos or days in a month. Unused deliverables do not roll over.",
          "If you are charged after you cancelled, or charged twice, tell us and we refund that charge in full.",
        ],
      },
      {
        id: "quality",
        heading: "If you are not happy with the work",
        body: [
          "Every project includes revision rounds so the final cut matches the brief you approved. Tell us what is not working and we will fix it within those rounds.",
          "Refunds are not given for changes of taste after a cut has been approved, or for creative direction outside the agreed brief. Those changes can be quoted as extra work.",
          "If we miss a delivery date by more than 14 days for reasons on our side, or cannot deliver the work we agreed, you can choose a full refund of the payments for the undelivered work.",
        ],
      },
      {
        id: "store",
        heading: "Store returns",
        body: [
          "Physical items (apparel, accessories and prints) can be returned unworn and unused, with tags attached, within 14 days of delivery for a refund of the item price. Shipping costs are not refunded unless the item arrived damaged or was the wrong item.",
          "If an item arrives damaged or wrong, email us a photo within 7 days and we will replace it or refund it in full, including shipping.",
          "Digital items (LUTs, presets and downloads) are final sale once delivered, because they cannot be returned. If a file is broken or will not download, we will replace it or refund it.",
        ],
      },
      {
        id: "how-to-request",
        heading: "How to cancel or ask for a refund",
        body: [
          `Email ${site.email}${site.phone ? ` or call ${site.phone}` : ""} with your name, the project or order, and what you would like to do. We reply within one business day.`,
          "Approved refunds go back to the original payment method. Once we issue them, they usually reach your account within 5 to 10 business days, depending on your bank.",
          `Charges appear on your statement as ${site.statementDescriptor}. If you don't recognize a charge, contact us before contacting your bank. We can usually sort it out the same day.`,
        ],
      },
      {
        id: "agreement",
        heading: "When there is a signed agreement",
        body: [
          "If you have signed a production agreement with us, its cancellation and payment terms apply to your project. Where the agreement says nothing, this policy applies.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    number: "007",
    title: "Disclaimer",
    lead: "A few plain statements about what this site is and is not.",
    updated: "November 13, 2026", // EDIT
    sections: [
      {
        id: "credits",
        heading: "Credits and attribution",
        body: [
          `Work shown here was produced, directed, shot or edited by ${studio} as credited on each project. Where a project was a collaboration, the other companies involved are named on the project page or in the video's own credits.`,
          "Project counts and years reflect our records at the date at the top of this page.",
        ],
      },
      {
        id: "third-parties",
        heading: "Third-party content",
        body: [
          "Videos play through YouTube. Links to other sites (press, partners, platforms) are provided for reference. We do not control those sites and are not responsible for what they publish.",
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
