"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { changePassword, deleteAccount, logout, useAuth } from "@/lib/auth";
import { getAllItems } from "@/lib/data";
import { LANG_IDS, getLanguage } from "@/lib/languages";
import { masteryPercent, summarize, useProgress } from "@/lib/progress";
import { useProfile, updateProfile } from "@/lib/profile";
import { useSettings } from "@/lib/settings";
import { currentStreak, useStats } from "@/lib/stats";
import { useMounted } from "@/lib/useMounted";

function levelLabel(pct: number): string {
  if (pct < 34) return "Starter";
  if (pct < 67) return "Building";
  return "Elementary";
}

export default function ProfilePage() {
  const profile = useProfile();
  const auth = useAuth();
  const store = useProgress();
  const stats = useStats();
  const settings = useSettings();
  const mounted = useMounted();
  const [editing, setEditing] = useState(false);

  const langs = useMemo(
    () =>
      LANG_IDS.map((id) => {
        const ids = getAllItems(id).map((c) => c.item.id);
        const sum = summarize(store, ids);
        return { id, cfg: getLanguage(id), total: ids.length, strong: sum.mastered, pct: mounted ? masteryPercent(store, ids) : 0 };
      }),
    [store, mounted],
  );

  const streak = mounted ? currentStreak(stats) : 0;
  const totalStrong = langs.reduce((n, l) => n + l.strong, 0);
  const initial = (profile.name.trim()[0] || "L").toUpperCase();

  return (
    <div>
      <h1 className="text-[28px]">Profile</h1>
      <p className="mt-1 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
        You, your languages, and how Lilt is set up.
      </p>

      {/* Profile header */}
      <div
        className="mt-6 rounded-[20px] p-5"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)" }}
      >
        <div className="flex items-center gap-4">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] font-display text-[28px] font-extrabold"
            style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--edge)" }}
          >
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="Your name"
                  className="rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3 py-1.5 font-display text-[18px] font-extrabold outline-none"
                />
                <div className="flex items-center gap-1.5 rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3 py-1.5">
                  <span className="text-[14px] font-bold" style={{ color: "var(--muted)" }}>@</span>
                  <input
                    value={profile.handle}
                    onChange={(e) => updateProfile({ handle: e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase() })}
                    placeholder="handle"
                    className="w-full bg-transparent text-[14px] font-bold outline-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[22px] font-extrabold">{profile.name}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.05em]"
                    style={{ background: "var(--lilt-yellow)", color: "var(--lilt-ink)", border: "1.5px solid var(--edge)" }}
                  >
                    Local
                  </span>
                </div>
                <div className="text-[13px] font-bold" style={{ color: "var(--muted)" }}>@{profile.handle}</div>
              </>
            )}
          </div>
          <button
            onClick={() => setEditing((e) => !e)}
            className="shrink-0 rounded-full px-4 py-2 text-[13px] font-extrabold transition active:translate-y-0.5"
            style={{ background: editing ? "var(--accent)" : "var(--surface)", color: editing ? "var(--accent-ink)" : "var(--ink)", border: "2px solid var(--edge)" }}
          >
            {editing ? "Done" : "Edit"}
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <Stat n={mounted ? `${streak}` : "—"} label="day streak" />
          <span className="w-0.5" style={{ background: "var(--divider)" }} />
          <Stat n={mounted ? `${totalStrong}` : "—"} label="words strong" />
          <span className="w-0.5" style={{ background: "var(--divider)" }} />
          <Stat n={`${LANG_IDS.length}`} label="languages" />
        </div>
      </div>

      {/* Languages */}
      <h2 className="section-label mt-8">Your languages</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {langs.map((l) => {
          const active = l.id === settings.studyLanguage;
          return (
            <div
              key={l.id}
              className="rounded-[16px] p-4"
              style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: active ? "3px 3px 0 0 var(--lilt-violet)" : "3px 3px 0 0 var(--edge)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[26px]" aria-hidden>{l.cfg.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[16px] font-extrabold">{l.cfg.name}</div>
                  <div className="text-[12px] font-bold" style={{ color: "var(--muted)" }}>
                    {mounted ? levelLabel(l.pct) : "—"} · {l.strong}/{l.total} strong
                  </div>
                </div>
                {active && (
                  <span className="rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase" style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "1.5px solid var(--edge)" }}>
                    Active
                  </span>
                )}
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--track)", border: "1.5px solid var(--edge)" }}>
                <div className="h-full" style={{ width: `${l.pct}%`, background: l.pct >= 100 ? "var(--lilt-lime)" : "var(--accent)" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Account & sync */}
      <h2 className="section-label mt-8">Account &amp; sync</h2>
      <div
        className="flex flex-col gap-4 rounded-[18px] p-5 sm:flex-row sm:items-center"
        style={{ background: "var(--lilt-ink)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-violet)", color: "#fff" }}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]" style={{ background: "#332b52", border: "2px solid var(--lilt-lime)", color: "var(--lilt-lime)" }}>
          <Icon name={auth.user ? "check" : "refresh"} size={24} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          {auth.user ? (
            <>
              <div className="font-display text-[17px] font-extrabold text-white">Signed in &amp; syncing</div>
              <div className="mt-0.5 truncate text-[13px] font-bold" style={{ color: "#b8b0da" }}>
                {auth.user.email}
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-[17px] font-extrabold text-white">Sync across devices</div>
              <div className="mt-0.5 text-[13px] font-bold" style={{ color: "#b8b0da" }}>
                Your progress lives on this device. Create an account to carry your streak and
                mastery to your phone — and to join a Circle.
              </div>
            </>
          )}
        </div>
        {auth.user ? (
          <button
            onClick={() => logout()}
            className="shrink-0 rounded-full px-5 py-2.5 text-center text-[13px] font-extrabold transition active:translate-y-0.5"
            style={{ background: "#332b52", color: "#fff", border: "2px solid var(--lilt-coral)" }}
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/signin"
            className="shrink-0 rounded-full px-5 py-2.5 text-center font-display text-[14px] font-extrabold transition active:translate-y-0.5"
            style={{ background: "var(--lilt-lime)", color: "var(--lilt-ink)", border: "2px solid var(--lilt-lime)" }}
          >
            {auth.status === "loading" ? "…" : "Create account"}
          </Link>
        )}
      </div>

      {auth.user && <ManageAccount />}

      {/* Preferences + data */}
      <h2 className="section-label mt-8">Settings</h2>
      <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
        <Row href="/settings" icon="gear" label="Preferences" desc="Goal, theme, retention, direction" />
        <Row href="/guide/pronunciation" icon="book" label="Pronunciation guide" desc="Sounds, kana charts, examples" border />
        <Row href="/stats" icon="bars" label="Progress & stats" desc="Streak, forecast, mastery" border />
      </div>
    </div>
  );
}

