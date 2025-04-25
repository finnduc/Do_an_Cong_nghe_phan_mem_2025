import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const user = req.cookies.get("user")?.value;
  const userRole = user ? JSON.parse(user).user_role : 'employee';
  const pathname = req.nextUrl.pathname;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // Redirect to /login if no accessToken and not a public path
  if (!accessToken && !isPublicPath) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Restrict employee role from accessing specific pages
  const restrictedPaths = ["/employees", "/parameters", "/ai", "/accounts"];
  const isRestrictedPath = restrictedPaths.includes(pathname);

  if (userRole === "employee" && isRestrictedPath) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};