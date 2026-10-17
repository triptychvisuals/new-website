import { projects } from "@/lib/projects";
import { youtubeThumbs } from "@/lib/youtube";
import WorkGridClient from "./WorkGridClient";

// EDIT: how many blurred video stills crossfade behind the headline.
const BACKDROPS = 7;

/**
 * "10 years strong" on a colour field made from the work itself: the small
 * stills of the newest music videos (lib/projects.ts), blurred and
 * crossfading as you scroll.
 */
export default function WorkGrid() {
  const backdrops = projects
    .filter((p) => p.youtube)
    .slice(0, BACKDROPS)
    .map((p) => youtubeThumbs(p.youtube!)[1]); // mqdefault — 320×180, no letterbox
  return <WorkGridClient backdrops={backdrops} />;
}
