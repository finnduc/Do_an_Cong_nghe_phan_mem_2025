"use server";

import { cookies } from "next/headers";

export async function set_cookie(data) {
  const { accessToken, refreshToken, user } = data;
  const cookieStore = await cookies();
  if (accessToken) {
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  if (user) {
    cookieStore.set("user", JSON.stringify(user), {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}

export async function get_cookie() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const user = cookieStore.get("user")?.value
    ? JSON.parse(cookieStore.get("user").value)
    : null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;
  return { accessToken, user, refreshToken };
}


export async function delete_cookie(){
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("user");
}