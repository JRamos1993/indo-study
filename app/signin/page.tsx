"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { login, signup } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  invalid_credentials: "That email and password don't match.",
  email_taken: "An account with that email already exists.",
  invalid_email: "Please enter a valid email address.",
  weak_password: "Use at least 8 characters.",
  missing_name: "Please tell us your name.",
  rate_limited: "Too many attempts — try again in a minute.",
  bad_origin: "Request blocked. Please reload and try again.",
  network: "Can't reach the server. Your progress still works offline.",
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
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = mode === "signup" ? await signup(email, password, name) : await login(email, password);
    setBusy(false);
    if (res.ok) router.push("/today");
    else setError(ERRORS[res.error ?? "network"] ?? "Something went wrong.");
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col justify-center px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/today" className="text-[12.5px] font-extrabold" style={{ color: "var(--muted)" }}>
          Skip →
        </Link>
      </div>

      <div
        className="rounded-[22px] p-6 sm:p-7"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "5px 5px 0 0 var(--lilt-violet)" }}
      >
        <h1 className="text-[24px] leading-tight">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-[13.5px] font-bold" style={{ color: "var(--muted)" }}>
          {mode === "signup"
            ? "Sync your streak and mastery across devices, and join a Circle."
            : "Sign in to pick up where you left off."}
        </p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {mode === "signup" && (
            <Field label="Name" value={name} onChange={setName} type="text" placeholder="Maya" autoComplete="name" />
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@example.com" autoComplete="email" />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="At least 8 characters"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          {error && (
            <p
              className="rounded-[12px] px-3 py-2 text-[13px] font-bold"
              style={{ background: "var(--tint-coral)", color: "var(--on-coral)", border: "2px solid var(--edge)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-[15px] font-extrabold transition active:translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "2px solid var(--edge)", boxShadow: "3px 3px 0 0 var(--edge)" }}
          >
            {busy ? "…" : mode === "signup" ? "Create account" : "Sign in"}
            {!busy && <Icon name="arrow" size={16} strokeWidth={2.4} />}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] font-bold" style={{ color: "var(--muted)" }}>
          {mode === "signup" ? "Already have an account?" : "New to Lilt?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError(null);
            }}
            className="font-extrabold"
            style={{ color: "var(--accent)" }}
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>

      <p className="mt-4 text-center text-[12px] font-bold" style={{ color: "var(--muted)" }}>
        Your progress works on this device without an account — signing in just syncs it.
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
