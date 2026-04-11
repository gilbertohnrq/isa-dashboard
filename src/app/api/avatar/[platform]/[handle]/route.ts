import { NextResponse } from "next/server";

const CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
};

const FETCH_OPTS = {
  next: { revalidate: 86400 },
  headers: { "User-Agent": "isa-dashboard/1.0" },
} as const;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml",
} as const;

// ── helpers ──────────────────────────────────────────────────────────────────

function isChannelId(handle: string): boolean {
  // YouTube channel IDs start with UC, HC, UU and are 24 chars
  return /^(UC|HC|UU)[a-zA-Z0-9_-]{20,}$/.test(handle);
}

function extractOgImage(html: string): string | null {
  // og:image — both attribute orders
  const m =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (m?.[1]?.startsWith("http")) return m[1];
  return null;
}

// ── Twitch (DecAPI — free, no rate limit) ────────────────────────────────────

async function resolveTwitchAvatar(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://decapi.me/twitch/avatar/${handle}`, {
      ...FETCH_OPTS,
    });
    if (!res.ok) return null;
    const url = (await res.text()).trim();
    if (url.startsWith("http") && !url.includes("User not found")) return url;
  } catch {
    // ignore
  }
  return null;
}

// ── YouTube ───────────────────────────────────────────────────────────────────

/**
 * Scrape YouTube channel page for og:image.
 * Handles both @handle and UCxxxxx channel-ID formats.
 */
async function scrapeYouTubePage(handle: string): Promise<string | null> {
  const channelId = isChannelId(handle);
  const candidates = channelId
    ? [`https://www.youtube.com/channel/${handle}`]
    : [
        `https://www.youtube.com/@${handle}`,
        `https://www.youtube.com/c/${handle}`,
        `https://www.youtube.com/${handle}`,
      ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 86400 },
        headers: BROWSER_HEADERS,
      });
      if (!res.ok) continue;
      const html = await res.text();

      const og = extractOgImage(html);
      if (og) return og;

      // ytInitialData thumbnail thumbnails array
      const ytMatch = html.match(
        /"avatar":\s*\{"thumbnails":\s*\[.*?"url":\s*"(https:[^"]+)"/s
      );
      if (ytMatch?.[1]) return ytMatch[1];
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * yt.lemnoslife.com — YouTube Data API proxy, no key required.
 */
async function tryYtLemnoslife(handle: string): Promise<string | null> {
  try {
    const channelId = isChannelId(handle);
    const url = channelId
      ? `https://yt.lemnoslife.com/noKey/channels?part=snippet&id=${handle}`
      : `https://yt.lemnoslife.com/noKey/channels?part=snippet&forHandle=%40${encodeURIComponent(handle)}`;

    const res = await fetch(url, { next: { revalidate: 86400 }, headers: FETCH_OPTS.headers });
    if (!res.ok) return null;

    const data = await res.json();
    const item = data?.items?.[0];
    const thumb =
      item?.snippet?.thumbnails?.high?.url ??
      item?.snippet?.thumbnails?.medium?.url ??
      item?.snippet?.thumbnails?.default?.url;
    if (thumb?.startsWith("http")) return thumb;
  } catch {
    // ignore
  }
  return null;
}

/**
 * Invidious — open-source YouTube frontend with public API.
 */
