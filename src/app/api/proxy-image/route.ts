import { NextResponse } from "next/server";

// Only proxy images from these trusted CDN hosts to prevent open-proxy abuse.
const ALLOWED_HOSTS = new Set([
  "yt3.googleusercontent.com",
  "yt3.ggpht.com",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "isa-dashboard/1.0" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 422 });
    }

    const blob = await res.blob();
    return new NextResponse(blob.stream(), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
