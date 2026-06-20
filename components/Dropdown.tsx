"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

export interface DropdownOption {
  value: string;
  label: React.ReactNode;
}

/**
 * A fully custom select — native <select> option lists can't be styled, so this
 * renders its own Pop-Sticker popup instead. Supports a custom trigger (used by
 * the language switcher) or a default pill trigger (Settings). Full keyboard
 * support via the aria-activedescendant combobox pattern (focus stays on the
 * trigger; arrows/Home/End move the active option; Enter selects; Esc closes).
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
  const [active, setActive] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const current = options.find((o) => o.value === value);
  const optId = (i: number) => `${baseId}-opt-${i}`;

  const openMenu = () => {
    const i = options.findIndex((o) => o.value === value);
    setActive(i < 0 ? 0 : i);
    setOpen(true);
  };
  const choose = (i: number) => {
    if (options[i]) onChange(options[i].value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || active < 0) return;
    ref.current?.querySelector(`#${CSS.escape(optId(active))}`)?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={ref} className={trigger ? "relative" : "relative shrink-0"}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={
          trigger
            ? "block w-full text-left"
            : "flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-extrabold transition active:translate-y-0.5"
        }
        style={trigger ? undefined : { background: "var(--surface)", border: "2px solid var(--edge)", color: "var(--ink)" }}
      >
        {trigger ? (
          trigger(current, open)
        ) : (
          <>
            <span className="truncate">{current?.label}</span>
            <Chevron open={open} />
          </>
        )}
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-full z-40 mt-1.5 max-h-64 overflow-auto rounded-[14px] p-1.5 ${align === "right" ? "right-0" : "left-0"}`}
          style={{ minWidth: menuWidth ?? 184, background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--edge)" }}
        >
          {options.map((o, i) => {
            const selected = o.value === value;
            const isActive = i === active;
            return (
              <button
                key={o.value}
                id={optId(i)}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className="flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-bold transition"
                style={
                  selected
                    ? { background: "var(--tint-violet)", color: "var(--ink)" }
                    : isActive
                      ? { background: "var(--tint-violet-2)", color: "var(--ink)" }
                      : { color: "var(--text-body)" }
                }
              >
                <span className="truncate">{o.label}</span>
                {selected && (
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
