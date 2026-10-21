import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";
import type { ReadableStream as WebReadableStream } from "stream/web";
import { requireAdmin } from "@/lib/auth";
import { allowedTypes, localUploadPath, maxBytes, newId, storageMode } from "@/lib/media";

// Local-disk uploads (used when no Vercel Blob store is connected). Body is the raw file.
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (storageMode !== "local") return NextResponse.json({ error: "Uploads go to Vercel Blob on this server" }, { status: 400 });

  const type = allowedTypes[(request.headers.get("content-type") || "").split(";")[0]];
  if (!type) return NextResponse.json({ error: "Use a JPG, PNG, WebP, AVIF or GIF photo, or an MP4, WebM or MOV video." }, { status: 415 });
  const limit = maxBytes[type.kind];
  if (Number(request.headers.get("content-length") || 0) > limit) {
    return NextResponse.json({ error: `File is too large. The limit is ${limit / 1024 / 1024} MB.` }, { status: 413 });
  }
  if (!request.body) return NextResponse.json({ error: "Empty upload" }, { status: 400 });

  const { file, url } = await localUploadPath(newId(), type.ext);
  let seen = 0;
  const counter = new Transform({
    transform(chunk, _enc, cb) {
      seen += chunk.length;
      cb(seen > limit ? new Error("too large") : null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(request.body as unknown as WebReadableStream), counter, createWriteStream(file));
  } catch {
    await rm(file, { force: true });
    return NextResponse.json({ error: "Upload failed or file too large." }, { status: 400 });
  }
  return NextResponse.json({ url, kind: type.kind });
}
