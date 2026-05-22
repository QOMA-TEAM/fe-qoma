import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Peta route prefix → role yang diizinkan ───────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  superadmin: "super_admin",
  owner: "owner",
  kasir: "kasir",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // ── 1. Jika sudah login dan akses /login → redirect ke dashboard role ────
  if (pathname.startsWith("/login") && token && role) {
    const roleRoutes: Record<string, string> = {
      super_admin: "/superadmin/dashboard",
      owner: "/owner/dashboard",
      kasir: "/kasir/dashboard",
    };
    const dest = roleRoutes[role] ?? "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── 2. Belum login tapi akses route protected → ke /login ────────────────
  const isProtectedRoute = Object.keys(ROLE_ROUTES).some((prefix) =>
    pathname.startsWith(`/${prefix}`),
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── 3. Sudah login tapi role salah → ke /login ───────────────────────────
  for (const [routePrefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(`/${routePrefix}`) && role !== requiredRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/superadmin/:path*", "/owner/:path*", "/kasir/:path*"],
};
