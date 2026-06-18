"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

export interface DropdownOption {
  value: string;
  label: React.ReactNode;
}

/**
 * A fully custom select — native <select> option lists can't be styled, so this
 * renders its own Pop-Sticker popup instead. Supports a custom trigger (used by
 * the language switcher) or a default pill trigger (used in Settings).
 */
export function Dropdown({
  value,
  options,
  onChange,
  ariaLabel,
  trigger,
  align = "right",
  menuWidth,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  ariaLabel?: string;
  trigger?: (current: DropdownOption | undefined, open: boolean) => React.ReactNode;
  align?: "left" | "right";
  menuWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={trigger ? "relative" : "relative shrink-0"}>
      {trigger ? (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          onClick={() => setOpen((o) => !o)}
          className="block w-full text-left"
        >
          {trigger(current, open)}
        </button>
      ) : (
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition active:translate-y-0.5"
          style={{ background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
        >
          <span className="truncate">{current?.label}</span>
          <Chevron open={open} />
        </button>
      )}

      {open && (
        <div
          role="listbox"
          className={`absolute top-full z-40 mt-1.5 max-h-64 overflow-auto rounded-[14px] p-1.5 ${align === "right" ? "right-0" : "left-0"}`}
          style={{ minWidth: menuWidth ?? 184, background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-bold transition hover:[background:var(--tint-violet-2)]"
                style={active ? { background: "var(--tint-violet)", color: "var(--ink)" } : { color: "var(--text-body)" }}
              >
                <span className="truncate">{o.label}</span>
                {active && (
                  <span style={{ color: "var(--lilt-violet)" }}>
                    <Icon name="check" size={15} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--muted)"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
