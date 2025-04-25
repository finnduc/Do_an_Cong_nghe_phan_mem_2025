import { authFetch } from "../auth/authWrapper";

export async function fetchHistories(page, limit = 6, extraParams = {}) {
  const payload = {
    page: page,
    limit: limit,
    ...extraParams,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v != null)
  );

  const query = new URLSearchParams(cleanedPayload).toString();

  const data = await authFetch(
    `http://localhost:3000/v1/api/transaction/getTransaction?${query}`
  );
  return data;
}

