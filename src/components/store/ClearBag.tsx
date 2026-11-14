"use client";

import { useEffect } from "react";

// EDIT: must match the bag's storage key in StoreClient.tsx
const KEY = "triptych-bag";

/** Empties the saved bag once an order has gone through. */
export default function ClearBag({ when }: { when: boolean }) {
  useEffect(() => {
    if (!when) return;
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, [when]);
  return null;
}
