import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string; handle: string }> }
) {
  const { platform, handle } = await params;

  try {
    if (platform === "twitch") {
      const res = await fetch(`https://decapi.me/twitch/avatar/${handle}`, {
        cache: "no-store",
        headers: { "User-Agent": "isa-dashboard" },
      });
      if (res.ok) {
        const url = await res.text();
        if (url && url.startsWith("http") && !url.includes("User not found")) {
          return NextResponse.redirect(url, {
            status: 302,
            headers: {
              "Cache-Control":
                "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
            },
          });
        }
      }
    }
  } catch (error) {
    console.error(`Failed to fetch avatar for ${platform} ${handle}`, error);
  }

  // Fallback to UI Avatars if DecAPI fails or if it's another platform
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    handle
  )}&background=random&color=fff&size=256`;

  return NextResponse.redirect(fallbackUrl, {
    status: 302,
    headers: {
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
