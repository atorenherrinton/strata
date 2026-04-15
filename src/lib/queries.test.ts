import { describe, expect, it } from "vitest";
import { toNote, toNoteWithTopic } from "./queries";

describe("toNote", () => {
  it("projects the Prisma row into a plain Note", () => {
    const row = {
      id: "n1",
      topicId: "t1",
      body: "hello",
      createdAt: new Date("2026-04-15T10:00:00Z"),
      tags: [{ name: "a" }, { name: "b" }],
    };
    expect(toNote(row)).toEqual({
      id: "n1",
      topicId: "t1",
      body: "hello",
      createdAt: row.createdAt,
      tags: ["a", "b"],
    });
  });
});

describe("toNoteWithTopic", () => {
  it("carries the topic title through", () => {
    const row = {
      id: "n1",
      topicId: "t1",
      body: "hi",
      createdAt: new Date("2026-04-15T10:00:00Z"),
      tags: [{ name: "x" }],
      topic: { title: "Field notes" },
    };
    expect(toNoteWithTopic(row).topicTitle).toBe("Field notes");
  });
});
