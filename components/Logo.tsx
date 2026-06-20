/**
 * The Lilt wordmark — a single source of truth so the mark + name never drift
 * (an orphaned copy is how the old "Lingo" name lingered). `size` is the glyph
 * height in px; the wordmark scales with it.
 */
export function Logo({
  size = 32,
  wordmark = true,
  className,
}: {
  size?: number;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg viewBox="0 0 130 130" width={size} height={size} aria-hidden style={{ display: "block" }}>
        <path
          d="M26 24 h66 a18 18 0 0 1 18 18 v36 a18 18 0 0 1 -18 18 h-30 l-16 18 v-18 h-20 a18 18 0 0 1 -18 -18 v-36 a18 18 0 0 1 18 -18 z"
          fill="var(--lilt-yellow)"
          stroke="var(--edge)"
          strokeWidth="7"
        />
      </svg>
      {wordmark && (
        <span className="font-display font-extrabold tracking-tight" style={{ fontSize: Math.round(size * 0.7) }}>
          Lilt
        </span>
      )}
    </span>
  );
}
