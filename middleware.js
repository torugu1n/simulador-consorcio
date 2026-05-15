import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/setup"];

function hasValidSession(request) {
  return Boolean(request.cookies.get("consorcio_session")?.value);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/setup")
  ) {
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isProtectedPage = pathname.startsWith("/dashboard");
  const isProtectedApi =
    pathname.startsWith("/api/clients") ||
    pathname.startsWith("/api/interactions") ||
    pathname.startsWith("/api/simulations") ||
    pathname.startsWith("/api/auth/logout");

  if (!isProtectedPage && !isProtectedApi && !isPublicPage) {
    return NextResponse.next();
  }

  const authenticated = hasValidSession(request);

  if (!authenticated && isProtectedApi) {
    return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });
  }

  if (!authenticated && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/setup", "/api/:path*"],
};
