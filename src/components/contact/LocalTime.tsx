"use client";

import { useEffect, useState } from "react";

// EDIT: the studio's time zone and hours (24h, local).
const ZONE = "America/Chicago";
const OPEN = 9;
const CLOSE = 18;

/** The studio's local time, and whether it's working hours right now. */
export default function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    const first = requestAnimationFrame(tick);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(first);
    };
  }, []);
  if (!now) return <span className="tabular-nums">--:-- --</span>;
  const time = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour: "numeric", minute: "2-digit" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour: "numeric", hour12: false }).format(now));
  const day = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, weekday: "short" }).format(now);
  const open = hour >= OPEN && hour < CLOSE && !["Sat", "Sun"].includes(day);
  return (
    <span className="inline-flex items-center gap-2 tabular-nums">
      {time} CT
      <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ${open ? "text-accent" : "text-muted"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-accent" : "bg-muted"}`} />
        {open ? "Open" : "After hours"}
      </span>
    </span>
  );
}
