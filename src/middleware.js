import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "./lib/auth/refreshToken"; // Đảm bảo hàm này có thể import từ server-side

export async function middleware(req) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const user = req.cookies.get("user")?.value
    ? JSON.parse(req.cookies.get("user").value)
    : null;
  const pathname = req.nextUrl.pathname;
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // Nếu là trang công khai, cho phép truy cập mà không cần kiểm tra
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Nếu thiếu token hoặc user, chuyển hướng đến /login
  if (!accessToken || !refreshToken || !user) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Hàm kiểm tra token hợp lệ
  const isTokenValid = () => {
    try {
      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  };

  // Nếu token không hợp lệ, thử làm mới token
  if (!isTokenValid()) {
    try {
      await refreshAccessToken(refreshToken);
      return NextResponse.next();
    } catch (error) {
      console.error("Không thể làm mới token:", error);
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Kiểm tra vai trò người dùng
  const userRole = user.role;
  const restrictedPaths = ["/employees", "/parameters", "/ai", "/accounts"];
  const isRestrictedPath = restrictedPaths.includes(pathname);

  if (userRole === "employee" && isRestrictedPath) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // Nếu mọi thứ hợp lệ, tiếp tục request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
}
