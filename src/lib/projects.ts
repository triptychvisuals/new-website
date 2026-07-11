// -------------------------------------------------------------------------
// EDIT: Real Triptych projects go here.
//
// This is the single source of truth for the gallery. Replace the placeholder
// entries below with real work — title + client are all you strictly need.
// When assets are ready, point `src` at a still (/public/work/x.jpg) or a
// muted looping preview (/public/work/x.mp4); until then a generated gradient
// stands in so the grid still reads. Order here == order on the page; the
// bracketed [n] index is derived automatically.
// -------------------------------------------------------------------------

export type Project = {
  title: string;
  client: string;
  /** EDIT: real still image, e.g. "/work/echoes.jpg" */
  src?: string;
  /** EDIT: muted looping hover preview, e.g. "/work/echoes.mp4" */
  video?: string;
};

export const projects: Project[] = [
  { title: "Echoes of the City", client: "URBANFRAME STUDIO" }, // EDIT
  { title: "Shadow of Tomorrow", client: "HORIZON PICTURES" }, // EDIT
  { title: "Silent Horizon", client: "NOVA FILMS" }, // EDIT
  { title: "Beyond the Last Frame", client: "ATLAS MOTION" }, // EDIT
  { title: "The Midnight Route", client: "NORTH DISTRICT FILMS" }, // EDIT
  { title: "Broken Skyline", client: "SILVERLINE PRODUCTIONS" }, // EDIT
  { title: "Fragments of Light", client: "LUMINA STUDIOS" }, // EDIT
  { title: "The Final Signal", client: "APEX NARRATIVE" }, // EDIT
  { title: "Drive the Future", client: "MOTIONDRIVE" }, // EDIT
  { title: "Pure Motion", client: "VELOCITY MOTORS" }, // EDIT
  { title: "Urban Energy", client: "METROGRID" }, // EDIT
  { title: "The Midnight Route V2", client: "CLAB" }, // EDIT
];

// Deterministic film-still-ish gradient per card, so the placeholder grid feels
// alive instead of flat gray. EDIT: delete once every project has real media.
const GRADIENTS = [
  ["#3a2e26", "#7a5c3e"], // warm amber
  ["#1c1c22", "#40404d"], // slate
  ["#2a1618", "#7c2b2f"], // deep red (cinema)
  ["#12211f", "#2f5d54"], // teal
  ["#241f2e", "#5a4a7a"], // dusk violet
  ["#0f1720", "#334155"], // cool blue
];

export function placeholderGradient(index: number): string {
  const [a, b] = GRADIENTS[index % GRADIENTS.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}
