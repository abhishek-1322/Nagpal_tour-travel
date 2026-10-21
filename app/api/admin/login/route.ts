import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "Admin is not set up. Add ADMIN_PASSWORD to the environment variables." }, { status: 503 });
  }
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Wrong password. Try again." }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
