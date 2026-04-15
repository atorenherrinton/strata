import type { Stratum } from "@/lib/types";
import { NoteCard } from "./NoteCard";

export function StrataColumn({ strata }: { strata: Stratum[] }) {
  return (
    <div>
      {strata.map((s) => (
        <section key={s.date}>
          <h2>{s.date}</h2>
          {s.notes.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </section>
      ))}
    </div>
  );
}
