import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

function site(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site();
  const topics = await db.topic.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true },
  });

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/core`, changeFrequency: "daily" },
    { url: `${base}/search`, changeFrequency: "weekly" },
    { url: `${base}/tags`, changeFrequency: "weekly" },
    { url: `${base}/import`, changeFrequency: "yearly" },
  ];

  const topicEntries: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${base}/topics/${t.id}`,
    lastModified: t.createdAt,
    changeFrequency: "daily",
  }));

  return [...staticEntries, ...topicEntries];
}
