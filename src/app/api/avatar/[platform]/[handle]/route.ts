import { NextResponse } from "next/server";

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
};

/**
 * Resolve a Twitch avatar via DecAPI (free, no rate limit issues).
 */
async function resolveTwitchAvatar(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://decapi.me/twitch/avatar/${handle}`, {
      next: { revalidate: 86400 },
      headers: { "User-Agent": "isa-dashboard" },
    });
    if (res.ok) {
      const url = (await res.text()).trim();
      if (url && url.startsWith("http") && !url.includes("User not found")) {
        return url;
      }
    }
  } catch {
    // silently fail
  }
  return null;
}

/**
 * Resolve a YouTube avatar by scraping the channel page for og:image meta tag.
 * Works with both @handle and channel ID formats.
 */
async function resolveYouTubeAvatar(handle: string): Promise<string | null> {
  const urls = [
    `https://www.youtube.com/@${handle}`,
    `https://www.youtube.com/c/${handle}`,
    `https://www.youtube.com/${handle}`,
  ];

  for (const pageUrl of urls) {
    try {
      const res = await fetch(pageUrl, {
        next: { revalidate: 86400 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!res.ok) continue;

      const html = await res.text();

      // Try og:image first (highest quality avatar)
      const ogMatch = html.match(
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
      );
      if (ogMatch?.[1]) {
        const imgUrl = ogMatch[1];
        // YouTube og:image URLs are always valid CDN URLs
        if (imgUrl.startsWith("http") && imgUrl.includes("yt")) {
          return imgUrl;
        }
      }

      // Fallback: look for channel avatar in JSON-LD or other meta
      const avatarMatch = html.match(
        /"avatar":\s*\{[^}]*"url":\s*"([^"]+)"/
      );
      if (avatarMatch?.[1]?.startsWith("http")) {
        return avatarMatch[1];
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string; handle: string }> }
) {
  const { platform, handle } = await params;

  let resolvedUrl: string | null = null;

  // Platform-specific resolvers (no Unavatar dependency)
  if (platform === "twitch") {
    resolvedUrl = await resolveTwitchAvatar(handle);
  } else if (platform === "youtube") {
    resolvedUrl = await resolveYouTubeAvatar(handle);
  }

  // If platform-specific resolver worked, redirect to direct CDN URL
  if (resolvedUrl) {
    return NextResponse.redirect(resolvedUrl, {
      status: 302,
      headers: CACHE_HEADERS,
    });
  }

  // For other platforms or if specific resolver failed, try Unavatar as last resort
  try {
    const unavatarRes = await fetch(
      `https://unavatar.io/${encodeURIComponent(platform)}/${encodeURIComponent(handle)}`,
      {
        next: { revalidate: 86400 },
        headers: { "User-Agent": "isa-dashboard" },
        redirect: "manual",
      }
    );

    // If unavatar returned a redirect or success, use it
    if (unavatarRes.status === 302 || unavatarRes.status === 301) {
      const location = unavatarRes.headers.get("location");
      if (location && !location.includes("ui-avatars")) {
        return NextResponse.redirect(location, {
          status: 302,
          headers: CACHE_HEADERS,
        });
      }
    }

    if (unavatarRes.ok) {
      const contentType = unavatarRes.headers.get("content-type") ?? "";
      if (contentType.startsWith("image/")) {
        // Serve the image directly from unavatar
        const blob = await unavatarRes.blob();
        return new NextResponse(blob.stream(), {
          status: 200,
          headers: {
            "Content-Type": contentType,
            ...CACHE_HEADERS,
          },
        });
      }
    }
  } catch {
    // Unavatar also failed, proceed to final fallback
  }

  // Ultimate fallback: UI Avatars (always works, generates initial-based avatar)
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    handle
  )}&background=1a1a2e&color=fff&size=256&bold=true&format=png`;

  return NextResponse.redirect(fallbackUrl, {
    status: 302,
    headers: CACHE_HEADERS,
  });
}
