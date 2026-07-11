/**
 * Red-rule section marker: a thin accent bar + mono uppercase label.
 * e.g.  | [WHO ARE WE]   | AWARDS   | RESULT
 */
export default function RuleLabel({
  children,
  className = "",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-l-2 border-accent pl-2 font-mono text-[11px] uppercase tracking-[0.15em] ${
        light ? "text-white/80" : "text-foreground"
      } ${className}`}
    >
      {children}
    </span>
  );
}
