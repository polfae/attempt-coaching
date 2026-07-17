import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxPosterSize = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function sanitizeFileName(value: string) {
  const extension = path.extname(value).toLowerCase();
  const base = path
    .basename(value, extension)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "article-poster"}${extension || ".jpg"}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Poster images must be JPG, PNG, WebP, or GIF files." },
        { status: 400 },
      );
    }

    if (file.size > maxPosterSize) {
      return NextResponse.json(
        { error: "Poster images must be smaller than 8 MB." },
        { status: 400 },
      );
    }

    const uploadsDirectory = path.join(process.cwd(), "public", "articles");
    await mkdir(uploadsDirectory, { recursive: true });

    const timestamp = Date.now();
    const fileName = `${timestamp}-${sanitizeFileName(file.name)}`;
    const filePath = path.join(uploadsDirectory, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    return NextResponse.json({
      path: `/articles/${fileName}`,
    });
  } catch (error) {
    console.error("Article poster upload failed.", error);
    return NextResponse.json(
      { error: "Could not upload the poster image." },
      { status: 500 },
    );
  }
}
