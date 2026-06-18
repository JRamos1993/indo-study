"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import {
  type CircleData,
  type CircleDetail,
  createCircle,
  getCircle,
  joinCircle,
  leaveCircle,
  setCircleGoal,
} from "@/lib/circle";

export default function CirclePage() {
  const auth = useAuth();
  const [data, setData] = useState<CircleData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await getCircle();
    if (res.ok) setData({ circles: res.circles ?? [], current: res.current ?? null });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auth.status !== "ready") return;
    if (!auth.user) {
      setLoading(false);
      return;
    }
    refresh();
  }, [auth.status, auth.user, refresh]);

  return (
    <div>
      <h1 className="text-[28px]">Circle</h1>
      <p className="mt-1 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
        Learn alongside friends — a shared weekly goal and who studied today. No leagues, no
        pressure.
      </p>

      <div className="mt-6">
        {auth.status === "loading" || (auth.user && loading) ? (
          <Panel>Loading…</Panel>
        ) : !auth.user ? (
          <SignedOut />
        ) : data?.current ? (
          <CircleView detail={data.current} onChange={refresh} />
        ) : (
          <NoCircle onChange={refresh} />
        )}
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-[18px] p-10 text-[14px] font-bold" style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--muted)" }}>
      {children}
    </div>
  );
}

function SignedOut() {
  return (
    <div className="rounded-[18px] p-7 text-center" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-violet)" }}>
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-[14px]" style={{ background: "var(--tint-lilac)", border: "2px solid var(--edge)" }}>
        <Icon name="people" size={28} strokeWidth={1.9} />
      </span>
      <h2 className="text-[20px]">Sign in to join a Circle</h2>
      <p className="mx-auto mt-2 max-w-sm text-[14px] font-semibold" style={{ color: "var(--text-body)" }}>
        Circles need an account so your shared activity can sync. Your solo learning works without
        one.
      </p>
      <Link href="/signin" className="btn btn-primary mt-5">Create account</Link>
    </div>
  );
}

function NoCircle({ onChange }: { onChange: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const create = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setErr(null);
    const res = await createCircle(name.trim());
    setBusy(false);
    if (res.ok) onChange();
    else setErr("Couldn't create the circle.");
  };
  const join = async () => {
    if (!code.trim()) return;
    setBusy(true);
    setErr(null);
    const res = await joinCircle(code.trim());
    setBusy(false);
    if (res.ok) onChange();
    else setErr(res.status === 404 ? "No circle with that code." : "Couldn't join.");
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] p-5" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--lilt-lime)" }}>
        <h2 className="text-[18px]">Start a circle</h2>
        <p className="mt-1 text-[13px] font-bold" style={{ color: "var(--muted)" }}>Create one and invite friends with a code.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bahasa buddies"
          className="mt-3 w-full rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] font-semibold outline-none"
        />
        <button onClick={create} disabled={busy || !name.trim()} className="btn btn-primary mt-3 w-full">Create circle</button>
      </div>
      <div className="rounded-[18px] p-5" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--lilt-violet)" }}>
        <h2 className="text-[18px]">Join with a code</h2>
        <p className="mt-1 text-[13px] font-bold" style={{ color: "var(--muted)" }}>Got an invite code from a friend?</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABC123"
          className="mt-3 w-full rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3.5 py-2.5 text-center font-display text-[18px] font-extrabold tracking-[0.2em] outline-none"
        />
        <button onClick={join} disabled={busy || !code.trim()} className="btn btn-secondary mt-3 w-full">Join circle</button>
      </div>
      {err && <p className="sm:col-span-2 text-[13px] font-bold" style={{ color: "var(--on-coral)" }}>{err}</p>}
    </div>
  );
}

