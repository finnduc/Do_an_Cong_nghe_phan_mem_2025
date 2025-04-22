"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setUser(JSON.parse(storedUser));
        try {
          const newAccessToken = await refreshAccessToken(storedRefreshToken);
          localStorage.setItem("accessToken", newAccessToken);
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
        credentials: "include",
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();

      if (!res.status === 200) {
        throw new Error(data.metadata?.error || "Đăng nhập thất bại");
      }

      const { user, tokens } = data.metadata;
      const { accessToken, refreshToken } = tokens;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user[0]));

      setUser(user[0]);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      throw error;
    }
  };

  const refreshAccessToken = async (storedRefreshToken) => {
    try {
      const res = await fetch("http://localhost:3000/v1/api/access/refreshToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!res.status === 200) {
        throw new Error("Refresh token không hợp lệ");
      }

      const data = await res.json();
      const { accessToken, userId: user } = data.metadata;
      let newRefreshToken = storedRefreshToken;

      if (data.metadata.refreshToken) {
        newRefreshToken = data.metadata.refreshToken;
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      localStorage.setItem("accessToken", accessToken);

      return accessToken;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    fetch("http://localhost:3000/v1/api/access/logout", {
      method: "GET",
      headers: {
        "x-client-id": userData?._id || "",
        authorization: localStorage.getItem("accessToken") || "",
      },
      credentials: "include",
    }).catch((err) => console.error("Logout failed:", err));

    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedUserName");

    setIsAuthenticated(false);
    setUser(null);
  };

  // Hàm fetch với token
  const fetchWithToken = async (url, options = {}, method = "GET", cacheOption = "no-store") => {
    const MAX_RETRIES = 1;

    const fetchRequest = async (retryCount = 0) => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const accessToken = localStorage.getItem("accessToken");

      if (!userData?._id || !accessToken) {
        if (retryCount === 0) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("Không có refresh token");

            await refreshAccessToken(refreshToken); // Thử làm mới token
            return fetchRequest(retryCount + 1); // Thử lại
          } catch (error) {
            if (window.confirm("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.")) {
              logout();
              window.location.href = "/login"; // Chuyển về trang đăng nhập
            }
            throw new Error("Không thể làm mới token");
          }
        }
        throw new Error("Không có thông tin user hoặc access token");
      }

      let headers = {
        "x-client-id": userData._id,
        authorization: `${accessToken}`, // Gửi accessToken trong header Authorization
        cache: cacheOption,
        ...(options.headers || {}),
      };

      if (options.body instanceof FormData) {
        delete headers["Content-Type"];
      } else if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`http://localhost:3000/${url}`, {
        method,
        ...options,
        headers,
        credentials: "include", // Giữ credentials để tương thích với backend
      });

      if (res.status === 403 && retryCount < MAX_RETRIES) { // Xử lý 403 (phiên hết hạn)
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("Không có refresh token");

          await refreshAccessToken(refreshToken); // Làm mới token nếu 403
          return fetchRequest(retryCount + 1);
        } catch (error) {
          if (window.confirm("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.")) {
            logout();
            window.location.href = "/login"; // Chuyển về trang đăng nhập
          }
          throw new Error("Không thể làm mới access token");
        }
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request thất bại: ${res.status} - ${errorText || res.statusText}`);
      }

      return res.json();
    };

    return fetchRequest();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        fetchWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}