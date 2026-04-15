import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "./lib/ratelimit";

// Paths exempt from middleware (static assets, Next internals, feeds).
// Keep this narrow: everything else gets security headers.
export const config = {
  matcher: ["/((?!_next/|favicon.ico|sitemap.xml|robots.txt).*)"],
};

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitFor(pathname: string) {
  // Import is expensive and one-off; every other mutation is cheap.
  if (pathname === "/import" || pathname.startsWith("/api/import")) {
    return { limit: 5, windowMs: 60_000 };
  }
  return { limit: 60, windowMs: 60_000 };
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);

  if (!MUTATING_METHODS.has(req.method)) return res;

  const ip = clientIp(req);
  const pathname = req.nextUrl.pathname;
  const cfg = rateLimitFor(pathname);
  const result = rateLimit(`${ip}:${pathname}`, cfg);

  if (!result.ok) {
    const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
    return new NextResponse("Rate limit exceeded. Try again in a moment.\n", {
      status: 429,
      headers: {
        ...SECURITY_HEADERS,
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  res.headers.set("X-RateLimit-Limit", String(result.limit));
  res.headers.set("X-RateLimit-Remaining", String(result.remaining));
  res.headers.set("X-RateLimit-Reset", String(Math.floor(result.resetAt / 1000)));
  return res;
}
