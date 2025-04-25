import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  if (!accessToken && !isPublicPath) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};