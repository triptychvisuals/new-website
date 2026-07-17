"use client";

import { useState } from "react";

/**
 * In-page sign-in for the private preview. Posts the password to /api/login,
 * which sets the cookie the proxy checks; on success we hard-navigate to the
 * originally requested page so the proxy sees the new cookie.
 */
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const next =
          new URLSearchParams(window.location.search).get("next") || "/";
        window.location.assign(next);
        return;
      }
      setError(true);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/triptych-logo.png"
            alt="Triptych"
            className="h-6 w-auto [filter:brightness(0)] dark:[filter:none]"
          />
          <p className="mt-5 text-sm text-muted">
            This site is a private preview.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            aria-label="Password"
            className="w-full rounded-2xl border border-hairline bg-background px-4 py-3.5 text-center text-[15px] tracking-wide text-foreground outline-none transition-colors placeholder:text-muted focus:border-foreground/40"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-2xl bg-foreground px-4 py-3.5 text-[15px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
          {error && (
            <p className="text-center text-[13px] text-red-500">
              Incorrect password. Try again.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
