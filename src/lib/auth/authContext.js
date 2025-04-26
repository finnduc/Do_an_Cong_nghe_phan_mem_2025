"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken } from "./refreshToken";
import { get_cookie } from "../cookie/action";
import { logout } from "./action";
import { jwtDecode } from "jwt-decode"; // Cần cài đặt: npm install jwt-decode

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      const cookies = await get_cookie();
      const { accessToken, user: storedUser, refreshToken } = cookies || {};

      if (accessToken && refreshToken && storedUser && isMounted) {
        setUser(storedUser);

        // Kiểm tra xem accessToken còn hợp lệ không
        const isTokenValid = () => {
          try {
            const decoded = jwtDecode(accessToken);
            const now = Date.now() / 1000;
            return decoded.exp > now;
          } catch (error) {
            return false;
          }
        };

        if (isTokenValid()) {
          setIsAuthenticated(true);
        } else {
          try {
            await refreshAccessToken(refreshToken);
            if (isMounted) {
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Không thể khôi phục phiên:", error);
            if (isMounted) {
              logout();
              setIsAuthenticated(false);
              setUser(null);
              window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
            }
          }
        }
      } else if (isMounted) {
        setIsAuthenticated(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
