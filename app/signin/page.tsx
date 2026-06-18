"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { login, recover, signup } from "@/lib/auth";

type Mode = "signup" | "login" | "recover";

const ERRORS: Record<string, string> = {
  invalid_credentials: "That email and password don't match.",
  email_taken: "An account with that email already exists.",
  invalid_email: "Please enter a valid email address.",
  weak_password: "Use at least 8 characters.",
  missing_name: "Please tell us your name.",
  invalid_recovery: "That email and recovery key don't match.",
  rate_limited: "Too many attempts — try again in a minute.",
  bad_origin: "Request blocked. Please reload and try again.",
  network: "Can't reach the server. Please check your connection.",
};

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 130 130" className="h-9 w-9" aria-hidden>
        <path
          d="M26 24 h66 a18 18 0 0 1 18 18 v36 a18 18 0 0 1 -18 18 h-30 l-16 18 v-18 h-20 a18 18 0 0 1 -18 -18 v-36 a18 18 0 0 1 18 -18 z"
          fill="var(--lilt-yellow)"
          stroke="var(--edge)"
          strokeWidth="7"
        />
      </svg>
      <span className="font-display text-[24px] font-extrabold tracking-tight">Lilt</span>
    </span>
  );
}

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // After signup/recover we show the recovery key before moving on.
  const [recovery, setRecovery] = useState<{ value: string; next: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res =
      mode === "signup"
        ? await signup(email, password, name)
        : mode === "recover"
          ? await recover(email, key, password)
          : await login(email, password);
    setBusy(false);
    if (!res.ok) {
      setError(ERRORS[res.error ?? "network"] ?? "Something went wrong.");
      return;
    }
    if (mode === "login") {
      router.push("/today");
    } else {
      // signup → onboarding; recover → straight back in.
      setRecovery({ value: res.recoveryKey ?? "", next: mode === "signup" ? "/onboarding" : "/today" });
    }
  };

  // ── recovery-key reveal ──
  if (recovery) {
    return (
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col justify-center px-5 py-8">
        <div className="mb-6"><Logo /></div>
        <div
          className="rounded-[22px] p-6 sm:p-7"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-lime)" }}
        >
          <h1 className="text-[22px] leading-tight">Save your recovery key</h1>
          <p className="mt-1.5 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>
            This is the only way to reset your password if you forget it. Store it somewhere safe —
            we can&apos;t show it again.
          </p>
          <div
            className="mt-4 flex items-center justify-between gap-3 rounded-[14px] px-4 py-3"
            style={{ background: "var(--tint-lime)", border: "2px solid var(--edge)" }}
          >
            <code className="font-display text-[16px] font-extrabold tracking-[0.08em]" style={{ color: "var(--lilt-ink)" }}>
              {recovery.value}
            </code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(recovery.value).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
              className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-extrabold"
              style={{ background: "var(--lilt-ink)", color: "#fff", border: "2px solid var(--edge)" }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => router.push(recovery.next)}
            className="btn btn-primary mt-5 w-full"
          >
            I&apos;ve saved it — continue
            <Icon name="arrow" size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    );
  }

  const titles: Record<Mode, { h: string; p: string; cta: string }> = {
    signup: { h: "Create your account", p: "Sync your streak and mastery across devices, and join a Circle.", cta: "Create account" },
    login: { h: "Welcome back", p: "Sign in to pick up where you left off.", cta: "Sign in" },
    recover: { h: "Reset your password", p: "Enter your email and the recovery key you saved at sign-up.", cta: "Reset password" },
  };
  const t = titles[mode];

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col justify-center px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/" className="text-[12.5px] font-extrabold" style={{ color: "var(--muted)" }}>
          ← Home
        </Link>
      </div>

      <div
        className="rounded-[22px] p-6 sm:p-7"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)" }}
      >
        <h1 className="text-[24px] leading-tight">{t.h}</h1>
        <p className="mt-1.5 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>{t.p}</p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {mode === "signup" && (
            <Field label="Name" value={name} onChange={setName} type="text" placeholder="Maya" autoComplete="name" />
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" autoComplete="email" />
          {mode === "recover" && (
            <Field label="Recovery key" value={key} onChange={setKey} type="text" placeholder="ABCD-EF2H-…" autoComplete="off" />
          )}
          <Field
            label={mode === "recover" ? "New password" : "Password"}
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="At least 8 characters"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error && (
            <p
              className="rounded-[12px] px-3 py-2 text-[13px] font-bold"
              style={{ background: "var(--tint-coral)", color: "var(--on-coral)", border: "2px solid var(--edge)" }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn btn-primary mt-1 w-full">
            {busy ? "…" : t.cta}
            {!busy && <Icon name="arrow" size={16} strokeWidth={2.4} />}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-1.5 text-center text-[13px] font-bold" style={{ color: "var(--muted)" }}>
          {mode === "signup" ? (
            <button onClick={() => { setMode("login"); setError(null); }} style={{ color: "var(--muted)" }}>
              Already have an account? <span className="font-extrabold" style={{ color: "var(--accent)" }}>Sign in</span>
            </button>
          ) : (
            <button onClick={() => { setMode("signup"); setError(null); }} style={{ color: "var(--muted)" }}>
              New to Lilt? <span className="font-extrabold" style={{ color: "var(--accent)" }}>Create one</span>
            </button>
          )}
          {mode === "login" && (
            <button onClick={() => { setMode("recover"); setError(null); }} className="font-extrabold" style={{ color: "var(--accent)" }}>
              Forgot your password?
            </button>
          )}
          {mode === "recover" && (
            <button onClick={() => { setMode("login"); setError(null); }} className="font-extrabold" style={{ color: "var(--accent)" }}>
              ← Back to sign in
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[12px] font-bold" style={{ color: "var(--muted)" }}>
        Free account. Your streak and progress sync across every device you sign in on.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-extrabold uppercase tracking-[0.05em]" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[12px] border-2 border-[color:var(--edge)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] font-semibold outline-none"
      />
    </label>
  );
}
