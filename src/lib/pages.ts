// -------------------------------------------------------------------------
// EDIT: copy for the inner About pages — Who we are, Services & partners,
// Philosophy, Testimonials.
// -------------------------------------------------------------------------

export const founder = {
  name: "Lawrence “Law” Mahone",
  role: "Founder & director",
  bio: [
    "Law started Triptych in 2016, still a teenager, with one camera and a run-and-gun way of shooting videos for the artists around him in Chicago.",
    "Ten years and 500+ projects later he still directs — G Herbo, Wale, Lil Zay Osama, Queen Key and more — and still treats every video like the first one.",
  ],
};

export const values: { title: string; body: string }[] = [
  { title: "Chicago, first", body: "The city taught us how to shoot. Its artists are still the people we make work for." },
  { title: "Small crew, whole film", body: "Strategy, shoot and post under one roof — the same eyes from the treatment to the final grade." },
  { title: "Built to be watched", body: "Every frame earns its place. Nothing ships until we'd watch it twice." },
];

export type Service = { name: string; blurb: string; includes: string[]; from: string };
export const servicesList: Service[] = [
  { name: "Music videos", blurb: "Concept, treatment, shoot, edit and colour for singles and album rollouts.", includes: ["Treatment & look book", "Casting & locations", "Director + DP", "Edit, colour, VFX clean-up", "Vertical cutdowns"], from: "From $5k" },
  { name: "Commercials", blurb: "Spots for brands and labels — from one hero film to a full campaign.", includes: ["Creative development", "Production & permits", "Hero spot + cutdowns", "Sound mix", "Platform deliverables"], from: "From $15k" },
  { name: "Brand films", blurb: "Longer stories about the people and the work behind a brand.", includes: ["Interviews & B-roll", "Story edit", "Music licensing", "Captions & subtitles"], from: "From $10k" },
  { name: "Live & events", blurb: "Performances, release parties and tours, shot to feel like you were there.", includes: ["Multi-camera coverage", "Same-week recap", "Social clips"], from: "From $3k" },
  { name: "Post-production", blurb: "Bring footage you've shot; we cut, grade and finish it.", includes: ["Editing", "Colour grading", "Motion graphics", "Delivery masters"], from: "From $1.5k" },
];

export const process: { step: string; body: string }[] = [
  { step: "Brief", body: "You tell us the song, the brand, the deadline. We listen for what it needs to feel like." },
  { step: "Treatment", body: "A written + visual plan: the idea, references, locations, schedule and budget." },
  { step: "Shoot", body: "A tight crew, a clear shot list, room for the moment nobody planned." },
  { step: "Post", body: "Edit, colour, sound and every cut you'll need, reviewed in the portal." },
];

export const principles: { title: string; body: string }[] = [
  { title: "Start with the feeling", body: "Before the shot list, before the gear: what should someone feel at 0:30? Everything follows from the answer." },
  { title: "One idea, executed fully", body: "A video with one strong idea beats a video with ten. We'd rather go deep than wide." },
  { title: "Colour is story", body: "Our palette is a character. Every grade is chosen, never defaulted." },
  { title: "Respect the artist", body: "It's their song and their face. We build the frame around who they are, not around us." },
  { title: "Craft over gear", body: "Light, composition and timing make a frame. The camera is the last thing that matters." },
  { title: "Finish the last 10%", body: "The grade, the sound, the cutdown nobody asked for — the last stretch is where good becomes ours." },
];

export const triptych: { label: string; title: string; body: string }[] = [
  { label: "I", title: "The idea", body: "Every project begins as a sentence. If we can't say it simply, we can't shoot it well." },
  { label: "II", title: "The image", body: "The sentence becomes frames: light, colour, movement and the people in them." },
  { label: "III", title: "The impact", body: "The frames become something people watch, share and remember." },
];
