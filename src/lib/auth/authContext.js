"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken } from "./refreshToken";
import { get_cookie } from "../cookie/action";
import { logout } from "./action";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      // Lấy dữ liệu xác thực từ hàm get_cookie
      const {
        accessToken,
        user: storedUser,
        refreshToken,
      } = await get_cookie();

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
