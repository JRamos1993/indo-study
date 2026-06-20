import type { Metadata } from "next";
import { PublicPage } from "@/components/PublicPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The simple terms for using Lilt.",
};

export default function TermsPage() {
  return (
    <PublicPage>
      <h1 className="text-[34px] leading-tight">Terms of use</h1>
      <p className="mt-2 text-[13px] font-bold" style={{ color: "var(--muted)" }}>
        The short version. Last updated June 2026.
      </p>

      <div className="mt-7 space-y-6 text-[15px] leading-relaxed">
        <Section title="The gist">
          <p>
            Lilt is a language-learning app provided free, as-is. Use it to learn — be reasonable, and
            it’s yours to enjoy.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You’re responsible for activity on your account and for keeping your{" "}
            <b>recovery key</b> safe — it’s the only way to reset a forgotten password, since there’s no
            email-based reset. One account per person, please.
          </p>
        </Section>

        <Section title="Fair use">
          <p>
            Don’t attempt to break, overload, scrape or abuse the service or other learners, and don’t
            upload anything unlawful. We may suspend accounts that do.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            The curriculum is for learning, not a substitute for professional translation or
            instruction. The app is provided without warranties, and we’re not liable for any loss
            arising from its use. We may change or discontinue features.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Reach us at{" "}
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
