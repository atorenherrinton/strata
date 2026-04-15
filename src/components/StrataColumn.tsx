import type { Stratum } from "@/lib/types";
import { NoteCard } from "./NoteCard";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function StrataColumn({
  strata,
  editable = true,
  showTopicPrefix = false,
}: {
  strata: Stratum[];
  editable?: boolean;
  showTopicPrefix?: boolean;
}) {
  return (
    <div className="strata" role="list" aria-label="Strata by date">
      {strata.map((s) => (
        <section
          className="stratum"
          role="listitem"
          key={s.date}
          aria-labelledby={`d-${s.date}`}
        >
          <h3 id={`d-${s.date}`} className="stratum-date">
            <time dateTime={s.date}>{formatDate(s.date)}</time>
          </h3>
          {s.notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              editable={editable}
              topicPrefix={showTopicPrefix ? n.topicTitle : undefined}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
