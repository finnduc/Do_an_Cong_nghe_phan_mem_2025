
import { NextResponse } from "next/server";

export function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const publicPaths = ["/login", "/signup", "/about"];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};