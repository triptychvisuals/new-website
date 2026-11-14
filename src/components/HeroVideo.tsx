"use client";

import { useCallback, useState } from "react";
import HeroReel from "@/components/HeroReel";
import HeroYouTube from "@/components/HeroYouTube";
import { HERO_YOUTUBE } from "@/lib/hero";

/**
 * Everything that moves behind the hero: the lead YouTube video on top,
 * with the local clips (HeroReel) underneath as the instant start and the
 * fallback. Once the YouTube video has faded in, the local clips rest.
 * Leave HERO_YOUTUBE empty to go back to the local clips alone.
 */
export default function HeroVideo() {
  const [leadReady, setLeadReady] = useState(false);
  const ready = useCallback(() => setLeadReady(true), []);
  return (
    <>
      <HeroReel resting={leadReady} />
      {HERO_YOUTUBE && <HeroYouTube id={HERO_YOUTUBE} onReady={ready} />}
    </>
  );
}