function CircleView({ detail, onChange }: { detail: CircleDetail; onChange: () => void }) {
  const [copied, setCopied] = useState(false);
  const [goalInput, setGoalInput] = useState(String(detail.goal ?? 200));
  const goalPct = detail.goal ? Math.min(100, Math.round((detail.weekTotal / detail.goal) * 100)) : 0;

  const copy = () => {
    navigator.clipboard?.writeText(detail.joinCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  const saveGoal = async () => {
    const n = parseInt(goalInput, 10);
    if (!Number.isFinite(n)) return;
    const res = await setCircleGoal(detail.id, n);
    if (res.ok) onChange();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] p-5" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}>
        <div>
          <div className="font-display text-[22px] font-extrabold">{detail.name}</div>
          <div className="text-[13px] font-bold" style={{ color: "var(--muted)" }}>
            {detail.members.length} {detail.members.length === 1 ? "member" : "members"}
          </div>
        </div>
        <button onClick={copy} className="flex items-center gap-2 rounded-full px-4 py-2 font-display text-[14px] font-extrabold transition active:translate-y-0.5" style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}>
          <Icon name={copied ? "check" : "plus"} size={15} strokeWidth={2.6} />
          {copied ? "Copied!" : `Invite · ${detail.joinCode}`}
        </button>
      </div>

      {/* Weekly group goal */}
      <div className="rounded-[18px] p-5" style={{ background: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-violet)", color: "#fff" }}>
        <div className="flex items-center justify-between">
          <div className="font-display text-[17px] font-extrabold text-white">This week&apos;s circle goal</div>
          <div className="font-display text-[15px] font-extrabold" style={{ color: "var(--lilt-lime)" }}>
            {detail.weekTotal}{detail.goal ? ` / ${detail.goal}` : ""}
          </div>
        </div>
        {detail.goal ? (
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full" style={{ background: "#332b52", border: "1.5px solid var(--lilt-lime)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${goalPct}%`, background: "var(--lilt-lime)" }} />
          </div>
        ) : (
          <p className="mt-2 text-[13px] font-bold" style={{ color: "#b8b0da" }}>No goal set yet.</p>
        )}
        {detail.isOwner && (
          <div className="mt-3 flex items-center gap-2">
            <input
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-24 rounded-[10px] border-2 px-3 py-1.5 text-center font-display text-[15px] font-extrabold outline-none"
              style={{ background: "#332b52", borderColor: "#4a3f73", color: "#fff" }}
            />
            <button onClick={saveGoal} className="rounded-full px-4 py-1.5 text-[13px] font-extrabold" style={{ background: "var(--lilt-violet)", color: "#fff", border: "2px solid var(--lilt-lime)" }}>
              Set weekly words
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="section-label">This week</h2>
        <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
          {detail.members.map((m, i) => (
            <div
              key={m.handle ?? m.name + i}
              className="flex items-center gap-3.5 px-4 py-3"
              style={{ borderTop: i > 0 ? "1.5px solid var(--divider)" : undefined, background: m.isYou ? "var(--tint-violet)" : undefined }}
            >
              <span className="w-5 shrink-0 text-center font-display text-[15px] font-extrabold" style={{ color: i === 0 ? "var(--accent)" : "var(--text-disabled)" }}>{i + 1}</span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[14px] font-extrabold" style={{ background: m.studiedToday ? "var(--lilt-lime)" : "var(--tint-violet-2)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}>
                {(m.name[0] || "?").toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-extrabold">
                  {m.name}{m.isYou ? " (you)" : ""}
                </span>
                <span className="block text-[12px] font-bold" style={{ color: m.studiedToday ? "var(--on-lime)" : "var(--muted)" }}>
                  {m.studiedToday ? "Studied today" : "Not yet today"}
                  {m.role === "owner" ? " · owner" : ""}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-display text-[16px] font-extrabold">{m.weekReviews}</span>
                <span className="block text-[10.5px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>reviews</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {detail.feed.length > 0 && (
        <div>
          <h2 className="section-label">Recent activity</h2>
          <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
            {detail.feed.map((f, i) => (
              <div
                key={`${f.name}-${f.day}-${i}`}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderTop: i > 0 ? "1.5px solid var(--divider)" : undefined }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[12px] font-extrabold" style={{ background: f.isToday ? "var(--lilt-lime)" : "var(--tint-violet-2)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}>
                  {(f.name[0] || "?").toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 text-[13.5px] font-bold">
                  <b className="font-display">{f.isYou ? "You" : f.name}</b> did{" "}
                  <b className="font-display" style={{ color: "var(--lilt-violet)" }}>{f.reviews}</b> reviews
                </span>
                <span className="shrink-0 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  {dayLabel(f.day, detail.weekStart, f.isToday)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={async () => {
            await leaveCircle(detail.id);
            onChange();
          }}
          className="text-[13px] font-extrabold"
          style={{ color: "var(--signout)" }}
        >
          Leave circle
        </button>
      </div>
    </div>
  );
}

function dayLabel(day: string, _weekStart: string, isToday: boolean): string {
  if (isToday) return "Today";
  // day is YYYY-MM-DD; show "Mon", "Tue" etc. for the current week, else the date.
  const d = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en", { weekday: "short", timeZone: "UTC" });
}
