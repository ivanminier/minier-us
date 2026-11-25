import { getCollection } from "astro:content";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export async function getPublishedNotes() {
  const notes = await getCollection("ideas", ({ data }) => !data.draft);
  return notes.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export function formatNoteDate(date: string) {
  return dateFormat.format(new Date(date + "T12:00:00Z"));
}
