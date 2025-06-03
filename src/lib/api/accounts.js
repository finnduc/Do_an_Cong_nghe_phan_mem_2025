import { authFetch } from "../auth/authWrapper";

export async function fetchAccounts(page, limit = 8) {
  const payload = {
    page: page,
    limit: limit,
  };
  const query = new URLSearchParams(payload).toString();
  const data = await authFetch(
    `/v1/api/user/getAll?${query}`
  );

  return data;
}

export async function createAccount(username, password, role_id) {
  const payload = {
    userName: username,
    password,
    role_id,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await authFetch(
    `/v1/api/user/create`,
    options
  );
  return data
}

export async function fetchRoles() {
  const data = await authFetch(`/v1/api/user/getRole`);
  return data;
}


export async function updateAccount(user_id, username, password) {
  const payload = {
    user_id,
    userName: username,
    password,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const data = await authFetch(
    `/v1/api/user/update`,
    options
  );
  return data;
}

export async function deleteAccount(user_id) {
  const options = {
    method: "DELETE",
  };
  const params = new URLSearchParams();
  params.append("user_id", user_id);
  

  await authFetch(
    `/v1/api/user/delete?${params.toString()}`,
    options
  );
}