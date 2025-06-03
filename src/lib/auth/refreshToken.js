import { set_cookie, get_cookie } from "../cookie/action";

export async function refreshAccessToken(storedRefreshToken) {
  const { user, accessToken } = await get_cookie(); // Xác minh get_cookie trả về { user }
  const res = await fetch(`/v1/api/access/refreshToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'authorization': 'Bearer ' + accessToken,
      "x-client-id": user?.user_id || "", // thêm dòng này
    },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to refresh token");
  }

  const { accessToken: newAccessToken, refreshToken } = data.metadata;

  if (!accessToken) {
    throw new Error("Dữ liệu từ backend không đầy đủ");
  }

  await set_cookie({ accessToken: newAccessToken, refreshToken, user }); // Xác minh set_cookie
  return accessToken;
}
