import type { Stratum } from "@/lib/types";
import { formatLongDate } from "@/lib/format";
import { NoteCard } from "./NoteCard";

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
            <time dateTime={s.date}>{formatLongDate(s.date)}</time>
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
