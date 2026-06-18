"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { buildBackup, restoreBackup } from "@/lib/backup";

// Local export/import of progress + stats. Lives in Settings; useful as an
// offline backup or to move data to a device where you're not signed in.
export function BackupCard() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const onExport = () => {
    const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lilt-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    const text = await file.text();
    const res = restoreBackup(text);
    if (res.ok) {
      setMsg("Progress restored. Reloading…");
      setTimeout(() => location.reload(), 600);
    } else {
      setMsg(res.error);
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-[11px]"
          style={{ background: "var(--tint-lilac)", border: "2px solid var(--edge)", color: "var(--ink)" }}
        >
          <Icon name="refresh" size={19} strokeWidth={1.9} />
        </span>
        <h2 className="text-[18px]">Backup &amp; move devices</h2>
      </div>
      <div
        className="rounded-[18px] p-5"
        style={{ background: "var(--surface)", border: "2px solid var(--edge)", boxShadow: "4px 4px 0 0 var(--lilt-violet)" }}
      >
        <p className="text-[13.5px] font-bold leading-relaxed" style={{ color: "var(--text-body)" }}>
          Signing in already syncs across your devices. Export a file as an offline backup, or to
          carry progress to a device where you&apos;re not signed in.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={onExport} className="btn btn-primary">
            Export progress
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn btn-secondary">
            Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
        </div>
        {msg && <p className="mt-3 text-[13px] font-extrabold" style={{ color: "var(--accent)" }}>{msg}</p>}
      </div>
    </section>
  );
}
