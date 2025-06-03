import { authFetch } from "../auth/authWrapper";

export async function updateAccountPassword(user_id, userName, password_old, password_new) {
  const payload = {
    user_id,
    userName,
    password_old,
    password_new
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  await authFetch(
    `/v1/api/user/updateSetting`,
    options
  );
}