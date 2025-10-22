"use client";
import { useMemo, useState } from "react";

type LogEntry = { id: string; message: string; timestamp: string | Date; };
const fmt = (t: string | Date) => new Date(t).toLocaleString();

export default function LogList({ entries }: { entries: LogEntry[] }) {
  const [on, setOn] = useState(false);

  const list = useMemo(() => {
    if (!on) return entries;
    return [...entries].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  }, [entries, on]);

  return (
    <section className="space-y-3">
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        Control deslizante habilitado
      </label>

      <ul className="space-y-2">
        {list.map((e) => (
          <li key={e.id} className="rounded border p-3">
            {on && <div className="mb-1 text-xs opacity-70">{fmt(e.timestamp)}</div>}
            <p className={on ? "whitespace-normal break-words" : "truncate"} title={!on ? e.message : undefined}>
              {e.message}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
