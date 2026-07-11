// Central GSAP setup — import { gsap, ScrollTrigger } from "@/lib/gsap" everywhere
// so the plugin is only registered once.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
