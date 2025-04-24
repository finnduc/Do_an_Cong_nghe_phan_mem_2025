"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
        body: JSON.stringify({ userName, password }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        throw new Error(data.metadata?.error || "Đăng nhập thất bại");
      }

      const { user, tokens } = data.metadata;
      const { accessToken, refreshToken } = tokens;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
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
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (res.status !== 200) {
        throw new Error("Refresh token không hợp lệ");
      }

      const data = await res.json();
      const { accessToken, user_id: user, refreshToken: newRefreshToken } = data.metadata || {};

      if (!accessToken || !user) {
        throw new Error("Dữ liệu từ backend không đầy đủ");
      }

      if (newRefreshToken) {
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

  const logout = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      await fetch("http://localhost:3000/v1/api/access/logout", {
        method: "GET",
        headers: {
          "x-client-id": userData?.user_id || "",
          authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedUserName");

    setIsAuthenticated(false);
    setUser(null);
  };

  const fetchWithToken = async (url, options = {}, method = "GET") => {
    const MAX_RETRIES = 1;

    const fetchRequest = async (retryCount = 0) => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const accessToken = localStorage.getItem("accessToken");

      if (!userData?.user_id || !accessToken) {
        if (retryCount === 0) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("Không có refresh token");

            await refreshAccessToken(refreshToken);
            return fetchRequest(retryCount + 1);
          } catch (error) {
            if (window.confirm("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.")) {
              logout();
              window.location.href = "/login";
            }
            throw new Error("Không thể làm mới token");
          }
        }
        throw new Error("Không có thông tin user hoặc access token");
      }

      let headers = {
        "x-client-id": userData.user_id,
        authorization: `Bearer ${accessToken}`,
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
      });

      if (res.status === 403 && retryCount < MAX_RETRIES) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) throw new Error("Không có refresh token");

          await refreshAccessToken(refreshToken);
          return fetchRequest(retryCount + 1);
        } catch (error) {
          if (window.confirm("Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại.")) {
            logout();
            window.location.href = "/login";
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