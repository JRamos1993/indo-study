import Link from "next/link";
import { Icon } from "@/components/Icon";

// Placeholder until the social backend (accounts + friends + leaderboard)
// lands. Kept on-brand so the nav slot is real, not a dead link.
export default function CirclePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-[28px]">Circle</h1>
      <p className="mt-1 text-[15px] font-semibold" style={{ color: "var(--muted)" }}>
        Learn alongside friends — no leagues, no streaks-shaming. Just a shared weekly goal and who
        studied today.
      </p>

      <div
        className="mt-6 rounded-[18px] p-7 text-center"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-violet)" }}
      >
        <span
          className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px]"
          style={{ background: "var(--tint-lilac)", border: "2px solid var(--edge)" }}
        >
          <Icon name="people" size={28} strokeWidth={1.9} />
        </span>
        <h2 className="text-[20px]">Circle is coming soon</h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] font-semibold" style={{ color: "var(--text-body)" }}>
          Once accounts are switched on you’ll be able to invite friends, set a shared weekly word
          goal, and cheer each other on. Your learning works fully on this device until then.
        </p>
        <Link href="/today" className="btn btn-primary mt-5">
          Back to Today
        </Link>
      </div>
    </div>
  );
}
