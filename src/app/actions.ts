"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { validateBody, validateTagsInput, validateTitle } from "@/lib/validate";

export type FormState = { error?: string; ok?: boolean } | null;

export async function createTopicAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = validateTitle(formData.get("title"));
  if (!title.ok) return { error: title.error };

  const topic = await db.topic.create({ data: { title: title.value } });
  revalidatePath("/");
  redirect(`/topics/${topic.id}`);
}

export async function updateTopicAction(topicId: string, formData: FormData) {
  const title = validateTitle(formData.get("title"));
  if (!title.ok) {
    redirect(`/topics/${topicId}?err=${encodeURIComponent(title.error)}`);
  }
  await db.topic.update({ where: { id: topicId }, data: { title: title.value } });
  revalidatePath("/");
  revalidatePath(`/topics/${topicId}`);
  redirect(`/topics/${topicId}`);
}

export async function deleteTopicAction(topicId: string) {
  await db.topic.delete({ where: { id: topicId } });
  revalidatePath("/");
  revalidatePath("/core");
  redirect("/");
}

export async function createNoteAction(
  topicId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const body = validateBody(formData.get("body"));
  if (!body.ok) return { error: body.error };
  const tags = validateTagsInput(formData.get("tags"));
  if (!tags.ok) return { error: tags.error };

  const topic = await db.topic.findUnique({ where: { id: topicId } });
  if (!topic) return { error: "This topic no longer exists." };

  await db.note.create({
    data: {
      topicId,
      body: body.value,
      tags: {
        connectOrCreate: tags.value.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/core");
  return { ok: true };
}

export async function updateNoteAction(
  noteId: string,
  topicId: string,
  formData: FormData,
) {
  const body = validateBody(formData.get("body"));
  const tags = validateTagsInput(formData.get("tags"));
  if (!body.ok) {
    redirect(`/topics/${topicId}?err=${encodeURIComponent(body.error)}`);
  }
  if (!tags.ok) {
    redirect(`/topics/${topicId}?err=${encodeURIComponent(tags.error)}`);
  }
  await db.note.update({
    where: { id: noteId },
    data: {
      body: body.value,
      tags: {
        set: [],
        connectOrCreate: tags.value.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/core");
  redirect(`/topics/${topicId}`);
}

export async function deleteNoteAction(noteId: string, topicId: string) {
  await db.note.delete({ where: { id: noteId } });
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/core");
}

export async function renameTagAction(oldName: string, formData: FormData) {
  const tags = validateTagsInput(formData.get("name"));
  if (!tags.ok || tags.value.length !== 1) {
    const msg =
      !tags.ok
        ? tags.error
        : "Provide exactly one replacement tag.";
    redirect(`/tags?err=${encodeURIComponent(msg)}`);
  }
  const target = tags.value[0];
  if (target === oldName) redirect("/tags");

  const existing = await db.tag.findUnique({ where: { name: target } });
  if (existing) {
    // Merge: point every note on the old tag at the target, then drop old.
    const oldTag = await db.tag.findUnique({
      where: { name: oldName },
      include: { notes: { select: { id: true } } },
    });
    if (oldTag) {
      await db.$transaction([
        ...oldTag.notes.map((n) =>
          db.note.update({
            where: { id: n.id },
            data: {
              tags: {
                disconnect: { id: oldTag.id },
                connect: { id: existing.id },
              },
            },
          }),
        ),
        db.tag.delete({ where: { id: oldTag.id } }),
      ]);
    }
  } else {
    await db.tag.update({ where: { name: oldName }, data: { name: target } });
  }
  revalidatePath("/tags");
  revalidatePath("/core");
  redirect("/tags");
}

export async function deleteTagAction(name: string) {
  await db.tag.delete({ where: { name } }).catch(() => null);
  revalidatePath("/tags");
  revalidatePath("/core");
  redirect("/tags");
}
