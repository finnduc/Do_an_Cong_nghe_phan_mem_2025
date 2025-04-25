import { set_cookie } from "../cookie/action";

export async function refreshAccessToken(storedRefreshToken) {
  console.log('Refreshing access token...');  
  const res = await fetch('http://localhost:3000/v1/api/access/refreshToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });

  if (res.status !== 200) {
    throw new Error('Refresh token không hợp lệ');
  }

  const data = await res.json();
  const { accessToken, refreshToken: newRefreshToken, user } = data.metadata;

  if (!accessToken || !user) {
    throw new Error('Dữ liệu từ backend không đầy đủ');
  }

  // Cập nhật cookie qua API Route
  await set_cookie({ accessToken, refreshToken: newRefreshToken, user })
  print(accessToken)
  return accessToken;
}