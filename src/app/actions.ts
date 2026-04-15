"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { parseTags } from "@/lib/strata";

export async function createTopic(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const topic = await db.topic.create({ data: { title } });
  revalidatePath("/");
  redirect(`/topics/${topic.id}`);
}

export async function createNote(topicId: string, formData: FormData) {
  const body = String(formData.get("body") ?? "");
  const tagNames = parseTags(String(formData.get("tags") ?? ""));

  await db.note.create({
    data: {
      topicId,
      body,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });
  revalidatePath(`/topics/${topicId}`);
  revalidatePath("/core");
}
