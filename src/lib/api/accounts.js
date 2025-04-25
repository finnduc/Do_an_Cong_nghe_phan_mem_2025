import { withAuthHeaders } from "../auth/authWrapper";

async function fetchAccounts(page, limit = 8) {
  const payload = {
    page: page,
    limit: limit,
  };
  const query = new URLSearchParams(payload).toString();
  const response = await fetch(
    `http://localhost:3000/v1/api/user/getAll?${query}`
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

async function createAccount(username, password, role) {
  const payload = {
    username,
    password,
    role,
  };

  const response = await fetch("http://localhost:3000/v1/api/user/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}


export const fetchAccountsWithAuth = withAuthHeaders(fetchAccounts);
export const createAccountWithAuth = withAuthHeaders(createAccount);