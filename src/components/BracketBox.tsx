/**
 * Wraps children with small corner-bracket marks (the framing device used on
 * the CONTACT buttons and the testimonial arrows in the reference).
 */
export default function BracketBox({
  children,
  className = "",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  const c = light ? "border-white/60" : "border-foreground/40";
  const corner = `pointer-events-none absolute h-2.5 w-2.5 ${c}`;
  return (
    <div className={`relative ${className}`}>
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
      {children}
    </div>
  );
}
