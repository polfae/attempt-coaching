import { NextResponse } from "next/server";
import { getRecentPublishedArticlesPage } from "@/lib/firestore";
import type { ArticlesPageCursor } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "3");
  const pageSize = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 6)
    : 3;
  const cursorId = searchParams.get("cursorId");
  const cursorPublishedAt = searchParams.get("cursorPublishedAt");
  const cursorPublishAtMillis = Number(searchParams.get("cursorPublishAtMillis"));
  const cursor: ArticlesPageCursor | null =
    cursorId && cursorPublishedAt && Number.isFinite(cursorPublishAtMillis)
      ? {
          id: cursorId,
          publishedAt: cursorPublishedAt,
          publishAtMillis: cursorPublishAtMillis,
        }
      : null;

  const page = await getRecentPublishedArticlesPage({
    pageSize,
    cursor,
  });

  return NextResponse.json(page);
}
