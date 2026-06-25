import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triptych Studios — Imagination in Motion",
  description: "A film & image studio crafting high-end cinematic stories and immersive experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
