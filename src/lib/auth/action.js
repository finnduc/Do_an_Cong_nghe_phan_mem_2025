"use server";
import { delete_cookie, get_cookie, set_cookie } from "../cookie/action";
export const logout = async () => {
  // Lấy dữ liệu user từ get_cookie để sử dụng trong logout
  const { user, accessToken } = await get_cookie();

  try {
    await fetch("http://localhost:3000/v1/api/access/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": user?.user_id || "",
        authorization: `Bearer ${accessToken || ""}`,
      },
      body: JSON.stringify({
        user_id: user?.user_id || "",
      }),
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }

  await delete_cookie();
  redirect("/login");
};

export const login = async (userName, password) => {
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
    await set_cookie({ accessToken, refreshToken, user });
  } catch (error) {
    throw error;
  }
};