async function tryInvidious(handle: string): Promise<string | null> {
  const instances = [
    "https://inv.nadeko.net",
    "https://invidious.privacydev.net",
    "https://yt.artemislena.eu",
  ];

  const path = isChannelId(handle)
    ? `/api/v1/channels/${handle}`
    : `/api/v1/channels/@${handle}`;

  for (const instance of instances) {
    try {
      const res = await fetch(`${instance}${path}`, {
        next: { revalidate: 86400 },
        headers: FETCH_OPTS.headers,
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      // authorThumbnails sorted small→large; pick largest
      const thumbs: Array<{ url: string }> = data?.authorThumbnails ?? [];
      const url = thumbs[thumbs.length - 1]?.url;
      if (url?.startsWith("http")) return url;
      // sometimes it's a protocol-relative URL
      if (url?.startsWith("//")) return `https:${url}`;
    } catch {
      continue;
    }
  }
  return null;
}

async function resolveYouTubeAvatar(handle: string): Promise<string | null> {
  return (
    (await scrapeYouTubePage(handle)) ??
    (await tryYtLemnoslife(handle)) ??
    (await tryInvidious(handle))
  );
}

// ── Kick (public REST API, no key) ──────────────────────────────────────────

async function resolveKickAvatar(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://kick.com/api/v1/channels/${handle}`, {
      ...FETCH_OPTS,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const url: string | undefined =
      data?.user?.profile_pic ??
      data?.user?.profilePic ??
      data?.profilePic;
    if (url?.startsWith("http")) return url;
  } catch {
    // ignore
  }
  return null;
}

// ── Instagram (scrape og:image — no login needed for public profiles) ────────

async function resolveInstagramAvatar(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.instagram.com/${handle}/`, {
      next: { revalidate: 86400 },
      headers: BROWSER_HEADERS,
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractOgImage(html);
  } catch {
    // ignore
  }
  return null;
}

// ── TikTok (scrape og:image) ─────────────────────────────────────────────────

async function resolveTikTokAvatar(handle: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.tiktok.com/@${handle}`, {
      next: { revalidate: 86400 },
      headers: BROWSER_HEADERS,
    });
    if (!res.ok) return null;
    const html = await res.text();
    return extractOgImage(html);
  } catch {
    // ignore
  }
  return null;
}

// ── Image proxy ───────────────────────────────────────────────────────────────

/**
 * Fetch a remote image and return it as a proxied response.
 * Avoids ERR_BLOCKED_BY_ORB that happens when the browser follows cross-origin
 * redirects to CDN URLs that don't include CORS headers (e.g. yt3.googleusercontent.com).
 */
async function proxyImage(url: string): Promise<NextResponse | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "isa-dashboard/1.0" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const blob = await res.blob();
    return new NextResponse(blob.stream(), {
      status: 200,
      headers: { "Content-Type": contentType, ...CACHE_HEADERS },
    });
  } catch {
    return null;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ platform: string; handle: string }> }
) {
  const { platform, handle } = await params;

  let resolvedUrl: string | null = null;

  switch (platform) {
    case "twitch":
      resolvedUrl = await resolveTwitchAvatar(handle);
      break;
    case "youtube":
      resolvedUrl = await resolveYouTubeAvatar(handle);
      break;
    case "kick":
      resolvedUrl = await resolveKickAvatar(handle);
      break;
    case "instagram":
      resolvedUrl = await resolveInstagramAvatar(handle);
      break;
    case "tiktok":
      resolvedUrl = await resolveTikTokAvatar(handle);
      break;
  }

  if (resolvedUrl) {
    // Proxy the image to avoid ERR_BLOCKED_BY_ORB on cross-origin CDN redirects
    const proxied = await proxyImage(resolvedUrl);
    if (proxied) return proxied;
  }

  // Last resort: unavatar (only for truly unsupported platforms, e.g. "x", "discord")
  const platformsWithOwnResolver = new Set(["twitch", "youtube", "kick", "instagram", "tiktok"]);
  if (!platformsWithOwnResolver.has(platform)) {
    try {
      const unavatarRes = await fetch(
        `https://unavatar.io/${encodeURIComponent(platform)}/${encodeURIComponent(handle)}`,
        {
          next: { revalidate: 86400 },
          headers: FETCH_OPTS.headers,
          redirect: "manual",
        }
      );

      if (unavatarRes.status === 302 || unavatarRes.status === 301) {
        const location = unavatarRes.headers.get("location");
        if (location && !location.includes("ui-avatars")) {
          const proxied = await proxyImage(location);
          if (proxied) return proxied;
        }
      }

      if (unavatarRes.ok) {
        const contentType = unavatarRes.headers.get("content-type") ?? "";
        if (contentType.startsWith("image/")) {
          const blob = await unavatarRes.blob();
          return new NextResponse(blob.stream(), {
            status: 200,
            headers: { "Content-Type": contentType, ...CACHE_HEADERS },
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // Ultimate fallback: generated initials avatar (proxied to keep same-origin)
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    handle
  )}&background=1a1a2e&color=fff&size=256&bold=true&format=png`;

  const fallbackProxied = await proxyImage(fallbackUrl);
  if (fallbackProxied) return fallbackProxied;

  return new NextResponse(null, { status: 404 });
}
