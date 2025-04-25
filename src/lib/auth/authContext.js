"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { refreshAccessToken } from "./refreshToken";
import { set_cookie, get_cookie } from "../cookie/action";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      // Lấy dữ liệu xác thực từ hàm get_cookie
      const { accessToken, user: storedUser, refreshToken } = await get_cookie();

      if (accessToken && refreshToken && storedUser) {
        setUser(storedUser);
        try {
          await refreshAccessToken(refreshToken);
          // Lấy lại dữ liệu user mới nhất từ get_cookie
          const { user: newUser } = await get_cookie();
          setUser(newUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Không thể khôi phục phiên:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (userName, password) => {
    try {
      const res = await fetch("http://localhost:3000/v1/api/access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data.metadata?.error || "Đăng nhập thất bại");
      }

      const { user, tokens } = data.metadata;
      const { accessToken, refreshToken } = tokens;
      console.log('Setting access token...');
      // Cập nhật cookie bằng hàm set_cookie
      await set_cookie({ accessToken, refreshToken, user });

      setUser(user);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    console.log("Logging out...");
    // Lấy dữ liệu user từ get_cookie để sử dụng trong logout
    const { user: userData } = await get_cookie();

    try {
      await fetch("http://localhost:3000/v1/api/access/logout", {
        method: "GET",
        headers: {
          "x-client-id": userData?.user_id || "",
          authorization: `Bearer ${Cookies.get("accessToken") || ""}`,
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    // Xóa cookie trực tiếp
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("user", { path: "/" });

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}