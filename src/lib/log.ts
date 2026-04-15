// Tiny structured logger. In production it emits one JSON object per
// line (friendly for log aggregators); in dev it falls back to the
// standard console formatting so the output stays readable.

type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, msg: string, fields?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") {
    const line = JSON.stringify({
      t: new Date().toISOString(),
      level,
      msg,
      ...fields,
    });
    (level === "error" ? console.error : console.log)(line);
    return;
  }
  const fn =
    level === "error"
      ? console.error
      : level === "warn"
        ? console.warn
        : console.log;
  fn(`[${level}]`, msg, fields ?? "");
}

export const log = {
  debug: (msg: string, fields?: Record<string, unknown>) => emit("debug", msg, fields),
  info: (msg: string, fields?: Record<string, unknown>) => emit("info", msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit("warn", msg, fields),
  error: (msg: string, fields?: Record<string, unknown>) => emit("error", msg, fields),
};
