"use client";

import dynamic from "next/dynamic";

// The 3D map loads in the browser only, after the page — Three.js stays out
// of every other page's bundle, and the page's text paints first.
const StudioMap = dynamic(() => import("./StudioMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#050505]" />,
});

export default StudioMap;
