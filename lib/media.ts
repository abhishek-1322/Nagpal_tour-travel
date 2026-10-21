import "server-only";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";

export type Section = "tours" | "gallery";
export type Kind = "image" | "video";

export type MediaItem = {
  id: string;
  section: Section;
  kind: Kind;
  url: string;
  title: string;
  location: string;
  description: string;
  createdAt: string;
};

export const sections: Record<Section, string> = { tours: "Our tours", gallery: "Gallery" };

export const allowedTypes: Record<string, { ext: string; kind: Kind }> = {
  "image/jpeg": { ext: "jpg", kind: "image" },
  "image/png": { ext: "png", kind: "image" },
  "image/webp": { ext: "webp", kind: "image" },
  "image/avif": { ext: "avif", kind: "image" },
  "image/gif": { ext: "gif", kind: "image" },
  "video/mp4": { ext: "mp4", kind: "video" },
  "video/webm": { ext: "webm", kind: "video" },
  "video/quicktime": { ext: "mov", kind: "video" },
};

export const maxBytes: Record<Kind, number> = { image: 20 * 1024 * 1024, video: 300 * 1024 * 1024 };

// Vercel Blob when a store is connected; otherwise files live on this server's disk.
export const storageMode: "blob" | "local" = process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";

export const localDir = process.env.MEDIA_DIR || path.join(process.cwd(), "storage");
const uploadsDir = path.join(localDir, "uploads");
const manifest = path.join(localDir, "media.json");
const META_PREFIX = "media/meta/";

export function newId() {
  return Date.now().toString(36) + randomBytes(4).toString("hex");
}

export function isSection(v: unknown): v is Section {
  return v === "tours" || v === "gallery";
}

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function sanitizeFields(input: Record<string, unknown>) {
  return {
    title: clean(input.title, 120),
    location: clean(input.location, 80),
    description: clean(input.description, 600),
  };
}

/* ---------- local driver ---------- */

async function readLocal(): Promise<MediaItem[]> {
  try {
    return JSON.parse(await fs.readFile(manifest, "utf8"));
  } catch {
    return [];
  }
}

async function writeLocal(items: MediaItem[]) {
  await fs.mkdir(localDir, { recursive: true });
  const tmp = `${manifest}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(items, null, 1));
  await fs.rename(tmp, manifest);
}

export async function localUploadPath(id: string, ext: string) {
  await fs.mkdir(uploadsDir, { recursive: true });
  return { file: path.join(uploadsDir, `${id}.${ext}`), url: `/media/${id}.${ext}` };
}

export function localFileFor(name: string) {
  if (!/^[a-z0-9]+\.(jpg|png|webp|avif|gif|mp4|webm|mov)$/.test(name)) return null;
  return path.join(uploadsDir, name);
}

/* ---------- blob driver: one immutable JSON file per item version ---------- */

type MetaBlob = { id: string; url: string; uploadedAt: Date };

async function listMeta(): Promise<MetaBlob[]> {
  const out: MetaBlob[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: META_PREFIX, cursor, limit: 1000 });
    for (const b of res.blobs) {
      const id = b.pathname.slice(META_PREFIX.length).split(/[-.]/)[0];
      out.push({ id, url: b.url, uploadedAt: new Date(b.uploadedAt) });
    }
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out;
}

async function writeMeta(item: MediaItem) {
  await put(`${META_PREFIX}${item.id}.json`, JSON.stringify(item), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

/* ---------- public API ---------- */

export async function listMedia(): Promise<MediaItem[]> {
  let items: MediaItem[];
  if (storageMode === "local") {
    items = await readLocal();
  } else {
    try {
      const latest = new Map<string, MetaBlob>();
      for (const m of await listMeta()) {
        const prev = latest.get(m.id);
        if (!prev || prev.uploadedAt < m.uploadedAt) latest.set(m.id, m);
      }
      // Each meta URL is unique and never changes, so it is safe to cache.
      items = await Promise.all([...latest.values()].map((m) => fetch(m.url, { cache: "force-cache" }).then((r) => r.json() as Promise<MediaItem>)));
    } catch (err) {
      console.error("Could not load media from Vercel Blob", err);
      items = [];
    }
  }
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createMedia(item: MediaItem) {
  if (storageMode === "local") {
    const items = await readLocal();
    items.push(item);
    await writeLocal(items);
  } else {
    await writeMeta(item);
  }
  return item;
}

export async function updateMedia(id: string, patch: Partial<Pick<MediaItem, "title" | "location" | "description" | "section">>) {
  if (storageMode === "local") {
    const items = await readLocal();
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    await writeLocal(items);
    return item;
  }
  const versions = (await listMeta()).filter((m) => m.id === id);
  if (!versions.length) return null;
  versions.sort((a, b) => +b.uploadedAt - +a.uploadedAt);
  const current = (await fetch(versions[0].url, { cache: "no-store" }).then((r) => r.json())) as MediaItem;
  const next = { ...current, ...patch };
  await writeMeta(next);
  await del(versions.map((v) => v.url));
  return next;
}

export async function deleteMedia(id: string) {
  if (storageMode === "local") {
    const items = await readLocal();
    const item = items.find((i) => i.id === id);
    if (!item) return false;
    await writeLocal(items.filter((i) => i.id !== id));
    const file = localFileFor(path.basename(item.url));
    if (file) await fs.rm(file, { force: true });
    return true;
  }
  const versions = (await listMeta()).filter((m) => m.id === id);
  if (!versions.length) return false;
  const current = (await fetch(versions[0].url, { cache: "no-store" }).then((r) => r.json())) as MediaItem;
  await del([current.url, ...versions.map((v) => v.url)]);
  return true;
}

export function isOwnFileUrl(url: string) {
  if (storageMode === "local") return /^\/media\/[a-z0-9]+\.[a-z0-9]+$/.test(url);
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com") && u.pathname.startsWith("/media/files/");
  } catch {
    return false;
  }
}
