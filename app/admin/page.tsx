"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/Icon";

type Metrics = {
  totalUsers: number;
  activeToday: number;
  active7d: number;
  sessionsToday: number;
  sessionsStartedToday: number;
  accuracy7d: number | null;
  dau: { day: string; c: number }[];
  signups: { day: string; c: number }[];
  topErrors: { msg: string; c: number }[];
};

type State = { kind: "loading" } | { kind: "denied" } | { kind: "error" } | { kind: "ok"; m: Metrics };

export default function AdminPage() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/events/metrics", { credentials: "include" })
      .then(async (r) => {
        if (!alive) return;
        if (r.status === 401 || r.status === 403) return setState({ kind: "denied" });
        if (!r.ok) return setState({ kind: "error" });
        setState({ kind: "ok", m: (await r.json()) as Metrics });
      })
      .catch(() => alive && setState({ kind: "error" }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <header className="mb-7">
        <span className="eyebrow">Owner only</span>
        <h1 className="mt-1.5 text-[30px] leading-none">Dashboard</h1>
        <p className="mt-2 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
          Live product metrics — anonymous, no personal data.
        </p>
      </header>

      {state.kind === "loading" && <Panel>Loading…</Panel>}
      {state.kind === "denied" && <Panel>This page is for the account owner.</Panel>}
      {state.kind === "error" && <Panel>Couldn’t load metrics. Try again shortly.</Panel>}
      {state.kind === "ok" && <Dashboard m={state.m} />}
    </div>
  );
}

function Dashboard({ m }: { m: Metrics }) {
  const dau = fillDays(m.dau, 14);
  const signups7 = m.signups.slice(-7).reduce((s, d) => s + d.c, 0);
  const completion =
    m.sessionsStartedToday > 0 ? Math.round((100 * m.sessionsToday) / m.sessionsStartedToday) : null;

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Kpi big={`${m.activeToday}`} label="Active today" icon="flame" tint="var(--tint-coral)" shadow="var(--lilt-coral)" />
        <Kpi big={`${m.active7d}`} label="Active (7d)" icon="people" tint="var(--tint-violet-2)" shadow="var(--lilt-violet)" />
        <Kpi big={`${m.totalUsers}`} label="Total accounts" icon="star" tint="var(--tint-lime)" shadow="var(--lilt-lime)" />
        <Kpi
          big={m.accuracy7d == null ? "—" : `${m.accuracy7d}%`}
          label="Accuracy (7d)"
          icon="check"
          tint="var(--tint-yellow)"
          shadow="var(--lilt-yellow)"
        />
      </div>

      <Card title="Active users" sub="distinct learners per day · last 14 days">
        <BarRow data={dau} />
      </Card>

      <div className="grid gap-3.5 sm:grid-cols-3">
        <MiniStat label="Sessions today" value={`${m.sessionsToday}`} />
        <MiniStat label="Completion today" value={completion == null ? "—" : `${completion}%`} />
        <MiniStat label="New accounts (7d)" value={`${signups7}`} />
      </div>

      <Card title="Top errors" sub="last 7 days — fix these first">
        {m.topErrors.length === 0 ? (
          <p className="px-5 py-5 text-[14px] font-bold" style={{ color: "var(--muted)" }}>
            No client errors reported. 🎉
          </p>
        ) : (
          <ul>
            {m.topErrors.map((e, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-5 py-3"
                style={{ borderTop: i ? "1.5px solid var(--divider)" : undefined }}
              >
                <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] font-bold">{e.msg}</span>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-extrabold"
                  style={{ background: "var(--tint-coral)", color: "var(--on-coral)", border: "2px solid var(--border-soft)" }}
                >
                  {e.c}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function fillDays(rows: { day: string; c: number }[], n: number): { day: string; c: number }[] {
  const byDay = new Map(rows.map((r) => [r.day, r.c]));
  const out: { day: string; c: number }[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const day = new Date(d.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push({ day, c: byDay.get(day) ?? 0 });
  }
  return out;
}

function BarRow({ data }: { data: { day: string; c: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.c));
  return (
    <div className="flex items-end justify-between gap-1.5 px-5 py-5" style={{ height: 140 }}>
      {data.map((d, i) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-extrabold" style={{ color: d.c > 0 ? "var(--ink)" : "var(--text-disabled)" }}>
            {d.c}
          </span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-[6px]"
              style={{
                height: `${Math.max(d.c > 0 ? 6 : 0, (d.c / max) * 100)}%`,
                background: d.c > 0 ? (i === data.length - 1 ? "var(--lilt-violet)" : "var(--tint-lilac)") : "transparent",
                border: d.c > 0 ? "2px solid var(--edge)" : undefined,
                borderBottom: d.c > 0 ? "none" : undefined,
              }}
              title={`${d.day}: ${d.c}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid h-40 place-items-center rounded-[18px] text-center text-[14px] font-bold"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--muted)" }}
    >
      <span className="px-6">{children}</span>
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <section
      className="overflow-hidden rounded-[18px]"
      style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}
    >
      <div className="px-5 pt-4">
        <h2 className="text-[18px]">{title}</h2>
        <p className="text-[12px] font-bold" style={{ color: "var(--muted)" }}>
          {sub}
        </p>
      </div>
      {children}
    </section>
  );
}

function Kpi({ big, label, icon, tint, shadow }: { big: string; label: string; icon: IconName; tint: string; shadow: string }) {
  return (
    <div className="rounded-[16px] p-4" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: `3px 3px 0 0 ${shadow}` }}>
      <span className="mb-3 grid h-9 w-9 place-items-center rounded-[10px]" style={{ background: tint, border: "2px solid var(--edge)", color: "var(--ink)" }}>
        <Icon name={icon} size={19} strokeWidth={2} />
      </span>
      <div className="font-display text-[26px] font-extrabold leading-none">{big}</div>
      <div className="mt-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.04em]" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] px-5 py-4" style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}>
      <div className="font-display text-[22px] font-extrabold leading-none">{value}</div>
      <div className="mt-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.04em]" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
