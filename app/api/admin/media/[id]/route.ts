import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deleteMedia, isSection, sanitizeFields, updateMedia } from "@/lib/media";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const fields = sanitizeFields(body);
  if (!fields.title) return NextResponse.json({ error: "Add a title" }, { status: 400 });
  if (!isSection(body.section)) return NextResponse.json({ error: "Choose a section" }, { status: 400 });
  const item = await updateMedia(id, { ...fields, section: body.section });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await params;
  if (!(await deleteMedia(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