function ManageAccount() {
  const router = useRouter();
  const [open, setOpen] = useState<"pw" | "del" | null>(null);
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwBusy, setPwBusy] = useState(false);
  const [delPw, setDelPw] = useState("");
  const [delErr, setDelErr] = useState<string | null>(null);
  const [delBusy, setDelBusy] = useState(false);

  const field = "w-full rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3.5 py-2.5 text-[14px] font-semibold outline-none";

  const doChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwBusy(true);
    setPwMsg(null);
    const r = await changePassword(cur, nw);
    setPwBusy(false);
    if (r.ok) {
      setPwMsg({ ok: true, text: "Password changed." });
      setCur("");
      setNw("");
    } else {
      setPwMsg({
        ok: false,
        text:
          r.error === "invalid_credentials"
            ? "Current password is wrong."
            : r.error === "weak_password"
              ? "Use at least 8 characters."
              : "Couldn't change password.",
      });
    }
  };

  const doDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDelBusy(true);
    setDelErr(null);
    const r = await deleteAccount(delPw);
    setDelBusy(false);
    if (r.ok) router.push("/");
    else setDelErr(r.error === "invalid_credentials" ? "Password is wrong." : "Couldn't delete account.");
  };

  return (
    <>
      <h2 className="section-label mt-8">Manage account</h2>
      <div className="overflow-hidden rounded-[18px]" style={{ background: "var(--surface)", border: "2px solid var(--edge)" }}>
        <button onClick={() => setOpen((o) => (o === "pw" ? null : "pw"))} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]" style={{ background: "var(--tint-violet-2)", border: "2px solid var(--edge)" }}>
            <Icon name="gear" size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15px] font-extrabold">Change password</span>
            <span className="block text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>Update your password</span>
          </span>
          <span style={{ transform: open === "pw" ? "rotate(90deg)" : "none", color: "var(--muted)" }}>
            <Icon name="arrow" size={17} strokeWidth={2.2} />
          </span>
        </button>
        {open === "pw" && (
          <form onSubmit={doChange} className="flex flex-col gap-2.5 px-4 pb-4" style={{ borderTop: "1.5px solid var(--divider)" }}>
            <input className={`${field} mt-3`} type="password" placeholder="Current password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} required />
            <input className={field} type="password" placeholder="New password (8+ chars)" autoComplete="new-password" value={nw} onChange={(e) => setNw(e.target.value)} required />
            {pwMsg && (
              <p className="text-[13px] font-bold" style={{ color: pwMsg.ok ? "var(--on-lime)" : "var(--on-coral)" }}>{pwMsg.text}</p>
            )}
            <button type="submit" disabled={pwBusy} className="btn btn-primary self-start">{pwBusy ? "…" : "Update password"}</button>
          </form>
        )}

        <button onClick={() => setOpen((o) => (o === "del" ? null : "del"))} className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left" style={{ borderTop: "1.5px solid var(--divider)" }}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]" style={{ background: "var(--tint-coral)", border: "2px solid var(--edge)" }}>
            <Icon name="flame" size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15px] font-extrabold" style={{ color: "var(--signout)" }}>Delete account</span>
            <span className="block text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>Permanently remove your account and data</span>
          </span>
          <span style={{ transform: open === "del" ? "rotate(90deg)" : "none", color: "var(--muted)" }}>
            <Icon name="arrow" size={17} strokeWidth={2.2} />
          </span>
        </button>
        {open === "del" && (
          <form onSubmit={doDelete} className="flex flex-col gap-2.5 px-4 pb-4" style={{ borderTop: "1.5px solid var(--divider)" }}>
            <p className="mt-3 text-[13px] font-bold" style={{ color: "var(--text-body)" }}>
              This permanently deletes your account, synced progress and Circle membership. It can&apos;t be undone.
            </p>
            <input className={field} type="password" placeholder="Confirm your password" autoComplete="current-password" value={delPw} onChange={(e) => setDelPw(e.target.value)} required />
            {delErr && <p className="text-[13px] font-bold" style={{ color: "var(--on-coral)" }}>{delErr}</p>}
            <button type="submit" disabled={delBusy} className="self-start rounded-full px-5 py-2.5 text-[13px] font-extrabold transition active:translate-y-0.5" style={{ background: "var(--signout)", color: "#fff", border: "2px solid var(--edge)" }}>
              {delBusy ? "…" : "Delete my account forever"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[20px] font-extrabold">{n}</div>
      <div className="text-[11.5px] font-bold" style={{ color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

function Row({ href, icon, label, desc, border }: { href: string; icon: "gear" | "book" | "bars"; label: string; desc: string; border?: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 px-4 py-3.5"
      style={border ? { borderTop: "1.5px solid var(--divider)" } : undefined}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px]" style={{ background: "var(--tint-violet-2)", border: "2px solid var(--edge)" }}>
        <Icon name={icon} size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-extrabold">{label}</span>
        <span className="block text-[12.5px] font-bold" style={{ color: "var(--muted)" }}>{desc}</span>
      </span>
      <Icon name="arrow" size={18} strokeWidth={2.2} className="shrink-0" />
    </Link>
  );
}
