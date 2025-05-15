import { authFetch } from "../auth/authWrapper";

export async function fetchExportTransaction(page, limit = 6, extraParams = {}) {
  const payload = {
    page: page,
    limit: limit,
    action: "export",
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