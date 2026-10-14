import type { Metadata } from "next";

// The sign-in screen is never a search result.
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
