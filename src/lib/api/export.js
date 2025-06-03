import { authFetch } from "../auth/authWrapper";

export async function fetchExportTransaction({ page, limit = 9, ...extraParams }) {
  const payload = {
    page,
    limit,
    action: "export",
    ...extraParams,
  };

  const cleanedPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, v]) => v != null && v !== "")
  );

  const query = new URLSearchParams(cleanedPayload).toString();

  const data = await authFetch(
    `/v1/api/transaction/getTransaction?${query}`
  );

  return data;
}