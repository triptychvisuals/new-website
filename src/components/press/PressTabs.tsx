import Link from "next/link";

// EDIT: the Press tabs — labels + routes.
const TABS = [
  { key: "news", label: "In the news", href: "/press" },
  { key: "kit", label: "Press kit", href: "/press/kit" },
] as const;

export default function PressTabs({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav aria-label="Press" className="mt-6 flex gap-2 sm:mt-8">
      {TABS.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={t.key === active ? "page" : undefined}
          className={`rounded-full border px-4 py-1.5 text-[14px] transition-colors ${
            t.key === active
              ? "border-foreground bg-foreground text-background"
              : "border-hairline text-muted hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
