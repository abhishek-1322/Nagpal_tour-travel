import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth";
import { allowedTypes, maxBytes } from "@/lib/media";

// Issues short-lived tokens so the browser can upload large files straight to Vercel Blob.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await requireAdmin())) throw new Error("Not signed in");
        if (!pathname.startsWith("media/files/")) throw new Error("Invalid upload path");
        return {
          allowedContentTypes: Object.keys(allowedTypes),
          maximumSizeInBytes: maxBytes.video,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
