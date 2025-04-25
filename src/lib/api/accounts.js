import { authFetch } from "../auth/authWrapper";

export async function fetchAccounts(page, limit = 8) {
  const payload = {
    page: page,
    limit: limit,
  };
  const query = new URLSearchParams(payload).toString();
  const data = await authFetch(
    `http://localhost:3000/v1/api/user/getAll?${query}`
  );

  return data;
}

export async function createAccount(username, password, role) {
  const payload = {
    username,
    password,
    role,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }

  const data = await authFetch("http://localhost:3000/v1/api/user/create", options);
  return data;
}
