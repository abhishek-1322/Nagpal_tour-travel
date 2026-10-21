import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createMedia, isOwnFileUrl, isSection, listMedia, newId, sanitizeFields } from "@/lib/media";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json(await listMedia());
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const fields = sanitizeFields(body);
  if (typeof body.url !== "string" || !isOwnFileUrl(body.url)) return NextResponse.json({ error: "Unknown file" }, { status: 400 });
  if (!isSection(body.section)) return NextResponse.json({ error: "Choose a section" }, { status: 400 });
  if (body.kind !== "image" && body.kind !== "video") return NextResponse.json({ error: "Unknown file type" }, { status: 400 });
  if (!fields.title) return NextResponse.json({ error: "Add a title" }, { status: 400 });

  const item = await createMedia({ id: newId(), url: body.url, kind: body.kind, section: body.section, ...fields, createdAt: new Date().toISOString() });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json(item);
}
