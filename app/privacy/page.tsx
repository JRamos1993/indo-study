import type { Metadata } from "next";
import { PublicPage } from "@/components/PublicPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Lilt stores, why, and how you stay in control. No selling data, ever.",
};

export default function PrivacyPage() {
  return (
    <PublicPage>
      <h1 className="text-[34px] leading-tight">Privacy</h1>
      <p className="mt-2 text-[13px] font-bold" style={{ color: "var(--muted)" }}>
        Plain-English, and short. Last updated June 2026.
      </p>

      <div className="mt-7 space-y-6 text-[15px] leading-relaxed">
        <Section title="What we store">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b>Your account:</b> email address and a password that is salted, peppered and
              PBKDF2-hashed — we never store or see your actual password.
            </li>
            <li>
              <b>Your learning:</b> which words you’ve studied, spaced-repetition schedule, streak,
              daily activity and your settings — so your progress syncs across devices.
            </li>
            <li>
              <b>Anonymous usage:</b> aggregate events (sessions, accuracy, errors) tied to a random
              id, with <b>no</b> name, email or IP address. We honour “Do Not Track”.
            </li>
          </ul>
        </Section>

        <Section title="What we don’t do">
          <p>
            We don’t sell your data, run ad trackers, or set tracking cookies — just one essential,
            HttpOnly session cookie to keep you signed in. Your Circle shares only an aggregate daily
            review count, and only if you leave “Share activity” on.
          </p>
        </Section>

        <Section title="Where it lives">
          <p>
            Data is stored in Cloudflare’s D1 database. Your progress is also cached on your device so
            the app works offline.
          </p>
        </Section>

        <Section title="You’re in control">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              <b>Export</b> everything as a file any time — Settings → Backup.
            </li>
            <li>
              <b>Delete your account</b> — Settings → Manage account. It removes your account, progress,
              sessions and circle memberships immediately and permanently.
            </li>
            <li>
              <b>Turn off</b> analytics (Do Not Track), reminders, and activity sharing whenever you like.
            </li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Email{" "}
            <a className="font-bold underline" href="mailto:jplramos1993@gmail.com">
              jplramos1993@gmail.com
            </a>
            .
          </p>
        </Section>
      </div>
    </PublicPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[19px]">{title}</h2>
      <div style={{ color: "var(--text-body)" }}>{children}</div>
    </section>
  );
}
